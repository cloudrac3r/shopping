const {Pinski} = require("pinski")
const passthrough = require("./passthrough")
const sqlite = require("better-sqlite3")

const db = new sqlite("./db/shopping.db")
passthrough.db = db

const server = new Pinski({
	relativeRoot: __dirname,
	filesDir: "html",
	port: 10409
})

server.startServer()
server.enableWS()

Object.assign(passthrough, server.getExports())

server.addAPIDir("api")

server.addPugDir("pug")
server.addRoute("/", "pug/home.pug", "pug")

server.addSassDir("sass")
server.addRoute("/static/css/main.css", "sass/main.sass", "sass")
