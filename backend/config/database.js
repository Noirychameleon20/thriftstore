const mysql = require('mysql2');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

// Convert pool to use promises
const promisePool = pool.promise();

// Test the connection
promisePool.getConnection()
  .then(connection => {
    console.log('MySQL Connected');
    connection.release();
  })
  .catch(err => {
    console.error('Error connecting to MySQL:', err.message);
  });

module.exports = promisePool; 