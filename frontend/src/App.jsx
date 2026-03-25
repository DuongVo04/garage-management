import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import AdminPage from "./pages/admin/AdminPage";
import UserPage from "./pages/user/UserPage";
import Register from "./pages/Register";

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/login" element={<Login />} />
				<Route path="/admin" element={<AdminPage />} />
				<Route path="/user" element={<UserPage />} />
				<Route path="*" element={<Navigate to="/login" />} />
				<Route path="/register" element={<Register />} />
			</Routes>
		</Router>
	);
}

export default App;