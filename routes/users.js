const express = require("express");
const router = express.Router();
const User = require("../schemas/user");

// 회원가입
router.post("/signup", async (req, res) => {
  const { email, nickname, password, confirmPassword } = req.body;
  let regExp = /[ \{\}\[\]\/?.,;:|\)*~`!^\-_+┼<>@\#$%&\'\"\\\(\=]/;

  try {
    if (nickname.length <= 3 || regExp.test(nickname)) {
      res.status(412).json({
        message: "닉네임은 최소 3자 이상이여야 하며, 특수문자 및 공백을 사용할 수 없습니다.",
      });
      return;
    } else if (password.length <= 4 || password === nickname) {
      res.status(412).json({
        message: "비밀번호는 최소 4자 이상이여야 하며, 닉네임과 같은 값이 포함될 수 없습니다.",
      });
      return;
    }

    if (password !== confirmPassword) {
      res.status(412).json({
        message: "입력한 비밀번호와 비밀번호 확인값이 일치하지 않습니다.",
      });
      return;
    }

    const savedUsers = await User.findOne({
      $or: [{ email }, { nickname }],
    });
    if (savedUsers) {
      res.status(412).json({
        message: "이메일 또는 닉네임이 이미 사용중입니다.",
      });
      return;
    }

    const user = new User({ email, nickname, password });
    await user.save();

    return res.status(201).json({
      message: "회원가입이 완료되었습니다.",
    });
  } catch (err) {
    res.status(400).json({
      message: "요청한 데이터 형식이 올바르지 않습니다.",
    });
  }
});

// 400 예외 케이스에서 처리하지못한 에러 추가 필요
module.exports = router;
