import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Enforces both valid user token (`hasToken`) AND optional role checks (`requireRole`).
 * `requireRole` accepts either a string ('professional') or an array (['operator', 'admin']).
 */
export default function ProtectedRoute({ children, requireRole = null }) {
  const { hasToken, role } = useAuth();
  const location = useLocation();

  if (!hasToken) {
    return (
      <Navigate
        to="/auth/login"
        replace
        state={{ from: location.pathname + location.search }}
      />
    );
  }

  if (requireRole) {
    const allowedRoles = Array.isArray(requireRole) ? requireRole : [requireRole];
    if (!allowedRoles.includes(role)) {
      const fallback =
        role === 'admin' ? '/admin' : role === 'operator' ? '/operator' : '/dashboard';
      return <Navigate to={fallback} replace />;
    }
  }

  return children;
}
