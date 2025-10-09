import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const initClientSocket = (userId: string) => {
  if (!socket) {
    socket = io("http://localhost:4000", {
      transports: ["websocket"], // ensures clean WS connection
    });

    socket.on("connect", () => {
      console.log("✅ Client connected:", socket.id);
      socket?.emit("register", userId);
    });
  }

  return socket;
};

export const getClientSocket = () => {
  if (!socket) throw new Error("Socket not initialized!");
  return socket;
};
