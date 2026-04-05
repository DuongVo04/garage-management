import apiClient from "./apiClient";

const VEHICLE_API = "/customer-vehicles/by-admin";

const customerVehicleService = {
  // Tạo xe mới cho khách hàng
  createVehicle: async (formData) => {
    try {
      const response = await apiClient.post(VEHICLE_API, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      return response.data;
    } catch (error) {
      console.error("Error creating vehicle:", error);
      throw error;
    }
  },

  // Cập nhật xe
  updateVehicle: async (vehicleId, formData) => {
    try {
      const response = await apiClient.put(`${VEHICLE_API}/${vehicleId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating vehicle ${vehicleId}:`, error);
      throw error;
    }
  },

  // Xóa xe
  deleteVehicle: async (vehicleId) => {
    try {
      const response = await apiClient.delete(`${VEHICLE_API}/${vehicleId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting vehicle ${vehicleId}:`, error);
      throw error;
    }
  },

  // Lấy danh sách brands
  getBrands: async () => {
    try {
      const response = await apiClient.get("/brands/by-admin");
      return response.data;
    } catch (error) {
      console.error("Error fetching brands:", error);
      throw error;
    }
  },

  // Lấy chi tiết xe theo ID (nếu cần)
  getVehicleById: async (vehicleId) => {
    try {
      const response = await apiClient.get(`${VEHICLE_API}/${vehicleId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching vehicle ${vehicleId}:`, error);
      throw error;
    }
  }
};

export default customerVehicleService;