import {store} from "../structures/Store.js"
import {ElemJS, q} from "../elemjs/elemjs.js"
import {createItemAisle} from "./create-item-aisle.js"
import {createItemPrice} from "./create-item-price.js"

/**
 * @extends ElemJS<HTMLButtonElement>
 */
class CreateItemButton extends ElemJS {
	constructor() {
		super(q("#create-item"))
		this.event("click", this.onClick.bind(this))
		store.bindElement("filter", this)
		store.bindElement("newItemAisle", this)
	}

	render() {
		this.element.disabled = store.filter.length === 0 || [...store.items.values()].some(i => i.name === store.filter) || store.newItemAisle == null
	}

	onClick() {
		const name = store.filter
		store.items.create(name, store.newItemAisle || 0, store.newItemPrice || null)
		createItemAisle.reset()
		createItemPrice.reset()
	}
}

new CreateItemButton()
