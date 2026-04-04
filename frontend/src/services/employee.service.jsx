// frontend/services/employee.service.js
import apiClient from "./apiClient";

// ==================== EMPLOYEE ====================

export const getAllEmployees = async (isWorking = "all") => {
	const res = await apiClient.get("/employees", { params: { is_working: isWorking } });
	return res.data;
};

export const getEmployeeById = async (id) => {
	const res = await apiClient.get(`/employees/${id}`);
	return res.data;
};

export const createEmployee = async (data) => {
	const res = await apiClient.post("/employees", data);
	return res.data;
};

export const updateEmployee = async (id, data) => {
	const res = await apiClient.put(`/employees/${id}`, data);
	return res.data;
};

export const deleteEmployee = async (id) => {
	const res = await apiClient.delete(`/employees/${id}`);
	return res.data;
};