import apiClient from "./apiClient";

// 👉 Lấy danh sách nhân viên (có thể truyền query: page, limit,...)
export const getEmployees = async (params = {}) => {
    const res = await apiClient.get("/employees", { params });
    return res.data;
};

// 👉 Lấy chi tiết 1 nhân viên
export const getEmployeeById = async (id) => {
    const res = await apiClient.get(`/employees/${id}`);
    return res.data;
};

// 👉 Tạo nhân viên
export const createEmployee = async (data) => {
    const res = await apiClient.post("/employees", data);
    return res.data;
};

// 👉 Cập nhật nhân viên
export const updateEmployee = async (id, data) => {
    const res = await apiClient.put(`/employees/${id}`, data);
    return res.data;
};

// 👉 Xóa nhân viên
export const deleteEmployee = async (id) => {
    const res = await apiClient.delete(`/employees/${id}`);
    return res.data;
};