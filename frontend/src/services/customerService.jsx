import apiClient from "./apiClient";

const CUSTOMER_API = "/customers/by-admin";

const customerService = {
  // Lấy danh sách khách hàng
  getCustomers: async () => {
    try {
      const response = await apiClient.get(CUSTOMER_API);
      return response.data;
    } catch (error) {
      console.error("Error fetching customers:", error);
      throw error;
    }
  },

  // Lấy chi tiết khách hàng theo ID
  getCustomerById: async (id) => {
    try {
      const response = await apiClient.get(`${CUSTOMER_API}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching customer ${id}:`, error);
      throw error;
    }
  },

  // Tạo mới khách hàng
  createCustomer: async (customerData) => {
    try {
      const response = await apiClient.post(CUSTOMER_API, customerData);
      return response.data;
    } catch (error) {
      console.error("Error creating customer:", error);
      throw error;
    }
  },

  // Cập nhật khách hàng
  updateCustomer: async (id, customerData) => {
    try {
      const response = await apiClient.put(`${CUSTOMER_API}/${id}`, customerData);
      return response.data;
    } catch (error) {
      console.error(`Error updating customer ${id}:`, error);
      throw error;
    }
  }
};

export default customerService;