import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

// Wraps pages that require login. Optionally restricts to certain roles.
export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  // Wait until the localStorage check finishes before deciding.
  if (loading) {
    return null;
  }

  // Not logged in: send to login.
  if (!user) {
    return <Navigate to='/login' replace />;
  }

  // Logged in but wrong role: send to their own area (or a safe page).
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to='/' replace />;
  }

  // Passed all checks: show the page.
  return children;
}
