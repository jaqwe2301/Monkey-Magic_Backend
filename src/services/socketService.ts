import { Server } from "socket.io";
import { Server as HTTPServer } from "http";

export let io: Server; // Socket.IO 인스턴스

/**
 * WebSocket 서버 초기화
 * @param server HTTP 서버
 */
export const initializeSocket = (server: HTTPServer) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:3000", // 클라이언트 주소
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("사용자가 연결되었습니다:", socket.id);

    // 클라이언트에게 메시지 전송
    socket.emit("message", "Socket.IO 서버에 연결되었습니다!");

    // 클라이언트에서 이벤트 수신
    socket.on("vote", (data) => {
      console.log("투표 데이터:", data);
      io.emit("update", data); // 모든 클라이언트에 업데이트 전송
    });

    socket.on("disconnect", () => {
      console.log("사용자가 연결 해제되었습니다:", socket.id);
    });
  });

  console.log("WebSocket 서버가 초기화되었습니다.");
};
