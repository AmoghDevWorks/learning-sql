const { Redis } = require('ioredis')
const dotenv = require('dotenv')

dotenv.config()

const client = new Redis({
  host: process.env.REDIS_ENDPOINT,
  port: process.env.REDIS_PORT,
  username: process.env.REDIS_USERNAME,   
  password: process.env.REDIS_PASSWORD,
});

client.on('connect', () => {
  console.log('Connected to Redis successfully!');
});

client.on('error', (err) => {
  console.error('Redis connection error:', err);
});

module.exports = client