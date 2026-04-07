// frontend/services/spare-parts.service.jsx
import apiClient from "./apiClient";

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

// Cập nhật phụ tùng - Lấy thông tin hiện tại và cập nhật đầy đủ
export const updateSparePart = async (id, data) => {
	try {
		// Lấy thông tin spare part hiện tại
		const currentRes = await getSparePartById(id);

		if (!currentRes.success || !currentRes.data) {
			throw new Error("Cannot find spare part");
		}

		const currentPart = currentRes.data;

		// Tạo payload với đầy đủ thông tin
		const payload = {
			name: currentPart.name,
			quantity_in_stock: data.quantity_in_stock !== undefined ? data.quantity_in_stock : currentPart.quantity_in_stock,
			unit_price: parseFloat(currentPart.unit_price || 0),
			unit_of_measure: currentPart.unit_of_measure || 'cái'
		};

		console.log("Updating spare part payload:", payload);

		const response = await apiClient.put(`/spare-parts/${id}`, payload);
		return response.data;
	} catch (error) {
		console.error("Error updating spare part:", error);
		console.error("Response:", error.response?.data);
		throw error;
	}
};

// Các hàm khác giữ nguyên...
export const createSparePart = async (data) => {
	try {
		const response = await apiClient.post("/spare-parts", data);
		return response.data;
	} catch (error) {
		console.error("Error creating spare part:", error);
		throw error;
	}
};

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