import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Home from "../pages/Home";
import AdminLayout from "../layouts/AdminLayout";

export default function AppRoutes({ toggleTheme, mode }) {
  return (
    <Routes>
      {/* Default → login */}
      <Route path="/" element={<Navigate to="/login" />} />

      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Admin (KHÔNG PROTECT) */}
      <Route
        path="/home"
        element={<AdminLayout toggleTheme={toggleTheme} mode={mode} />}
      >
        <Route index element={<Home />} />
      </Route>
    </Routes>
  );
}