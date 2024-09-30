import Post from "../models/post.model.js";

import Comment from "../models/comment.model.js";
import Reaction from "../models/reaction.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// Create a new post
export const createPost = async (req, res, next) => {
  try {
    const { title, content, tags } = req.body;
    const author = req.user._id; // Assuming user info is available in req.user
    // const author = "66c0af684ad4a052f2aaf590";
    console.log("request . is ", req);
    let image;
    if (req.file && req.file.path) {
      image = await uploadOnCloudinary(req.file.path);
      if (!image) {
        throw new ApiError(500, "Failed to upload image");
      }
    } else {
      throw new ApiError(400, "Image is required");
    }

    console.log(image);
    const post = new Post({
      title,
      content,
      image,
      tags,
      author,
    });

    await post.save();
    res.status(201).json({
      success: true,
      data: post,
    });
  } catch (error) {
    next(new ApiError(400, "Failed to create post"));
  }
};

// export const createPost = asyncHandler(async (req, res) => {
//   const { title, content } = req.body;

//   // const author = "66c8e298d5bdf18dacdcd7c8"; // Replace with dynamic author ID
//   const author = req.user._id; // Assuming user info is available in req.user
//   // Parse the tags JSON string back into an array
//   let parsedTags = [];
//   try {
//     parsedTags = JSON.parse(tags);
//   } catch (error) {
//     throw new ApiError(400, "Invalid tags format");
//   }

//   let image;
//   if (req.file && req.file.path) {
//     const uploadResponse = await uploadOnCloudinary(req.file.path);
//     if (!uploadResponse) {
//       throw new ApiError(500, "Failed to upload image");
//     }
//     image = uploadResponse.secure_url; // Save only the secure URL or other required field
//   } else {
//     throw new ApiError(408, "Image is required");
//   }

//   const post = new Post({
//     title: title,
//     content: content,
//     author: author,
//   });

//   if (!post) {
//     throw new ApiError(400, "Failed to create post");
//   }

//   await post.save();
//   res.status(201).json(new ApiResponse(201, post, "Post created successfully"));
// });

// Get all posts
export const getPosts = asyncHandler(async (req, res, next) => {
  try {
    const posts = await Post.find().populate(
      "author",
      "fullname email profilePic"
    ); // Adjust as per your schema
    // .populate("comments")
    // .populate("reactions");
    if (!posts || posts.length === 0) {
      throw new ApiError(404, "No posts found");
    }
    res.json(new ApiResponse(200, posts, "Posts fetched successfully"));
  } catch (error) {
    next(new ApiError(500, "Failed to fetch posts"));
  }
});

// Get a single post by ID
export const getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      "author",
      "fullname email profilePic"
    );
    // .populate("comments")
    // .populate("reactions");

    if (!post) {
      return next(new ApiError(404, "Post not found"));
    }

    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    next(new ApiError(500, "Failed to fetch post"));
  }
};

// Update a post by ID
export const updatePost = async (req, res, next) => {
  try {
    const { title, content, tags } = req.body;

    // Parse the tags JSON string back into an array
    let parsedTags = [];
    if (tags) {
      try {
        parsedTags = JSON.parse(tags);
      } catch (error) {
        throw new ApiError(400, "Invalid tags format");
      }
    }

    let image;
    if (req.file && req.file.path) {
      const uploadResponse = await uploadOnCloudinary(req.file.path);
      if (!uploadResponse) {
        throw new ApiError(500, "Failed to upload image");
      }
      image = uploadResponse.secure_url; // Save only the secure URL or other required field
    }

    const updateData = { title, content, tags: parsedTags };
    if (image) {
      updateData.image = image;
    }

    const post = await Post.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!post) {
      return next(new ApiError(404, "Post not found"));
    }

    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    next(new ApiError(500, "Failed to update post"));
  }
};

// Delete a post by ID
export const deletePost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const post = await Post.findByIdAndDelete(postId);

    if (!post) {
      return next(new ApiError(404, "Post not found"));
    }
    // Delete all comments associated with the post
    await Comment.deleteMany({ post: postId });

    // Delete all reactions associated with the post
    await Reaction.deleteMany({ post: postId });

    res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    next(new ApiError(500, "Failed to delete post"));
  }
};

export const getUserPosts = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  console.log(userId);

  const posts = await Post.find({ author: userId });
  if (!posts) {
    conosle.log("No posts found for this user");
    throw new ApiError(404, "No posts found for this user");
  }
  console.log(posts);
  res
    .status(200)
    .json(new ApiResponse(200, posts, "Posts fetched successfully"));
});

// Get comments for a post
export const getCommentsForPost = async (req, res, next) => {
  try {
    const comments = await Comment.find({ post: req.params.id }).populate(
      "author",
      "fullname"
    );
    res.status(200).json({
      success: true,
      data: comments,
    });
  } catch (error) {
    next(new ApiError(500, "Failed to fetch comments"));
  }
};

// Add a comment to a post
export const addCommentToPost = async (req, res, next) => {
  try {
    const { content } = req.body;

    const comment = new Comment({
      content,
      author: req.user._id, // Assuming user info is available in req.user
      post: req.params.id,
    });

    await comment.save();

    // Update the post document
    await Post.findByIdAndUpdate(req.params.id, {
      $push: { comments: comment._id },
    });

    res.status(201).json({
      success: true,
      data: comment,
    });
  } catch (error) {
    next(new ApiError(500, "Failed to add comment"));
  }
};

