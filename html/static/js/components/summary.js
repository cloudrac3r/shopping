import {ElemJS, q} from "../elemjs/elemjs.js"
import {store} from "../structures/Store.js"
import {tags} from "./tag-selection.js"

class ItemCount extends ElemJS {
	constructor() {
		super("div")

		store.list.bindElement("any", this)

		this.render()
	}

	render() {
		const itemCount = store.list.getItemCount()
		this.text(`${itemCount} item${itemCount === 1 ? "" : "s"} in list`)
	}
}

class PriceList extends ElemJS {
	constructor() {
		super("div")
		this.class("prices")

		store.list.bindElement("any", this)

		this.render()
	}

	render() {
		// Compute required information
		const itemsByTag = store.list.getItemsByTag()
		let totalPrice = 0
		let unknownItems = 0
		let hasNonDefaultTags = false
		const tagPrice = new Map()
		for (const key of itemsByTag.keys()) {
			if (key !== "default") hasNonDefaultTags = true
			const priceForTag = itemsByTag.getAll(key).reduce((a, c) => {
				const quantity = c.quantity
				const price = store.items.get(c.item_id).price
				if (!price) {
					unknownItems++
					return a // no price information available, add 0
				} else {
					return a + quantity * price
				}
			}, 0)
			tagPrice.set(key, priceForTag)
			totalPrice += priceForTag
		}

		this.clearChildren()

		// Generate text
		this.addText(`$${totalPrice.toFixed(2)}\n`)

		// Generate tree
		/** @type {{text: string, special: boolean, color?: string}[]} */
		let tree = []
		if (unknownItems) tree.push({text: `${unknownItems} unknown item${unknownItems === 1 ? "" : "s"}`, special: false})
		if (hasNonDefaultTags) {
			for (const key of tagPrice.keys()) {
				if (key !== "default") {
					tree.push({text: `$${tagPrice.get(key).toFixed(2)}`, special: false, color: tags.get(key)})
				}
			}
			if (tagPrice.has("default")) {
				tree.push({text: `$${tagPrice.get("default").toFixed(2)}`, special: true})
			}
		}

		// Convert tree to text
		tree.forEach((branch, index) => {
			const last = index === tree.length-1
			let prefix = last ? "└" : "├"
			prefix += branch.special ? "➤" : "╴"
			this.child(
				new ElemJS("span").class("border").addText(prefix)
			)
			if (branch.color) {
				this.child(
					new ElemJS("span").style("color", branch.color).addText(` ${branch.text}`)
				)
				if (!last) this.addText(`\n`)
			} else {
				if (!last) branch.text += "\n"
				this.addText(` ${branch.text}`)
			}
		})
	}
}

class Progress extends ElemJS {
	constructor() {
		super("div")
		this.class("progress")

		store.list.bindElement("completed", this)

		this.render()
	}

	render() {
		if (store.list.backing.size > 0) {
			const percent = store.list.completed/store.list.backing.size*100
			this.style("background", `linear-gradient(to right, #4ba84b ${percent}%, transparent 0 100%)`)
		} else {
			this.style("background", "")
		}
	}
}

class Summary extends ElemJS {
	constructor() {
		super(q("#summary"))

		this.parts = {}
		this.parts.itemCount = new ItemCount()
		this.parts.priceList = new PriceList()
		this.parts.progress = new Progress()

		this.clearChildren()
		this.child(this.parts.itemCount)
		this.child(this.parts.priceList)
		this.child(this.parts.progress)
	}
}

new Summary()
