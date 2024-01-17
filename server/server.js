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
    

    socket.on('disconnect', () => {
        console.log('Disconnected from the server!');
    });

    socket.on('code_change', () => {
        console.log('Code change!');

    });
});

server.listen(3001, () => {
    console.log("Server is Running on Port 3001");
});