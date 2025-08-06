import axios from "axios";
// import router from "./src/router";
import { useAuthService } from "@/services/AuthService";

const authService = useAuthService();
let retryFailRequest = [];
let isRefreshing = false;

const instance = axios.create({
  // baseURL: `${import.meta.env.VITE_APP_API_URL}/api`,
  baseURL: "/api",
});
let token = localStorage.getItem("do-more-token");
const logoutErrorStatus = [401];

const oauth2 = function (config) {
  if (localStorage.getItem("do-more-token")) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

instance.interceptors.request.use(oauth2);
instance.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (error) {
    const isAuthEndpoint = error.config.url.includes('/auth/') || 
                            error.config.url.includes('/login');
    if (
      error.response?.status == logoutErrorStatus && 
      !isRefreshing && 
      !isAuthEndpoint &&
      localStorage.getItem("refresh-do-more")
    ) {
      isRefreshing = true;
      try {
        const newAccessToken = await authService.refreshToken(
          localStorage.getItem("refresh-do-more")
        );
        localStorage.setItem("do-more-token", newAccessToken?.data?.token);
        token = newAccessToken?.data?.token;
        retryFailRequest.forEach((failRequest) => {
          instance
            .request(failRequest)
            .then((response) => response)
            .catch((err) => err);
        });
        retryFailRequest = [];
      } catch (refreshError) {
        throw refreshError;
      } finally {
        isRefreshing = false;
      }
    } else {
      return Promise.reject(error);
    }
  }
);
export default instance;
