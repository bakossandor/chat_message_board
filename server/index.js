const http = require("http")
const express = require("express")
const socketIO = require("socket.io")
const serveStatic = require("serve-static")
const path = require("path")

const IO = require("./io/io")
const DB = require("./db/db")

const app = express()
const server = http.Server(app)
const io = socketIO(server)

app.use(serveStatic(path.join(__dirname, "../client")))

io.on("connection", IO.connect)

DB.connect(() => {
    server.listen(3000, () => {
        console.log("server is listneing on port 3000")
    })
})
