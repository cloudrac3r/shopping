import {ElemJS, q} from "../elemjs/elemjs.js"

class Preview extends ElemJS {
	constructor(url) {
		super("div")
		this.class("preview")
		this.style("display", "none")
		this.child(
			new ElemJS("img").attribute("src", url).attribute("referrerpolicy", "no-referrer")
		)
	}

	goto(x, y) {
		this.style("display", "")
		this.style("transform", `translate(${x+10}px, ${y+10}px)`)
	}

	hide() {
		this.style("display", "none")
	}
}

class OnlineListItem extends ElemJS {
	/**
	 * @param {import("../../../../types").OnlineListItem} data
	 */
	constructor(data) {
		super("li")

		this.data = data

		this.preview = new Preview(data.image)
		this.event("mousemove", this.onMouseMove.bind(this))
		this.event("mouseleave", this.onMouseLeave.bind(this))

		this.child(
			new ElemJS("a").attribute("href", this.data.href).attribute("target", "_blank").attribute("rel", "noopener noreferrer").class("link-button", "item-list-button").child(
				new ElemJS("div").class("name").text(data.name)
			).child(
				new ElemJS("div").class("capacity").text(data.capacity)
			).child(
				new ElemJS("div").class("price").child(
					new ElemJS("span").class("number").text(data.price),
				).child(
					new ElemJS("span").class("mode").text(data.priceMode)
				)
			).child(
				this.preview
			)
		)
	}

	onMouseMove(event) {
		this.preview.goto(event.pageX, event.pageY)
	}

	onMouseLeave() {
		this.preview.hide()
	}
}

export {OnlineListItem}
