import { config } from "dotenv";
import { Pool } from "pg";

// .env 파일 로드
config();

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  // host: "localhost",
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: parseInt(process.env.POSTGRES_PORT || "5432", 10),
});

export default pool;
