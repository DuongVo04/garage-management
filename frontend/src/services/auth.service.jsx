import apiClient from "./apiClient";

// ✅ LOGIN
export const loginApi = async (data) => {
	const res = await apiClient.post("/auth/login", data);
	return res.data;
};

//  LOGOUT
export const logoutApi = async () => {
	const res = await apiClient.post("/logout");
	return res.data;
};

// REFRESH TOKEN (ít khi gọi tay)
export const refreshTokenApi = async () => {
	const res = await apiClient.post("/refresh-token");
	return res.data;
};

// Reg
export const registerApi = async (data) => {
	const res = await apiClient.post("/accounts", data);
	return res.data;
};