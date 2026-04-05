import React from 'react';
import { Route } from 'react-router-dom';

import ProtectedRoute from '../components/routes/ProtectedRoute';
import RoleBasedRoute from '../components/routes/RoleBasedRoute';

import MainLayout from "../layouts/MainLayout"
import ProfilePage from '../pages/user/ProfileManagement/ProfilePage';


const UserRoutes = (
    <Route
        path="/user"
        element={
            <ProtectedRoute>
                <RoleBasedRoute role="CUSTOMER">
                    <MainLayout />
                </RoleBasedRoute>
            </ProtectedRoute>
        }
    >
        <Route path="my-info" element={<ProfilePage />} />
    </Route>
);

export default UserRoutes;