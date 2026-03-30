import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const RoleBasedRoute = ({ children, role }) => {
    const { user, loading } = useAuth();


    if (loading) return null

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (user.role_name !== role) {
        return <Navigate to="/" />;
    }

    return children;
};

export default RoleBasedRoute;