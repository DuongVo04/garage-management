import React from 'react';
import { Route } from 'react-router-dom';

import ProtectedRoute from '../components/routes/ProtectedRoute';
import RoleBasedRoute from '../components/routes/RoleBasedRoute';

import UserPage from '../pages/user/UserPage';


const UserRoutes = (
    <Route
        path="/user"
        element={
            <ProtectedRoute>
                <RoleBasedRoute role="USER">
                    <UserPage />
                </RoleBasedRoute>
            </ProtectedRoute>
        }
    >
        {/* <Route path="dashboard" element={<DashboardPage />} /> */}
    </Route>
);

export default UserRoutes;