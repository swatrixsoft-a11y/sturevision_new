// Socket.io server — run separately: node src/lib/socket-server.js
// Deploy this on Railway for production

const { createServer } = require("http");
const { Server } = require("socket.io");

const PORT = process.env.SOCKET_PORT || 3001;

const httpServer = createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Sturevision Socket.io Server");
});

const io = new Server(httpServer, {
  cors: {
    origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Track online users
const onlineUsers = new Map(); // userId -> { socketId, name, avatar }
const studyRooms = new Map();  // roomId -> Set of userIds
const chatRooms  = new Map();  // roomName -> Map<userId, { userId, name, avatar }>

io.on("connection", (socket) => {
  console.log(`[Socket] Connected: ${socket.id}`);

  // ── User presence ──────────────────────────────────────────────────────────

  socket.on("user:online", ({ userId, name, avatar }) => {
    onlineUsers.set(userId, { socketId: socket.id, name, avatar });
    socket.userId = userId;
    io.emit("leaderboard:update", { onlineCount: onlineUsers.size });
    console.log(`[Socket] User online: ${name} (${userId})`);
  });

  socket.on("streak:update", ({ userId, streakCount, xpPoints }) => {
    io.emit("streak:broadcast", { userId, streakCount, xpPoints });
  });

  socket.on("xp:earned", ({ userId, name, xpEarned, totalXP }) => {
    socket.broadcast.emit("xp:broadcast", { userId, name, xpEarned, totalXP });
  });

  // ── Study rooms ────────────────────────────────────────────────────────────

  socket.on("room:join", ({ roomId, userId, name }) => {
    socket.join(roomId);
    if (!studyRooms.has(roomId)) studyRooms.set(roomId, new Set());
    studyRooms.get(roomId).add(userId);
    io.to(roomId).emit("room:user_joined", {
      userId,
      name,
      memberCount: studyRooms.get(roomId).size,
    });
    console.log(`[Socket] ${name} joined study room: ${roomId}`);
  });

  socket.on("room:answer", ({ roomId, userId, questionIndex, isCorrect, score }) => {
    io.to(roomId).emit("room:score_update", { userId, score, questionIndex, isCorrect });
  });

  socket.on("room:leave", ({ roomId, userId }) => {
    socket.leave(roomId);
    if (studyRooms.has(roomId)) {
      studyRooms.get(roomId).delete(userId);
      if (studyRooms.get(roomId).size === 0) studyRooms.delete(roomId);
    }
    io.to(roomId).emit("room:user_left", { userId });
  });

  // ── Chat rooms ─────────────────────────────────────────────────────────────

  socket.on("chat:join", ({ room, userId, name, avatar }) => {
    const key = `chat:${room}`;
    socket.join(key);

    if (!chatRooms.has(room)) chatRooms.set(room, new Map());
    chatRooms.get(room).set(userId, { userId, name, avatar });

    // Track which chat rooms this socket is in (for cleanup on disconnect)
    if (!socket.chatRooms) socket.chatRooms = new Set();
    socket.chatRooms.add(room);

    io.to(key).emit("chat:presence", {
      room,
      members: Array.from(chatRooms.get(room).values()),
    });
    console.log(`[Socket] ${name} joined chat room: ${room}`);
  });

  socket.on("chat:leave", ({ room, userId }) => {
    const key = `chat:${room}`;
    socket.leave(key);
    if (chatRooms.has(room)) {
      chatRooms.get(room).delete(userId);
      if (chatRooms.get(room).size === 0) chatRooms.delete(room);
      else {
        io.to(key).emit("chat:presence", {
          room,
          members: Array.from(chatRooms.get(room).values()),
        });
      }
    }
    if (socket.chatRooms) socket.chatRooms.delete(room);
  });

  // Broadcast a persisted message to everyone else in the room
  socket.on("chat:message", (message) => {
    io.to(`chat:${message.room}`).emit("chat:message", message);
  });

  socket.on("chat:typing", ({ room, userId, name }) => {
    socket.to(`chat:${room}`).emit("chat:typing", { userId, name });
  });

  socket.on("chat:stop_typing", ({ room, userId }) => {
    socket.to(`chat:${room}`).emit("chat:stop_typing", { userId });
  });

  // ── Disconnect ─────────────────────────────────────────────────────────────

  socket.on("disconnect", () => {
    if (socket.userId) {
      // Clean up chat room presence
      if (socket.chatRooms) {
        for (const room of socket.chatRooms) {
          const members = chatRooms.get(room);
          if (members) {
            members.delete(socket.userId);
            if (members.size === 0) {
              chatRooms.delete(room);
            } else {
              io.to(`chat:${room}`).emit("chat:presence", {
                room,
                members: Array.from(members.values()),
              });
            }
          }
        }
      }
      onlineUsers.delete(socket.userId);
      io.emit("leaderboard:update", { onlineCount: onlineUsers.size });
      console.log(`[Socket] Disconnected: ${socket.userId}`);
    }
  });
});

httpServer.listen(PORT, () => {
  console.log(`✅ Sturevision Socket.io server running on port ${PORT}`);
});
