import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json"
  },
  withCredentials: true // Enable sending cookies and authorization headers
});

// attach token if available
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  err => Promise.reject(err)
);

api.interceptors.response.use(
  response => response,
  error => {
    console.error("API error:", error);
    return Promise.reject(error);
  }
);

export default api;
