/** @returns {HTMLElement} */
export function q(s) {
	return document.querySelector(s)
}

/**
 * @template {HTMLElement} T
 */
export class ElemJS {
	constructor(type) {
		if (type instanceof HTMLElement) this.bind(type)
		else this.bind(document.createElement(type))
		this.children = [];
	}
	bind(element) {
		/** @type {T} */
		this.element = element
		// @ts-ignore
		this.element.js = this
		return this
	}
	class() {
		for (let name of arguments) if (name) this.element.classList.add(name);
		return this;
	}
	removeClass() {
		for (let name of arguments) if (name) this.element.classList.remove(name);
		return this;
	}
	direct(name, value) {
		if (name) this.element[name] = value;
		return this;
	}
	attribute(name, value) {
		if (name) this.element.setAttribute(name, value);
		return this;
	}
	style(name, value) {
		if (name) this.element.style[name] = value;
		return this;
	}
	id(name) {
		if (name) this.element.id = name;
		return this;
	}
	text(name) {
		this.element.innerText = name;
		return this;
	}
	addText(name) {
		const node = document.createTextNode(name)
		this.element.appendChild(node)
		return this
	}
	html(name) {
		this.element.innerHTML = name;
		return this;
	}
	event(name, callback) {
		this.element.addEventListener(name, event => callback(event))
		return this
	}
	child(toAdd, position = undefined) {
		if (typeof toAdd === "object" && toAdd !== null) {
			toAdd.parent = this;
			if (typeof(position) == "number" && position >= 0) {
				this.element.insertBefore(toAdd.element, this.element.children[position]);
				this.children.splice(position, 0, toAdd);
			} else {
				this.element.appendChild(toAdd.element);
				this.children.push(toAdd);
			}
		} else if (typeof toAdd === "string") {
			this.text(toAdd)
		}
		return this;
	}
	clearChildren() {
		this.children.length = 0;
		while (this.element.lastChild) this.element.removeChild(this.element.lastChild);
	}
}
