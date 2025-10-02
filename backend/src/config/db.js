const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  user: "appuser",
  password: "apppassword",
  database: "login_app",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool.promise();
