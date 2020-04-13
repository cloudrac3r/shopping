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
		const filter = store.get("filter")
		for (const item of store.items.values()) {
			if (item.name.toLowerCase().includes(filter.toLowerCase())) {
				this.child(new Item(item))
			}
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
