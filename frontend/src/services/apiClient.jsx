import axios from "axios";

const API = import.meta.env.VITE_API_BASE_URL;

const apiClient = axios.create({
	baseURL: API,
	withCredentials: true // để gửi cookie refreshToken
});

// 👉 Request interceptor (gắn accessToken)
apiClient.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("token");

		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}

		return config;
	},
	(error) => Promise.reject(error)
);

// 👉 Response interceptor (auto refresh token nếu hết hạn)
apiClient.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;

		// Nếu lỗi 401 (Unauthorized)
		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			try {
				// Thử refresh token
				const res = await axios.post(
					`${API}/auth/refresh-token`,
					{},
					{ withCredentials: true }
				);

				const newToken = res.data.data;
				localStorage.setItem("token", newToken);
				originalRequest.headers.Authorization = `Bearer ${newToken}`;

				return apiClient(originalRequest);
			} catch (refreshError) {
				// Nếu refresh cũng fail -> buộc logout
				localStorage.removeItem("token");
				if (!window.location.pathname.includes("/login")) {
					window.location.href = "/login";
				}
			}
		}

		return Promise.reject(error);
	}
);

export default apiClient;