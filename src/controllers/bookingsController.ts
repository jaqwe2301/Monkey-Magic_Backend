import { Request, Response } from "express";
import pool from "../db";
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

// 예매번호 저장
export const saveBooking = async (req: Request, res: Response) => {
  const { bookingNumber } = req.body; // userId 제거

  try {
    const result = await pool.query(
      "INSERT INTO bookings (booking_number) VALUES ($1) RETURNING *",
      [bookingNumber]
    );
    res
      .status(201)
      .json({ message: "Booking saved successfully", booking: result.rows[0] });
  } catch (error) {
    console.error("Error saving booking:", error);
    res.status(500).json({ message: "Failed to save booking" });
  }
};
