import {BaseStore} from "./BaseStore.js"
import {ItemStore} from "./ItemStore.js"
import {ListStore} from "./ListStore.js"

class Store extends BaseStore {
	constructor() {
		super()
		this.items = this.bindSubstore("items", new ItemStore(this, "items"))
		this.list = this.bindSubstore("list", new ListStore(this, "list"))
		this.filter = this.bindSubstore("filter", "")
		this.filterUpdatedBy = this.bindSubstore("filterUpdatedBy", null)
		/** @type {import("../components/tag-selection").Tag} */
		this.defaultTag = this.bindSubstore("defaultTag", null)
		/** @type {number} */
		this.newItemAisle = this.bindSubstore("newItemAisle", null)
		/** @type {number} */
		this.newItemPrice = this.bindSubstore("newItemPrice", null)
	}
}

const store = new Store()
// @ts-ignore
window.store = store

export {store}
