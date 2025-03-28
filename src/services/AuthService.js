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
  const verifyResetToken = (token) => {
    return http.post("auth/verify-reset-token", { token: token });
  };
  const resetPassword = (token, password) => {
    return http.post("auth/complete-reset-password", { token: token, password: password });
  };
  const requestPasswordReset = (email) => {
    console.log("Requesting password reset for:", email);
    return http.post("auth/reset-password", { email: email });
  };
  return {
    createUser,
    signIn,
    refreshToken,
    requestPasswordReset,
    verifyResetToken,
    resetPassword,
  };
}
