import axios from "axios";
import { useAuthStore } from "@/store/use-auth-store";

const BASE_URL = "/api";

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (originalRequest.url?.includes("/auth/refresh")) {
        cleanupAndRedirect();
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      // Deduplicate: only one refresh at a time
      if (!isRefreshing) {
        isRefreshing = true;
        refreshPromise = axios
          .post(`${BASE_URL}/auth/refresh`, {}, { withCredentials: true })
          .then((res) => {
            const newToken = res.data.accessToken;
            useAuthStore.getState().setAccessToken(newToken);
            return newToken;
          })
          .catch((err) => {
            cleanupAndRedirect();
            return Promise.reject(err);
          })
          .finally(() => {
            isRefreshing = false;
            refreshPromise = null;
          });
      }

      try {
        const newToken = await refreshPromise!;
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (err) {
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  },
);

function cleanupAndRedirect() {
  useAuthStore.getState().setAuth(null, null);
  localStorage.removeItem("auth-storage");
  if (typeof window !== "undefined" && window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
}
