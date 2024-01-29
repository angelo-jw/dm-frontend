import http from "../../http.js";
export function useActivityTracker() {
  const getActivities = (options) => {
    return http.get(`/activity?${options}`);
  };
  const postActivities = (data) => {
    return http.post(`/activity`, data);
  };
  return {
    getActivities,
    postActivities,
  };
}
