const express = require("express");
const router = express.Router();

const Posts = require("../schemas/post.js");
const Comments = require("../schemas/comment.js");
const { ObjectId } = require("mongoose").Types;

const checkObjectId = (req, res, next) => {
  const { postId } = req.params;
  try {
    if (!ObjectId.isValid(postId)) {
      throw Error("데이터 형식이 올바르지 않습니다.");
    }
    next();
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// 게시글 생성
router.post("/posts", async (req, res) => {
  const { user, password, title, content } = req.body;

  if (!user || !password || !title) {
    return res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." });
  }

  const createPosts = await Posts.create({ user, password, title, content });

  res.status(201).json({ posts: createPosts, message: "게시글 생성완료" });
});

// 게시글 전체조회
router.get("/posts", async (req, res) => {
  const showPost = await Posts.find({}).sort({ createdAt: -1 });

  if (!showPost.length) {
    return res.status(404).json({ message: "게시글이 없습니다." });
  }

  const data = showPost.map((post) => {
    return {
      postId: post._id,
      user: post.user,
      title: post.title,
      createdAt: post.createdAt,
    };
  });

  res.json({
    showPost: data,
  });
});

// 게시글 상세 조회
router.get("/posts/:postId", checkObjectId, async (req, res) => {
  const { postId } = req.params;

  const result = await Posts.findById({ _id: new ObjectId(postId) });

  if (!result) {
    return res.status(404).json({ message: "해당 ID로 작성된 게시글이 없습니다." });
  }

  res.status(200).json({
    Detail: {
      postId: result._id,
      user: result.user,
      title: result.title,
      content: result.content,
      createdAt: result.createdAt,
    },
  });
});

//게시글 수정
router.put("/posts/:postId", checkObjectId, async (req, res) => {
  const { postId } = req.params;
  const { user, password, title, content, createdAt, updatedAt } = req.body;

  const modifyPost = await Posts.findById(new ObjectId(postId));
  if (!modifyPost) {
    return res.status(404).json({ message: "해당 ID로 작성된 게시글이 없습니다." });
  } else if (!user || !title || !content) {
    return res.status(400).json({ message: "데이터를 입력해주세요." });
  } else if (modifyPost.password !== password) {
    return res.status(400).json({ message: "잘못된 비밀번호입니다." });
  } else {
    await Posts.updateOne(
      { _id: new ObjectId(postId) },
      { $set: { user: user, title: title, content: content } }
    );
    res.status(201).json({
      message: "게시글 수정 완료",
      Detail: {
        postId: modifyPost._id,
        user: modifyPost.user,
        title: modifyPost.title,
        content: modifyPost.content,
        createdAt: modifyPost.createdAt,
        updatedAt: modifyPost.updatedAt,
      },
    });
  }
});

// 게시글 삭제
router.delete("/posts/:postId", checkObjectId, async (req, res) => {
  const { postId } = req.params;
  const { password } = req.body;

  const deletePost = await Posts.findById({ _id: new ObjectId(postId) });
  if (!deletePost) {
    return res.status(404).json({ message: "해당 ID로 작성된 게시글이 없습니다." });
  } else if (deletePost.password !== password) {
    return res.status(400).json({ message: "잘못된 비밀번호입니다." });
  } else {
    await Posts.deleteOne(new ObjectId(postId));
    await Comments.deleteMany({ postId: new ObjectId(postId) });
    res.status(200).json({ message: "게시글 삭제 완료" });
  }
});

module.exports = { router, checkObjectId };
// module.exports = checkObjectId;
// exports하니까 게시글 조회할때 데이터가 없으면 게시글이 없어야 합니다
// 가 나와야하는데 안나오는 현상 발생, exports를 하지 않으면 정상출력
