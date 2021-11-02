import {store} from "../structures/Store.js"
import {ElemJS, q} from "../elemjs/elemjs.js"
import {RequiredItemButton} from "./required-item-button.js"

const requiredItemSection = new ElemJS(q("#required-item-section"))

class ItemList extends ElemJS {
	constructor() {
		super(q("#required-item-list"))

		this.items = [
			391, // cow milk
			78, // tomatoes
			400, // chickpeas
			86, // lentils
			180, // chilli beans
		]

		store.bindElement("list", this)
	}

	render() {
		this.clearChildren()
		let isEmpty = true
		for (const id of this.items) {
			if (!store.list.get(id)) {
				this.child(
					new RequiredItemButton(id)
				)
				isEmpty = false
			}
		}
		if (isEmpty) {
			requiredItemSection.style("display", "none")
		} else {
			requiredItemSection.style("display", "block")
		}
	}
}

new ItemList()
