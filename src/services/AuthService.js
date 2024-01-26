import axios from "axios";

const url = import.meta.env.VITE_APP_API_URL;
export function useAuthService() {
  const createUser = (data) => {
    return axios.post(`${url}/users`, data);
  };
  const signIn = (data) => {
    return axios.post(`${url}/auth/login`, data);
  };
  return {
    createUser,
    signIn,
  };
}
