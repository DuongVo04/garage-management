// customerVehicle.jsx
import apiClient from "./apiClient";

const customerVehicleService = {

    getById: async (id) => {
        try {
            const response = await apiClient.get(`/customer-vehicles/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    create: async (vehicleData, imageFile = null) => {
        try {
            const formData = new FormData();

            // Thêm dữ liệu xe vào formData
            Object.keys(vehicleData).forEach(key => {
                if (vehicleData[key] !== null && vehicleData[key] !== undefined) {
                    if (typeof vehicleData[key] === 'object') {
                        formData.append(key, JSON.stringify(vehicleData[key]));
                    } else {
                        formData.append(key, vehicleData[key]);
                    }
                }
            });

            // Thêm file ảnh nếu có
            if (imageFile) {
                formData.append("image", imageFile);
            }

            const response = await apiClient.post("/customer-vehicles", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    update: async (id, vehicleData, imageFile = null) => {
        try {
            const formData = new FormData();

            // Thêm dữ liệu xe vào formData
            Object.keys(vehicleData).forEach(key => {
                if (vehicleData[key] !== null && vehicleData[key] !== undefined) {
                    if (typeof vehicleData[key] === 'object') {
                        formData.append(key, JSON.stringify(vehicleData[key]));
                    } else {
                        formData.append(key, vehicleData[key]);
                    }
                }
            });

            if (imageFile) {
                formData.append("image", imageFile);
            }

            const response = await apiClient.put(`/customer-vehicles/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    delete: async (id) => {
        try {
            const response = await apiClient.delete(`/customer-vehicles/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};


export default customerVehicleService;