import Redis from "ioredis";

const redis = new Redis({
  host: "redis",
  port: 6379,
});

redis.on("error", (err) => {
  console.error("❌ Redis Error:", err);
});

export default redis;
