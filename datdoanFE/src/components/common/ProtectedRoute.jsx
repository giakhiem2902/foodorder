import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) return <div>Đang tải...</div>;
  if (!user || !isAdmin()) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;