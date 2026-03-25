import React from 'react';
import { Route } from 'react-router-dom';

import ProtectedRoute from '../components/routes/ProtectedRoute';
import RoleBasedRoute from '../components/routes/RoleBasedRoute';

import LoginPage from '../pages/user/LoginPage';
import HomePage from '../pages/user/HomePage';
import ProfilePage from '../pages/user/ProfilePage';

const withUserProtection = (Component) => (
	<ProtectedRoute>
		<RoleBasedRoute role="USER">
			<Component />
		</RoleBasedRoute>
	</ProtectedRoute>
);

const authRoutes = [
	<Route key="login" path="/login" element={<LoginPage />} />,
];

const userRoutes = [
	<Route key="home" path="/" element={<HomePage />} />,
	<Route
		key="profile"
		path="/profile"
		element={withUserProtection(ProfilePage)}
	/>,
];

export { authRoutes };
export default userRoutes;