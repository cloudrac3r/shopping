import {store} from "../structures/Store.js"
import {ElemJS, q} from "../elemjs/elemjs.js"
import {onlineListManager} from "./online-list.js"

class Keyword extends ElemJS {
	constructor(keyword) {
		super("li")
		this.keyword = keyword

		this.event("click", this.onClick.bind(this))

		this.class("keyword")
		this.child(
			new ElemJS("button").class("keyword-button").text(keyword)
		)
	}

	onClick() {
		store.set("filterUpdatedBy", "keyword")
		store.set("filter", `${store.filter} ${this.keyword}`)
		this.element.remove()
	}
}

export {Keyword}
