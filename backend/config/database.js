const mysql = require('mysql2');

// Clever Cloud provides these environment variables
const dbConfig = {
  host: process.env.MYSQL_ADDON_HOST,
  user: process.env.MYSQL_ADDON_USER,
  password: process.env.MYSQL_ADDON_PASSWORD,
  database: process.env.MYSQL_ADDON_DB,
  port: process.env.MYSQL_ADDON_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const pool = mysql.createPool(dbConfig);
const promisePool = pool.promise();

// Test connection
pool.getConnection((err, connection) => {
  if (err) {
    console.log('Database connection pending...');
  } else {
    console.log('✅ Connected to Clever Cloud MySQL');
    
    // Create table
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
        console.error('Error creating table:', err.message);
      } else {
        console.log('✅ Attendance table ready');
      }
      connection.release();
    });
  }
});

module.exports = promisePool;