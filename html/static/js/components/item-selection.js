import {store} from "../structures/Store.js"
import {ElemJS, q} from "../elemjs/elemjs.js"
import {Item} from "./item.js"

class ItemList extends ElemJS {
	constructor() {
		super(q("#item-selection"))

		store.bindElement("items", this)
		store.bindElement("filter", this)
		store.bindElement("defaultTag", this)

		this.render()
	}

	render() {
		this.clearChildren()
		const filter = store.get("filter").toLowerCase()
		/** @param {import("../../../../types").Item} item */
		function calculateItemOrderAsString(item) {
			const result = []
			if (item.name.toLowerCase().startsWith(filter)) { // starting match bonus
				result.push(0)
			} else {
				result.push(1)
			}
			result.push(item.name)
			return result.join("\0")
		}
		const items = [...store.items.values()].filter(item => item.name.toLowerCase().includes(filter)).sort((a, b) => {
			const a2 = calculateItemOrderAsString(a)
			const b2 = calculateItemOrderAsString(b)
			if (a2 < b2) return -1
			else if (a2 === b2) return 0
			else return 1
		})
		for (const item of items) {
			this.child(new Item(item))
		}
		if (store.defaultTag) {
			this.style("borderColor", store.defaultTag.getColor())
			this.class("outlined")
		} else {
			this.removeClass("outlined")
		}
	}
}

new ItemList()
