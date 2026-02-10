import { lazy, Suspense } from 'react';

const ReactQueryDevtools = lazy(() =>
  import('@tanstack/react-query-devtools').then((m) => ({ default: m.ReactQueryDevtools }))
);

export const QueryDevtools = () => (
  <Suspense fallback={null}>
    <ReactQueryDevtools buttonPosition="bottom-right" initialIsOpen={false} />
  </Suspense>
);
