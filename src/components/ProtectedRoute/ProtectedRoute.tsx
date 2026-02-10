import { Navigate, useLocation } from 'react-router-dom';
import { PageSkeleton } from '$components';
import { useAuth } from '$store';
import { ROUTES } from '$constants';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { token, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <PageSkeleton />;
  }

  if (!token) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
