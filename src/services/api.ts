import axios from "axios";

const api = axios.create({
  baseURL: "https://gps-do-bem-back-end.vercel.app"
});

export default api;
