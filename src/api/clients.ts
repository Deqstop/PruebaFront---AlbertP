import axios from "axios";

// Auth API
export const authApi = axios.create({
  baseURL: "https://dev.apinetbo.bekindnetwork.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// App API
export const appApi = axios.create({
  baseURL: "https://dev.api.bekindnetwork.com/api/v1",
});

// Request interceptor
appApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // FormData: dejar que el browser maneje el Content-Type
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    } else {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
appApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);
