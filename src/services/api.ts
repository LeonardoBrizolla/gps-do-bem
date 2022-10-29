import axios from "axios";

const api = axios.create({
  baseURL: "https://gps-do-bem-back-end.vercel.app"
  // baseURL: process.env.BASEURL
});

export default api;
