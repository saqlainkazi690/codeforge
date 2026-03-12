import { io, Socket } from "socket.io-client";
import { useEffect, useState } from "react";
import { XPUpdateEvent, LevelUpEvent } from "../types/shared";

let socket: Socket | null = null;

export const useSocket = (studentId: string | null) => {
  const [xpUpdate, setXpUpdate] = useState<XPUpdateEvent | null>(null);
  const [levelUp, setLevelUp] = useState<LevelUpEvent | null>(null);

  useEffect(() => {
    if (!studentId) return;

    socket = io(window.location.origin);

    socket.on("connect", () => {
      console.log("Connected to real-time server");
      socket?.emit("join", studentId);
    });

    socket.on("xp_update", (data: XPUpdateEvent) => {
      setXpUpdate(data);
    });

    socket.on("level_up", (data: LevelUpEvent) => {
      setLevelUp(data);
    });

    return () => {
      socket?.disconnect();
    };
  }, [studentId]);

  return { xpUpdate, levelUp };
};
