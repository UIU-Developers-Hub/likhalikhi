import mongoose from "mongoose";

const reactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
  },
  { timestamps: true }
);

// Ensure a unique reaction per user per post
reactionSchema.index({ user: 1, post: 1 }, { unique: true });

const Reaction = mongoose.model("Reaction", reactionSchema);
export default Reaction;
