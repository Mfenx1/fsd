import { memo } from 'react';

const LoadMoreProgressComponent = () => (
  <div className="
    sticky bottom-0 left-0 right-0 h-0.5 bg-zinc-200 dark:bg-zinc-600 overflow-hidden z-[2]
  ">
    <div className="h-full w-2/5 bg-indigo-500 animate-pulse" />
  </div>
);

export const LoadMoreProgress = memo(LoadMoreProgressComponent);