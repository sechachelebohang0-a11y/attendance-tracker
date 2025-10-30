const mysql = require('mysql2');

// For Railway MySQL - it provides these environment variables automatically
// For local development without MySQL, we'll handle the error gracefully
const dbConfig = {
  host: process.env.MYSQLHOST || 'localhost',
  user: process.env.MYSQLUSER || 'root',
  password: process.env.MYSQLPASSWORD || '',
  database: process.env.MYSQLDATABASE || 'attendance_tracker',
  port: process.env.MYSQLPORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true
};

console.log('Database Config:', {
  host: dbConfig.host,
  user: dbConfig.user,
  database: dbConfig.database,
  port: dbConfig.port,
  hasPassword: !!dbConfig.password
});

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Create a promise wrapper
const promisePool = pool.promise();

// Test connection - but don't crash if it fails
pool.getConnection((err, connection) => {
  if (err) {
    console.log('⚠️  MySQL Connection Note:', err.message);
    console.log('💡 This is normal if:');
    console.log('   - MySQL is not installed locally');
    console.log('   - Using different MySQL credentials');
    console.log('   - Deploying to Railway (they provide MySQL automatically)');
    console.log('🚀 The app will still start and work on Railway with their MySQL');
  } else {
    console.log('✅ Connected to MySQL database');
    
    // Create table if it doesn't exist
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS Attendance (
        id INT AUTO_INCREMENT PRIMARY KEY,
        employeeName VARCHAR(255) NOT NULL,
        employeeID VARCHAR(100) NOT NULL,
        date DATE NOT NULL,
        status ENUM('Present', 'Absent') NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    connection.query(createTableQuery, (err) => {
      if (err) {
        console.error('❌ Error creating table:', err.message);
      } else {
        console.log('✅ Attendance table ready');
      }
      connection.release();
    });
  }
});

module.exports = promisePool;