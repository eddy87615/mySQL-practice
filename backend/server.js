const express = require("express");
const cors = require("cors");
const authRoutes = require("./src/routes/authRoutes");

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.json({ messgae: "API運行中" });
});

app.listen(PORT, () => {
  console.log(`伺服器運行在 http://localhost:${PORT}`);
});
