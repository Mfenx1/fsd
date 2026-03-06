import { useEffect, useRef } from 'react';

export const useLatest = <T,>(value: T): React.MutableRefObject<T> => {
  const ref = useRef(value);
  useEffect(() => {
    ref.current = value;
  });

  return ref;
};