"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function useSocket() {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001";

    if (!socket) {
      socket = io(socketUrl, {
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        transports: ["websocket"],
      });
    }

    socket.on("connect", () => setIsConnected(true));
    socket.on("disconnect", () => setIsConnected(false));

    return () => {
      socket?.off("connect");
      socket?.off("disconnect");
    };
  }, []);

  return { socket, isConnected };
}

export function useLeaderboard() {
  const { socket } = useSocket();
  const [onlineCount, setOnlineCount] = useState(0);

  useEffect(() => {
    if (!socket) return;

    socket.on("leaderboard:update", ({ onlineCount }: { onlineCount: number }) => {
      setOnlineCount(onlineCount);
    });

    return () => {
      socket?.off("leaderboard:update");
    };
  }, [socket]);

  return { onlineCount };
}

export function useStudyRoom(roomId: string | null) {
  const { socket } = useSocket();
  const [members, setMembers] = useState<Array<{ userId: string; name: string }>>([]);
  const [scores, setScores] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!socket || !roomId) return;

    socket.on("room:user_joined", ({ userId, name }: any) => {
      setMembers((prev) => [...prev.filter((m) => m.userId !== userId), { userId, name }]);
    });

    socket.on("room:user_left", ({ userId }: any) => {
      setMembers((prev) => prev.filter((m) => m.userId !== userId));
    });

    socket.on("room:score_update", ({ userId, score }: any) => {
      setScores((prev) => ({ ...prev, [userId]: score }));
    });

    return () => {
      socket?.off("room:user_joined");
      socket?.off("room:user_left");
      socket?.off("room:score_update");
    };
  }, [socket, roomId]);

  return { members, scores };
}

// ── Types ──────────────────────────────────────────────────────────────────

export interface ChatMessage {
  _id: string;
  room: string;
  sender: { userId: string; name: string; avatar?: string };
  content: string;
  type: "text" | "note" | "flashcard";
  attachmentData?: { front?: string; back?: string; subject?: string };
  createdAt: string;
}

export interface RoomMember {
  userId: string;
  name: string;
  avatar?: string;
}

// ── useChat ────────────────────────────────────────────────────────────────

export function useChat(
  room: string | null,
  userInfo: { userId: string; name: string; avatar?: string } | null
) {
  const { socket } = useSocket();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typingUsers, setTypingUsers] = useState<Record<string, string>>({}); // userId -> name
  const [roomMembers, setRoomMembers] = useState<RoomMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const prevRoom = useRef<string | null>(null);
  const typingTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Fetch message history whenever room changes
  useEffect(() => {
    if (!room) return;
    setIsLoading(true);
    setMessages([]);
    setTypingUsers({});

    fetch(`/api/chat?room=${encodeURIComponent(room)}&limit=50`)
      .then((r) => r.json())
      .then((data) => {
        setMessages(data.messages || []);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [room]);

  // Socket join / leave + real-time listeners
  useEffect(() => {
    if (!socket || !room || !userInfo?.userId) return;

    // Leave previous room
    if (prevRoom.current && prevRoom.current !== room) {
      socket.emit("chat:leave", { room: prevRoom.current, userId: userInfo.userId });
    }
    prevRoom.current = room;

    socket.emit("chat:join", { room, ...userInfo });

    const onMessage = (msg: ChatMessage) => {
      if (msg.room !== room) return;
      setMessages((prev) => {
        if (prev.some((m) => m._id === msg._id)) return prev;
        return [...prev, msg];
      });
    };

    const onTyping = ({ userId, name }: { userId: string; name: string }) => {
      if (userId === userInfo.userId) return;
      setTypingUsers((prev) => ({ ...prev, [userId]: name }));
    };

    const onStopTyping = ({ userId }: { userId: string }) => {
      setTypingUsers((prev) => {
        const next = { ...prev };
        delete next[userId];
        return next;
      });
    };

    const onPresence = ({ room: r, members }: { room: string; members: RoomMember[] }) => {
      if (r === room) setRoomMembers(members);
    };

    socket.on("chat:message", onMessage);
    socket.on("chat:typing", onTyping);
    socket.on("chat:stop_typing", onStopTyping);
    socket.on("chat:presence", onPresence);

    return () => {
      socket.off("chat:message", onMessage);
      socket.off("chat:typing", onTyping);
      socket.off("chat:stop_typing", onStopTyping);
      socket.off("chat:presence", onPresence);
    };
  }, [socket, room, userInfo?.userId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (socket && prevRoom.current && userInfo?.userId) {
        socket.emit("chat:leave", { room: prevRoom.current, userId: userInfo.userId });
      }
      clearTimeout(typingTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendMessage = useCallback(
    async (
      content: string,
      type: "text" | "note" | "flashcard" = "text",
      attachmentData?: { front?: string; back?: string; subject?: string }
    ) => {
      if (!room || !content.trim()) return null;

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ room, content, type, attachmentData }),
      });

      if (!res.ok) return null;
      const msg: ChatMessage = await res.json();

      // Optimistic: add locally, socket echo will be deduped
      setMessages((prev) => {
        if (prev.some((m) => m._id === msg._id)) return prev;
        return [...prev, msg];
      });

      // Broadcast to other clients
      socket?.emit("chat:message", msg);

      // Clear typing state
      clearTimeout(typingTimer.current);
      if (userInfo?.userId) {
        socket?.emit("chat:stop_typing", { room, userId: userInfo.userId });
      }

      return msg;
    },
    [socket, room, userInfo?.userId]
  );

  const emitTyping = useCallback(() => {
    if (!socket || !room || !userInfo?.userId) return;
    socket.emit("chat:typing", { room, userId: userInfo.userId, name: userInfo.name });
    clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => {
      socket.emit("chat:stop_typing", { room, userId: userInfo.userId });
    }, 2500);
  }, [socket, room, userInfo?.userId, userInfo?.name]);

  return { messages, sendMessage, typingUsers, roomMembers, isLoading, emitTyping };
}
