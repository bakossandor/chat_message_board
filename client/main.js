$("document").ready(() => {
    const socket = io();
    var username = undefined;

    socket.on("connect", function () {
        socket.on("server_msg", (msg) => {
            console.log("msg form server :", msg)
            appendMessage(msg[0], msg[1])
        })
    })
    
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

    $("#button-username").click(() => {
        socket.emit("receive_username", $("#user-name").val(), (data) =>{
            if (data) {
                username = $("#user-name").val()
                $(".user-modal").modal("hide")
            } else {
                if (username !== false) {
                    $(".model-to-append").append("<p style='color: red'>The username is used</p>")
                }
                username = false
            }
        })
    })

    $("#button-addon").click(() => {
        if ( $("#chat-input").val().length >= 1 ) {
            socket.emit("user_msg", [username, $("#chat-input").val()])
        } else {
            // some buzzing animation
        }
    })
    

    //modal instant show as page loads
    $(".user-modal").modal("show")
    //enabling fancy tooltip
    $('[data-toggle="tooltip"]').tooltip()
})