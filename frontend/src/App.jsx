import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { AdminRoutes, UserRoutes, PublicRoutes } from "./routes";
import { getTheme } from "./theme";
import { AuthProvider } from "./context/AuthContext";
import NotFound from "./components/NoutFound";

function App() {
	const [mode, setMode] = useState("light");
	const toggleTheme = () => setMode((m) => (m === "light" ? "dark" : "light"));

	const theme = getTheme(mode);

	return (
		<AuthProvider>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<BrowserRouter >
					<Routes>
						{PublicRoutes}
						{UserRoutes}
						{AdminRoutes}
						<Route path="*" element={<NotFound />} />
					</Routes>

				</BrowserRouter>
			</ThemeProvider>

		</AuthProvider>

	);
}

export default App;