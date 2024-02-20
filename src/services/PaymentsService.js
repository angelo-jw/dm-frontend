import http from "../../http.js";
export function usePaymentsService() {
  const getPayments = (options) => {
    return http.get(`/deposit${options}`);
  };
  const createPayment = (data) => {
    return http.post("/deposit", data);
  };
  const deletePayment = (id) => {
    return http.delete(`deposit/${id}`);
  };
  const updatePayment = (id, data) => {
    return http.put(`deposit/${id}`, data);
  };
  return {
    getPayments,
    createPayment,
    deletePayment,
    updatePayment,
  };
}
