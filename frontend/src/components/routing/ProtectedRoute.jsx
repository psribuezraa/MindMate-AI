import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Wraps routes that require the user to be logged in.
 * If not authenticated → redirect to /.
 * If authenticated but survey not completed → redirect to /onboarding.
 * If authenticated & survey done → render the child route normally.
 */
export default function ProtectedRoute() {
  const { isAuthenticated, hasCompletedSurvey } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // If user hasn't completed the survey and is NOT already on /onboarding, redirect
  if (!hasCompletedSurvey && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  return <Outlet />;
}
