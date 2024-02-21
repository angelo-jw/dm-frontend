import http from "../../http.js";
export function useActivityTracker() {
  const getActivities = (options) => {
    return http.get(`/activity?${options}`);
  };
  const postActivities = (data) => {
    return http.post(`/activity`, data);
  };
  const putActivity = (id, data) => {
    return http.put(`/activity/${id}`, data);
  };
  const deleteActivity = (id) => {
    return http.delete(`/activity/${id}`, data);
  };
  return {
    getActivities,
    postActivities,
    putActivity,
    deleteActivity,
  };
}
