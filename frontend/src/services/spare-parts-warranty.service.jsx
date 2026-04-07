import apiClient from "./apiClient";

// ==================== SPARE PARTS WARRANTY ====================

// Lấy tất cả phiếu bảo hành
export const getAllSparePartsWarranties = async (params = {}) => {
	try {
		const response = await apiClient.get("/spare-parts-warranties", { params });
		return response.data;
	} catch (error) {
		console.error("Error fetching spare parts warranties:", error);
		throw error;
	}
};

// Lấy phiếu bảo hành theo usage_id
export const getSparePartsWarrantyByUsageId = async (usageId) => {
	try {
		const response = await apiClient.get(`/spare-parts-warranties/${usageId}`);
		return response.data;
	} catch (error) {
		console.error("Error fetching spare parts warranty:", error);
		throw error;
	}
};

// Tạo phiếu bảo hành
export const createSparePartsWarranty = async (data) => {
	try {
		const { usage_id, ...rest } = data;
		const response = await apiClient.post(`/spare-parts-warranties/${usage_id}`, rest);
		return response.data;
	} catch (error) {
		console.error("Error creating spare parts warranty:", error);
		throw error;
	}
};

// Cập nhật phiếu bảo hành
export const updateSparePartsWarranty = async (usageId, data) => {
	try {
		const response = await apiClient.put(`/spare-parts-warranties/${usageId}`, data);
		return response.data;
	} catch (error) {
		console.error("Error updating spare parts warranty:", error);
		throw error;
	}
};

// Xóa phiếu bảo hành
export const deleteSparePartsWarranty = async (usageId) => {
	try {
		const response = await apiClient.delete(`/spare-parts-warranties/${usageId}`);
		return response.data;
	} catch (error) {
		console.error("Error deleting spare parts warranty:", error);
		throw error;
	}
};