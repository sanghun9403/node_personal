const { ObjectId } = require("mongoose").Types;

module.exports = async (req, res, next) => {
  const { postId } = await req.params;

  try {
    if (!ObjectId.isValid(postId)) {
      throw Error("param 데이터 형식이 올바르지 않습니다.");
    }
    next();
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
