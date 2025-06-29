import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { analytics } from '../lib/analytics';

export const useAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    // Track page changes
    analytics.onPageChange();
  }, [location.pathname]);

  return {
    trackButtonClick: analytics.trackButtonClick.bind(analytics),
    trackFormSubmit: analytics.trackFormSubmit.bind(analytics),
    trackDownload: analytics.trackDownload.bind(analytics),
    trackInteraction: analytics.trackInteraction.bind(analytics)
  };
};