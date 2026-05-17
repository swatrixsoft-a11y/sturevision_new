"use client";

import { useEffect, useRef, useState } from "react";
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

    socket.on("room:user_joined", ({ userId, name, memberCount }: any) => {
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
