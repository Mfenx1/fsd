import { memo } from 'react';

const LoadMoreProgressComponent = () => (
  <div className="
    sticky bottom-0 left-0 right-0 h-1 bg-gray-200 overflow-hidden z-[2]
  ">
    <div className="h-full w-2/5 bg-blue-600" />
  </div>
);

export const LoadMoreProgress = memo(LoadMoreProgressComponent);
