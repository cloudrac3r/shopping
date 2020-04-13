import {ElemJS, q} from "../elemjs/elemjs.js"
import {store} from "../structures/Store.js"
import {ContextMenu} from "./context-menu.js"
import {tags} from "./tag-selection.js"

class ListItem extends ElemJS {
	constructor(id) {
		super("li")

		this.id = id

		this.getData()

		this.parts = {}
		this.parts.button =
			new ElemJS("button").class("item-list-button")
			.event("click", this.onClick.bind(this))
			.event("contextmenu", this.onRightClick.bind(this))
			.child(
				this.parts.tag = new ElemJS("div").class("tag").child(
					this.parts.tagInner = new ElemJS("div").class("tag-inner")
				)
			).child(
				this.parts.name = new ElemJS("div").class("name")
			).child(
				this.parts.aisle = new ElemJS("div").class("aisle")
			).child(
				this.parts.quantity = new ElemJS("div").class("quantity")
			)
		this.child(this.parts.button)

		this.parts.button

		store.list.bindElement(this.data.item_id, this)

		this.render()
	}

	onClick() {
		if (this.data.complete) {
			store.list.uncomplete(this.id)
		} else {
			store.list.complete(this.id)
		}
	}

	onRightClick(event) {
		event.preventDefault()
		const options = [
			{text: `${this.itemData.name} — Aisle ${this.itemData.aisle}`, type: "label"},
			{text: "Search for this", type: "button", fn: menu => {
				store.set("filterUpdatedBy", "list item context menu")
				store.set("filter", this.itemData.name)
				menu.close()
			}},
			{text: "Remove this", type: "button", fn: menu => {
				store.list.remove(this.itemData.id, null)
				menu.close()
			}},
			{text: "Remove tag", type: "button", fn: menu => {
				store.list.tag(this.itemData.id, null)
				menu.close()
			}}
		]
		for (const tagName of tags.keys()) {
			options.splice(3, 0, {
				text: `Tag ${tagName}`,
				type: "button",
				fn: menu => {
					store.list.tag(this.itemData.id, tagName)
					menu.close()
				}
			})
		}
		if (this.data.complete) {
			options[0].text = "In trolley!\n"+options[0].text
		}
		if (this.itemData.price) {
			options[0].text += `\n${this.data.quantity} × $${this.itemData.price.toFixed(2)} = $${(this.itemData.price * this.data.quantity).toFixed(2)}`
		}
		new ContextMenu(options)
	}

	getData() {
		this.data = store.list.get(this.id)
		this.itemData = store.items.get(this.id)
	}

	render() {
		this.getData()
		if (this.data.complete) this.parts.button.class("complete")
		else this.parts.button.removeClass("complete")
		this.parts.name.text(this.itemData.name)
		this.parts.aisle.text(this.itemData.aisle)
		this.parts.quantity.text("x"+this.data.quantity)
		if (this.data.tag) {
			this.parts.tag.removeClass("hidden")
			this.parts.tagInner.element.style.backgroundColor = tags.get(this.data.tag)
		} else {
			this.parts.tag.class("hidden")
		}
	}
}

export {ListItem}
