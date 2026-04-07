import apiClient from "./apiClient";

// Lấy tất cả spare parts usage theo repair_detail_id
export const getSparePartsUsagesByRepairDetailId = async (repairDetailId) => {
	try {
		// ✅ Sửa: api -> apiClient
		const response = await apiClient.get(`/spare-parts-usage/by-repair-detail/${repairDetailId}`);
		return response.data;
	} catch (error) {
		console.error('Error fetching spare parts usages:', error);
		return { success: false, data: [], message: error.message };
	}
};

// Tạo mới spare parts usage
export const createSparePartsUsage = async (data) => {
	try {
		const response = await apiClient.post("/spare-parts-usage", data);
		return response.data;
	} catch (error) {
		console.error("Error creating spare parts usage:", error);
		throw error;
	}
};

// Xóa spare parts usage
export const deleteSparePartsUsage = async (id) => {
	try {
		const response = await apiClient.delete(`/spare-parts-usage/${id}`);
		return response.data;
	} catch (error) {
		console.error("Error deleting spare parts usage:", error);
		throw error;
	}
};

// Cập nhật spare parts usage
export const updateSparePartsUsage = async (id, data) => {
	try {
		const response = await apiClient.put(`/spare-parts-usage/${id}`, data);
		return response.data;
	} catch (error) {
		console.error("Error updating spare parts usage:", error);
		throw error;
	}
};