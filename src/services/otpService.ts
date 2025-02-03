import { SolapiMessageService } from "solapi";
import redis from "../db/redisClient.ts";

// Solapi 설정
const messageService = new SolapiMessageService(
  process.env.SOLAPI_KEY || "",
  process.env.SOLAPI_SECRET_KEY || ""
);

// 인증번호 생성 함수
export const generateOtp = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6자리 랜덤 숫자
};

// 인증번호 요청 함수 (Redis 적용)
export const sendOtp = async (phoneNumber: string): Promise<void> => {
  const otp = generateOtp();
  const expiresAt = 3 * 60; // 3분 (초 단위)

  // Redis에 OTP 저장
  await redis.set(`otp:${phoneNumber}`, otp, "EX", expiresAt);

  await messageService.send({
    to: phoneNumber,
    from: "01043737767",
    text: `[Monkey Magic] 인증번호 [${otp}]를 입력해주세요.`,
  });

  console.log(`OTP sent to ${phoneNumber}: ${otp}`);
};

// 인증번호 검증 함수 (Redis 적용)
export const verifyOtp = async (
  phoneNumber: string,
  otp: string
): Promise<boolean> => {
  const storedOtp = await redis.get(`otp:${phoneNumber}`);

  if (!storedOtp) return false;
  if (storedOtp !== otp) return false;

  // 인증 성공 후 OTP 삭제
  await redis.del(`otp:${phoneNumber}`);
  return true;
};
