import apiClient from "./apiClient.jsx";

export const getMyCustomerInfo = async () => {
    try {
        const response = await apiClient.get("/customers/me");
        return response.data;
    } catch (error) {
        console.error("Error fetching customer info:", error);
        return { success: false, message: error.response?.data?.message || "Error fetching customer info" };
    }
};

export const updateMyCustomerInfo = async (data) => {
    try {
        const response = await apiClient.put("/customers/me", data);
        return response.data;
    } catch (error) {
        console.error("Error updating customer info:", error);
        return { success: false, message: error.response?.data?.message || "Error updating customer info" };
    }
};

export const createCustomerInfo = async (data) => {
    try {
        const response = await apiClient.post("/customers", data);
        return response.data;
    } catch (error) {
        console.error("Error creating customer info:", error);
        return { success: false, message: error.response?.data?.message || "Error creating customer info" };
    }
};
