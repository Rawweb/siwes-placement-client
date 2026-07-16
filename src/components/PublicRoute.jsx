import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

// Wraps pages meant for logged-OUT users, like login and register.
// A logged-in user hitting these is bounced to their dashboard.
export default function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  // Already logged in: send to the right dashboard by role.
  if (user) {
    if (user.role === 'student') return <Navigate to='/student/browse' replace />;
    if (user.role === 'employer') return <Navigate to='/employer/dashboard' replace />;
    if (user.role === 'coordinator') return <Navigate to='/coordinator/overview' replace />;
  }

  // Not logged in: show the public page.
  return children;
}
