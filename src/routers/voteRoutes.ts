import express from "express";
import {
  vote,
  getVoteResults,
  checkVoteStatus,
  requestOtp,
  verifyUserOtp,
} from "../controllers/voteController";

const voteRouter = express.Router();

// 🔹 인증번호 요청 API
voteRouter.post("/request-otp", requestOtp);

// 🔹 인증번호 확인 API
voteRouter.post("/verify-otp", verifyUserOtp);

// 🔹 투표 API
voteRouter.post("/vote", vote);

// 🔹 결과 조회 API
voteRouter.get("/votes", getVoteResults);

// 🔹 중복 투표 여부 확인 API
voteRouter.get("/vote/check", checkVoteStatus);

export default voteRouter;
