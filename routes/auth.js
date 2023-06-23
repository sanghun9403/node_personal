const jwt = require("jsonwebtoken");
const express = require("express");
const User = require("../schemas/user");
const router = express.Router();

// 로그인 API
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  try {
    if (!user || password !== user.password) {
      res.status(412).json({
        errorMessage: "이메일 또는 패스워드가 틀렸습니다.",
      });
      return;
    }

    const token = jwt.sign({ userId: user.userId }, "customized-secret-key", { expiresIn: "30m" });

    res.cookie("authorization", `Bearer ${token}`);
    res.status(200).json({
      token,
      message: "로그인에 성공하였습니다.",
    });
  } catch (err) {
    res.status(400).json({
      message: "로그인에 실패하였습니다.",
    });
  }
});

module.exports = router;
