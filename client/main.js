$("document").ready(() => {
    const socket = io();
    var username = undefined;

    //dealing with the username
    const emittingName = () => {
        socket.emit("receive_username", $("#user-name").val(), (data) => {
            if (data) {
                username = $("#user-name").val()
                $(".user-modal").modal("hide")
                $(".hello-user").text(`Hello ${username}`)
            } else {
                if (username !== false) {
                    $(".model-to-append").append("<p style='color: red'>The username is used</p>")
                }
                username = false
            }
        })
    }
    $("#button-username").click(emittingName)
    $("#user-name").keypress((event) => {
        if (event.which === 13) {
            emittingName()
        }
    })

    socket.on("server_mb_msg", (arr) => {
        console.log(arr)
        arr.forEach(element => {
            $(".mb-content").prepend(
                `<p><span class="bg-info text-light">${element.username}</span> | <span class="bg-light">${element.date}</span> | <span class="text-secondary">${element.message}</span></p>`
            )
        });
    })

    socket.on("connect", () => {
        //listening for all meessages come from other users
        socket.on("server_msg", (msg) => {
            console.log("msg form server :", msg)
            appendMessage(msg[0], msg[1])
        })
    })
    
    //adding the styled chat elements to the chat
    const appendMessage = (un, msg) => {
        if (un !== username) {
            $(".message-s").prepend(
                `<div class="alert alert-primary" role="alert"> \
                    <p><span class="font-weight-bold">${un}</span> - <span class="text-monospace">${msg}</span></p> \
                </div>`
            )
        } else {
            $(".message-s").prepend(
                `<div class="alert alert-success" role="alert"> \
                    <p><span class="font-weight-bold">${un}</span> - <span class="text-monospace">${msg}</span></p> \
                </div>`
            )
        }
    }

    //emitting chat messages
    const emittingChat = () => {
        if ( $("#chat-input").val().length >= 1 ) {
            socket.emit("user_msg", [username, $("#chat-input").val()])
            $("#chat-input").val("")
        } else {
            // some buzzing animation
        }
    }
    $("#button-addon").click(emittingChat)
    $("#chat-input").keypress((event) => {
        if (event.which === 13) {
            emittingChat()
        }
    })

    //emitting to the msg board
    const emittingToMbrd = () => {
        if ( $("#mb-input").val().length >= 1 ) {
            socket.emit("mb_msg", [username, $("#mb-input").val()])
            $("#mb-input").val("")
        } else {
            // some buzzing animation
        }
    }
    $("#mb-button").click(emittingToMbrd)
    $("#mb-input").keypress((event) => {
        if (event.which === 13) {
            emittingToMbrd()
        }
    })

    //modal instant show as page loads
    $(".user-modal").modal("show")
    //enabling fancy tooltip
    $('[data-toggle="tooltip"]').tooltip()
})
