import { Server, Socket } from 'socket.io';
import http from 'http';
import express from 'express';
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    }
});
const userSocketMap = {};
io.on("connection", (socket) => {
    console.log("User connected ", socket.id);
    const userId = socket.handshake.query.userId;
    if (userId && userId !== "undefined") {
        userSocketMap[userId] = socket.id;
        console.log(`User ${userId} mapped to socket ${socket.id}`);
    }
    io.emit("getOnlineUser", Object.keys(userSocketMap));
    socket.on("disconnect", () => {
        console.log("User disconnected ", socket.id);
        if (userId) {
            delete userSocketMap[userId];
            console.log(`User ${userId} removed from online users`);
            io.emit("getOnlineUser", Object.keys(userSocketMap));
        }
    });
    socket.on("connect_error", (error) => {
        console.log("Socket connection error ", error);
    });
});
export { app, server, io };
//# sourceMappingURL=socket.js.map