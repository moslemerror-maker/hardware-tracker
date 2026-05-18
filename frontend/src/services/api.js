import axios from "axios";

const api = axios.create({
  baseURL: "https://hardware-tracker-backend.onrender.com",
});

export default api;