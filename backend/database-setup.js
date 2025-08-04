const mysql = require('mysql2/promise');
require('dotenv').config();
const fs = require('fs').promises;
const path = require('path');

async function setupDatabase() {
  console.log('🚀 Starting database setup...\n');

  const connectionConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'your_password',
    multipleStatements: true,
  };

  let connection;

  try {
    console.log('📡 Connecting to MySQL server...');
    connection = await mysql.createConnection(connectionConfig);
    console.log('✅ Connected to MySQL server successfully!\n');

    const dbName = process.env.DB_NAME || 'thrift_store';
    console.log(`🗄️  Creating database '${dbName}'...`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    console.log(`✅ Database '${dbName}' created successfully!\n`);

    await connection.query(`USE \`${dbName}\``);
    console.log(`🔄 Switched to database '${dbName}'\n`);

    console.log('📋 Reading schema.sql file...');
    const schemaPath = path.join(__dirname, 'database', 'schema.sql');
    const schemaSQL = await fs.readFile(schemaPath, 'utf8');

    // Split the SQL file by semicolons and filter out empty statements
    const statements = schemaSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length);

    console.log('🏗️ Executing schema statements one by one...');
    for (const statement of statements) {
      try {
        await connection.query(statement);
        console.log('Executed:', statement.slice(0, 60).replace(/\n/g, ' ') + '...');
      } catch (e) {
        console.error('Error executing statement:', statement);
        console.error(e.message);
        throw e;
      }
    }

    console.log('✅ All tables created successfully!\n');

  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Database connection closed.');
    }
  }
}

setupDatabase();
