import express from "express";
import { vote, getVoteResults } from "../controllers/voteController";

const voteRouter = express.Router();

// 투표 API
voteRouter.post("/vote", vote);

// 결과 조회 API
voteRouter.get("/votes", getVoteResults);

export default voteRouter;
