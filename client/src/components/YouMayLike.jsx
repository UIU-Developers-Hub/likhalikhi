import { motion } from "framer-motion"; // Import motion from framer-motion
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPopularPosts, getRelatedPosts } from "../services/postServices";

const YouMayLike = ({ currentPostId, tags }) => {
  const [recommendedPosts, setRecommendedPosts] = useState([]);

  useEffect(() => {
    const fetchRecommendedPosts = async () => {
      try {
        let relatedPosts = await getRelatedPosts(tags, currentPostId);

        if (relatedPosts.data.data.length < 5) {
          const popularPosts = await getPopularPosts(currentPostId);
          const combinedPosts = [
            ...relatedPosts.data.data,
            ...popularPosts.data.data,
          ];
          setRecommendedPosts(combinedPosts.slice(0, 5));
        } else {
          setRecommendedPosts(relatedPosts.data.data.slice(0, 5));
        }
      } catch (error) {
        console.error("Error fetching recommended posts:", error.message);
      }
    };

    fetchRecommendedPosts();
  }, [tags, currentPostId]);

  // Animation variants
  const postAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: (index) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: index * 0.1 }, // Staggered effect
    }),
  };

  return (
    <div className="bg-white dark:bg-cusDarkBG p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-2xl text-center font-bold mb-4 text-cusPrimaryColor">
        You May Like
      </h3>
      <ul className="space-y-6">
        {recommendedPosts.map((post, index) => (
          <motion.li
            key={post._id}
            className="bg-cusLightBG dark:bg-cusLightDarkBG p-4 rounded shadow-md flex-none max-w-full lg:w-84 mx-auto"
            initial="hidden"
            animate="visible"
            variants={postAnimation}
            custom={index} // Pass the index for staggered animation
          >
            <Link
              to={`/post/${post._id}`}
              className="text-2xl md:text-xl text-cusPrimaryColor font-semibold hover:underline"
            >
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-30 object-cover mb-2 rounded"
              />
              {post.title}
            </Link>
            {/* Uncomment if you want to show the author's name */}
            {/* <p className="text-sm text-gray-500">{post.author.fullname}</p> */}
          </motion.li>
        ))}
      </ul>
    </div>
  );
};

export default YouMayLike;
