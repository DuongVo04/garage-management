import {
	createContext,
	useContext,
	useState,
	useEffect
} from 'react';
import { decodeToken } from '../utils/jwt';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [accessToken, setAccessToken] = useState(
		localStorage.getItem("token") || null
	);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (accessToken) {
			const decoded = decodeToken(accessToken);
			setUser(decoded);
		} else {
			setUser(null);
		}
		setLoading(false);
	}, [accessToken]);

	const login = (token) => {
		setAccessToken(token);
		const decoded = decodeToken(token);
		setUser(decoded);
		localStorage.setItem("token", token);
	};

	const logout = () => {
		setAccessToken(null);
		setUser(null);
		localStorage.removeItem("token");
	};

	return (
		<AuthContext.Provider value={{ user, setUser, accessToken, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	return useContext(AuthContext);
};