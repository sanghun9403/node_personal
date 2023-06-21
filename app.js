const express = require("express");
const cookieParser = require("cookie-parser");
const commentsRouter = require("./routes/comments");
const postsRouter = require("./routes/posts");
const usersRouter = require("./routes/users");
const authRouter = require("./routes/auth");
const connect = require("./schemas");

const app = express();
const port = 3000;

connect();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/", [commentsRouter, postsRouter, usersRouter, authRouter]);

app.get("/", (req, res) => {
  res.send("sparta node.js blog");
});

app.listen(port, () => {
  console.log(port, "포트로 서버가 열렸어요");
});
