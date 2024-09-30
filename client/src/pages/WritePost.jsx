import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createPost, updatePost } from "../services/postServices";

const WritePost = () => {
  const location = useLocation();
  const post = location?.state;
  console.log("location state is --------->", location.state);
  console.log("Post is --------->", post);

  const [selectedTags, setSelectedTags] = useState(post ? post.tags : []);
  const [title, setTitle] = useState(post ? post.title : "");
  const [content, setContent] = useState(post ? post.content : "");
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const fixedTags = [
    "Technology",
    "Health",
    "Travel",
    "Education",
    "Food",
    "Lifestyle",
    "Fashion",
    "Sports",
    "Entertainment",
    "Finance",
  ];

  const handleTagClick = (tag) => {
    setSelectedTags((prevTags) =>
      prevTags.includes(tag)
        ? prevTags.filter((t) => t !== tag)
        : [...prevTags, tag]
    );
    // console.log(JSON.stringify(selectedTags));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Set loading state to true
    // Create a new FormData object
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("tags", JSON.stringify(selectedTags)); // Convert array to JSON string
    if (image) {
      formData.append("image", image);
    }

    try {
      let res;
      if (post) {
        res = await updatePost(post._id, formData);
        console.log("Post updated successfully:", res);
      } else {
        res = await createPost(formData);
        console.log("Post created successfully:", res);
      }
      navigate(`/post/${res.data.data._id}`);
    } catch (error) {
      console.error("Error creating/updating post:", error.message);
      console.log("ERROR IS-->", error);
    } finally {
      setIsLoading(false); // Set loading state to false
    }
    // Logic to handle form submission, such as sending data to the server
  };

  return (
    <div className="max-w-4xl mx-auto p-4 my-5 bg-cusLightBG dark:bg-cusDarkBG rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-cusPrimaryColor dark:text-cusSecondaryLightColor">
        {post ? "Edit Post" : "Create a New Post"}
      </h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            className="block text-cusPrimaryColor dark:text-cusSecondaryLightColor font-medium mb-2"
            htmlFor="title"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg dark:bg-cusLightDarkBG dark:text-cusSecondaryLightColor"
            placeholder="Enter the title of your post"
            required
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-cusPrimaryColor dark:text-cusSecondaryLightColor font-medium mb-2"
            htmlFor="content"
          >
            Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg dark:bg-cusLightDarkBG dark:text-cusSecondaryLightColor"
            rows="8"
            placeholder="Write your post content here..."
            required
          ></textarea>
        </div>
        <div className="mb-4">
          <label
            className="block text-cusPrimaryColor dark:text-cusSecondaryLightColor font-medium mb-2"
            htmlFor="image"
          >
            Image
          </label>
          <input
            type="file"
            id="image"
            onChange={(e) => setImage(e.target.files[0])}
            className="w-full p-2 border border-gray-300 rounded-lg dark:bg-cusLightDarkBG dark:text-cusSecondaryLightColor   file:mr-4 file:py-2 file:px-4 file:rounded-full file:border file:border-cusPrimaryColor file:text-sm file:font-semibold file:bg-cusLightBG dark:file:bg-cusLightDarkBG file:text-cusSecondaryColor dark:file:text-cusSecondaryLightColor hover:file:bg-cusSecondaryLightColor dark:hover:file:bg-cusSecondaryColor  "
            accept="image/*"
          />
        </div>
        <div className="mb-4">
          <label className="block text-cusPrimaryColor dark:text-cusSecondaryLightColor font-medium mb-2   ">
            Tags
          </label>
          <div className="flex flex-wrap gap-2">
            {fixedTags.map((tag) => (
              <button
                type="button"
                key={tag}
                onClick={() => handleTagClick(tag)}
                className={`px-3 py-1 rounded-full ${
                  selectedTags.includes(tag)
                    ? "bg-cusPrimaryColor text-white"
                    : "bg-gray-200 text-gray-800 dark:bg-cusLightDarkBG dark:text-cusSecondaryLightColor"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
        <button
          type="submit"
          className={`w-full py-2 rounded-lg font-semibold transition-colors ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-cusPrimaryColor text-white hover:bg-cusSecondaryColor"
          }`}
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-4 border-t-transparent border-white rounded-full animate-spin-slow mr-2"></div>
              <span>{post ? "Updating..." : "Publishing..."}</span>
            </div>
          ) : post ? (
            "Update Post"
          ) : (
            "Publish Post"
          )}
        </button>
      </form>
    </div>
  );
};

export default WritePost;
