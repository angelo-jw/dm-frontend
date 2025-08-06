import http from "../../http.js";
export function useAuthService() {
  const createUser = (data) => {
    return http.post(`/api/users`, data);
  };
  const signIn = (data) => {
    return http.post(`/api/auth/login`, data);
  };
  const refreshToken = (data) => {
    return http.post("/api/auth/refresh-token", { refresh_token: data });
  };
  const getCurrentUser = () => {
    return http.get("/api/users/me");
  }
  const verifyResetToken = (token) => {
    return http.post("/api/auth/verify-reset-token", { token: token });
  };
  const resetPassword = (token, password) => {
    return http.post("/api/auth/complete-reset-password", { token: token, password: password });
  };
  const requestPasswordReset = (email) => {
    console.log("Requesting password reset for:", email);
    return http.post("/api/auth/reset-password", { email: email });
  };
  return {
    createUser,
    signIn,
    refreshToken,
    getCurrentUser,
    requestPasswordReset,
    verifyResetToken,
    resetPassword,
  };
}
