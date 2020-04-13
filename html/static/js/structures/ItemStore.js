import {addWSEventListener, send} from "../ws/ws.js"

class ItemStore {
	/**
	 * @param {import("./Store").store} parent
	 * @param {string} parentKey
	 */
	constructor(parent, parentKey) {
		this.parent = parent
		this.parentKey = parentKey

		/** @type {Map<number, import("../../../../types").Item>} */
		this.backing = new Map()

		addWSEventListener("STATE",
			/**
			 * @param {import("../../../../types").Event_READY} data
			 */
			data => {
				for (const item of data.items) {
					this.backing.set(item.id, item)
				}
				this.updateParent()
			}
		)

		addWSEventListener("CREATE_ITEM",
			/**
			 * @param {import("../../../../types").Event_CREATE_ITEM} item
			 */
			item => {
				this.set(item.id, item)
			}
		)

		addWSEventListener("DELETE_ITEM",
			/**
			 * @param {import("../../../../types").Event_DELETE_ITEM} data
			 */
			data => {
				this.backing.delete(data.id)
				this.updateParent()
			}
		)
	}

	create(name, aisle, price) {
		send({
			event: "CREATE_ITEM",
			data: {
				name,
				aisle,
				price
			}
		})
	}

	delete(id) {
		send({
			event: "DELETE_ITEM",
			data: {
				id
			}
		})
	}

	get(name) {
		return this.backing.get(name)
	}

	set(name, value) {
		this.backing.set(name, value)
		this.updateParent()
	}

	updateParent() {
		this.parent.update(this.parentKey)
	}

	values() {
		return this.backing.values()
	}
}

export {ItemStore}
