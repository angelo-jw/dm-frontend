import http from "../../http.js";
export function usePaymentsService() {
  const getPayments = (options) => {
    return http.get(`/payment${options}`);
  };
  const createPayment = (data) => {
    return http.post("/payment", data);
  };
  const deletePayment = (id) => {
    return http.delete(`payment/${id}`);
  };
  const updatePayment = (id, data) => {
    return http.put(`payment/${id}`, data);
  };
  return {
    getPayments,
    createPayment,
    deletePayment,
    updatePayment,
  };
}
