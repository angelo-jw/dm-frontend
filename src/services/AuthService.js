import http from "../../http.js";
export function useAuthService() {
  const createUser = (data) => {
    return http.post(`/users`, data);
  };
  const signIn = (data) => {
    return http.post(`/auth/login`, data);
  };
  return {
    createUser,
    signIn,
  };
}
