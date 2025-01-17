import { Request, Response } from "express";
import { updateVotes, logVote, getVotes } from "../models/voteModel";

// 투표 API
export const vote = async (req: Request, res: Response): Promise<void> => {
  const { userId, team1, team2 } = req.body;

  if (!userId || !team1 || !team2) {
    res.status(400).json({ message: "모든 필드를 입력해주세요." });
    return;
  }

  if (team1 === team2) {
    res.status(400).json({ message: "다른 두 팀을 선택해주세요." });
    return;
  }

  try {
    await updateVotes(team1, team2);
    await logVote(userId, team1, team2);
    res.status(200).json({ message: "투표가 완료되었습니다." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
};

// 결과 조회 API
export const getVoteResults = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const votes = await getVotes();
    res.status(200).json({ votes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
};
