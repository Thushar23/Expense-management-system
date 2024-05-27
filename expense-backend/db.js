//db.js
const mysql = require('mysql2/promise');

// MySQL connection
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root', // Your MySQL username
  password: '9740768231', // Your MySQL password
  database: 'expense_management', // Your database name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test MySQL connection
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Connected to MySQL database!');
    connection.release();
  } catch (err) {
    console.error('Error connecting to MySQL database:', err);
    throw err; // Terminate the application if unable to connect to the database
  }
})();

module.exports = pool;
