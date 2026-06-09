import { useCallback, useRef, useEffect } from 'react';
import { logEvent } from 'firebase/analytics';
import { analytics } from '../services/firebase';

export function useAnalytics() {
  const analyticsRef = useRef(analytics);
  useEffect(() => { analyticsRef.current = analytics; }, []);

  const trackEvent = useCallback((eventName, eventParams = {}) => {
    if (analyticsRef.current) {
      try {
        logEvent(analyticsRef.current, eventName, eventParams);
      } catch (error) {
        console.error('Analytics event failed:', eventName, error);
      }
    }
  }, []);

  return trackEvent;
}

export function useTrackPageView(page) {
  const hasTracked = useRef(false);
  useEffect(() => {
    if (!hasTracked.current && analytics) {
      logEvent(analytics, 'page_view', { page });
      hasTracked.current = true;
    }
  }, [page]);
}

export function trackPageView(page) {
  if (analytics) {
    try {
      logEvent(analytics, 'page_view', { page });
    } catch (error) {
      console.error('Page view tracking failed:', page, error);
    }
  }
}