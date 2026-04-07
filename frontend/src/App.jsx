import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AdminRoutes, UserRoutes, PublicRoutes } from "./routes";
import { AuthProvider } from "./context/AuthContext";
import { ThemeModeProvider } from "./context/ThemeContext";
import NotFound from "./components/NoutFound";

function App() {
    return (
        <AuthProvider>
            <ThemeModeProvider>
                <BrowserRouter>
                    <Routes>
                        {PublicRoutes}
                        {UserRoutes}
                        {AdminRoutes}
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </BrowserRouter>
            </ThemeModeProvider>
        </AuthProvider>
    );
}

export default App;
