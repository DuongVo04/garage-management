
import apiClient from "./apiClient";

// ==================== ADMIN ====================

// Lấy tổng doanh thu
export const getTotalRevenue = async () => {
	const res = await apiClient.get("/admin/revenue/total-cost");
	return res.data;
};

// Cập nhật trạng thái tài khoản
export const updateUserAccountStatus = async (id, data) => {
	const res = await apiClient.patch(`/admin/accounts/${id}/change-status`, data);
	return res.data;
};