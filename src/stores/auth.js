import {defineStore} from 'pinia';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: localStorage.getItem('do-more-token') || '',
    }),
    actions: {
        setToken(newToken) {
            this.token = newToken;
            localStorage.setItem('do-more-token', newToken);
        },
        setRefreshToken(refreshToken) {
            localStorage.setItem('refresh-do-more', refreshToken);
        },
        logout() {
            this.token = '';
            localStorage.removeItem('do-more-token');
            localStorage.removeItem('refresh-do-more');
        },
    },
});