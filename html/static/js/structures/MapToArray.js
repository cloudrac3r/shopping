/**
 * @template T
 */
class MapToArray {
	constructor() {
		/** @type {Map<string, T[]>} */
		this.backing = new Map()
	}

	/**
	 * @param {string} key
	 */
	getAll(key) {
		return this.backing.get(key) || []
	}

	/**
	 * @param {string} key
	 * @param {T} value
	 */
	add(key, value) {
		if (this.backing.has(key)) {
			this.backing.get(key).push(value)
		} else {
			this.backing.set(key, [value])
		}
	}

	keys() {
		return this.backing.keys()
	}
}

export {MapToArray}
