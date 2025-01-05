import { Votes } from "../types/vote";

// 현재 활성화된 토큰과 예매번호 관리
export const activeTokens: Map<string, string> = new Map();
export const usedBookingNumbers: Set<string> = new Set();

// 초기 투표 상태
export const votes: Votes = {
  최수웅: 0,
  웬즈데이: 0,
  이세현밴드: 0,
  오프더로드: 0,
  전체이용가: 0,
};
