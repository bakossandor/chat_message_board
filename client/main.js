$("document").ready(() => {
    const socket = io();

    $("#button-addon").click(() => {
        if ( $("#chat-input").val().length >= 1 ) {
            socket.emit("user_msg", $("#chat-input").val())
        } else {
            // some buzzing animation
        }
    })

    socket.on("server_msg", (msg) => {
        console.log("msg form server :", msg)
    })
})