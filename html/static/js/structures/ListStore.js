import {addWSEventListener, send} from "../ws/ws.js"
import {BaseStore} from "../structures/BaseStore.js"
import {MapToArray} from "../structures/MapToArray.js"

class ListStore extends BaseStore {
	/**
	 * @param {import("./Store").store} parent
	 * @param {string} parentKey
	 */
	constructor(parent, parentKey) {
		super()
		this.parent = parent
		this.parentKey = parentKey
		this.completed = 0

		/** @type {Map<number, import("../../../../types").ListItem>} */
		this.backing = new Map()

		addWSEventListener("STATE",
			/**
			 * @param {import("../../../../types").Event_READY} data
			 */
			data => {
				for (const item of data.list) {
					this.backing.set(item.item_id, item)
					this.update(item.item_id)
				}
				this.updateCompleted()
				this.updateParent()
				this.updateAny()
			}
		)

		addWSEventListener("ADD_TO_LIST",
			/**
			 * @param {import("../../../../types").Event_ADD_TO_LIST} data
			 */
			data => {
				if (this.backing.has(data.id)) {
					this.backing.get(data.id).quantity += data.count
				} else {
					this.backing.set(data.id, {
						item_id: data.id,
						quantity: data.count,
						complete: 0,
						tag: data.tag
					})
				}
				this.update(data.id)
				this.updateCompleted()
				this.updateParent()
				this.updateAny()
			}
		)

		addWSEventListener("REMOVE_FROM_LIST",
			/**
			 * @param {import("../../../../types").Event_REMOVE_FROM_LIST} data
			 */
			data => {
				if (this.backing.has(data.id)) {
					if (data.count == null || this.backing.get(data.id).quantity <= data.count) {
						this.backing.delete(data.id)
					} else {
						this.backing.get(data.id).quantity -= data.count
					}
					this.update(data.id)
					this.updateCompleted()
					this.updateParent()
					this.updateAny()
				}
			}
		)

		addWSEventListener("ITEM_COMPLETE",
			/**
			 * @param {import("../../../../types").Event_ITEM_COMPLETE} data
			 */
			data => {
				this.backing.get(data.id).complete = 1
				this.update(data.id)
				this.updateCompleted()
				this.updateAny()
			}
		)

		addWSEventListener("ITEM_UNCOMPLETE",
			/**
			 * @param {import("../../../../types").Event_ITEM_UNCOMPLETE} data
			 */
			data => {
				this.backing.get(data.id).complete = 0
				this.update(data.id)
				this.updateCompleted()
				this.updateAny()
			}
		)

		addWSEventListener("ITEM_SET_TAG",
			/**
			 * @param {import("../../../../types").Event_ITEM_SET_TAG} data
			 */
			data => {
				this.backing.get(data.id).tag = data.tag
				this.update(data.id)
				this.updateAny()
			}
		)

		addWSEventListener("CLEAR_LIST", () => {
			const currentKeys = [...this.backing.keys()]
			this.backing.clear()
			for (const key of currentKeys) {
				this.update(key)
			}
			this.updateAny()
			this.updateCompleted()
			this.updateParent()
		})

		addWSEventListener("CLEAR_COMPLETED", () => {
			for (const [key, item] of this.backing.entries()) {
				if (item.complete) {
					this.backing.delete(key)
					this.update(key)
				}
			}
			this.updateAny()
			this.updateCompleted()
			this.updateParent()
		})

		addWSEventListener("DELETE_ITEM",
			/**
			 * @param {import("../../../../types").Event_DELETE_ITEM} data
			 */
			data => {
				this.backing.delete(data.id)
				this.updateCompleted()
				this.updateParent()
				this.updateAny()
			}
		)
	}

	get(id) {
		return this.backing.get(id)
	}

	/**
	 * @param {number} id
	 * @param {number} count
	 * @param {import("../components/tag-selection").Tag} [tag]
	 */
	add(id, count, tag) {
		const data = {
			id,
			count
		}
		if (tag) {
			data.tag = tag.name
		} else {
			data.tag = null
		}
		send({
			event: "ADD_TO_LIST",
			data
		})
	}

	remove(id, count) {
		send({
			event: "REMOVE_FROM_LIST",
			data: {
				id,
				count
			}
		})
	}

	complete(id) {
		send({
			event: "ITEM_COMPLETE",
			data: {
				id
			}
		})
	}

	uncomplete(id) {
		send({
			event: "ITEM_UNCOMPLETE",
			data: {
				id
			}
		})
	}

	tag(id, tag) {
		send({
			event: "ITEM_SET_TAG",
			data: {
				id,
				tag
			}
		})
	}

	clear() {
		send({
			event: "CLEAR_LIST",
			data: null
		})
	}

	clearCompleted() {
		send({
			event: "CLEAR_COMPLETED",
			data: null
		})
	}

	getItemsByTag() {
		const result = new MapToArray()
		for (const item of this.backing.values()) {
			result.add(item.tag || "default", item)
		}
		return result
	}

	getItemCount() {
		return [...this.backing.values()].reduce((a, c) => a + c.quantity, 0)
	}

	updateParent() {
		this.parent.update(this.parentKey)
	}

	updateAny() {
		this.update("any")
	}

	updateCompleted() {
		this.completed = [...this.backing.values()].reduce((a, c) => a + c.complete, 0)
		this.update("completed")
	}

	values() {
		return this.backing.values()
	}
}

export {ListStore}
