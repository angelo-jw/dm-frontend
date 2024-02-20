import http from "../../http.js";
export function useActivitiesService() {
  const getActivitiesType = () => {
    return http.get(`/activity-type`);
  };
  const createActivityType = (data) => {
    return http.post("/activity-type", data);
  };
  const putActivityType = (id, data) => {
    return http.put(`/activity-type/${id}`, data);
  };
  const deleteActivityType = (id) => {
    return http.delete(`/activity-type/${id}`);
  };
  return {
    getActivitiesType,
    createActivityType,
    putActivityType,
    deleteActivityType,
  };
}
