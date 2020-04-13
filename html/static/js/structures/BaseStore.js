import {MapToArray} from "./MapToArray.js"

class BaseStore {
	constructor() {
		this.backing = new Map()
		/** @type {MapToArray<() => void>} */
		this.boundCallbacks = new MapToArray()
	}

	get(key) {
		return this.backing.get(key)
	}

	set(key, value) {
		this.backing.set(key, value)
		this.update(key)
	}

	update(key) {
		console.log(`${key} updated! running ${this.boundCallbacks.getAll(key).length} callbacks`)
		this.boundCallbacks.getAll(key).forEach(fn => fn())
	}

	/**
	 * @param {any} key
	 * @param {import("../../../../types").ElemJSComponent} e
	 * @param {boolean} now
	 */
	bindElement(key, e, now = false) {
		this.boundCallbacks.add(key, () => e.render())
		if (now) e.render()
	}

	/**
	 * @param {any} key
	 * @param {() => void} fn
	 */
	bindCallback(key, fn) {
		this.boundCallbacks.add(key, fn)
	}

	/**
	 * @param {any} key
	 * @param {T} substore
	 * @returns {T}
	 * @template T
	 */
	bindSubstore(key, substore) {
		this.set(key, substore)
		this.bindCallback(key, () => {
			this[key] = this.get(key)
		})
		return substore
	}
}

export {BaseStore}
