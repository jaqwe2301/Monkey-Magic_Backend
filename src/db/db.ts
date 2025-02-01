import { config } from "dotenv";
import { Pool } from "pg";

// .env 파일 로드
config();

// 환경 변수 유효성 검증
const requiredEnv = [
  "POSTGRES_USER",
  "POSTGRES_HOST",
  "POSTGRES_DB",
  "POSTGRES_PASSWORD",
];

for (const variable of requiredEnv) {
  if (!process.env[variable]) {
    console.error(`환경 변수 ${variable}가 .env 파일에 설정되지 않았습니다.`);
    process.exit(1); // 필수 환경 변수가 누락된 경우 프로세스를 종료
  }
}

// PostgreSQL 연결 풀 생성
const pool = new Pool({
  user: process.env.POSTGRES_USER, // PostgreSQL 사용자
  host: process.env.POSTGRES_HOST, // PostgreSQL 호스트
  database: process.env.POSTGRES_DB, // PostgreSQL 데이터베이스 이름
  password: process.env.POSTGRES_PASSWORD, // PostgreSQL 비밀번호
  port: 5432,
});

// 연결 테스트
(async () => {
  try {
    const client = await pool.connect();
    console.log("PostgreSQL 연결 성공!");
    client.release(); // 연결 반환
  } catch (error: any) {
    console.error("PostgreSQL 연결 실패:", error.message);
    process.exit(1); // 연결 실패 시 프로세스 종료
  }
})();

export default pool;
