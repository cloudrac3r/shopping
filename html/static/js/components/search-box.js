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
		document.addEventListener("keypress", event => {
			// @ts-ignore
			if (event.target.tagName !== "INPUT" && event.key === "s" && !event.ctrlKey && !event.shiftKey && !event.altKey) {
				event.preventDefault()
				this.element.focus()
				this.element.select()
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
