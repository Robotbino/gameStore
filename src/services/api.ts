import axios from "axios";

// Vite inlines this at BUILD time, not runtime — a deployed bundle has the
// value baked in, so it must be set before `npm run build`, not on the host.
const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8181";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});


api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const url = error.config?.url ?? "";
      
      if (!url.includes("/auth/")) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;