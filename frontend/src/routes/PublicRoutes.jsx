import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import MainLayout from "../layouts/MainLayout";
import HomePage from "../pages/showroom/HomePage";
import GaragePage from "../pages/garage/GaragePage";
import BookingPage from "../pages/garage/BookingPage";
import VehicleDetailPage from "../pages/showroom/VehicleDetailPage";
import ContactPage from "../pages/Contact";


const PublicRoutes = (
    <Route path="/" element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/garage" element={<GaragePage />} />
        <Route path="/booking/:serviceId" element={<BookingPage />} />
        <Route path="/vehicle/:id" element={<VehicleDetailPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/contact" element={<ContactPage />} />
    </Route>
);

export default PublicRoutes;