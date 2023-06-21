const express = require("express");
const Comments = require("../schemas/comment.js");
const Posts = require("../schemas/post.js");
const authMiddleware = require("../middlewares/auth-middleware");
const checkMiddelware = require("../middlewares/check-middleware.js");
const router = express.Router();

// 댓글 생성
router.post("/posts/:postId/comments", authMiddleware, checkMiddelware, async (req, res) => {
  const { postId } = req.params;
  const { comment } = req.body;
  const { userId } = res.locals.user;
  const nickname = res.locals.userNickname;

  const savedPost = await Posts.findById(postId);

  try {
    if (!comment) {
      return res.status(400).json({ message: "댓글 내용을 입력해주세요." });
    } else if (!savedPost) {
      return res.status(404).json({ message: "해당 게시글을 찾을 수 없습니다." });
    }

    const createComments = await Comments.create({
      postId: postId,
      userId,
      nickname,
      comment,
    });
    res.status(201).json({ comments: createComments, message: "댓글 생성완료" });
  } catch (err) {
    res.status(400).json({
      message: "댓글 작성에 실패하였습니다.",
    });
  }
});

// 댓글 목록 조회
router.get("/posts/:postId/comments", checkMiddelware, async (req, res) => {
  const { postId } = req.params;

  const showReview = await Comments.find({ postId }).sort({ createdAt: -1 });

  try {
    if (!showReview.length) {
      return res.status(404).json({ message: "작성된 댓글이 없습니다." });
    }

    const data = showReview.map((comment) => {
      return {
        commentId: comment.commentId,
        userId: comment.userId,
        nickname: comment.nickname,
        comment: comment.comment,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
      };
    });

    res.json({
      showReview: data,
    });
  } catch (err) {
    res.status(400).json({
      message: "댓글 조회에 실패하였습니다.",
    });
  }
});

// 댓글 수정
router.put(
  "/posts/:postId/comments/:commentId",
  authMiddleware,
  checkMiddelware,
  async (req, res) => {
    const { commentId } = req.params;
    const { userId } = res.locals.user;
    const { comment } = req.body;
    const modifyReview = await Comments.findById(commentId);

    try {
      if (!modifyReview) {
        return res.status(404).json({ message: "해당 아이디로 작성된 댓글이 없습니다." });
      } else if (modifyReview.userId != userId) {
        return res.status(400).json({ message: "수정권한이 없습니다." });
      } else if (!comment) {
        return res.status(400).json({ message: "댓글 내용을 입력해주세요." });
      } else {
        await Comments.updateOne({ _id: commentId }, { $set: { comment: comment } });
        res.status(201).json({
          message: "댓글 수정 완료",
          Detail: {
            createdAt: modifyReview.createdAt,
            updatedAt: modifyReview.updatedAt,
          },
        });
      }
    } catch (err) {
      res.status(400).json({
        message: "댓글 수정에 실패하였습니다.",
      });
    }
  }
);

// 댓글 삭제
router.delete(
  "/posts/:postId/comments/:commentId",
  authMiddleware,
  checkMiddelware,
  async (req, res) => {
    const { commentId } = req.params;
    const { userId } = res.locals.user;

    try {
      const deleteReview = await Comments.findById(commentId);
      if (!deleteReview) {
        return res.status(400).json({ message: "해당 아이디로 작성된 댓글이 없습니다." });
      } else if (deleteReview.userId != userId) {
        return res.status(400).json({ message: "삭제권한이 없습니다." });
      } else {
        await Comments.deleteOne({ _id: commentId });
        res.status(200).json({ message: "댓글 삭제 완료" });
      }
    } catch (err) {
      res.status(400).json({
        message: "댓글 삭제에 실패하였습니다.",
      });
    }
  }
);

module.exports = router;
