import {store} from "../structures/Store.js"
import {ElemJS, q} from "../elemjs/elemjs.js"

/**
 * @extends ElemJS<HTMLInputElement>
 */
class CreateItemPrice extends ElemJS {
	constructor() {
		super(q("#create-item-price"))
		this.event("input", this.onInput.bind(this))
	}

	onInput() {
		const value = this.element.value.replace(/^\$/, "")
		const valueAsNumber = +value
		if (value.length && !isNaN(valueAsNumber)) {
			store.set("newItemPrice", valueAsNumber)
		} else {
			store.set("newItemPrice", null)
		}
	}

	reset() {
		this.element.value = ""
		this.onInput()
	}
}

const createItemPrice = new CreateItemPrice()

export {createItemPrice}
