import http from "../../http.js";
export function useAuthService() {
  const createUser = (data) => {
    return http.post(`/users`, data);
  };
  const signIn = (data) => {
    return http.post(`/auth/login`, data);
  };
  const refreshToken = (data) => {
    return http.post("auth/refresh-token", { refresh_token: data });
  };
  return {
    createUser,
    signIn,
    refreshToken,
  };
}
