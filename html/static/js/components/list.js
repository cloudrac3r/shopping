import {store} from "../structures/Store.js"
import {ElemJS, q} from "../elemjs/elemjs.js"
import {ListItem} from "./list-item.js"

class List extends ElemJS {
	constructor() {
		super(q("#item-list"))

		store.bindElement("list", this)

		this.render()
	}

	render() {
		this.clearChildren()
		const items = [...store.list.values()].sort((a, b) => store.items.get(a.item_id).aisle - store.items.get(b.item_id).aisle)
		for (const item of items) {
			this.child(
				new ListItem(item.item_id)
			)
		}
	}
}

new List()
