const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

const JWT_SECRET =
  process.env.JWT_SECRET || "your_super_secret_key_change_this_in_production";

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUsers = await pool.query(
      "SELECT * FROM users WHERE email = $2 OR username = $1",
      [email, username]
    );

    if (existingUsers.rows.length > 0) {
      return res.status(400).json({ message: "使用者名稱或Email已存在" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3)",
      [username, email, hashedPassword]
    );

    res.status(201).json({ message: "註冊成功" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "伺服器錯誤" });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const users = await pool.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);

    if (users.rows.length === 0) {
      return res.status(401).json({ message: "用戶名或密碼錯誤" });
    }
    const user = users.rows[0];

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "用戶名或密碼錯誤" });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username,
      },
      JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );

    res.json({
      message: "登入成功",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "伺服器錯誤" });
  }
};
