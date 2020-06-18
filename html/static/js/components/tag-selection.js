import {store} from "../structures/Store.js"
import {ElemJS, q} from "../elemjs/elemjs.js"

const tags = new Map([
	["yellow", "rgb(204, 186, 40)"],
	["red", "#b41416"],
	["green", "rgb(40, 134, 13)"],
	["orange", "rgb(223, 135, 41)"],
	["pink", "#f048de"],
	["grey", "rgb(117, 117, 117)"]
])

class Tag extends ElemJS {
	/**
	 * @param {TagSelection} parent
	 */
	constructor(parent, name) {
		super("div")

		this.parent = parent
		this.name = name

		this.class("tag")
		this.child(
			new ElemJS("div").class("tag-inner").style("backgroundColor", this.getColor())
		)

		this.event("click", this.onClick.bind(this))

		store.bindElement("defaultTag", this)

		this.render()
	}

	getColor() {
		return tags.get(this.name)
	}

	render() {
		if (store.defaultTag === this) this.class("selected")
		else this.removeClass("selected")
	}

	onClick() {
		if (store.defaultTag === this) {
			store.set("defaultTag", null)
		} else {
			store.set("defaultTag", this)
		}
	}
}

class TagSelection extends ElemJS {
	constructor() {
		super(q("#default-tag-flex"))

		this.tags = []
		for (const tagName of tags.keys()) {
			const tag = new Tag(this, tagName)
			this.tags.push(tag)
			this.child(tag)
		}

		document.addEventListener("keypress", event => {
			// @ts-ignore
			if (event.target.tagName !== "INPUT" && !event.ctrlKey && !event.shiftKey && !event.altKey) {
				const number = (+event.key) - 1
				if (!isNaN(number)) {
					if (number >= 0 && number < this.tags.length) {
						store.set("defaultTag", this.tags[number])
					} else {
						store.set("defaultTag", null)
					}
				}
			}
		})
	}

	/**
	 * @param {Tag} tagName
	 */
	select(tagName) {
		store.defaultTag = tagName
	}
}

new TagSelection()

export {Tag, tags}
