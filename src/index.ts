import express, { Application } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import bookingsRoutes from "./routers/bookingsRoutes";

import { votes } from "./models/vote";

const app: Application = express();
const PORT = Number(process.env.PORT) || 8001;

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000", // 클라이언트 주소
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000", // 요청을 허용할 도메인
    methods: ["GET", "POST", "PUT", "DELETE"], // 허용할 HTTP 메서드
    credentials: true, // 쿠키와 같은 인증 정보를 허용하려면 true
  })
);

app.get('/', (req, res) => {
  res.status(200).send('OK');
});

// Routes
app.use("/api/bookings", bookingsRoutes);

// 소켓 연결 이벤트
io.on("connection", (socket) => {
  console.log("사용자가 연결되었습니다:", socket.id);

  // 클라이언트로 현재 투표 상태 전송
  socket.emit("update", votes);

  socket.on("disconnect", () => {
    console.log("사용자가 연결 해제되었습니다:", socket.id);
  });
});

// Start server
httpServer.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
