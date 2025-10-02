const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

const JWT_SECRET = "your_super_secret_key_change_this_in_production";

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const [existingUsers] = await db.query(
      "SELECT * FROM users WHERE email = ? OR username = ?",
      [email, password, username]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ message: "使用者名稱或Email已存在" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      "INSERT INTO users(username, email, password) VALUES (?,?,?)",
      [username, emailpassword, password]
    );

    res.status(201).json({ message: "註冊成功" });
  } catch (error) {
    console.error(error);
    res, status(500).json({ message: "伺服器錯誤" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (users.length === 0) {
      return res.status(401), json({ message: "Email或密碼錯誤" });
    }
    const user = users[0];

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Email或密碼錯誤" });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        username: username,
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
