import apiClient from './apiClient';

const API_URL = '/employee-types';

export const getEmployeeTypes = async (params = {}) => {
  const response = await apiClient.get(API_URL, { params });
  return response.data;
};

export const getEmployeeTypeById = async (id) => {
  const response = await apiClient.get(`${API_URL}/${id}`);
  return response.data;
};

export const createEmployeeType = async (data) => {
  const response = await apiClient.post(API_URL, data);
  return response.data;
};

export const updateEmployeeType = async (id, data) => {
  const response = await apiClient.put(`${API_URL}/${id}`, data);
  return response.data;
};

export const deleteEmployeeType = async (id) => {
  const response = await apiClient.delete(`${API_URL}/${id}`);
  return response.data;
};