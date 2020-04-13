import {store} from "../structures/Store.js"
import {ElemJS, q} from "../elemjs/elemjs.js"

const tags = new Map([
	["blue", "#284acc"],
	["red", "maroon"],
	["orange", "#c17422"],
	["pink", "#f048de"]
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
