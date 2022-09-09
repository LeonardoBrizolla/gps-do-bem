import axios from "axios";

const api = axios.create({
  baseURL: `${process.env.BASEURL}`
});

export default api;
