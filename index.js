const {Pinski} = require("pinski")

const server = new Pinski({
	relativeRoot: __dirname,
	filesDir: "html",
	port: 10409
})

server.enableWS()
server.startServer()

server.addAPIDir("api")

server.addPugDir("pug")
server.addRoute("/", "pug/home.pug", "pug")

server.addSassDir("sass")
server.addRoute("/static/css/main.css", "sass/main.sass", "sass")
