import {store} from "../structures/Store.js"
import {ElemJS, q} from "../elemjs/elemjs.js"

/**
 * @extends ElemJS<HTMLInputElement>
 */
class CreateItemAisle extends ElemJS {
	constructor() {
		super(q("#create-item-aisle"))
		this.event("input", this.onInput.bind(this))
	}

	onInput() {
		const value = this.element.value
		const valueAsNumber = +value
		if (value.length && !isNaN(valueAsNumber)) {
			store.set("newItemAisle", valueAsNumber)
		} else {
			store.set("newItemAisle", null)
		}
	}

	reset() {
		this.element.value = ""
		this.onInput()
	}
}

const createItemAisle = new CreateItemAisle()

export {createItemAisle}
