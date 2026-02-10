import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ErrorBoundary, PageSkeleton, ProtectedRoute } from '$components';
import { useAuthSync, useGlobalQueryErrorHandler } from '$store';
import { ROUTES } from '$constants';

const Login = lazy(() => import('$pages/Login'));
const Products = lazy(() => import('$pages/Products'));

export const App = () => {
  useAuthSync();
  useGlobalQueryErrorHandler();

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Suspense fallback={<PageSkeleton />}>
          <Routes>
            <Route path={ROUTES.LOGIN} element={<Login />} />
            <Route
              path={ROUTES.PRODUCTS}
              element={
                <ProtectedRoute>
                  <Products />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to={ROUTES.PRODUCTS} replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  );
};
