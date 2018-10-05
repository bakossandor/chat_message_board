const http = require("http")
const express = require("express")
const socketIO = require("socket.io")
const serveStatic = require("serve-static")
const path = require("path")
const MongoClient = require("mongodb").MongoClient

const app = express()
const server = http.Server(app)
const io = socketIO(server)

const mongodbUrl = "mongodb://localhost:27017/"
var database = undefined
var dbo = undefined
MongoClient.connect(mongodbUrl, (err, db) => {
    if (err) throw err
    database = db
    dbo = database.db("chat_app_mb")
})

const users = []

app.use(serveStatic(path.join(__dirname, "../client")))

io.on('connection', (socket) => {
    const findThem = () => {
        dbo.collection("messages").find({}).toArray((error, result) => {
            if (error) throw error
            socket.emit("server_mb_msg", result)
            socket.broadcast.emit("server_mb_msg", result)
        })
    }
    console.log('an user connected')
    socket.on("receive_username", (username, cbFn) => {
        if (users.indexOf(username) === -1) {
            users.push(username)
            console.log("connected usernames: ", users)
            findThem()
            cbFn(true)
        } else {
            cbFn(false)
        }
    })
    socket.on("user_msg", (msg) => {
        console.log("message from the user: ", msg)
        socket.emit("server_msg", msg)
        socket.broadcast.emit("server_msg", msg)
    })
    socket.on("mb_msg", (msg) => {
        const objToPass = {
            username: msg[0],
            message: msg[1],
            date: new Date()
        }

        dbo.collection("messages").insertOne(objToPass, (err, res) => {
            if (err) throw err
            findThem()
        })
    })
    socket.on("disconnect", () => {
        console.log("user disconnected")
    })
});

server.listen(3000, () => {
    console.log("server is listneing on port 3000")
})