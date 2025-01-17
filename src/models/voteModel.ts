import pool from "../db/db";

// 투표를 업데이트
export const updateVotes = async (
  team1: string,
  team2: string
): Promise<void> => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(
      "UPDATE votes SET vote_count = vote_count + 1 WHERE team_name = $1",
      [team1]
    );
    await client.query(
      "UPDATE votes SET vote_count = vote_count + 1 WHERE team_name = $2",
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
  userId: string,
  team1: string,
  team2: string
): Promise<void> => {
  const query =
    "INSERT INTO vote_log (user_id, team1, team2) VALUES ($1, $2, $3)";
  await pool.query(query, [userId, team1, team2]);
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
