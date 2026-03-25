import axios from "axios";

const API = import.meta.env.VITE_API_URL;

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

		// Nếu token hết hạn (BE trả TOKEN_EXPIRED)
		if (
			error.response?.data?.error === "TOKEN_EXPIRED" &&
			!originalRequest._retry
		) {
			originalRequest._retry = true;

			try {
				const res = await axios.post(
					`${API}/refresh-token`,
					{},
					{ withCredentials: true }
				);

				const newToken = res.data.data;

				// lưu token mới
				localStorage.setItem("token", newToken);

				// gắn lại token cho request cũ
				originalRequest.headers.Authorization = `Bearer ${newToken}`;

				return apiClient(originalRequest);
			} catch (err) {
				// refresh fail → logout
				localStorage.removeItem("token");
				window.location.href = "/login";
			}
		}

		return Promise.reject(error);
	}
);

export default apiClient;