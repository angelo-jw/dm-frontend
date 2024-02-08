import http from "../../http.js";
export function useDashboardService() {
  const getActivityCount = (options) => {
    return http.get(`get-activity-count${options}`);
  };
  const getActivityCountPerMonth = (options) => {
    return http.get(`get-activity-count-per-month${options}`);
  };
  return {
    getActivityCount,
    getActivityCountPerMonth,
  };
}
