import React from 'react';
import { Route } from 'react-router-dom';

import ProtectedRoute from '../components/routes/ProtectedRoute';
import RoleBasedRoute from '../components/routes/RoleBasedRoute';

import UserPage from '../pages/user/UserPage';
import UserAppointmentsPage from '../pages/user/UserAppointmentsPage';


const UserRoutes = (
    <Route
        path="/user"
        element={
            <ProtectedRoute>
                <RoleBasedRoute role="CUSTOMER">
                    <UserPage />
                </RoleBasedRoute>
            </ProtectedRoute>
        }
    >
        <Route path="appointments" element={<UserAppointmentsPage />} />
    </Route>
);

export default UserRoutes;