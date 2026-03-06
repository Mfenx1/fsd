'use client';

import { useReportWebVitals } from 'next/web-vitals';

type WebVitalsMetric = {
  id: string;
  name: string;
  value: number;
  rating: string;
  delta?: number;
};

const reportWebVitals = (metric: WebVitalsMetric) => {
  if (process.env.NODE_ENV === 'development') {
    
    console.log(`[Web Vitals] ${metric.name}:`, metric.value, metric.rating, metric);
  }

  
  if (typeof window !== 'undefined' && (window as unknown as { gtag?: (a: string, b: string, c: object) => void }).gtag) {
    (window as unknown as { gtag: (a: string, b: string, c: object) => void }).gtag('event', metric.name, {
      event_category: 'Web Vitals',
      event_label: metric.id,
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      non_interaction: true,
    });
  }

  
  if (typeof window !== 'undefined' && (window as unknown as { va?: (name: string, opts?: { d?: string; id?: string }) => void }).va) {
    (window as unknown as { va: (name: string, opts?: { d?: string; id?: string }) => void }).va(metric.name, {
      d: String(metric.delta ?? metric.value),
      id: metric.id,
    });
  }
};

export const WebVitalsReporter = () => {
  useReportWebVitals(reportWebVitals);
  return null;
};