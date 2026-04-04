import apiClient from "./apiClient";

// ==================== BRAND ====================

export const getAllBrands = async () => {
	const res = await apiClient.get("/brands");
	return res.data;
};

export const getBrandById = async (id) => {
	const res = await apiClient.get(`/brands/${id}`);
	return res.data;
};

export const createBrand = async (formData) => {
	const res = await apiClient.post("/brands", formData, {
		headers: { "Content-Type": "multipart/form-data" },
	});
	return res.data;
};

export const updateBrand = async (id, formData) => {
	const res = await apiClient.put(`/brands/${id}`, formData, {
		headers: { "Content-Type": "multipart/form-data" },
	});
	return res.data;
};

export const deleteBrand = async (id) => {
	const res = await apiClient.delete(`/brands/${id}`);
	return res.data;
};