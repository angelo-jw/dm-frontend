import axios from "axios";

const url = "http://127.0.0.1:5000/api";
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
