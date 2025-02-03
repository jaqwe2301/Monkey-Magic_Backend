import express from "express";
import cors from "cors";

import voteRouter from "./routers/voteRoutes";

const app = express();
const PORT = Number(process.env.PORT) || 8002;

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://monkeymagic.kr",
    ], // 허용할 도메인
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // 허용할 HTTP 메서드
    allowedHeaders: ["Content-Type", "Authorization"], // 허용할 헤더
    credentials: true, // 인증 정보를 포함하는 요청 허용
  })
);

app.options("*", cors());

// JSON 본문 파싱 미들웨어
app.use(express.json()); // 요청의 JSON 본문을 파싱하여 req.body에 저장

// Routes
app.use("/api", voteRouter);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
