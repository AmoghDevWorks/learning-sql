const mysql = require('mysql2')
const dotenv = require('dotenv')

dotenv.config()

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: process.env.SQL_PASSWORD,
  database: process.env.SQL_DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;