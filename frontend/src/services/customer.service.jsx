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

// Lấy thông tin customer hiện tại (dành cho Customer)
export const getMyCustomerInfo = async () => {
	const res = await apiClient.get("/customers/me");
	return res.data;
};

// Link account với số điện thoại
export const linkAccount = async (phoneNumber) => {
	const res = await apiClient.patch("/customers/link-account", { phone_number: phoneNumber });
	return res.data;
};