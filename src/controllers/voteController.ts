import { Request, Response } from "express";
import {
  checkDuplicateVote,
  updateVotes,
  logVote,
  getVotes,
} from "../models/voteModel";
import { sendOtp, verifyOtp } from "../services/otpService";

const verifiedUsers = new Map<string, number>(); // 인증된 사용자 및 만료 시간 저장

// 🔹 인증번호 요청 API
export const requestOtp = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    res.status(400).json({ message: "전화번호를 입력해주세요." });
    return;
  }

  if (phoneNumber.length !== 11) {
    res
      .status(400)
      .json({ message: "11자리 전화번호만 인증 요청을 할 수 있습니다." });
    return;
  }

  try {
    const hasVoted = await checkDuplicateVote(phoneNumber);
    if (hasVoted) {
      res.status(400).json({ message: "이미 투표한 전화번호입니다." });
      return;
    }

    await sendOtp(phoneNumber);
    res.status(200).json({ message: "인증번호가 전송되었습니다." });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: "OTP 전송 실패" });
  }
};

// 🔹 인증번호 확인 API
export const verifyUserOtp = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { phoneNumber, otp } = req.body;

  if (!phoneNumber || !otp) {
    res.status(400).json({ message: "전화번호와 인증번호를 입력해주세요." });
    return;
  }

  if (!verifyOtp(phoneNumber, otp)) {
    res
      .status(400)
      .json({ message: "인증번호가 잘못되었거나 만료되었습니다." });
    return;
  }

  // 인증된 사용자를 3분 동안 저장
  verifiedUsers.set(phoneNumber, Date.now() + 3 * 60 * 1000);

  res.status(200).json({ message: "인증 성공! 3분 내에 투표해주세요." });
};

// 🔹 투표 API (3분 제한 추가)
export const vote = async (req: Request, res: Response): Promise<void> => {
  const { phoneNumber, team1, team2 } = req.body;

  if (!phoneNumber || !team1 || !team2) {
    res.status(400).json({ message: "모든 필드를 입력해주세요." });
    return;
  }

  if (team1 === team2) {
    res.status(400).json({ message: "다른 두 팀을 선택해주세요." });
    return;
  }

  // 인증 여부 확인 및 만료 체크
  const expiresAt = verifiedUsers.get(phoneNumber);
  if (!expiresAt || Date.now() > expiresAt) {
    verifiedUsers.delete(phoneNumber);
    res
      .status(400)
      .json({ message: "인증이 만료되었습니다. 다시 인증해주세요." });
    return;
  }

  try {
    const hasVoted = await checkDuplicateVote(phoneNumber);
    if (hasVoted) {
      res.status(400).json({ message: "이미 투표한 전화번호입니다." });
      return;
    }

    await updateVotes(team1, team2);
    await logVote(phoneNumber, team1, team2);

    // 투표 후 인증 만료
    verifiedUsers.delete(phoneNumber);

    res.status(200).json({ message: "투표가 완료되었습니다." });
  } catch (error) {
    console.error("Error in vote:", error);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
};

// 중복 투표 여부 확인 API
export const checkVoteStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { phoneNumber } = req.query;

  if (!phoneNumber) {
    res.status(400).json({ message: "전화번호를 입력해주세요." });
    return;
  }

  try {
    const hasVoted = await checkDuplicateVote(phoneNumber as string);
    res.status(200).json({ hasVoted });
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
