// frontend/services/repair-appointment.service.js
import apiClient from "./apiClient";

// ==================== REPAIR APPOINTMENT ====================

export const getAllRepairAppointments = async (params = {}) => {
	const response = await apiClient.get('/repair-appointments', { params });
	return response.data;
};

export const getRepairAppointmentById = async (id) => {
	const response = await apiClient.get(`/repair-appointments/${id}`);
	return response.data;
};

export const updateRepairAppointmentStatus = async (id, status) => {
	const response = await apiClient.patch(`/repair-appointments/${id}/status`, { status });
	return response.data;
};

export const deleteRepairAppointment = async (id) => {
	const response = await apiClient.delete(`/repair-appointments/${id}`);
	return response.data;
};

export const createRepairAppointment = async (data) => {
	const response = await apiClient.post("/repair-appointments", data);
	return response.data;
};