const ws = new WebSocket(window.origin.replace("http", "ws"))
const listeners = []
/** @type {{event: string, fn: (any) => void}[]} */
const eventListeners = []

ws.addEventListener("message", message => {
	const data = JSON.parse(message.data)
	console.log("%c[WS ←]", "color: #88ccff", data)
	listeners.forEach(l => l(data))
	if (data.event) {
		eventListeners.forEach(l => l.event === data.event && l.fn(data.data))
	}
})

let websocketOk = true
const websocketFailed = document.getElementById("websocket-failed")
ws.addEventListener("close", () => {
	if (!websocketOk) return
	websocketOk = false
	websocketFailed.textContent = "WebSocket disconnected. Reload the page."
	websocketFailed.style.display = "block"
})
ws.addEventListener("error", () => {
	if (!websocketOk) return
	websocketOk = false
	websocketFailed.textContent = "WebSocket connection error."
	websocketFailed.style.display = "block"
})

function addWSListener(callback) {
	listeners.push(callback)
}

function addWSEventListener(name, callback) {
	eventListeners.push({event: name, fn: callback})
}

function send(data) {
	console.log("%c[WS →]", "color: #ff3333", data)
	const string = JSON.stringify(data)
	ws.send(string)
}

export {ws, send, addWSEventListener, addWSListener}
