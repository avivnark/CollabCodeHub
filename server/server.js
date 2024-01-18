const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { MongoClient } = require('mongodb');

app.use(cors());

const server = http.createServer(app);

const codeBlocks = [
    {
        id: 1,
        name: 'Variables and Data Types',
        description: 'Declare a variable to store your age and print it to the console.',
        code: '',
        solution: 'const age = 25; console.log(age);',
    },
    {
        id: 2,
        name: 'Conditional Statements',
        description: 'Write a program that checks if a given number is even or odd.',
        code: '',
        solution: 'const number = 10;if (number % 2 === 0) {  console.log("Even");} else {  console.log("Odd");}',
    },
    {
        id: 3,
        name: 'Functions',
        description: 'Create a function that adds two numbers and returns the result.',
        code: '',
        solution: 'function addNumbers(a, b) {  return a + b;}const result = addNumbers(3, 4);console.log(result);',
    },
    {
        id: 4,
        name: 'Loops',
        description: 'Use a loop to print the numbers from 1 to 5 to the console.',
        code: '',
        solution: '1',
    },
];

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

let isMentor = {};

// MongoDB connection URI
const mongoURI = "mongodb+srv://avivn14:96UQIMIl23v5T0Tx@collabcodehub.ioxvtqd.mongodb.net/?retryWrites=true&w=majority";

// Connect to MongoDB
const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
let db;

async function connectToMongoDB() {
    try {
        await client.connect();
        db = client.db('collabcode');
        console.log("Connected to MongoDB");

        // Check if the 'codeblocks' collection exists
        const collections = await db.collections();
        const codeblocksCollection = collections.find(collection => collection.collectionName === 'codeblocks');

        if (codeblocksCollection) {
            // Drop the existing 'codeblocks' collection
            await codeblocksCollection.drop();
        }

        // Insert the initial data into the 'codeblocks' collection
        await db.collection('codeblocks').insertMany(codeBlocks);

        console.log("Initialized 'codeblocks' collection with initial data");
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
    }
}


connectToMongoDB();

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

    socket.on('code_change', async (data) => {
        try {
            // Update the MongoDB document with the new code
            await db.collection('codeblocks').updateOne(
                { id: data.id },
                { $set: { code: data.code } }
            );

            // Retrieve the updated document
            const updatedBlock = await db.collection('codeblocks').findOne({ id: data.id });

            // Check if the updated code matches the solution
            const solutionCode = updatedBlock.solution.trim().replace(/\s+/g, ' ');
            const userCode = data.code.trim().replace(/\s+/g, ' ');

            if (userCode === solutionCode) {
                // Broadcast the code change to all connected clients along with a success indicator
                io.emit('receive_code', { code: data.code, id: data.id, success: true });
                console.log(`Code change broadcasted for code block ${data.id} (success)`);
            } else {
                // Broadcast the code change to all connected clients with a failure indicator
                io.emit('receive_code', { code: data.code, id: data.id, success: false });
                console.log(`Code change broadcasted for code block ${data.id}`);
                console.log({ userCode });
                console.log({ solutionCode });
            }
        } catch (err) {
            console.error("Error updating MongoDB document:", err);
        }
    });

    socket.on('disconnect', () => {
        console.log(`User Disconnected: ${socket.id}`);
    });
});

const port = process.env.PORT || 3001;

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Close the MongoDB connection when the server is stopped
process.on('SIGINT', async () => {
    try {
        await client.close();
        console.log('Closed the MongoDB connection.');
        process.exit(0);
    } catch (err) {
        console.error("Error closing MongoDB connection:", err);
        process.exit(1);
    }
});
