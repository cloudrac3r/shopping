const {wss, db} = require("../passthrough")

/** @type {Set<Client>} */
const clients = new Set()

wss.on("connection", wsConnection)

function wsConnection(socket) {
	new Client(socket)
}

function broadcast(message) {
	for (const client of clients.values()) {
		client.send(message)
	}
}

class Client {
	constructor(socket) {
		this.socket = socket
		clients.add(this)

		socket.on("message", incoming => {
			const message = JSON.parse(incoming)
			if (message.event === "CREATE_ITEM") {
				/** @type {import("../types").Event_CREATE_ITEM} */
				const data = message.data
				db.prepare("INSERT INTO Items (name, price, aisle) VALUES (@name, @price, @aisle)").run(data)
				const id = db.prepare("SELECT seq FROM sqlite_sequence WHERE name = 'Items'").pluck().get()
				data.id = id
				broadcast({
					event: "CREATE_ITEM",
					data
				})
			}
			else if (message.event === "DELETE_ITEM") {
				/** @type {import("../types").Event_DELETE_ITEM} */
				const data = message.data
				db.prepare("DELETE FROM Items WHERE id = @id").run(data)
				db.prepare("DELETE FROM List WHERE item_id = @id").run(data)
				broadcast({
					event: "DELETE_ITEM",
					data
				})
			}
			else if (message.event === "ADD_TO_LIST") {
				/** @type {import("../types").Event_ADD_TO_LIST} */
				const data = message.data
				const row = db.prepare("SELECT item_id, quantity FROM List WHERE item_id = @id").get(data)
				if (row) {
					db.prepare("UPDATE List SET quantity = quantity + @count WHERE item_id = @id").run(data)
				} else {
					db.prepare("INSERT INTO List (item_id, quantity, complete, tag) VALUES (@id, @count, 0, @tag)").run(data)
				}
				broadcast({
					event: "ADD_TO_LIST",
					data
				})
			}
			else if (message.event === "REMOVE_FROM_LIST") {
				/** @type {import("../types").Event_REMOVE_FROM_LIST} */
				const data = message.data
				const row = db.prepare("SELECT item_id, quantity FROM List WHERE item_id = @id").get(data)
				if (row) {
					if (data.count == null || data.count >= row.quantity) {
						db.prepare("DELETE FROM List WHERE item_id = @id").run(data)
					} else {
						db.prepare("UPDATE List SET quantity = quantity - @count WHERE item_id = @id").run(data)
					}
					broadcast({
						event: "REMOVE_FROM_LIST",
						data
					})
				}
			}
			else if (message.event === "ITEM_COMPLETE") {
				/** @type {import("../types").Event_ITEM_COMPLETE} */
				const data = message.data
				db.prepare("UPDATE List SET complete = 1 WHERE item_id = @id").run(data)
				broadcast({
					event: "ITEM_COMPLETE",
					data
				})
			}
			else if (message.event === "ITEM_UNCOMPLETE") {
				/** @type {import("../types").Event_ITEM_UNCOMPLETE} */
				const data = message.data
				db.prepare("UPDATE List SET complete = 0 WHERE item_id = @id").run(data)
				broadcast({
					event: "ITEM_UNCOMPLETE",
					data
				})
			}
			else if (message.event === "ITEM_SET_TAG") {
				/** @type {import("../types").Event_ITEM_SET_TAG} */
				const data = message.data
				db.prepare("UPDATE List SET tag = @tag WHERE item_id = @id").run(data)
				broadcast({
					event: "ITEM_SET_TAG",
					data
				})
			}
			else if (message.event === "CLEAR_LIST") {
				db.prepare("DELETE FROM List").run()
				broadcast({
					event: "CLEAR_LIST",
					data: null
				})
			}

		})

		socket.on("disconnect", () => {
			clients.delete(socket)
		})

		// Send the current state
		const items = db.prepare("SELECT * FROM Items").all()
		const list = db.prepare("SELECT * FROM List").all()
		this.send({
			event: "STATE",
			data: {
				items,
				list
			}
		})
	}

	send(data) {
		this.socket.send(JSON.stringify(data))
	}
}

module.exports = [
	{
		cancel: true, code: () => {
			wss.removeListener("connection", wsConnection)
		}
	}
]
