const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

app.use(cors());

const server = http.createServer(app);
require('./initializeDB');

const io = new Server(server, {
    cors: {
        origin: "https://collab-code-2k62pvu1t-avivnarks-projects.vercel.app",
        methods: ["GET", "POST"],
    },
});

let isMentor = {};

// Connect to SQLite database
const db = new sqlite3.Database('codeblocks.db');

io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

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

    socket.on('code_change', (data) => {
        // Update the database with the new code
        db.run('UPDATE codeblocks SET code = ? WHERE id = ?', [data.code, data.id], (err) => {
            if (err) {
                console.error(err.message);
            } 
            else {
                // Check if the updated code matches the solution
                db.get('SELECT solution FROM codeblocks WHERE id = ?', [data.id], (err, row) => {
                    if (err) {
                        console.error(err.message);
                    } 
                    else {
                        let solutionCode = row.solution.trim().replace(/\s+/g, ' ');
                        let userCode = data.code.trim().replace(/\s+/g, ' ');

                        if (userCode === solutionCode) {                        
                            // Broadcast the code change to all connected clients along with a success indicator
                            io.emit('receive_code', { code: data.code, id: data.id, success: true });
                            console.log(`Code change broadcasted for code block ${data.id} (success)`);
                        } else {
                            // Broadcast the code change to all connected clients with a failure indicator
                            io.emit('receive_code', { code: data.code, id: data.id, success: false });
                            console.log(`Code change broadcasted for code block ${data.id}`);
                            console.log({userCode});
                            console.log({solutionCode});
                        }
                    }
                });
            }
        });
    });

    socket.on('code_change', (data) => {
        // Update the database with the new code
        db.run('UPDATE codeblocks SET code = ? WHERE id = ?', [data.code, data.id], (err) => {
            if (err) {
                console.error(err.message);
            } else {
                // Check if the updated code matches the solution
                db.get('SELECT * FROM codeblocks WHERE id = ?', [data.id], (err, row) => {
                    if (err) {
                        console.error(err.message);
                    } else {
                        let solutionCode = row.solution;
                        let userCode = data.code.trim().replace(/\s+/g, ' ');
    
                        if (userCode === solutionCode) {
                            // Broadcast the code change to all connected clients along with a success indicator
                            io.emit('receive_code', { code: data.code, id: data.id, success: true });
                            console.log(`Code change broadcasted for code block ${data.id} (success)`);
                        } else {
                            // Broadcast the code change to all connected clients with a failure indicator
                            io.emit('receive_code', { code: data.code, id: data.id, success: false });
                            console.log(`Code change broadcasted for code block ${data.id} (failure)`);
                            console.log({ userCode });
                            console.log({ solutionCode });
                        }
                    }
                });
            }
        });
    });
    
    

    socket.on('disconnect', () => {
        console.log(`User Disconnected: ${socket.id}`);
    });
});

const port = process.env.PORT || 3001;

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


// Close the database connection when the server is stopped
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Closed the database connection.');
        process.exit(0);
    });
});
