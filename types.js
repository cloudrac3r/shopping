/**
 * @typedef Item
 * @property {number} id
 * @property {string} name
 * @property {number|null} price
 * @property {number} aisle
 */

/**
 * @typedef ListItem
 * @property {number} item_id
 * @property {number} quantity
 * @property {number} complete
 * @property {string} tag
 */

/**
 * @typedef Event_READY
 * @property {Item[]} items
 * @property {ListItem[]} list
 */

/**
 * @typedef {Item} Event_CREATE_ITEM
 */

/**
 * @typedef Event_DELETE_ITEM
 * @property {number} id
 */

/**
 * @typedef Event_ADD_TO_LIST
 * @property {number} id
 * @property {number} count
 * @property {string} tag
 */

/**
 * @typedef Event_REMOVE_FROM_LIST
 * @property {number} id
 * @property {number} count
 */

/**
 * @typedef Event_ITEM_COMPLETE
 * @property {number} id
 */

/**
 * @typedef Event_ITEM_UNCOMPLETE
 * @property {number} id
 */

/**
 * @typedef Event_ITEM_SET_TAG
 * @property {number} id
 * @property {string} tag
 */

/**
 * @typedef ElemJSComponent_Additions
 * @property {() => void} render
 */

/**
 * @typedef {import("./html/static/js/elemjs/elemjs").ElemJS & ElemJSComponent_Additions} ElemJSComponent
 */

module.exports = {}
