import http from "../../http.js";
export function useCarrierService() {
  const createCarrier = (data) => {
    return http.post("/carrier", data);
  };
  const getCarriers = (options) => {
    return options ? http.get(`/carrier${options}`) : http.get("/carrier");
  };
  const updateCarrier = (id, data) => {
    return http.put(`/carrier/${id}`, data);
  };
  const deleteCarrier = (id) => {
    return http.delete(`carrier/${id}`);
  };
  return {
    createCarrier,
    getCarriers,
    updateCarrier,
    deleteCarrier,
  };
}
