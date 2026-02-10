import { memo } from 'react';

const PageSkeletonComponent = () => (
  <div className="flex flex-col min-h-dvh bg-gray-50" aria-label="Загрузка">
    <div className="
      flex items-center justify-between py-4 px-6 bg-white border-b
      border-gray-200
    ">
      <div className="w-32 h-6 rounded bg-gray-200" />
      <div className="w-48 h-8 rounded-lg bg-gray-200" />
    </div>
    <div className="flex-1 flex flex-col p-6">
      <div className="w-full h-10 mb-4 rounded-lg bg-gray-200" />
      <div className="flex-1 flex flex-col gap-3 p-4 bg-white rounded-xl">
        <div className="h-12 rounded bg-gray-200" />
        <div className="h-12 rounded bg-gray-200" />
        <div className="h-12 flex-1 min-h-[200px] rounded bg-gray-200" />
      </div>
    </div>
  </div>
);

export const PageSkeleton = memo(PageSkeletonComponent);
