import apiClient from './apiClient';

export const getAllAppointments = async (params = {}) => {
  const response = await apiClient.get('/car-review-appointments', { params });
  return response.data;
};

export const getMyAppointments = async () => {
  const response = await apiClient.get('/car-review-appointments/me');
  return response.data;
};

export const getAppointmentsByPhoneNumber = async (phoneNumber) => {
  const response = await apiClient.get(`/car-review-appointments/phone-number/${phoneNumber}`);
  return response.data;
};

export const updateAppointmentStatus = async (id, status) => {
  const response = await apiClient.patch(`/car-review-appointments/${id}`, { status });
  return response.data;
};

export const deleteAppointment = async (id) => {
  const response = await apiClient.delete(`/car-review-appointments/${id}`);
  return response.data;
};
