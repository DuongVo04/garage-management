import { BrowserRouter as Router, Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import { AdminRoutes, UserRoutes } from "./routes";
import Login from "./pages/Login";
import HomePage from "./pages/showroom/HomePage"

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<HomePage />}/>
				<Route path="/login" element={<Login />} />
				{ AdminRoutes }
				{ UserRoutes }
			</Routes>
		</BrowserRouter>
	);
}

export default App;