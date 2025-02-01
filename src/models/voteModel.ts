import pool from "../db/db";

// 투표를 업데이트
export const updateVotes = async (
  team1: string,
  team2: string
): Promise<void> => {
  console.log("team1:", team1); // 디버깅용
  console.log("team2:", team2); // 디버깅용

  if (!team1 || !team2) {
    throw new Error("Both team1 and team2 must be valid strings");
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(
      "UPDATE votes SET vote_count = vote_count + 1 WHERE team_name = $1::text",
      [team1]
    );
    await client.query(
      "UPDATE votes SET vote_count = vote_count + 1 WHERE team_name = $1::text",
      [team2]
    );
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

// 투표 기록 추가
export const logVote = async (
  phoneNumber: string,
  team1: string,
  team2: string
): Promise<void> => {
  console.log("logVote params:", { phoneNumber, team1, team2 }); // 디버깅용
  const query =
    "INSERT INTO vote_log (phone_number, team1, team2) VALUES ($1, $2, $3)";
  await pool.query(query, [phoneNumber, team1, team2]);
};

// 투표 결과 조회
export const getVotes = async (): Promise<{ [key: string]: number }> => {
  const result = await pool.query("SELECT team_name, vote_count FROM votes");
  return result.rows.reduce(
    (
      acc: { [key: string]: number },
      row: { team_name: string; vote_count: number }
    ) => {
      acc[row.team_name] = row.vote_count;
      return acc;
    },
    {}
  );
};

// 중복 투표 여부 확인
export const checkDuplicateVote = async (
  phoneNumber: string
): Promise<boolean> => {
  const query = "SELECT COUNT(*) FROM vote_log WHERE phone_number = $1";
  const result = await pool.query(query, [phoneNumber]);
  return parseInt(result.rows[0].count, 10) > 0;
};
