const mysql = require('mysql2/promise');
require('dotenv').config();

async function testConnection() {
  try {
    console.log('Using config:', {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD ? '*****' : 'EMPTY',
      database: process.env.DB_NAME,
      multipleStatements: true,
    });

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      multipleStatements: true,
    });

    console.log('Connection successful!');

    await connection.end();
  } catch (error) {
    console.error('Connection error:', error);
  }
}

testConnection();
