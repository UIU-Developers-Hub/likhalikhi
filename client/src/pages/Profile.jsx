import { motion } from "framer-motion";
import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ConfirmationModal from "../components/ConfirmationModal";
import { AuthContext } from "../context/authContext";
import { deletePost, getUserPosts } from "../services/postServices";
import { getUserProfile, updateUserData } from "../services/userServices";

const Profile = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const { user, setUser } = useContext(AuthContext);
  const isCurrentUser = user && id === user._id;
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    fullname: "",
    email: "",
  });
  const [profilePic, setProfilePic] = useState("/profilePicture.jpg");
  const [posts, setPosts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState("");

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const res = await getUserProfile(id);
        setProfileData({
          fullname: res.data.data.fullname,
          email: res.data.data.email,
        });
        setProfilePic(res.data.data.profilePic || "/profilePicture.jpg");
      } catch (error) {
        console.log("Failed to fetch Profile Data: ", error);
      }
    };

    const fetchPosts = async () => {
      try {
        const res = await getUserPosts(id);
        setPosts(res.data.data);
      } catch (error) {
        console.log("Failed to fetch Posts: ", error);
      }
    };
    fetchProfileData();
    fetchPosts();
  }, [id]);

  const handleInputChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size < 5000000) {
      setProfilePic(file);
    } else {
      window.alert("File is too large or not an image.");
      console.error("File is too large or not an image.");
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("fullname", profileData.fullname);

    if (profilePic) {
      formData.append("profilePic", profilePic);
    }

    try {
      const response = await updateUserData(id, formData);
      if (isCurrentUser) {
        setUser({
          ...user,
          profilePic: response.data.data.profilePic,
          fullname: response.data.data.fullname,
        });
      }
      setProfilePic(response.data.data.profilePic);
      setProfileData({ ...profileData, fullname: response.data.data.fullname });
      console.log("Successfully updated data");
    } catch (err) {
      console.log(err);
    }
    setIsLoading(false);
    setEditMode(false);
  };

  const handleDeletePost = (postId) => {
    setPostIdToDelete(postId);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deletePost(postIdToDelete);
      setPosts(posts.filter((post) => post._id !== postIdToDelete));
      setIsModalOpen(false);
      console.log("Post deleted successfully");
    } catch (err) {
      console.log("Failed to delete post: ", err);
    }
  };

  const handleCancelDelete = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="container mx-auto p-4">
      <motion.div
        className="bg-cusLightBG p-6 rounded-lg shadow-md dark:bg-cusDarkBG"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center">
          <motion.img
            src={profilePic}
            alt="Profile"
            className="rounded-full object-cover h-32 w-32 mx-auto mb-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          />
          {isCurrentUser && editMode && (
            <input
              type="file"
              accept="image/*"
              onChange={handleProfilePictureChange}
              className="mb-4"
            />
          )}
          <h2 className="text-2xl font-semibold text-cusPrimaryColor dark:text-cusSecondaryColor">
            {profileData.fullname}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {profileData.email}
          </p>
        </div>
        <div className="mt-6">
          {isCurrentUser && editMode ? (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <label
                  className="block text-gray-700 dark:text-gray-300 mb-2"
                  htmlFor="username"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullname"
                  value={profileData.fullname}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded dark:bg-cusLightDarkBG dark:text-gray-200"
                />
              </motion.div>
              <motion.button
                onClick={handleSave}
                disabled={isLoading}
                className="px-4 py-2 bg-cusPrimaryColor text-white rounded hover:bg-cusSecondaryColor"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                {isLoading ? (
                  <div className="flex justify-center items-center">
                    <div className="w-5 h-5 border-4 border-t-transparent border-white rounded-full animate-spin-slow"></div>
                    <span className="ml-2">Saving...</span>
                  </div>
                ) : (
                  "Save"
                )}
              </motion.button>
              <motion.button
                onClick={() => setEditMode(false)}
                className="ml-4 px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-400 dark:hover:bg-gray-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                Cancel
              </motion.button>
            </>
          ) : (
            isCurrentUser && (
              <motion.button
                onClick={() => setEditMode(true)}
                className="px-4 py-2 bg-cusPrimaryColor text-white rounded hover:bg-cusSecondaryColor"
                whileHover={{ scale: 1.05 }}
              >
                Edit Profile
              </motion.button>
            )
          )}
        </div>
      </motion.div>
      <div className="mt-8">
        <h3 className="text-xl font-semibold text-cusPrimaryColor dark:text-cusSecondaryColor mb-4">
          {isCurrentUser ? "Your Posts" : "Posts by " + profileData.fullname}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.length > 0 ? (
            posts.map((post) => (
              <motion.div
                key={post._id}
                className="bg-cusLightBG p-4 rounded shadow-md dark:bg-cusLightDarkBG"
                whileHover={{ scale: 1.03 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                {post.image && (
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-40 object-cover rounded-md mb-4"
                  />
                )}
                <h4 className="text-lg font-semibold text-cusPrimaryColor dark:text-cusSecondaryColor">
                  {post.title}
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  {post.content.substring(0, 100)}...
                </p>
                <div className="mt-2 flex justify-between items-center">
                  <Link
                    to={`/post/${post._id}`}
                    className="px-4 py-2 bg-cusPrimaryColor text-white rounded hover:bg-cusSecondaryColor"
                  >
                    Read More
                  </Link>
                  {isCurrentUser && (
                    <div>
                      <Link
                        to={`/create-post?postId=${post._id}`}
                        state={post}
                        className="px-4 py-2 bg-cusSecondaryColor text-white rounded hover:bg-cusSecondaryLightColor"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDeletePost(post._id)}
                        className="ml-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
                <div className="mt-2">
                  <span className="text-gray-600 dark:text-gray-400">
                    {post.comments.length} Comments
                  </span>
                  <span className="ml-4 text-gray-600 dark:text-gray-400">
                    {post.reactions.length} Reactions
                  </span>
                </div>
                <div className="mt-2">
                  {post.tags.length > 0 &&
                    post.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-block bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 text-xs px-2 py-1 rounded-full mr-2"
                      >
                        {tag}
                      </span>
                    ))}
                </div>
              </motion.div>
            ))
          ) : (
            <p className="text-gray-600 dark:text-gray-400">
              {isCurrentUser
                ? "You have no posts yet."
                : "This user has no posts yet."}
            </p>
          )}
        </div>
      </div>
      <ConfirmationModal
        isOpen={isModalOpen}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};

export default Profile;
