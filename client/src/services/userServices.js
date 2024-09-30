import axios from "axios";

const API_URL = "http://localhost:5000/api/v1/";
// const API_URL = "https://blog-app-eta-orcin.vercel.app/api/v1/";

export const updateUserData = async (userId, formdata) =>
  await axios.put(`${API_URL}users/${userId}`, formdata, {
    withCredentials: true,
  });

export const getUserProfile = async (userId) =>
  await axios.get(`${API_URL}users/${userId}`);
