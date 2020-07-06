import {store} from "../structures/Store.js"
import {ElemJS, q} from "../elemjs/elemjs.js"
import {OnlineListItem} from "./online-list-item.js"
import {Keyword} from "./keyword.js"

/**
 * @param {string} query
 * @return {Promise<{results: import("../../../../types").OnlineListItem[], keywords: string[]}>}
 */
function doSearch(query) {
	const url = new URL(`${location.origin}/api/search`)
	url.searchParams.append("query", query)
	return fetch(url.toString()).then(res => res.json())
}

class OnlineList extends ElemJS {
	constructor() {
		super(q("#online-list"))
		this.results = []
	}

	setResults(results) {
		this.results = results
		this.render()
	}

	render() {
		this.clearChildren()
		if (this.results.length) {
			this.class("has-items")
			for (const result of this.results) {
				this.child(
					new OnlineListItem(result)
				)
			}
		} else {
			this.removeClass("has-items")
		}
	}
}

class KeywordList extends ElemJS {
	constructor() {
		super(q("#keyword-list"))
		this.keywords = []
		this.render()
	}

	setKeywords(keywords) {
		this.keywords = keywords
		this.render()
	}

	render() {
		this.clearChildren()
		for (const keyword of this.keywords) {
			this.child(
				new Keyword(keyword)
			)
		}
	}
}

class OnlineListManager {
	constructor() {
		this.onlineList = new OnlineList()
		this.keywordList = new KeywordList()
		store.bindCallback("filter", () => {
			if (store.filterUpdatedBy === "keyword") {
				this.search(store.filter)
			}
		})
	}

	/**
	 * @param {string} query
	 */
	search(query) {
		this.onlineList.setResults([])
		doSearch(query).then(({results, keywords}) => {
			this.onlineList.setResults(results)
			this.keywordList.setKeywords(keywords)
		})
	}
}

const onlineListManager = new OnlineListManager()

export {onlineListManager}
