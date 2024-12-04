import { format } from "date-fns";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { AiFillHeart } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import { Link } from "react-router-dom";
import { getPosts } from "../services/postServices";

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

const truncateText = (text, wordLimit) => {
  const words = text.split(" ");
  return words.length <= wordLimit
    ? text
    : words.slice(0, wordLimit).join(" ") + "...";
};

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [selectedTag, setSelectedTag] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await getPosts();
        setPosts(response.data.data);
      } catch (error) {
        console.error("Error fetching posts:", error.message);
      }
    };

    fetchPosts();
  }, []);

  const handleTagClick = (tag) => setSelectedTag(tag);

  const filteredPosts = selectedTag
    ? posts.filter((post) =>
        post.tags
          .map((tag) => tag.toLowerCase())
          .includes(selectedTag.toLowerCase())
      )
    : posts;

  return (
    <motion.div
      className="p-4 max-w-7xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl text-cusPrimaryColor dark:text-cusSecondaryLightColor font-bold mb-6">
        All Posts
      </h1>

      <div className="mb-4">
        <h2 className="text-xl text-cusSecondaryColor font-semibold mb-2">
          Filter by Tag:
        </h2>
        <div className="flex flex-wrap gap-2">
          {fixedTags.map((tag) => (
            <motion.button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              whileHover={{ scale: 1.05 }}
              className={`px-4 py-2 rounded-lg ${
                selectedTag === tag
                  ? "bg-cusPrimaryColor text-white"
                  : "bg-cusSecondaryLightColor text-cusDarkBG"
              }`}
            >
              {tag}
            </motion.button>
          ))}
          <motion.button
            onClick={() => setSelectedTag("")}
            whileHover={{ scale: 1.05 }}
            className="px-4 py-2 rounded-lg bg-cusSecondaryColor text-white"
          >
            Clear Filter
          </motion.button>
        </div>
      </div>

      <div className="space-y-8">
        {filteredPosts.map((post, index) => (
          <motion.div
            key={post._id}
            className={`flex flex-col md:flex-row gap-4 bg-cusLightBG dark:bg-cusLightDarkBG p-6 rounded-lg ${
              index % 2 === 0 ? "md:flex-row-reverse" : "md:flex-row"
            }`}
            initial={{ opacity: 0, x: index % 2 === 0 ? 100 : -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="relative md:w-2/5 my-2 md:my-6">
              <img
                src={post.image}
                alt={post.title}
                className="max-w-full h-96 md:h-96 object-cover rounded-lg"
              />
              <div className="absolute top-2 left-2 bg-white bg-opacity-75 text-gray-700 text-xs px-2 py-1 rounded">
                {format(new Date(post.createdAt), "PPP")}
              </div>
              <div className="absolute bottom-2 left-2 flex gap-4 text-white">
                <div className="flex items-center gap-1 bg-black bg-opacity-50 px-2 py-1 rounded border border-gray-600">
                  <AiFillHeart /> {post.reactions.length}
                </div>
                <div className="flex items-center gap-1 bg-black bg-opacity-50 px-2 py-1 rounded border border-gray-600">
                  <FaRegComment /> {post.comments.length}
                </div>
              </div>
            </div>

            {/* <div className="md:w-3/5 flex flex-col justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-cusPrimaryColor dark:text-cusSecondaryLightColor">
                  {post.title}
                </h2>
                <Link
                  to={`/profile/${post.author._id}`}
                  className="text-cusSecondaryColor text-opacity-75 mt-2"
                >
                  by {post.author.fullname}
                </Link>
                <p className="text-cusPrimaryColor dark:text-cusSecondaryColor mt-4">
                  {truncateText(post.content, 80)}
                </p>
              </div>
              <div className="mt-4">
                <h3 className="font-semibold text-cusPrimaryColor dark:text-cusSecondaryLightColor">
                  Tags:
                </h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {post.tags.map((tag) => (
                    <motion.span
                      onClick={() => handleTagClick(tag)}
                      key={tag}
                      whileHover={{ scale: 1.05 }}
                      className="px-3 py-1 bg-cusSecondaryLightColor text-cusDarkBG cursor-pointer rounded-full"
                    >
                      {tag}
                    </motion.span>
                  ))}
                </div>
              </div>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Link
                  to={`/post/${post._id}`}
                  className="mt-4 bg-cusPrimaryColor text-white py-2 px-4 rounded text-center w-32"
                >
                  Read More
                </Link>
              </motion.div>
            </div> */}
            <div className="md:w-3/5 flex flex-col justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-cusPrimaryColor dark:text-cusSecondaryLightColor">
                  {post.title}
                </h2>
                <Link
                  to={`/profile/${post.author._id}`}
                  className="text-cusSecondaryColor text-opacity-75 mt-2"
                >
                  by {post.author.fullname}
                </Link>
                <p className="text-cusPrimaryColor dark:text-cusSecondaryColor mt-4">
                  {truncateText(post.content, 80)}
                </p>
              </div>
              <div className="mt-4">
                <h3 className="font-semibold text-cusPrimaryColor dark:text-cusSecondaryLightColor">
                  Tags:
                </h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {post.tags.map((tag) => (
                    <motion.span
                      onClick={() => handleTagClick(tag)}
                      key={tag}
                      whileHover={{ scale: 1.05 }}
                      className="px-3 py-1 bg-cusSecondaryLightColor text-cusDarkBG cursor-pointer rounded-full"
                    >
                      {tag}
                    </motion.span>
                  ))}
                </div>
              </div>
              <Link
                to={`/post/${post._id}`}
                className="mt-4 bg-cusPrimaryColor text-white py-2 px-4 rounded text-center mx-auto w-32"
              >
                Read More
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Posts;
