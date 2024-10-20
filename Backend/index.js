import express from 'express';
import { Server } from "socket.io";
import dotenv from "dotenv";
import http from 'http';
import mongoose from 'mongoose';
import cors from 'cors';

// routes
import authRoutes from './routes/auth.js';
import conversationRoutes from './routes/conversation.js';
import messageRoutes from './routes/message.js';

const app = express();
dotenv.config();

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "https://chat-app-frontend-puce-mu.vercel.app", // Allows all origins for Socket.io
        methods: ["GET", "POST"],
    },
});

// Socket.io connection
io.on("connection", (socket) => {
    console.log("A user has connected");
    //handle chat message event
    socket.on('chat message', (message)=>{
        console.log('Message' ,message);
        io.emit('chat message' , message);
    });

    socket.on('disconnet' , ()=>{
        console.log('User disconneted');
    });
});
app.options("" ,cors({
    origin:'https://chat-app-frontend-puce-mu.vercel.app', // Specify frontend origin
    credentials: true, // Allow cookies if needed
}));
// CORS middleware - should be added **before routes**
app.use(cors({
    origin:'https://chat-app-frontend-puce-mu.vercel.app', // Specify frontend origin
    credentials: true, // Allow cookies if needed
}));

// Other middlewares
app.use(express.json());

// API routes
app.use('/api/auth/', authRoutes);
app.use('/api/conversations/', conversationRoutes);
app.use('/api/messages/', messageRoutes);

const PORT = process.env.PORT || 4000;


app.get('/', (req, res) => {
    res.send('Backend is working!');
});


// Database connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => { console.log("DB is connected"); })
    .catch(err => { console.log(err); });

// Start server
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
