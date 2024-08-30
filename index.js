const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        // origin: "http://localhost:3000",
        origin: ["http://192.168.86.28:3000", "http://localhost:3000"],
        methods: ["GET", "POST"]
    }
});

// app.use(express.static('public'));
let onlineUsers = 0;

io.on('connection', (socket) => {
    console.log('A user connected');
    onlineUsers += 1;
    io.emit('online users', onlineUsers);
    
    socket.on('chat message', ({message, username, color, formattedDate, formattedTime}) => {
        console.log('Message received at:', formattedDate, formattedTime, 'From: ', username, ':', message, ' - color: ', color);
        io.emit('chat message', { message, username, color, formattedDate, formattedTime });
    })

    socket.on('disconnect', () => {
        if (onlineUsers > 0) {
            onlineUsers -= 1;
            io.emit('online users', onlineUsers);
        }
        console.log('User disconnected');
    })
})

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});