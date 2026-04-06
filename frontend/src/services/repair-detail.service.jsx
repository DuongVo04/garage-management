import apiClient from "./apiClient";

// ==================== REPAIR DETAIL ====================

// Lấy chi tiết sửa xe theo ticket_id
export const getRepairDetailByTicketId = async (ticketId) => {
	try {
		const response = await apiClient.get(`/repair-details/${ticketId}`);
		return response.data;
	} catch (error) {
		console.error("Error fetching repair detail:", error);
		throw error;
	}
};

// Tạo chi tiết sửa xe
export const createRepairDetail = async (ticketId, data) => {
	try {
		const response = await apiClient.post(`/repair-details/${ticketId}`, data);
		return response.data;
	} catch (error) {
		console.error("Error creating repair detail:", error);
		throw error;
	}
};

// Cập nhật chi tiết sửa xe
export const updateRepairDetail = async (ticketId, data) => {
	try {
		const response = await apiClient.put(`/repair-details/${ticketId}`, data);
		return response.data;
	} catch (error) {
		console.error("Error updating repair detail:", error);
		throw error;
	}
};

// Xóa chi tiết sửa xe
export const deleteRepairDetail = async (ticketId) => {
	try {
		const response = await apiClient.delete(`/repair-details/${ticketId}`);
		return response.data;
	} catch (error) {
		console.error("Error deleting repair detail:", error);
		throw error;
	}
};