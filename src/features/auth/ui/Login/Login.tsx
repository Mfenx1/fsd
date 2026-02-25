'use client';

import { useEffect, useState, useRef } from 'react';
import { ROUTES, useRouterAdapter, LottieView } from '$shared';
import { useAuth } from '$features/auth';
import { LoginForm, LoginHeader } from './components';

const LOTTIE_BG = '/lottie/background.json';
const LOTTIE_SUCCESS = '/lottie/success.json';

export const Login = () => {
  const { token, isLoading } = useAuth();
  const router = useRouterAdapter();
  const navigate = router?.navigate ?? (() => {});
  const location = router?.location ?? { pathname: '/', state: undefined };
  const [showSuccess, setShowSuccess] = useState(false);
  const hasNavigatedRef = useRef(false);

  useEffect(() => {
    router?.prefetch(ROUTES.PRODUCTS);
  }, [router]);

  const doNavigate = () => {
    if (hasNavigatedRef.current) return;
    hasNavigatedRef.current = true;
    const from = location.state?.from?.pathname;
    navigate(from ?? ROUTES.PRODUCTS, { replace: true });
  };

  useEffect(() => {
    if (!isLoading && token && router && !hasNavigatedRef.current) {
      queueMicrotask(() => setShowSuccess(true));
      const fallbackTimer = setTimeout(doNavigate, 2500);
      return () => clearTimeout(fallbackTimer);
    }
  }, [token, isLoading, navigate, location.state, router]);

  const handleSuccessComplete = doNavigate;

  return (
    <div className="min-h-full flex items-center justify-center p-6 bg-gray-100 dark:bg-zinc-900 relative overflow-hidden">
      {}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.15]"
        aria-hidden
      >
        <LottieView
          src={LOTTIE_BG}
          loop
          width="100%"
          height="100%"
          style={{ minHeight: '100vh' }}
        />
      </div>

      {}
      {showSuccess && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm"
          role="alert"
          aria-live="polite"
        >
          <div className="w-48 h-48">
            <LottieView
              src={LOTTIE_SUCCESS}
              loop={false}
              onComplete={handleSuccessComplete}
              width="100%"
              height="100%"
            />
          </div>
        </div>
      )}

      <div id="main" className="relative z-10 w-full max-w-[28rem] p-10 bg-white dark:bg-zinc-800 rounded-2xl shadow-lg dark:shadow-zinc-950/50" role="main" tabIndex={-1}>
        <LoginHeader />
        <LoginForm />
      </div>
    </div>
  );
};