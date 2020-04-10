const ws = new WebSocket(window.origin.replace("http", "ws"))
const listeners = []

ws.addEventListener("message", message => {
	const content = JSON.parse(message.data)
	listeners.forEach(l => l(content))
})

function addWSListener(callback) {
	listeners.push(callback)
}

export {ws, addWSListener}
