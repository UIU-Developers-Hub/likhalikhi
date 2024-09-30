import axios from "axios";

const API_URL = "/api/notifications/";

export const getNotifications = (userId) =>
  axios.get(`${API_URL}user/${userId}`);
export const markAsRead = (notificationId) =>
  axios.put(`${API_URL}${notificationId}/read`);
export const deleteNotification = (notificationId) =>
  axios.delete(`${API_URL}${notificationId}`);
