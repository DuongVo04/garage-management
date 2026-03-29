import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Home from "../pages/Home";
import AdminLayout from "../layouts/AdminLayout";
import MainLayout from "../layouts/MainLayout";
import HomePage from "../pages/showroom/HomePage";
import GaragePage from "../pages/garage/GaragePage";
import VehicleDetailPage from "../pages/showroom/VehicleDetailPage";

export default function AppRoutes({ toggleTheme, mode }) {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/garage" element={<GaragePage />} />
        <Route path="/vehicle/:id" element={<VehicleDetailPage />} />
        {/* Có thể thêm các trang public khác ở đây như /about, /contact */}
      </Route>

      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Admin Routes */}
      <Route
        path="/home"
        element={<AdminLayout toggleTheme={toggleTheme} mode={mode} />}
      >
        <Route index element={<Home />} />
        <Route path="showroom" element={<HomePage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}