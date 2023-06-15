const express = require("express");
const router = express.Router();

const { checkObjectId } = require("./posts.js");
const Comments = require("../schemas/comment.js");
const Posts = require("../schemas/post.js");
const { ObjectId } = require("mongoose").Types;

// 댓글 생성
router.post("/comments/:postId", checkObjectId, async (req, res) => {
  const { postId } = req.params;
  const { user, password, content } = req.body;

  const savedPost = await Posts.findById({ _id: new ObjectId(postId) });

  if (!content) {
    return res.status(400).json({ message: "댓글 내용을 입력해주세요." });
  } else if (!savedPost) {
    return res.status(404).json({ message: "해당 게시글을 찾을 수 없습니다." });
  }
  const createComments = await Comments.create({
    postId: new ObjectId(postId),
    user,
    password,
    content,
  });
  res.status(201).json({ comments: createComments, message: "댓글 생성완료" });
});

// 댓글 목록 조회
router.get("/comments/:postId", checkObjectId, async (req, res) => {
  const { postId } = req.params;
  const showReview = await Comments.find({ postId: new ObjectId(postId) }).sort({ createdAt: -1 });

  if (!showReview.length) {
    return res.status(404).json({ message: "데이터가 없습니다." });
  }

  const data = showReview.map((comment) => {
    return {
      commentId: comment._id,
      user: comment.user,
      content: comment.content,
      createdAt: comment.createdAt,
    };
  });

  res.json({
    showReview: data,
  });
});

// 댓글 수정
router.put("/comments/:commentId", async (req, res) => {
  const { commentId } = req.params;
  const { password, content } = req.body;

  try {
    new ObjectId(commentId);
  } catch (error) {
    return res.status(400).json({ message: "데이터 형식이 올바르지 않습니다" });
  }

  const modifyReview = await Comments.findById(new ObjectId(commentId));
  if (!modifyReview) {
    return res.status(404).json({ message: "해당 아이디로 작성된 댓글이 없습니다." });
  } else if (modifyReview.password !== password) {
    return res.status(400).json({ message: "잘못된 비밀번호입니다." });
  } else if (!content) {
    return res.status(400).json({ message: "댓글 내용을 입력해주세요." });
  } else {
    await Comments.updateOne({ _id: new ObjectId(commentId) }, { $set: { content: content } });
    res.status(201).json({
      message: "댓글 수정 완료",
      Detail: {
        content: modifyReview.content,
        createdAt: modifyReview.createdAt,
        updatedAt: modifyReview.updatedAt,
      },
    });
  }
});

// 댓글 삭제
router.delete("/comments/:commentId", async (req, res) => {
  const { commentId } = req.params;
  const { password } = req.body;

  try {
    new ObjectId(commentId);
  } catch (error) {
    return res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." });
  }

  const deleteReview = await Comments.findById({ _id: new ObjectId(commentId) });
  if (!deleteReview) {
    return res.status(400).json({ message: "해당 아이디로 작성된 댓글이 없습니다." });
  } else if (deleteReview.password !== password) {
    return res.status(400).json({ message: "잘못된 비밀번호입니다." });
  } else {
    await Comments.deleteOne(new ObjectId(commentId));
    res.status(200).json({ message: "댓글 삭제 완료" });
  }
});

module.exports = router;
