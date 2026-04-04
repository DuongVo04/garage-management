import apiClient from "./apiClient";

// ==================== SPARE PARTS ====================

// Lấy danh sách tất cả phụ tùng
export const getAllSpareParts = async () => {
	try {
		const response = await apiClient.get("/spare-parts");
		return response.data;
	} catch (error) {
		console.error("Error fetching spare parts:", error);
		throw error;
	}
};

// Lấy phụ tùng theo ID
export const getSparePartById = async (id) => {
	try {
		const response = await apiClient.get(`/spare-parts/${id}`);
		return response.data;
	} catch (error) {
		console.error("Error fetching spare part by ID:", error);
		throw error;
	}
};

// Tạo phụ tùng mới
export const createSparePart = async (data) => {
	try {
		const response = await apiClient.post("/spare-parts", data);
		return response.data;
	} catch (error) {
		console.error("Error creating spare part:", error);
		throw error;
	}
};

// Cập nhật phụ tùng
export const updateSparePart = async (id, data) => {
	try {
		const response = await apiClient.put(`/spare-parts/${id}`, data);
		return response.data;
	} catch (error) {
		console.error("Error updating spare part:", error);
		throw error;
	}
};

// Xóa phụ tùng
export const deleteSparePart = async (id) => {
	try {
		const response = await apiClient.delete(`/spare-parts/${id}`);
		return response.data;
	} catch (error) {
		console.error("Error deleting spare part:", error);
		throw error;
	}
};

// Upload ảnh cho phụ tùng
export const uploadSparePartImage = async (id, file) => {
	try {
		const formData = new FormData();
		formData.append("image", file);
		const response = await apiClient.post(`/spare-parts/${id}/image`, formData, {
			headers: { "Content-Type": "multipart/form-data" }
		});
		return response.data;
	} catch (error) {
		console.error("Error uploading spare part image:", error);
		throw error;
	}
};

// ==================== SPARE PARTS USAGE ====================

// Lấy lịch sử sử dụng phụ tùng
export const getSparePartsUsage = async (sparePartId) => {
	try {
		const response = await apiClient.get(`/spare-parts/${sparePartId}/usage`);
		return response.data;
	} catch (error) {
		console.error("Error fetching spare parts usage:", error);
		throw error;
	}
};

// Tạo phiếu sử dụng phụ tùng
export const createSparePartsUsage = async (data) => {
	try {
		const response = await apiClient.post("/spare-parts-usage", data);
		return response.data;
	} catch (error) {
		console.error("Error creating spare parts usage:", error);
		throw error;
	}
};