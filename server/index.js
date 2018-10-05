const http = require("http")
const express = require("express")
const socketIO = require("socket.io")
const serveStatic = require("serve-static")
const path = require("path")

const app = express()
const server = http.Server(app)
const io = socketIO(server)

const users = []

app.use(serveStatic(path.join(__dirname, "../client")))

io.on('connection', (socket) => {
    console.log('an user connected')
    socket.on("user_msg", (msg) => {
        console.log("message from the user: ", msg)
        socket.emit("server_msg", msg)
        socket.broadcast.emit("server_msg", msg)
    })
    socket.on("disconnect", () => {
        console.log("user disconnected")
    })
    socket.on("receive_username", (username, cbFn) => {
        if (users.indexOf(username) === -1) {
            users.push(username)
            console.log("connected usernames: ", users)
            cbFn(true)
        } else {
            cbFn(false)
        }
    })
});

server.listen(3000, () => {
    console.log("serve is listneing on port 3000")
})