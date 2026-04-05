import { Route, Navigate } from 'react-router-dom';

import ProtectedRoute from '../components/routes/ProtectedRoute';
import RoleBasedRoute from '../components/routes/RoleBasedRoute';

import AdminLayout from '../layouts/AdminLayout';
import DashboardPage from '../pages/admin/DashboardPage'
import ShowroomPage from '../pages/admin/Showroompage';
import AppointmentsPage from '../pages/admin/AppointmentsPage';


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
		<Route index element={<Navigate to="Xe và showroom" replace />} />
		<Route path="carandshowroom" element={<ShowroomPage />} />
		<Route path="appointments" element={<AppointmentsPage />} />
	</Route>
);
export default AdminRoutes;