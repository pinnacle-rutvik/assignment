const mysql = require('mysql2');

// MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root', 
  password: 'Raut@0958', 
  database: 'url_scraper'
});

// Handle connection errors
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('***********Connected to MySQL DB as id**********' + connection.threadId);
});

module.exports = connection;

