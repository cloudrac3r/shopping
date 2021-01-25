import {store} from "../structures/Store.js"
import {ElemJS, q} from "../elemjs/elemjs.js"
import {ContextMenu} from "./context-menu.js"

class ClearList extends ElemJS {
	constructor() {
		super(q("#clear-list"))

		this.event("click", this.onRightClick.bind(this))
	}

	onRightClick(event) {
		event.preventDefault()
		new ContextMenu([
			{text: "Really clear the list?\nThere's no going back.", color: "#bd1919", type: "label"},
			{text: "Remove completed", type: "button", fn: menu => {
				store.list.clearCompleted()
				menu.close()
			}},
			{text: "Clear entire list", type: "button", fn: menu => {
				store.list.clear()
				menu.close()
			}}
		])
	}
}

new ClearList()
