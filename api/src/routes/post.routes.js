import express from "express";
import {
  addCommentToPost,
  addOrRemoveReactionToPost,
  createPost,
  deleteComment,
  deletePost,
  getCommentsForPost,
  getPopularPosts,
  getPostById,
  getPosts,
  getReactionsForPost,
  getRelatedPosts,
  getUserPosts,
  updateComment,
  updatePost,
} from "../controllers/post.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

// Define routes
router.post("/", verifyJWT, upload.single("image"), createPost);
router.get("/", getPosts);
router.get("/user/:userId", getUserPosts);
router.get("/:id", getPostById);
router.put("/:id", verifyJWT, upload.single("image"), updatePost);
router.delete("/:id", deletePost);

//New ROuter
router.get("/popular/:currentPostId", getPopularPosts);
router.post("/related", getRelatedPosts);

// Comments;
router.get("/:id/comments", getCommentsForPost);
router.post("/:id/comments", verifyJWT, addCommentToPost);
// Update comment
router.put("/:id/comments/:commentId", verifyJWT, updateComment);
// http://localhost:5000/api/v1/posts/66c2093d6e6535cde51a1d7e/comments/66c371289ae0755d6740ca2b

// Delete comment
router.delete("/:id/comments/:commentId", verifyJWT, deleteComment);

// Reactions
router.get("/:id/reactions", getReactionsForPost);
router.post("/:id/reactions", verifyJWT, addOrRemoveReactionToPost);

// Best Blogs
router.get("/best-blogs", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

export default router;
