import apiClient from "./apiClient";

// Lấy chi tiết sửa xe theo ticket_id (có thể trả về MẢNG)
export const getRepairDetailsByTicketId = async (ticketId) => {
	try {
		// Sửa endpoint để trả về mảng các repair details
		const response = await apiClient.get(`/repair-details/ticket/${ticketId}`);
		return response.data;
	} catch (error) {
		console.error("Error fetching repair details:", error);
		throw error;
	}
};

// Giữ lại hàm cũ cho tương thích (deprecated)
export const getRepairDetailByTicketId = async (ticketId) => {
	console.warn('getRepairDetailByTicketId is deprecated, use getRepairDetailsByTicketId');
	const response = await apiClient.get(`/repair-details/ticket/${ticketId}`);
	return response.data;
};

// Tạo chi tiết sửa xe
export const createRepairDetail = async (ticketId, data) => {
	try {
		const response = await apiClient.post(`/repair-details`, { ...data, ticket_id: ticketId });
		return response.data;
	} catch (error) {
		console.error("Error creating repair detail:", error);
		throw error;
	}
};

// Cập nhật chi tiết sửa xe - cần detail_id
export const updateRepairDetail = async (detailId, data) => {
	try {
		const response = await apiClient.put(`/repair-details/${detailId}`, data);
		return response.data;
	} catch (error) {
		console.error("Error updating repair detail:", error);
		throw error;
	}
};