import axios from "axios";

const API = import.meta.env.VITE_API_BASE_URL;

const apiClient = axios.create({
	baseURL: API,
	withCredentials: true
});

let refreshPromise = null;

const refreshAccessToken = async () => {
	const res = await axios.post(
		`${API}/auth/refresh-token`,
		{},
		{ withCredentials: true }
	);

	const newToken = res.data?.data;
	if (!newToken) throw new Error("No token in refresh response");

	localStorage.setItem("token", newToken);
	return newToken;
};
// ─────────────────────────────────────────────────────────────────────────────

// Request interceptor — attach access token
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

// Response interceptor — auto-refresh on 401, serialised via singleton
apiClient.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;
		const status = error.response?.status;

		if (status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			try {
				// All concurrent 401s share ONE refresh call
				if (!refreshPromise) {
					refreshPromise = refreshAccessToken().finally(() => {
						refreshPromise = null;
					});
				}

				const newToken = await refreshPromise;

				// Let the request interceptor attach the token on retry
				originalRequest.headers.Authorization = `Bearer ${newToken}`;

				// Retry through apiClient so interceptors run normally
				return apiClient(originalRequest);
			} catch (refreshError) {
				localStorage.removeItem("token");
				window.location.href = "/login";
				return Promise.reject(refreshError);
			}
		}

		return Promise.reject(error);
	}
);

export default apiClient;