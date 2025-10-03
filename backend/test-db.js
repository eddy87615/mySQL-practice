const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function testConnection() {
  try {
    const client = await pool.connect();
    console.log("✅ 資料庫連線成功！");
    const result = await client.query("SELECT NOW()");
    console.log("伺服器時間:", result.rows[0]);
    client.release();
    process.exit(0);
  } catch (error) {
    console.error("❌ 資料庫連線失敗:");
    console.error("錯誤訊息:", error.message);
    console.error("完整錯誤:", error);
    process.exit(1);
  }
}

testConnection();
