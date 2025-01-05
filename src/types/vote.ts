export type VoteOption =
  | "최수웅"
  | "웬즈데이"
  | "이세현밴드"
  | "오프더로드"
  | "전체이용가";
export type Votes = Record<VoteOption, number>; // 투표 옵션에 대한 카운트 맵

export interface VoteRequestBody {
  token: string;
  option: VoteOption;
}
