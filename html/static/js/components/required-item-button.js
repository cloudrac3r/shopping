import {ElemJS} from "../elemjs/elemjs.js"
import {store} from "../structures/Store.js"

class RequiredItemButton extends ElemJS {
	constructor(id) {
		super("li")

		this.id = id

		this.getData()

		this.parts = {
			button: new ElemJS("button").text(this.itemData.name).event("click", this.onClick.bind(this))
		}

		this.child(this.parts.button)
	}

	onClick() {
		store.set("filterUpdatedBy", "required items list")
		store.set("filter", this.itemData.name)
	}

	getData() {
		this.itemData = store.items.get(this.id)
	}
}

export {RequiredItemButton}
