const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  nickname: {
    type: String,
  },
  postId: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
});
commentSchema.virtual("commentId").get(function () {
  return this._id.toHexString();
});
commentSchema.set("toJSON", { virtuals: true });

commentSchema.set("timestamps", true);
module.exports = mongoose.model("Comments", commentSchema);
