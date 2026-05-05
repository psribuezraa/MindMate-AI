import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Wraps routes that require the user to be logged in.
 * If not authenticated → redirect to /login.
 * If authenticated → render the child route normally.
 */
export default function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
