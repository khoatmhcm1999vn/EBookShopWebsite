import redis from "redis";
import colors from "colors";

const redis_client = redis.createClient(
  process.env.REDIS_PORT,
  process.env.REDIS_HOST
);
redis_client.on("connect", function () {
  console.log(`Redis client connected`.green.bold);
});
export default redis_client;
