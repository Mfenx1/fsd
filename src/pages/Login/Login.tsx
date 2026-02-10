import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '$constants';
import { useAuth } from '$store';
import { LoginForm, LoginHeader } from './components';

export const Login = () => {
  const { token, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && token) {
      const from = (location.state as { from?: { pathname: string } })?.from?.pathname;

      navigate(from ?? ROUTES.PRODUCTS, { replace: true });
    }
  }, [token, isLoading, navigate, location.state]);

  return (
    <div className="min-h-full flex items-center justify-center p-6 bg-gray-100">
      <div className="w-full max-w-[28rem] p-10 bg-white rounded-2xl shadow-lg">
        <LoginHeader />
        <LoginForm />
      </div>
    </div>
  );
};
