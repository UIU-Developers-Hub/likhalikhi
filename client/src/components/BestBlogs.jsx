import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { FaChevronLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import { getPosts } from "../services/postServices";

const BestBlogs = () => {
  const [posts, setPosts] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await getPosts();
        const allPosts = response.data.data;

        // Filter posts by most reactions and comments
        const sortedPosts = allPosts.sort((a, b) => {
          if (b.reactions.length === a.reactions.length) {
            return b.comments.length - a.comments.length;
          }
          return b.reactions.length - a.reactions.length;
        });

        // Select top 7 posts or random posts if none meet the criteria
        const bestPosts =
          sortedPosts.length > 0
            ? sortedPosts.slice(0, 7)
            : allPosts.slice(0, 7);
        setPosts(bestPosts);
      } catch (error) {
        console.error("Error fetching posts:", error.message);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div>
      <h2>Best Blogs</h2>
      <div className="relative">
        <button
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-200 p-2 rounded-full shadow-md"
          onClick={() => {
            if (scrollRef.current) {
              scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
            }
          }}
        >
          <FaChevronLeft />
        </button>
        <div ref={scrollRef} className="flex overflow-x-auto space-x-4 pb-4">
          {posts.map((post, index) => (
            <motion.div
              key={post._id}
              className="flex flex-col bg-cusLightBG dark:bg-cusLightDarkBG p-4 rounded shadow-md flex-none w-64 md:w-72"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-40 object-cover mb-2 rounded"
              />
              <h3 className="text-lg text-cusPrimaryColor dark:text-cusSecondaryColor md:text-xl font-semibold">
                {post.title}
              </h3>
              <br />
              <Link
                to={`/post/${post._id}`}
                className="mt-auto py-2 px-4 bg-cusPrimaryColor hover:bg-cusSecondaryColor text-white rounded flex justify-center w-32"
              >
                Read More
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BestBlogs;
