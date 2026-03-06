import type { ImgHTMLAttributes } from 'react';

declare global {
  interface Window {
    __IMAGE_PROXY_BASE__?: string;
  }
}

const getImageSrc = (src: string): string => {
  if (typeof window === 'undefined') return src;
  const base = window.__IMAGE_PROXY_BASE__;
  if (!base) return src;
  try {
    const srcUrl = new URL(src, window.location.href);
    if (srcUrl.protocol !== 'http:' && srcUrl.protocol !== 'https:') return src;
    const currentOrigin = window.location.origin;
    if (srcUrl.origin === currentOrigin) return src;
    return `${base}/api/image-proxy?url=${encodeURIComponent(srcUrl.href)}`;
  } catch {
    return src;
  }
};

interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  unoptimized?: boolean;
}

export const Image = ({ src, alt, width, height, className, ...rest }: ImageProps) => (
  <img
    src={getImageSrc(src)}
    alt={alt}
    width={width}
    height={height}
    className={className}
    loading="lazy"
    referrerPolicy="no-referrer"
    {...rest}
  />
);