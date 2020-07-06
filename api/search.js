const fetch = require("node-fetch").default
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
		console.log(text, "->", result)
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
			const remoteURL = new URL("https://www.ishopnewworld.co.nz/Search")
			remoteURL.searchParams.append("q", query)
			const body = await fetch(remoteURL.toString()).then(res => res.text())
			const dom = parse(body)

			const results = dom.querySelectorAll(".fs-product-card").map(productCardElement => {
				const productAnchorElement = productCardElement.querySelector(".fs-product-card__row").childNodes[1]
				const productDetailsElement = productCardElement.querySelector(".js-product-card-footer")
				const productImageElement = productCardElement.querySelector(".fs-product-card__product-image")
				const data = JSON.parse(productDetailsElement.attributes["data-options"])
				const capacity = productCardElement.querySelector(".u-p3")
				return {
					name: data.productName,
					price: Number(data.ProductDetails.PricePerItem),
					priceMode: data.ProductDetails.PriceMode,
					capacity: capacity.text.trim(),
					href: `https://www.ishopnewworld.co.nz${productAnchorElement.attributes.href}`,
					image: productImageElement.attributes.style.match(/background(?:-image)?: url\('?([^')]+)'?\)/)[1]
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
