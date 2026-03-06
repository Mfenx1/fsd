'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export type ErrorTooltipPlacement = 'above' | 'below';

interface ErrorTooltipProps {
  id: string;
  message: string;
  anchorRef: React.RefObject<HTMLElement | null>;
  placement?: ErrorTooltipPlacement;
  role?: 'alert';
}

export const ErrorTooltip = ({
  id,
  message,
  anchorRef,
  placement = 'below',
  role = 'alert',
}: ErrorTooltipProps) => {
  const tooltipRef = useRef<HTMLSpanElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [isVisible, setIsVisible] = useState(true);

  const updatePosition = useCallback(() => {
    const anchor = anchorRef.current;
    if (!anchor) return;
    const rect = anchor.getBoundingClientRect();
    const scrollParent = anchor.closest('.table-scroll') as HTMLElement | null;
    const parentRect = scrollParent?.getBoundingClientRect();
    const inView =
      !parentRect ||
      (rect.bottom > parentRect.top && rect.top < parentRect.bottom);
    setIsVisible(inView);
    setPosition({
      top: placement === 'above' ? rect.top - 6 : rect.bottom + 6,
      left: rect.left,
    });
  }, [anchorRef, placement]);

  useLayoutEffect(() => {
    queueMicrotask(updatePosition);
  }, [message, updatePosition]);

  useEffect(() => {
    const anchor = anchorRef.current;
    if (!anchor) return;
    const observer = new ResizeObserver(() => queueMicrotask(updatePosition));
    observer.observe(anchor);
    const scrollParent = anchor.closest('.table-scroll');
    const onScroll = () => queueMicrotask(updatePosition);
    scrollParent?.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      observer.disconnect();
      scrollParent?.removeEventListener('scroll', onScroll);
    };
  }, [message, anchorRef, updatePosition]);

  if (!isVisible) return null;

  const style: React.CSSProperties =
    placement === 'above'
      ? {
          top: position.top,
          left: position.left,
          transform: 'translateY(-100%)',
        }
      : { top: position.top, left: position.left };

  return createPortal(
    <span
      ref={tooltipRef}
      id={id}
      className="
        tooltip-error fixed z-[9999] py-1.5 px-2 text-xs text-white bg-red-500
        rounded shadow-md whitespace-nowrap max-w-[min(90vw,400px)]
        overflow-hidden text-ellipsis
      "
      style={style}
      role={role}
    >
      {message}
    </span>,
    document.body
  );
};