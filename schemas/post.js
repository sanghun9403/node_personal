const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
  },
});
// postSchema.virtual("postId").get(function () {
//   return this._id.toHexString();
// });
// postSchema.set("toJSON", { virtuals: true });
postSchema.set("timestamps", true);

module.exports = mongoose.model("Posts", postSchema);
