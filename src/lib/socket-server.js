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
const onlineUsers = new Map(); // userId -> socketId
const studyRooms = new Map();  // roomId -> Set of userIds

io.on("connection", (socket) => {
  console.log(`[Socket] Connected: ${socket.id}`);

  // User comes online
  socket.on("user:online", ({ userId, name, avatar }) => {
    onlineUsers.set(userId, { socketId: socket.id, name, avatar });
    socket.userId = userId;

    // Broadcast updated leaderboard
    io.emit("leaderboard:update", { onlineCount: onlineUsers.size });
    console.log(`[Socket] User online: ${name} (${userId})`);
  });

  // Streak update
  socket.on("streak:update", ({ userId, streakCount, xpPoints }) => {
    io.emit("streak:broadcast", { userId, streakCount, xpPoints });
  });

  // XP gain broadcast
  socket.on("xp:earned", ({ userId, name, xpEarned, totalXP }) => {
    socket.broadcast.emit("xp:broadcast", { userId, name, xpEarned, totalXP });
  });

  // Study room — join
  socket.on("room:join", ({ roomId, userId, name }) => {
    socket.join(roomId);
    if (!studyRooms.has(roomId)) studyRooms.set(roomId, new Set());
    studyRooms.get(roomId).add(userId);

    io.to(roomId).emit("room:user_joined", {
      userId,
      name,
      memberCount: studyRooms.get(roomId).size,
    });
    console.log(`[Socket] ${name} joined room: ${roomId}`);
  });

  // Study room — quiz answer
  socket.on("room:answer", ({ roomId, userId, questionIndex, isCorrect, score }) => {
    io.to(roomId).emit("room:score_update", { userId, score, questionIndex, isCorrect });
  });

  // Study room — leave
  socket.on("room:leave", ({ roomId, userId }) => {
    socket.leave(roomId);
    if (studyRooms.has(roomId)) {
      studyRooms.get(roomId).delete(userId);
      if (studyRooms.get(roomId).size === 0) studyRooms.delete(roomId);
    }
    io.to(roomId).emit("room:user_left", { userId });
  });

  // Disconnect
  socket.on("disconnect", () => {
    if (socket.userId) {
      onlineUsers.delete(socket.userId);
      io.emit("leaderboard:update", { onlineCount: onlineUsers.size });
      console.log(`[Socket] Disconnected: ${socket.userId}`);
    }
  });
});

httpServer.listen(PORT, () => {
  console.log(`✅ Sturevision Socket.io server running on port ${PORT}`);
});
