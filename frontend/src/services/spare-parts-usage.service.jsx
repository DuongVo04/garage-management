import apiClient from "./apiClient";

// ==================== SPARE PARTS USAGE ====================

// Lấy tất cả phiếu sử dụng phụ tùng
export const getAllSparePartsUsages = async (params = {}) => {
	try {
		const response = await apiClient.get("/spare-parts-usages", { params });
		return response.data;
	} catch (error) {
		console.error("Error fetching spare parts usages:", error);
		throw error;
	}
};

// Lấy phiếu sử dụng phụ tùng theo ID
export const getSparePartsUsageById = async (id) => {
	try {
		const response = await apiClient.get(`/spare-parts-usages/${id}`);
		return response.data;
	} catch (error) {
		console.error("Error fetching spare parts usage:", error);
		throw error;
	}
};

// Lấy danh sách phiếu sử dụng theo repair_detail_id
export const getSparePartsUsagesByRepairDetailId = async (repairDetailId) => {
	try {
		const response = await apiClient.get(`/spare-parts-usages/by-repair-detail/${repairDetailId}`);
		return response.data;
	} catch (error) {
		console.error("Error fetching spare parts usages by repair detail:", error);
		throw error;
	}
};

// Tạo phiếu sử dụng phụ tùng mới
export const createSparePartsUsage = async (data) => {
	try {
		const response = await apiClient.post("/spare-parts-usages", data);
		return response.data;
	} catch (error) {
		console.error("Error creating spare parts usage:", error);
		throw error;
	}
};

// Cập nhật phiếu sử dụng phụ tùng
export const updateSparePartsUsage = async (id, data) => {
	try {
		const response = await apiClient.put(`/spare-parts-usages/${id}`, data);
		return response.data;
	} catch (error) {
		console.error("Error updating spare parts usage:", error);
		throw error;
	}
};

// Xóa phiếu sử dụng phụ tùng
export const deleteSparePartsUsage = async (id) => {
	try {
		const response = await apiClient.delete(`/spare-parts-usages/${id}`);
		return response.data;
	} catch (error) {
		console.error("Error deleting spare parts usage:", error);
		throw error;
	}
};