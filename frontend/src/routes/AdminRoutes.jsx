import React from 'react';
import { Route } from 'react-router-dom';

import ProtectedRoute from '../components/routes/ProtectedRoute';
import RoleBasedRoute from '../components/routes/RoleBasedRoute';

import AdminPage from '../pages/admin/AdminPage';


const AdminRoutes = (
    <Route
        path="/admin"
        element={
            <ProtectedRoute>
                <RoleBasedRoute role="ADMIN">
                    <AdminPage />
                </RoleBasedRoute>
            </ProtectedRoute>
        }
    >
        {/* <Route path="dashboard" element={<DashboardPage />} /> */}
    </Route>
);

export default AdminRoutes;