require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/db");
const adminRoutes = require("./src/routes/admin");
const agentRoutes = require("./src/routes/agent");
const chatRoutes = require("./src/routes/chat");
const http = require("http");
const socketio = require("socket.io");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Connect database
connectDB();

// Serve frontend
app.use(express.static("public"));

// Routes
app.use("/api/admin", adminRoutes);
app.use("/api/agent", agentRoutes);
app.use("/api", chatRoutes);

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
const io = socketio(server, {
  cors: { origin: "*" },
});

// Make io global
global.io = io;

// SOCKET.IO LOGIC
io.on("connection", (socket) => {
  console.log("Socket Connected:", socket.id);

  // When agent logs in → register with socket
  socket.on("register_agent", (agentId) => {
    socket.join(agentId);
    console.log("Agent joined room:", agentId);
  });

  socket.on("send_message", async (msg) => {
    console.log("Message Received:", msg);
    io.emit("new_message", msg);
  });
});

// Start server
server.listen(5000, () => console.log("Server running on 5000"));
