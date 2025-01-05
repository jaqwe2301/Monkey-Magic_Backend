export const validBookingNumbers = new Set(["ABC123", "DEF456", "GHI789"]); // 유효한 예매번호
export const usedBookingNumbers = new Set<string>(); // 이미 사용된 예매번호
export const activeTokens = new Map<string, string>(); // 토큰과 예매번호 매핑
