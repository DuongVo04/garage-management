import React, { useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import AppRoutes from "./routes/AppRoutes";
import { getTheme } from "./theme";

function App() {
	const [mode, setMode] = useState("light");
	const toggleTheme = () => setMode((m) => (m === "light" ? "dark" : "light"));

	const theme = getTheme(mode);

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<BrowserRouter>
				<AppRoutes mode={mode} toggleTheme={toggleTheme} />
			</BrowserRouter>
		</ThemeProvider>
	);
}

export default App;