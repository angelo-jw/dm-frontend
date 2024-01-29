import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL,
});
const logoutErrorStatus = [401];

instance.defaults.withCredentials = true;

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
