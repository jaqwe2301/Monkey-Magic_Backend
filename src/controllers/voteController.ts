import { Request, Response } from "express";
import { VoteOption, Votes, VoteRequestBody } from "../types/vote";
import { activeTokens, usedBookingNumbers, votes } from "../models/vote";
import { io } from "../services/socketService";

// 투표 API 처리
export const vote = (req: Request, res: Response) => {
  const { token, option } = req.body as VoteRequestBody;

  // 토큰 유효성 검사
  if (!activeTokens.has(token)) {
    res.status(400).json({ message: "유효하지 않은 토큰입니다." });
  }

  // 선택한 옵션이 유효한지 확인
  if (!Object.keys(votes).includes(option)) {
    res.status(400).json({ message: "유효하지 않은 투표 옵션입니다." });
  }

  const bookingNumber = activeTokens.get(token)!;

  // 투표 처리
  votes[option as VoteOption] += 1; // 투표 수 증가
  usedBookingNumbers.add(bookingNumber); // 예매번호 사용 완료
  activeTokens.delete(token); // 토큰 제거

  // 모든 클라이언트에 업데이트 전송
  io.emit("update", votes);

  res.status(200).json({ message: "투표가 완료되었습니다." });
};
