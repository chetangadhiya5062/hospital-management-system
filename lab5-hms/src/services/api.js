import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

let isRefreshing = false;

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!error.response) {
      return Promise.reject(error);
    }

    const originalRequest = error.config;

    // Do not refresh if it's login or refresh endpoint
    if (
      originalRequest.url.includes("/auth/login") ||
      originalRequest.url.includes("/auth/refresh")
    ) {
      return Promise.reject(error);
    }

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          await axios.post(
            "http://localhost:5000/api/auth/refresh",
            {},
            { withCredentials: true }
          );

          isRefreshing = false;
          return API(originalRequest);

        } catch (refreshError) {
          isRefreshing = false;

          // 🔥 Do NOT force reload here
          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
  }
);

export default API;