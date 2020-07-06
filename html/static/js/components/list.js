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
		const items = [...store.list.values()].sort((a, b) => {
			const itemA = store.items.get(a.item_id)
			const itemB = store.items.get(b.item_id)
			if (itemA.aisle !== itemB.aisle) {
				return itemA.aisle - itemB.aisle
			} else {
				if (itemA.name < itemB.name) return -1
				else if (itemB.name < itemA.name) return 1
				else return 0
			}
		})
		for (const item of items) {
			this.child(
				new ListItem(item.item_id)
			)
		}
	}
}

new List()
