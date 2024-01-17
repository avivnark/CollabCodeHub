const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

let isMentor = {};

io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    // Emit the 'userConnected' event to the server
    socket.on('userConnected', () => {
        // Handle user connection logic if needed
    });

    socket.on('joinCodeBlock', (numOfBlock) => {
        if (isMentor[numOfBlock] === undefined || isMentor[numOfBlock] === false) {
            isMentor[numOfBlock] = true;
            socket.emit('mentorConnected');
            console.log('mentorConnected');
        } else {
            socket.emit('mentorConnectedAlready');
            console.log('mentorConnectedAlready');
        }
    });

    // Listen for 'code_change' event from the student
    socket.on('code_change', (data) => {
        // Broadcast the code change mentor
        io.emit('receive_code', { code: data.code, id: data.id });
        console.log(`Code change broadcasted code block ${data.id}`);
    });

    socket.on('disconnect', () => {
        console.log(`User Disconnected: ${socket.id}`);
    });
});

server.listen(3001, () => {
    console.log("Server is Running on Port 3001");
});
