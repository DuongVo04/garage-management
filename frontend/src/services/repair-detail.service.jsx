// repair-detail.service.jsx
import apiClient from "./apiClient";

// Lấy chi tiết sửa xe theo ticket_id
export const getRepairDetailsByTicketId = async (ticketId) => {
	try {
		const response = await apiClient.get(`/repair-details/by-ticket/${ticketId}`);
		return response.data;
	} catch (error) {
		console.error("Error fetching repair details by ticket:", error);
		throw error;
	}
};

// Tạo chi tiết sửa xe
export const createRepairDetail = async (ticketId, data) => {
	try {
		const payload = {
			employee_id: data.employee_id,
			note: data.note || null,
			repair_date: data.repair_date || null,
			// usage_id có thể thêm sau nếu cần
		};

		const response = await apiClient.post(`/repair-details/${ticketId}`, payload);
		return response.data;
	} catch (error) {
		console.error("Error creating repair detail:", error.response?.data || error.message);
		throw error;
	}
};

// Cập nhật repair detail theo ID của RepairDetail (KHÔNG phải ticketId)
export const updateRepairDetail = async (repairDetailId, data) => {
	try {
		const payload = {};
		if (data.employee_id !== undefined) payload.employee_id = data.employee_id;
		if (data.note !== undefined) payload.note = data.note;
		if (data.repair_date !== undefined) payload.repair_date = data.repair_date;
		if (data.usage_id !== undefined) payload.usage_id = data.usage_id;

		const response = await apiClient.put(`/repair-details/${repairDetailId}`, payload);
		return response.data;
	} catch (error) {
		console.error("Error updating repair detail:", error);
		throw error;
	}
};

// Xóa repair detail theo ID
export const deleteRepairDetail = async (repairDetailId) => {
	try {
		const response = await apiClient.delete(`/repair-details/${repairDetailId}`);
		return response.data;
	} catch (error) {
		console.error("Error deleting repair detail:", error);
		throw error;
	}
};