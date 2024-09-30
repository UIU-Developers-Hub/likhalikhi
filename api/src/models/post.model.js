import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    image: { type: String }, // URL for the post image
    tags: [{ type: String }], // Tags for categorization
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    reactions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Reaction" }],
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);
export default Post;
