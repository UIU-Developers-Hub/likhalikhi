import axios from "axios";

// const API_URL = "https://blog-app-eta-orcin.vercel.app/api/v1/";
// Update the API_URL if you are running the backend locally
const API_URL = "http://localhost:5000/api/v1/";

export const createPost = (postData) => {
  return axios.post(`${API_URL}posts`, postData, {
    withCredentials: true, // Ensures cookies are sent and received
  });
};

export const getPosts = () => {
  return axios.get(`${API_URL}posts`);
};

export const getPostById = (postId) => {
  return axios.get(`${API_URL}posts/${postId}`);
};

export const updatePost = (postId, updatedData) => {
  return axios.put(`${API_URL}posts/${postId}`, updatedData, {
    withCredentials: true, // Ensures cookies are sent and received
  });
};

export const deletePost = (postId) => {
  return axios.delete(`${API_URL}posts/${postId}`, {
    withCredentials: true, // Ensures cookies are sent and received
  });
};

//get perticular users all post
export const getUserPosts = async (userId) =>
  await axios.get(`${API_URL}posts/user/${userId}`);

export const getComments = (postId) =>
  axios.get(`${API_URL}posts/${postId}/comments`);
export const addComment = (postId, commentData) => {
  return axios.post(`${API_URL}posts/${postId}/comments`, commentData, {
    withCredentials: true, // Ensures cookies are sent and received
  });
};
export const updateComment = (postId, commentId, commentData) => {
  return axios.put(
    `${API_URL}posts/${postId}/comments/${commentId}`,
    commentData,
    {
      withCredentials: true, // Ensures cookies are sent and received
    }
  );
};

export const deleteComment = (postId, commentId) => {
  return axios.delete(`${API_URL}posts/${postId}/comments/${commentId}`, {
    withCredentials: true, // Ensures cookies are sent and received
  });
};
export const getReactions = (postId) =>
  axios.get(`${API_URL}posts/${postId}/reactions`);

export const addOrRemoveReaction = (postId) => {
  return axios.post(
    `${API_URL}posts/${postId}/reactions`,
    {},
    {
      withCredentials: true, // Ensures cookies are sent and received
    }
  );
};

// New Services for Popular and Related Posts

export const getPopularPosts = (currentPostId) => {
  return axios.get(`${API_URL}posts/popular/${currentPostId}`);
};

export const getRelatedPosts = (tags, currentPostId) => {
  return axios.post(`${API_URL}posts/related`, { tags, currentPostId });
};
