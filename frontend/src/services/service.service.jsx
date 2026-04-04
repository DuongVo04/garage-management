// src/services/service.service.js
import apiClient from "./apiClient";

// ==================== SERVICE ====================

export const getAllServices = async (type = "all") => {
	try {
		const response = await apiClient.get("/services", {
			params: { type }
		});
		return response.data;
	} catch (error) {
		console.error("Error fetching services:", error);
		throw error;
	}
};

export const getServiceById = async (id) => {
	try {
		const response = await apiClient.get(`/services/${id}`);
		return response.data;
	} catch (error) {
		console.error("Error fetching service by ID:", error);
		throw error;
	}
};

export const createService = async (data) => {
	try {
		const response = await apiClient.post("/services", data);
		return response.data;
	} catch (error) {
		console.error("Error creating service:", error);
		throw error;
	}
};

export const updateService = async (id, data) => {
	try {
		const response = await apiClient.put(`/services/${id}`, data);
		return response.data;
	} catch (error) {
		console.error("Error updating service:", error);
		throw error;
	}
};

export const deleteService = async (id) => {
	try {
		const response = await apiClient.delete(`/services/${id}`);
		return response.data;
	} catch (error) {
		console.error("Error deleting service:", error);
		throw error;
	}
};