const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  postId: {
    type: String,
    required: true,
  },
  user: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  content: {
    type: String,
  },
});
commentSchema.set("timestamps", true);
module.exports = mongoose.model("Comments", commentSchema);
