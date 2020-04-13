import {store} from "../structures/Store.js"
import {ElemJS, q} from "../elemjs/elemjs.js"

class ClearList extends ElemJS {
	constructor() {
		super(q("#clear-list"))

		this.event("click", this.onClick.bind(this))
	}

	onClick() {
		store.list.clear()
	}
}

new ClearList()
