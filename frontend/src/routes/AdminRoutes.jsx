import { Route, Navigate } from 'react-router-dom';

import ProtectedRoute from '../components/routes/ProtectedRoute';
import RoleBasedRoute from '../components/routes/RoleBasedRoute';

import AdminLayout from '../layouts/AdminLayout';
import DashboardPage from '../pages/admin/DashboardPage'


const AdminRoutes = (
    <Route
        path="/admin"
        element={
            <ProtectedRoute>
                <RoleBasedRoute role="ADMIN">
                    <AdminLayout />
                </RoleBasedRoute>
            </ProtectedRoute>
        }
    >
        <Route index element={<Navigate to="dashboard" replace />} />

        <Route path="dashboard" element={<DashboardPage />} />
    </Route>
);
export default AdminRoutes;