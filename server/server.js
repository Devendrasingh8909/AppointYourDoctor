const express = require("express");
const cors = require("cors");
const path = require("path");
const { Server } = require("socket.io");
require("dotenv").config();
require("./db/conn");
require("./controllers/socket");

const userRouter = require("./routes/userRoutes");
const doctorRouter = require("./routes/doctorRoutes");
const appointRouter = require("./routes/appointRoutes");
const notificationRouter = require("./routes/notificationRouter");

const app = express();
const port = process.env.PORT || 5015;

// CORS configuration (optional, customize based on your needs)
const corsOptions = {
    origin: 'http://localhost:3001', // Replace with your frontend URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Allow credentials (if needed)
};

// Use CORS middleware
app.use(cors(corsOptions));
app.use(express.json());

// API routes
app.use("/api/user", userRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/appointment", appointRouter);
app.use("/api/notification", notificationRouter);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "./client/build")));

// Handle any request that doesn't match the above routes
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

// Create HTTP server and attach Socket.IO
const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Initialize Socket.IO
const io = new Server(server);

// Socket.IO connection event
io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Handle socket events here

    // Clean up when the user disconnects
    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});
