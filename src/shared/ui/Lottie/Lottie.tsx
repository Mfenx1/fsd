'use client';

import { useEffect, useState } from 'react';
import Lottie from 'lottie-react';

export interface LottieProps {
  
  src: string;
  
  loop?: boolean;
  
  onComplete?: () => void;
  className?: string;
  style?: React.CSSProperties;
  
  width?: string | number;
  
  height?: string | number;
}


export const LottieView = ({
  src,
  loop = true,
  onComplete,
  className,
  style,
  width = '100%',
  height = '100%',
}: LottieProps) => {
  const [animationData, setAnimationData] = useState<object | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(src)
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) setAnimationData(data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [src]);

  if (!animationData) return null;

  return (
    <div className={className} style={{ width, height, ...style }}>
      <Lottie
        animationData={animationData}
        loop={loop}
        onComplete={onComplete}
        style={{ width, height }}
      />
    </div>
  );
};