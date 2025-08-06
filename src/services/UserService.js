import http from "../../http.js";

export function useUserService() {
    const updateCurrentUser = (data) => {
        return http.put('/api/users/me', data);
    };

    return {
        updateCurrentUser,
    };
}