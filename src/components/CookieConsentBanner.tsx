import React, { useState, useEffect } from 'react';
import { Cookie, X, Settings, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cookieConsent, ConsentStatus } from '../lib/cookieConsent';

const CookieConsentBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [consentStatus, setConsentStatus] = useState<ConsentStatus>('pending');

  useEffect(() => {
    // Check initial consent status
    const status = cookieConsent.getConsentStatus();
    setConsentStatus(status);

    // Show banner if consent is pending or expired
    if (status === 'pending' || !cookieConsent.isConsentValid()) {
      // Reset if expired
      if (!cookieConsent.isConsentValid()) {
        cookieConsent.resetConsent();
      }
      setIsVisible(true);
    }

    // Subscribe to consent changes
    const unsubscribe = cookieConsent.onConsentChange((newStatus) => {
      setConsentStatus(newStatus);
      if (newStatus !== 'pending') {
        setIsVisible(false);
      }
    });

    return unsubscribe;
  }, []);

  const handleAcceptAll = () => {
    cookieConsent.acceptAll();
  };

  const handleDeclineAll = () => {
    cookieConsent.declineAll();
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-brand-dark/95 backdrop-blur-sm border-t border-gray-800 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          {/* Content */}
          <div className="flex items-start space-x-4 flex-1">
            <div className="w-10 h-10 bg-brand-orange/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <Cookie className="text-brand-orange" size={20} />
            </div>
            
            <div className="flex-1">
              <h3 className="text-lg font-heading font-bold text-white mb-2">
                We Value Your Privacy
              </h3>
              
              {!showDetails ? (
                <p className="text-gray-300 font-body leading-relaxed">
                  We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. 
                  By clicking "Accept All", you consent to our use of cookies.{' '}
                  <button
                    onClick={() => setShowDetails(true)}
                    className="text-brand-orange hover:text-brand-yellow transition-colors duration-200 underline"
                  >
                    Learn more
                  </button>
                </p>
              ) : (
                <div className="space-y-3">
                  <p className="text-gray-300 font-body text-sm leading-relaxed">
                    We use different types of cookies to optimize your experience:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="bg-black/30 p-3 rounded-lg border border-gray-700">
                      <div className="flex items-center space-x-2 mb-1">
                        <Shield className="text-green-400" size={14} />
                        <span className="font-semibold text-white font-body">Essential Cookies</span>
                      </div>
                      <p className="text-gray-400 font-body">Required for basic site functionality. Always active.</p>
                    </div>
                    
                    <div className="bg-black/30 p-3 rounded-lg border border-gray-700">
                      <div className="flex items-center space-x-2 mb-1">
                        <Settings className="text-blue-400" size={14} />
                        <span className="font-semibold text-white font-body">Analytics Cookies</span>
                      </div>
                      <p className="text-gray-400 font-body">Help us understand how you use our site to improve performance.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm">
                    <Link 
                      to="/privacy-policy" 
                      className="text-brand-orange hover:text-brand-yellow transition-colors duration-200 underline font-body"
                    >
                      Privacy Policy
                    </Link>
                    <Link 
                      to="/cookies-policy" 
                      className="text-brand-orange hover:text-brand-yellow transition-colors duration-200 underline font-body"
                    >
                      Cookie Policy
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            {showDetails && (
              <button
                onClick={() => setShowDetails(false)}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors duration-200 font-body text-sm"
              >
                Show Less
              </button>
            )}
            
            <button
              onClick={handleDeclineAll}
              className="px-4 py-2 border border-gray-600 text-gray-300 hover:border-white hover:text-white transition-all duration-200 rounded-lg font-body text-sm font-semibold"
            >
              Decline
            </button>
            
            <button
              onClick={handleAcceptAll}
              className="px-6 py-2 bg-brand-gradient text-brand-dark font-bold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(234,163,56,0.5)] font-body text-sm"
            >
              Accept All
            </button>
            
            <button
              onClick={handleClose}
              className="p-2 text-gray-400 hover:text-white transition-colors duration-200"
              aria-label="Close banner"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsentBanner;