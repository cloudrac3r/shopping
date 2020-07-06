import {store} from "../structures/Store.js"
import {ElemJS, q} from "../elemjs/elemjs.js"
import {ContextMenu} from "./context-menu.js"

class Item extends ElemJS {
	/**
	 * @param {import("../../../../types").Item} data
	 */
	constructor(data) {
		super("li")

		this.data = data

		this.parts = {
			button:
				new ElemJS("button").class("item-line").child(
					new ElemJS("div").addText(data.name).class("name")
				).child(
					data.price && new ElemJS("div").addText(data.price.toFixed(2)).class("price")
				)
		}
		this.child(this.parts.button)

		this.event("click", this.onClick.bind(this))
		this.event("contextmenu", this.onRightClick.bind(this))
	}

	getCount() {
		const listEntry = store.list.get(this.data.id)
		const count = listEntry ? listEntry.quantity : 0
		return count
	}

	onClick() {
		store.list.add(this.data.id, 1, store.defaultTag)
	}

	onRightClick(event) {
		event.preventDefault()
		const menu = new ContextMenu([
			{text: () => `${this.data.name} × ${this.getCount()}`, type: "label"},
			{text: "Search for this", type: "button", fn: menu => {
				store.set("filterUpdatedBy", "item context menu")
				store.set("filter", this.data.name)
				menu.close()
			}},
			{text: "Add 1", type: "button", fn: menu => {
				store.list.add(this.data.id, 1, store.defaultTag)
			}},
			{text: "Add 5", type: "button", fn: menu => {
				store.list.add(this.data.id, 5, store.defaultTag)
			}},
			{text: "Remove 1", type: "button", fn: menu => {
				store.list.remove(this.data.id, 1)
			}},
			{text: "Remove all", type: "button", fn: menu => {
				store.list.remove(this.data.id, null)
				menu.close()
			}},
			{text: "Danger zone", color: "#bd1919", type: "label"},
			{text: "Delete from database", type: "button", fn: menu => {
				store.items.delete(this.data.id)
				menu.close()
			}}
		])
		store.bindElement("list", menu)
	}
}

export {Item}
