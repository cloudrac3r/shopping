import {store} from "../structures/Store.js"
import {ElemJS, q} from "../elemjs/elemjs.js"
import {onlineListManager} from "./online-list.js"

/**
 * @extends ElemJS<HTMLButtonElement>
 */
class LookOnlineButton extends ElemJS {
	constructor() {
		super(q("#look-online-button"))
		this.event("click", this.onClick.bind(this))
		store.bindElement("filter", this, true)
	}

	render() {
		this.element.disabled = store.filter.length === 0
	}

	onClick() {
		const query = store.filter
		onlineListManager.search(query)
	}
}

new LookOnlineButton()
