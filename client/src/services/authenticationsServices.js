import axios from "axios";

// const API_URL = "https://blog-app-eta-orcin.vercel.app/api/v1/auth/";
const API_URL = "http://localhost:5001/api/v1/auth/";

export const register = (credentials) => {
  return axios.post(`${API_URL}register`, credentials);
};
export const login = (credentials) => {
  return axios.post(`${API_URL}login`, credentials, {
    withCredentials: true, // This ensures that cookies are sent and received
  });
};
export const verifyEmail = (id, token) => {
  return axios.get(`${API_URL}verify-email?id=${id}&token=${token}`);
};
export const logout = () =>
  axios.post(
    `${API_URL}logout`,
    {},
    {
      withCredentials: true, // This ensures that cookies are sent and received
    }
  );
export const refreshToken = () => axios.post(`${API_URL}refresh-token`);

export const resendVerificationEmail = async (credentials) => {
  try {
    const response = await axios.post(
      "http://localhost:5000/api/v1/auth/resend-verification-email",
      credentials
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error in resendVerificationEmail:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};
