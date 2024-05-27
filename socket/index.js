const {Server} = require("socket.io")

const server = new Server({
    cors: {
        origin: "http://localhost:4200"
    }
});

let editors = {}
let activeConnections = [];

server.on("connection", (socket) => {
    console.log("connected, ", "socket: ", socket.data, socket.id);

    socket.on("startedEditing", ({room, editor}) => {
        console.log("started editing data: ", room, editor);
        const ed = {...editor, socketId: socket.id}
        if (Array.isArray(editors[room])) {
            console.log("ed push: ", ed);
            editors[room].push(ed);
        } else {
            console.log("ed create: ", ed);
            editors[room] = [ed];
        }

        socket.to(room).emit("startedEditing", editor);
        console.log("EDITORS: startedEditing:", editors);
        console.log("ACTIVE_CONNECTIONS: startedEditing:", activeConnections);

    })

    socket.on("cancelledEditing", ({room, vendor}) => {
        console.log("cancelled editing data: ", room, vendor);
        if (editors[room]) {
            editors[String(room)] = editors[String(room)].filter((e) => e._id !== vendor?._id);
        }

        
        socket.to(room).emit("cancelledEditing", vendor);
        console.log("EDITORS: cancelledEditing:", editors);
        console.log("ACTIVE_CONNECTIONS: cancelledEditing:", activeConnections);

    })

    socket.on("joinRoom", ({room, userId}) => {
        console.log("joining room: ", room);
        socket.join(room);

        activeConnections.push({socketId: socket.id, userId, room})

        // Send the current editors to the newly joined socket
        if (Array.isArray(editors[room])) {
            socket.emit("joinedRoom", editors[room]);
        } else {
            socket.emit("joinedRoom", []);
        }

        console.log("EDITORS: joinRoom:", editors);
        console.log("ACTIVE_CONNECTIONS: joinRoom:", activeConnections);
    });

    socket.on("vendorUpdated", (data) => {
        console.log("data:", data)
        console.log("emitting vendor in room: ", data.room, data.vendor);

        socket.to(data.room).emit("vendorUpdated", data.vendor);

        console.log("EDITORS: vendorUpdated:", editors);
        console.log("ACTIVE_CONNECTIONS: vendorUpdated:", activeConnections);
    })

    socket.on("disconnect", () => {
        try {
            let disconnectedUser = {};
            activeConnections = activeConnections.filter((c) => {
                if (c.socketId === socket.id) {
                    disconnectedUser = c;
                    return false;
                }

                return true;
            })

            console.log("disconnectedUser; ", disconnectedUser)
            const remEditors = []

            for (let ed of editors[disconnectedUser.room]) {
                if (ed)
                if (ed.userId !== disconnectedUser.userId) {
                    remEditors.push(ed);
                }
            }

            console.log("rem editors: ", remEditors);
            editors[disconnectedUser.room] = remEditors;

            socket.to(disconnectedUser.room).emit("disconnected", disconnectedUser.userId);
        }
        catch(e) {
            console.log("could not remove editor from the editors array", e);
        }
        console.log("ACTIVE_CONNECTIONS: disconnect:", activeConnections);

    });
})


server.listen(5000);