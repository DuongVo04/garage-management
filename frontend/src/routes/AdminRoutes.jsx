import { Route, Navigate } from 'react-router-dom';

import ProtectedRoute from '../components/routes/ProtectedRoute';
import RoleBasedRoute from '../components/routes/RoleBasedRoute';

import AdminLayout from '../layouts/AdminLayout';
import DashboardPage from '../pages/admin/DashboardPage'
import ShowroomPage from '../pages/admin/Showroompage';
import EmployeePage from '../pages/admin/EmployeePage'
import RepairAppointmentsPage from '../pages/admin/RepairAppointmentsPage'


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
		<Route path="carandshowroom" element={<ShowroomPage />} />
		<Route path="employees" element={<EmployeePage />} />
		<Route path="repair-appointments" element={<RepairAppointmentsPage />} />
	</Route>
);
export default AdminRoutes;