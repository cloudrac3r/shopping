const fetch = require("node-fetch").default
const entities = require("entities")
const {parse} = require("fast-html-parser")

class FrequencyMap {
	constructor() {
		this.ignorelist = ["", "&", "a", "the", "at", "with"]
		this.max = 8
		this.requiredCount = 3

		this.backing = new Map()
	}

	normalise(word) {
		return word.trim().toLowerCase()
	}

	add(word) {
		word = this.normalise(word)
		if (this.ignorelist.includes(word)) return
		if (!this.backing.has(word)) this.backing.set(word, 0)
		this.backing.set(word, this.backing.get(word) + 1)
	}

	delete(word) {
		word = this.normalise(word)
		this.backing.delete(word)
	}

	split(text) {
		const splitters = [" ", "-"]
		const result = splitters.reduce((a, c) => a.flat(Infinity).map(x => x.split(c)), [text]).flat(Infinity)
		// console.log(text, "->", result)
		return result
	}

	addWords(text) {
		for (const word of this.split(text)) this.add(word)
	}

	deleteWords(text) {
		for (const word of this.split(text)) this.delete(word)
	}

	popular() {
		return [...this.backing.entries()].filter(x => x[1] >= this.requiredCount).sort((a, b) => b[1] - a[1]).map(x => x[0]).slice(0, this.max)
	}
}

module.exports = [
	{
		route: "/api/search", methods: ["GET"], code: async ({url}) => {
			if (!url.searchParams.has("query")) {
				return {
					statusCode: 400,
					contentType: "text/plain",
					content: "Missing URL parameter: `query`"
				}
			}

			const query = url.searchParams.get("query")
			const remoteURL = new URL("https://www.newworld.co.nz/shop/Search")
			remoteURL.searchParams.append("q", query)
			const body = await fetch(remoteURL.toString(), {
				headers: {
					"Cookie": `server_nearest_store_v2={"StoreId":"d4408e0f-5268-42c2-ba76-2bc9732d4316","UserLat":"-46.0511","UserLng":"169.9467","StoreLat":"-41.334534","StoreLng":"174.772497","IsSuccess":true}; STORE_ID_V2=63cbb6c6-4a0b-448d-aa78-8046692a082c|False; Region=NI; AllowRestrictedItems=true; sxa_site=New World; fs-store-select-tooltip-closed=true`
				}
			}).then(res => res.text())
			const dom = parse(body)

			const results = dom.querySelectorAll(".fs-product-card").map(productCardElement => {
				const productAnchorElement = productCardElement.querySelector(".fs-product-card__row").childNodes[1]
				const productDetailsElement = productCardElement.querySelector(".js-product-card-footer")
				const productImageElement = productCardElement.querySelector(".fs-product-card__product-image")
				let productOptions = productDetailsElement.rawAttrs.match(/^.*? data-options='(\{.*?),\s*"clubCardComponentStrings/ms)[1] + "}}"
				productOptions = entities.decodeHTML5(productOptions)
				const data = JSON.parse(productOptions)
				let capacityText = productCardElement.querySelector(".u-p3").text.trim()
				if (capacityText.includes("\n")) capacityText = ""
				const imageURL = productImageElement.rawAttrs.match(/data-src-s="([^"]+)"/)[1]
				const link = productAnchorElement.rawAttrs.match(/href="([^"]+)"/)[1]
				return {
					name: data.productName,
					price: Number(data.ProductDetails.PricePerItem),
					priceMode: data.ProductDetails.PriceMode,
					capacity: capacityText,
					href: `https://www.newworld.co.nz${link}`,
					image: imageURL
				}
			})

			const frequency = new FrequencyMap()
			for (const result of results) {
				frequency.addWords(result.name)
			}
			frequency.deleteWords(query)

			return {
				statusCode: 200,
				contentType: "application/json",
				content: {
					results,
					keywords: frequency.popular()
				}
			}
		}
	}
]
