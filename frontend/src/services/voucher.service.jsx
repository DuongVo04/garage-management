// services/voucher.service.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

// Lấy danh sách tất cả voucher
export const getAllVouchers = async (type = "all") => {
	try {
		const response = await axios.get(`${API_URL}/vouchers`, {
			params: { type }
		});
		return response.data;
	} catch (error) {
		console.error("Error fetching vouchers:", error);
		throw error;
	}
};

// Lấy voucher theo ID
export const getVoucherById = async (id) => {
	try {
		const response = await axios.get(`${API_URL}/vouchers/${id}`);
		return response.data;
	} catch (error) {
		console.error("Error fetching voucher by ID:", error);
		throw error;
	}
};

// Tạo voucher mới
export const createVoucher = async (data) => {
	try {
		const token = localStorage.getItem("token");
		const response = await axios.post(`${API_URL}/vouchers`, data, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error) {
		console.error("Error creating voucher:", error);
		throw error;
	}
};

// Cập nhật voucher
export const updateVoucher = async (id, data) => {
	try {
		const token = localStorage.getItem("token");
		const response = await axios.put(`${API_URL}/vouchers/${id}`, data, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error) {
		console.error("Error updating voucher:", error);
		throw error;
	}
};

// Xóa voucher
export const deleteVoucher = async (id) => {
	try {
		const token = localStorage.getItem("token");
		const response = await axios.delete(`${API_URL}/vouchers/${id}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error) {
		console.error("Error deleting voucher:", error);
		throw error;
	}
};