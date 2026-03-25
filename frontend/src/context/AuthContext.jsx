import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [accessToken, setAccessToken] = useState(
		localStorage.getItem("token") || null
	);

	const login = (token) => {
		setAccessToken(token);
		localStorage.setItem("token", token);
	};

	const logout = () => {
		setAccessToken(null);
		localStorage.removeItem("token");
	};

	return (
		<AuthContext.Provider value={{ user, setUser, accessToken, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};