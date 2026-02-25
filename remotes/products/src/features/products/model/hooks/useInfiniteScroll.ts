import { useEffect, useRef } from 'react';
import { useLatest, throttle } from '$shared';

const SCROLL_THRESHOLD = 100;
const THROTTLE_MS = 80;

export const useInfiniteScroll = (
  onLoadMore: () => void,
  hasMore: boolean,
  loadingMore: boolean
) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const onLoadMoreRef = useLatest(onLoadMore);
  const hasMoreRef = useLatest(hasMore);
  const loadingMoreRef = useLatest(loadingMore);

  useEffect(() => {
    const element = scrollContainerRef.current;
    if (!element) return;

    const handleScroll = throttle(() => {
      const el = scrollContainerRef.current;
      if (!el || !onLoadMoreRef.current || !hasMoreRef.current || loadingMoreRef.current)
        return;
      const { scrollTop, scrollHeight, clientHeight } = el;
      if (scrollHeight - scrollTop - clientHeight < SCROLL_THRESHOLD)
        onLoadMoreRef.current();
    }, THROTTLE_MS);
    element.addEventListener('scroll', handleScroll);

    return () => element.removeEventListener('scroll', handleScroll);
  }, [onLoadMoreRef, hasMoreRef, loadingMoreRef]);

  return scrollContainerRef;
};