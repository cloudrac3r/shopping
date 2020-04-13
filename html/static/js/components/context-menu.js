import {ElemJS, q} from "../elemjs/elemjs.js"

let x = null
let y = null

document.addEventListener("mousemove", event => {
	x = event.clientX
	y = event.clientY
})

const width = 215

class Overlay extends ElemJS {
	constructor() {
		super(q("#context-menu-overlay"))
		/** @type {ContextMenu[]} */
		this.connected = []
		this.event("click", this.onClick.bind(this))
		this.event("contextmenu", this.onRightClick.bind(this))
	}

	onRightClick(event) {
		event.preventDefault()
		this.onClick()
	}

	onClick() {
		for (const component of this.connected) {
			component.close()
		}
		this.reset()
	}

	/**
	 * @param {ContextMenu} component
	 */
	connect(component) {
		this.show()
		this.connected.push(component)
	}

	show() {
		this.removeClass("hidden")
	}

	reset() {
		this.class("hidden")
		this.connected = []
	}
}

const overlay = new Overlay()

class ContextMenu extends ElemJS {
	/**
	 * @param {{text: (string|(() => string)), type: string, color?: string, fn?: (menu: ContextMenu) => void}[]} options
	 */
	constructor(options) {
		super("div")
		this.class("context-menu")
		overlay.connect(this)
		this.options = options

		this.parts = {
			list: new ElemJS("ul").class("menu-list")
		}
		this.child(this.parts.list)

		q("#context-menu-layer").appendChild(this.element)

		this.render()

		this.element.style.left = Math.min(x-5, window.innerWidth-width-5)+"px"
		this.element.style.top = Math.min(y-5, window.innerHeight-this.element.clientHeight-5)+"px"
	}

	render() {
		console.log("rendering menu")
		this.parts.list.clearChildren()
		for (const option of this.options) {
			const text = typeof option.text === "function" ? option.text() : option.text
			const borderColor = option.color || ""
			this.parts.list.child(
				new ElemJS("li").class("menu-item").child(
					option.type === "button"
					? new ElemJS("button").class("menu-button").addText(text).event("click", () => option.fn(this))
					: new ElemJS("div").class("menu-label").style("borderColor", borderColor).addText(text)
				)
			)
		}
	}

	close() {
		overlay.reset()
		this.element.remove()
	}
}

export {ContextMenu}
