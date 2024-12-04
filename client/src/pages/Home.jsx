import { format } from "date-fns"; // To format the date
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { AiFillHeart } from "react-icons/ai"; // For love icon
import { FaRegComment } from "react-icons/fa"; // For comment icon
import { Link, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BestBlogs from "../components/BestBlogs"; // Import the new component
import { getPosts } from "../services/postServices";
import { notify } from "../utils/notify";

const truncateText = (text, wordLimit) => {
  const words = text.split(" ");
  if (words.length <= wordLimit) return text;
  return words.slice(0, wordLimit).join(" ") + "...";
};

const Home = () => {
  const [posts, setPosts] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await getPosts();
        const fetchedPosts = response.data.data;
        const lastTenPosts = fetchedPosts.slice(-10).reverse();
        setPosts(lastTenPosts);
      } catch (error) {
        console.error("Error fetching posts:", error.message);
      }
    };

    fetchBlogs();
    const queryParams = new URLSearchParams(location.search);

    if (queryParams.get("source") === "login") {
      notify("You have successfully logged in!", "success");
    }
  }, []);

  return (
    <motion.div
      className="p-4 max-w-7xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <ToastContainer />
      <BestBlogs />

      <section>
        <h2 className="text-2xl text-cusPrimaryColor dark:text-cusSecondaryLightColor font-bold mb-4">
          All Blogs
        </h2>
        <div className="space-y-8">
          {posts.map((post, index) => (
            <motion.div
              key={post._id}
              className={`flex flex-col md:flex-row gap-4 bg-cusLightBG dark:bg-cusLightDarkBG p-6 rounded-lg ${
                index % 2 === 0 ? "md:flex-row-reverse" : "md:flex-row"
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="relative md:w-2/5 my-2 md:my-6">
                <img
                  src={post.image}
                  alt={post.title}
                  className="max-w-full h-96  object-cover rounded-lg"
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
                      <span
                        key={tag}
                        className="px-3 py-1 bg-cusSecondaryLightColor text-cusDarkBG rounded-full"
                      >
                        {tag}
                      </span>
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

        <div className="flex justify-center mt-4">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/posts"
              className="bg-cusPrimaryColor text-white py-2 px-4 rounded text-center"
            >
              View All Posts
            </Link>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

export default Home;
