'use client';

import dynamic from 'next/dynamic';
import { PageSuspense } from '../PageSuspense';
import { ProtectedRoute } from '$features';
import { ProductsLoaderSkeleton } from '$widgets';

const ProductsRemoteLoaderDynamic = dynamic(
  () =>
    import('$widgets/remote-loader').then((m) => ({
      default: m.ProductsRemoteLoader,
    })),
  { loading: () => <ProductsLoaderSkeleton /> }
);

const HomeClient = () => (
  <PageSuspense>
    <ProtectedRoute>
      <div className="flex flex-col h-full min-h-0 py-6 bg-gray-100 dark:bg-zinc-900">
        <ProductsRemoteLoaderDynamic />
      </div>
    </ProtectedRoute>
  </PageSuspense>
);

export default HomeClient;