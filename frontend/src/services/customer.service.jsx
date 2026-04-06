// frontend/services/customer.service.js
import apiClient from "./apiClient";

// ==================== CUSTOMER ====================

// Lấy danh sách khách hàng (dành cho Admin)
export const getAllCustomers = async () => {
	const res = await apiClient.get("/customers/by-admin");
	return res.data;
};

// Lấy chi tiết khách hàng theo ID (dành cho Admin)
export const getCustomerById = async (id) => {
	const res = await apiClient.get(`/customers/by-admin/${id}`);
	return res.data;
};

// Tạo khách hàng mới (dành cho Customer đăng ký)
export const createCustomer = async (data) => {
	const res = await apiClient.post("/customers", data);
	return res.data;
};

// Cập nhật thông tin khách hàng (dành cho Customer)
export const updateCustomer = async (data) => {
	const res = await apiClient.put("/customers", data);
	return res.data;
};

// Tạo khách hàng mới (dành cho Admin)
export const createCustomerByAdmin = async (data) => {
	const res = await apiClient.post("/customers/by-admin", data);
	return res.data;
};

// Cập nhật khách hàng (dành cho Admin)
export const updateCustomerByAdmin = async (customerId, data) => {
	const res = await apiClient.put(`/customers/by-admin/${customerId}`, data);
	return res.data;
};

// Link account với số điện thoại
export const linkAccount = async (phoneNumber) => {
	const res = await apiClient.patch("/customers/link-account", { phone_number: phoneNumber });
	return res.data;
}

export const getMyCustomerInfo = async () => {
    try {
        const response = await apiClient.get("/customers/me");
        return response.data;
    } catch (error) {
        console.error("Error fetching customer info:", error);
        return { success: false, message: error.response?.data?.message || "Error fetching customer info" };
    }
};

export const updateMyCustomerInfo = async (data) => {
    try {
        const response = await apiClient.put("/customers/me", data);
        return response.data;
    } catch (error) {
        console.error("Error updating customer info:", error);
        return { success: false, message: error.response?.data?.message || "Error updating customer info" };
    }
};

export const createCustomerInfo = async (data) => {
    try {
        const response = await apiClient.post("/customers", data);
        return response.data;
    } catch (error) {
        console.error("Error creating customer info:", error);
        return { success: false, message: error.response?.data?.message || "Error creating customer info" };
    }
};

export const linkCustomerAccount = async (phoneNumber) => {
    try {
        const response = await apiClient.patch("/customers/link-account", { phone_number: phoneNumber });
        return response.data;
    } catch (error) {
        console.error("Error linking account:", error);
        return { success: false, message: error.response?.data?.message || "Error linking account" };
    }
};