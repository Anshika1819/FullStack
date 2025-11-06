// server/server.js
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" } // for development; restrict in production
});

const PORT = process.env.PORT || 5000;

// In-memory user map: socketId -> username
const users = new Map();

io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.on("join", (username) => {
    const name = username?.trim() || "Anonymous";
    users.set(socket.id, name);
    // send updated user list to everyone
    io.emit("users", Array.from(users.values()));
    // announce join to others
    socket.broadcast.emit("message", {
      user: "System",
      text: `${name} joined the chat`,
      time: new Date().toISOString()
    });
  });

  socket.on("message", (text) => {
    const user = users.get(socket.id) || "Anonymous";
    const payload = { user, text, time: new Date().toISOString() };
    io.emit("message", payload);
  });

  socket.on("disconnect", () => {
    const name = users.get(socket.id);
    if (name) {
      users.delete(socket.id);
      io.emit("users", Array.from(users.values()));
      socket.broadcast.emit("message", {
        user: "System",
        text: `${name} left the chat`,
        time: new Date().toISOString()
      });
    }
    console.log(`Client disconnected: ${socket.id}`);
  });
});

app.get("/", (req, res) => res.send("Socket.io chat server running"));

server.listen(PORT, () => console.log(`Server listening on ${PORT}`));
