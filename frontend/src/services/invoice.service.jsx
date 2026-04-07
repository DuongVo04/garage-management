// frontend/services/invoice.service.js
import apiClient from "./apiClient";

export const getAllInvoices = async (params = {}) => {
	try {
		const res = await apiClient.get("/invoices", { params });
		return res.data;
	} catch (error) {
		console.error("getAllInvoices error:", error);
		throw error;
	}
};

export const getInvoiceById = async (id) => {
	try {
		// Đảm bảo URL đúng format
		const res = await apiClient.get(`/invoices/${id}`);
		return res.data;
	} catch (error) {
		console.error(`getInvoiceById error for id ${id}:`, error);
		throw error;
	}
};

export const createInvoice = async (data) => {
	try {
		const res = await apiClient.post("/invoices", data);
		return res.data;
	} catch (error) {
		console.error("createInvoice request data:", data);
		console.error("createInvoice response errors:", error.response?.data);
		throw error;
	}
};

export const updateInvoice = async (id, data) => {
	try {
		const res = await apiClient.put(`/invoices/${id}`, data);
		return res.data;
	} catch (error) {
		console.error(`updateInvoice error for id ${id}:`, error);
		throw error;
	}
};

export const deleteInvoice = async (id) => {
	try {
		const res = await apiClient.delete(`/invoices/${id}`);
		return res.data;
	} catch (error) {
		console.error(`deleteInvoice error for id ${id}:`, error);
		throw error;
	}
};