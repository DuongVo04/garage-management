import apiClient from "./apiClient";

// ==================== SHOWROOM VEHICLE ====================

export const getAllShowroomVehicles = async () => {
	const res = await apiClient.get("/showroom-vehicles");
	return res.data;
};

export const getShowroomVehicleById = async (id) => {
	const res = await apiClient.get(`/showroom-vehicles/${id}`);
	return res.data;
};

export const createShowroomVehicle = async (formData) => {
	const res = await apiClient.post("/showroom-vehicles", formData, {
		headers: { "Content-Type": "multipart/form-data" },
	});
	return res.data;
};

export const updateShowroomVehicle = async (id, formData) => {
	const res = await apiClient.put(`/showroom-vehicles/${id}`, formData, {
		headers: { "Content-Type": "multipart/form-data" },
	});
	return res.data;
};

export const deleteShowroomVehicle = async (id) => {
	const res = await apiClient.delete(`/showroom-vehicles/${id}`);
	return res.data;
};

// ==================== SHOWROOM VEHICLE IMAGES ====================

export const uploadVehicleImages = async (showroomVehicleId, files) => {
	const formData = new FormData();
	files.forEach((file) => formData.append("images", file));

	const res = await apiClient.post(
		`/showroom-vehicles/${showroomVehicleId}/images`,
		formData,
		{ headers: { "Content-Type": "multipart/form-data" } }
	);
	return res.data;
};

export const deleteVehicleImage = async (showroomVehicleId, imageId) => {
	const res = await apiClient.delete(
		`/showroom-vehicles/${showroomVehicleId}/images/${imageId}`
	);
	return res.data;
};

// ==================== VEHICLE SPECIFICATIONS ====================

// --- Engine ---
export const createEngineSpec = async (showroomVehicleId, data) => {
	const res = await apiClient.post(`/showroom-vehicles/${showroomVehicleId}/engine`, data);
	return res.data;
};

export const updateEngineSpec = async (showroomVehicleId, data) => {
	const res = await apiClient.put(`/showroom-vehicles/${showroomVehicleId}/engine`, data);
	return res.data;
};

export const deleteEngineSpec = async (showroomVehicleId) => {
	const res = await apiClient.delete(`/showroom-vehicles/${showroomVehicleId}/engine`);
	return res.data;
};

// --- Fuel ---
export const createFuelSpec = async (showroomVehicleId, data) => {
	const res = await apiClient.post(`/showroom-vehicles/${showroomVehicleId}/fuel`, data);
	return res.data;
};

export const updateFuelSpec = async (showroomVehicleId, data) => {
	const res = await apiClient.put(`/showroom-vehicles/${showroomVehicleId}/fuel`, data);
	return res.data;
};

export const deleteFuelSpec = async (showroomVehicleId) => {
	const res = await apiClient.delete(`/showroom-vehicles/${showroomVehicleId}/fuel`);
	return res.data;
};

// --- Steering ---
export const createSteeringSpec = async (showroomVehicleId, data) => {
	const res = await apiClient.post(`/showroom-vehicles/${showroomVehicleId}/steering`, data);
	return res.data;
};

export const updateSteeringSpec = async (showroomVehicleId, data) => {
	const res = await apiClient.put(`/showroom-vehicles/${showroomVehicleId}/steering`, data);
	return res.data;
};

export const deleteSteeringSpec = async (showroomVehicleId) => {
	const res = await apiClient.delete(`/showroom-vehicles/${showroomVehicleId}/steering`);
	return res.data;
};

// --- Size ---
export const createSizeSpec = async (showroomVehicleId, data) => {
	const res = await apiClient.post(`/showroom-vehicles/${showroomVehicleId}/size`, data);
	return res.data;
};

export const updateSizeSpec = async (showroomVehicleId, data) => {
	const res = await apiClient.put(`/showroom-vehicles/${showroomVehicleId}/size`, data);
	return res.data;
};

export const deleteSizeSpec = async (showroomVehicleId) => {
	const res = await apiClient.delete(`/showroom-vehicles/${showroomVehicleId}/size`);
	return res.data;
};

// --- Interior ---
export const createInteriorSpec = async (showroomVehicleId, data) => {
	const res = await apiClient.post(`/showroom-vehicles/${showroomVehicleId}/interior`, data);
	return res.data;
};

export const updateInteriorSpec = async (showroomVehicleId, data) => {
	const res = await apiClient.put(`/showroom-vehicles/${showroomVehicleId}/interior`, data);
	return res.data;
};

export const deleteInteriorSpec = async (showroomVehicleId) => {
	const res = await apiClient.delete(`/showroom-vehicles/${showroomVehicleId}/interior`);
	return res.data;
};