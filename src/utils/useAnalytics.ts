// useAnalytics.ts
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// 1. Define the gtag function type
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event',
      action: string,
      params?: {
        page_path?: string;
        event_category?: string;
        event_label?: string;
        value?: number;
      },
    ) => void;
  }
}

const useAnalytics = (measurementId: string): void => {
  const location = useLocation();

  useEffect(() => {
    if (typeof window.gtag === 'function') {
      window.gtag('config', measurementId, {
        page_path: location.pathname,
      });
    }
  }, [location, measurementId]);
};

export default useAnalytics;