//Update comment
export const updateComment = asyncHandler(async (req, res) => {
  console.log("update comment is called");
  const { commentId } = req.params;
  const { content } = req.body;
  // const userId = req.user._id;
  const userId = "66c0af684ad4a052f2aaf590";

  // Find the comment by its ID
  const comment = await Comment.findById(commentId);
  console.log("comment is ", comment);
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  // Check if the current user is the owner of the comment

  if (comment.author.toString() !== userId.toString()) {
    console.log("comment user is ", comment.author);

    throw new ApiError(403, "You are not authorized to update this comment");
  }

  // Update the comment content
  comment.content = content;
  await comment.save();
  console.log("comment is saved");

  res
    .status(200)
    .json(new ApiResponse(200, comment, "Comment updated Successfully"));
});

//Delete comment
// export const deleteComment = asyncHandler(async (req, res) => {
//   const { commentId, id } = req.params;
//   console.log("id is : ", id);
//   console.log("comment id is : ", commentId);
//   // const userId = req.user._id;
//   const userId = "66c0af684ad4a052f2aaf590";

//   //find the comment by its id
//   const comment = await Comment.findById(commentId);
//   console.log("comment is ", comment);
//   if (!comment) {
//     throw new ApiError(404, "Comment not found");
//   }

//   //check if the current user is the owner of the commment

//   if (comment.author.toString() !== userId.toString()) {
//     throw new ApiError(403, "You are not authorized to delete this comment");
//   }

//   // delete the comment
//   await comment.remove();
//   console.log("comment is removed");
//   res.status(200).json({
//     success: true,
//     message: "Comment deleted successfully",
//   });
// });

export const deleteComment = asyncHandler(async (req, res, next) => {
  const { commentId } = req.params;

  const comment = await Comment.findByIdAndDelete(commentId);

  if (!comment) {
    return next(new ApiError(404, "comment not found"));
  }
  // make it delete comment in post
  await Post.findByIdAndUpdate(req.params.id, {
    $pull: { comments: commentId },
  });

  res.status(200).json({
    success: true,
    message: "Comment deleted successfully",
  });
});
// Add a reaction to a post
// export const addReactionToPost = async (req, res, next) => {
//   try {
//     const { type } = req.body;
//     const existingReaction = await Reaction.findOne({
//       post: req.params.id,
//       user: req.user._id,
//     });

//     if (existingReaction) {
//       return next(new ApiError(400, "User has already reacted to this post"));
//     }

//     const reaction = new Reaction({
//       type,
//       user: req.user._id, // Assuming user info is available in req.user
//       post: req.params.id,
//     });

//     await reaction.save();
//     res.status(201).json({
//       success: true,
//       data: reaction,
//     });
//   } catch (error) {
//     next(new ApiError(500, "Failed to add reaction"));
//   }
// };

export const addOrRemoveReactionToPost = asyncHandler(
  async (req, res, next) => {
    const userId = req.user._id; // user is set in verifyJWT middleware
    const postId = req.params.id;
    console.log("user id is ", userId);
    console.log("post id is ", postId);

    let reaction = await Reaction.findOne({ user: userId, post: postId });
    console.log("reaction is ", reaction);
    if (reaction) {
      // If the reaction exists, remove it from post
      await Post.findByIdAndUpdate(postId, {
        $pull: { reactions: reaction._id },
      });

      // If the reaction exists, remove it
      await Reaction.findByIdAndDelete(reaction._id);
    } else {
      // console.log();
      // If the reaction does not exist, add it
      reaction = new Reaction({ user: userId, post: postId });
      console.log("again reaction is ", reaction);
      await reaction.save();
      await Post.findByIdAndUpdate(postId, {
        $push: { reactions: reaction._id },
      });
    }

    const updatedReactions = await Reaction.find({ post: postId });
    console.log("updated reactions are ", updatedReactions);

    res
      .status(200)
      .json(
        new ApiResponse(200, updatedReactions, "Reaction updated successfully")
      );
  }
);

// Get reactions for a post
export const getReactionsForPost = async (req, res, next) => {
  try {
    const reactions = await Reaction.find({ post: req.params.id }).populate(
      "user",
      "fullname"
    );
    res.status(200).json({
      success: true,
      data: reactions,
    });
  } catch (error) {
    next(new ApiError(500, "Failed to fetch reactions"));
  }
};

/// New Controller

export const getPopularPosts = asyncHandler(async (req, res) => {
  const { currentPostId } = req.params;

  // find all posts exluding the current one and sort them by reaction and comment

  // const posts = await Post.find({ _id: { $ne: currentPostId } })
  //   // .populate("author", "fullname email profilePic")
  //   .sort({ reactions: -1, comments: -1 })
  //   .limit(5);

  const posts = await Post.find({ _id: { $ne: currentPostId } });
  if (!posts) {
    throw new ApiError(404, "No posts found");
  }
  const sortedPosts = posts.sort((a, b) => {
    if (b.reactions.length === a.reactions.length) {
      return b.comments.length - a.comments.length;
    }
    return b.reactions.length - a.reactions.length;
  });

  res
    .status(200)
    .json(
      new ApiResponse(200, sortedPosts, "Popular posts fetched successfully")
    );
});

export const getRelatedPosts = asyncHandler(async (req, res) => {
  const { tags, currentPostId } = req.body;

  //Find all posts with the same tags as the current post
  const relatedPosts = await Post.find({
    _id: { $ne: currentPostId },
    tags: { $in: tags },
  }).limit(5);

  if (!relatedPosts) {
    throw new ApiError(404, "No posts found");
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, relatedPosts, "Related posts fetched successfully")
    );
});
