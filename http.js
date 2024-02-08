import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL,
});
const logoutErrorStatus = [401];

const oauth2 = function (config) {
  if (localStorage.getItem("do-more-token")) {
    config.headers.Authorization = localStorage.getItem("do-more-token");
  }
  return config;
};

instance.interceptors.request.use(oauth2);
instance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (error.response?.status == logoutErrorStatus) {
      router.push({ name: "login" });
    } else {
      return Promise.reject(error);
    }
  }
);
export default instance;
