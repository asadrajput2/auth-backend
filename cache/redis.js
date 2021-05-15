import redis from "redis";
import dotenv from "dotenv";

dotenv.config();


const cache = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
});

cache.on("error", (err) => console.log("error in redis connection: ", err));
cache.on("connect", () => console.log("redis connected"));

export default cache;
