import { SolapiMessageService } from "solapi";

// Solapi 설정
const messageService = new SolapiMessageService(
  process.env.SOLAPI_KEY || "",
  process.env.SOLAPI_SECRET_KEY || ""
);

const otpStorage = new Map<string, { otp: string; expiresAt: number }>();

// 인증번호 생성 함수
export const generateOtp = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6자리 랜덤 숫자
};

// 인증번호 요청 함수
export const sendOtp = async (phoneNumber: string): Promise<void> => {
  const otp = generateOtp();
  const expiresAt = Date.now() + 3 * 60 * 1000; // 3분 후 만료

  // OTP 저장 (메모리 기반)
  otpStorage.set(phoneNumber, { otp, expiresAt });

  await messageService.send({
    to: phoneNumber,
    from: "01043737767",
    text: `[Monkey Magic] 인증번호 [${otp}]를 입력해주세요.`,
  });

  console.log(`OTP sent to ${phoneNumber}: ${otp}`);
};

// 인증번호 검증 함수
export const verifyOtp = (phoneNumber: string, otp: string): boolean => {
  const storedOtp = otpStorage.get(phoneNumber);

  if (!storedOtp) return false;
  if (Date.now() > storedOtp.expiresAt) {
    otpStorage.delete(phoneNumber); // 만료된 OTP 제거
    return false;
  }
  if (storedOtp.otp !== otp) return false;

  // 인증 성공 시 OTP 삭제
  otpStorage.delete(phoneNumber);
  return true;
};
