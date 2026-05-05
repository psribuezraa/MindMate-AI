import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Wraps public-only routes (login, register, forgot-password).
 * If authenticated → redirect to / (dashboard).
 * If not authenticated → render the child route normally.
 */
export default function PublicRoute() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
}
