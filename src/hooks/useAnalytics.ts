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
    trackGameDemo: analytics.trackGameDemo.bind(analytics),
    trackContactForm: analytics.trackContactForm.bind(analytics),
    trackCareerApplication: analytics.trackCareerApplication.bind(analytics),
    trackInteraction: analytics.trackInteraction.bind(analytics),
    trackConversion: analytics.trackConversion.bind(analytics)
  };
};