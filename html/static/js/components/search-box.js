import {store} from "../structures/Store.js"
import {ElemJS, q} from "../elemjs/elemjs.js"

/**
 * @extends ElemJS<HTMLInputElement>
 */
class SearchBox extends ElemJS {
	constructor() {
		super(q("#search-box"))
		this.event("input", this.onInput.bind(this))
		store.bindCallback("filter", () => {
			if (store.filterUpdatedBy !== "search") {
				this.element.value = store.filter
			}
		})
	}

	onInput() {
		const value = this.element.value
		store.set("filterUpdatedBy", "search")
		store.set("filter", value)
	}
}

new SearchBox()
