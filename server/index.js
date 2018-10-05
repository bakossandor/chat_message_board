const http = require("http")
const express = require("express")
const socketIO = require("socket.io")
const serveStatic = require("serve-static")
const path = require("path")

const app = express()
const server = http.Server(app)
const io = socketIO(server)

app.use(serveStatic(path.join(__dirname, "../client")))

io.on('connection', (socket) => {
    console.log('a user connected')
    socket.on("chat message", (msg) => {
        console.log("message from the user: ", msg)
    })
    socket.on("disconnect", () => {
        console.log("user disconnected")
    })
});

server.listen(3000, () => {
    console.log("serve is listneing on port 3000")
})