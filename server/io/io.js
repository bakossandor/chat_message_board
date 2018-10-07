const DB = require("../db/db")

const users = []

module.exports = {
    connect(socket) {
        
        socket.on("receive_username", async (username, cbFn) => {
            if (users.indexOf(username) === -1) {
                try {
                    users.push(username)
                    console.log("connected usernames: ", users)
                    await cbFn(true)
                    const messages = await DB.getAllMessage()
                    
                    socket.emit("server_mb_msg", messages)
                    socket.broadcast.emit("server_mb_msg", messages)
                } catch (error) {
                    console.log("error receving the username :", error)
                }
            } else {
                cbFn(false)
            }
        })

        socket.on("user_msg", (msg) => {
            socket.emit("server_msg", msg)
            socket.broadcast.emit("server_msg", msg)
        })

        socket.on("mb_msg", async (msg) => {
            try {
                const objToPass = {
                    username: msg[0],
                    message: msg[1],
                    date: new Date()
                }
                await DB.insertMessage(objToPass)
                socket.emit("server_mb_msg", [objToPass])
                socket.broadcast.emit("server_mb_msg", [objToPass])
            } catch (error) {
                console.log("error receiving message from user :", error)
            }
        })

        socket.on("disconnect", () => {
            console.log("user disconnected")
        })
    }
}
