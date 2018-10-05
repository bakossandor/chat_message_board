$("document").ready(() => {
    console.log("document ready")
    const socket = io();
    $("#button-addon").click(() => {
        if ( $("#chat-input").val().length >= 1 ) {
            socket.emit("chat message", $("#chat-input").val())
        } else {
            // some buzzing animation
        }
    })
})