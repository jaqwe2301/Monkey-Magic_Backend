import { Request, Response } from "express";
import {
  validBookingNumbers,
  usedBookingNumbers,
  activeTokens,
} from "../models/bookings";
import crypto from "crypto";

export const verifyBookingNumbers = (req: Request, res: Response) => {
  const { bookingNumber } = req.body;
  // 예매번호 유효성 검사
  if (!validBookingNumbers.has(bookingNumber)) {
    res.status(400).json({ message: "유효하지 않은 예매번호입니다." });
  }

  // 이미 사용된 예매번호인지 확인
  if (usedBookingNumbers.has(bookingNumber)) {
    res.status(400).json({ message: "이미 사용된 예매번호입니다." });
  }

  // 토큰 생성
  const token = crypto.randomBytes(16).toString("hex");
  activeTokens.set(token, bookingNumber);

  res.status(200).json({ token });
};
