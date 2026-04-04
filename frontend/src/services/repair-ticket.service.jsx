// frontend/services/repair-ticket.service.js
import apiClient from "./apiClient";

// ==================== REPAIR TICKET ====================

export const getAllRepairTickets = async (params = {}) => {
	const res = await apiClient.get("/repair-tickets", { params });
	return res.data;
};

export const getRepairTicketById = async (id) => {
	const res = await apiClient.get(`/repair-tickets/${id}`);
	return res.data;
};

export const createRepairTicket = async (data) => {
	const res = await apiClient.post("/repair-tickets", data);
	return res.data;
};

export const updateRepairTicket = async (id, data) => {
	const res = await apiClient.put(`/repair-tickets/${id}`, data);
	return res.data;
};

export const deleteRepairTicket = async (id) => {
	const res = await apiClient.delete(`/repair-tickets/${id}`);
	return res.data;
};

export const completeRepairTicket = async (id) => {
	const res = await apiClient.patch(`/repair-tickets/${id}/complete`);
	return res.data;
};

export const getRepairTicketsByVehicle = async (vehicleId) => {
	const res = await apiClient.get(`/repair-tickets/vehicle/${vehicleId}`);
	return res.data;
};