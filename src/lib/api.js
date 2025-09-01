import axios from "axios";

export const api = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL
});

// attach token automatically if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("rewearify_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
