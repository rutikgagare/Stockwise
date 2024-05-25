const {Server} = require("socket.io")

const server = new Server({
    cors: {
        origin: "http://localhost:4200"
    }
});

server.on("connection", (socket) => {
    console.log("connected, ", "socket: ", socket.data, socket.id);

    socket.on("startedEditing", ({room, vendorId}) => {
        console.log("started editing data: ", room, vendorId);
        socket.to(room).emit("startedEditing", vendorId);
    })

    socket.on("cancelledEditing", ({room, vendorId}) => {
        console.log("cancelled editing data: ", room, vendorId);
        socket.to(room).emit("cancelledEditing", vendorId);
    })

    socket.on("joinRoom", (room) => {
        console.log("joining room: ", room);
        socket.join(room);
    });

    socket.on("vendorUpdated", (data) => {
        console.log("data:", data)
        console.log("emitting vendor in room: ", data.room, data.vendor);

        socket.to(data.room).emit("vendorUpdated", data.vendor);
    })
})


server.listen(5000);