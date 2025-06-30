// Cookie consent management utility
export type ConsentStatus = 'pending' | 'accepted' | 'declined';

const CONSENT_KEY = 'playeola_cookie_consent';
const CONSENT_TIMESTAMP_KEY = 'playeola_consent_timestamp';

export class CookieConsent {
  private static instance: CookieConsent;
  private listeners: Array<(status: ConsentStatus) => void> = [];

  static getInstance(): CookieConsent {
    if (!CookieConsent.instance) {
      CookieConsent.instance = new CookieConsent();
    }
    return CookieConsent.instance;
  }

  getConsentStatus(): ConsentStatus {
    try {
      const consent = localStorage.getItem(CONSENT_KEY);
      if (consent === 'accepted' || consent === 'declined') {
        return consent as ConsentStatus;
      }
    } catch (error) {
      console.warn('Could not read consent status from localStorage:', error);
    }
    return 'pending';
  }

  setConsentStatus(status: ConsentStatus): void {
    try {
      localStorage.setItem(CONSENT_KEY, status);
      localStorage.setItem(CONSENT_TIMESTAMP_KEY, new Date().toISOString());
      
      // Notify all listeners
      this.listeners.forEach(listener => listener(status));
    } catch (error) {
      console.warn('Could not save consent status to localStorage:', error);
    }
  }

  hasConsent(): boolean {
    return this.getConsentStatus() === 'accepted';
  }

  hasDeclined(): boolean {
    return this.getConsentStatus() === 'declined';
  }

  isPending(): boolean {
    return this.getConsentStatus() === 'pending';
  }

  getConsentTimestamp(): Date | null {
    try {
      const timestamp = localStorage.getItem(CONSENT_TIMESTAMP_KEY);
      return timestamp ? new Date(timestamp) : null;
    } catch (error) {
      console.warn('Could not read consent timestamp from localStorage:', error);
      return null;
    }
  }

  // Check if consent is still valid (not older than 1 year)
  isConsentValid(): boolean {
    const timestamp = this.getConsentTimestamp();
    if (!timestamp) return false;
    
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    
    return timestamp > oneYearAgo;
  }

  // Reset consent (useful for testing or if consent expires)
  resetConsent(): void {
    try {
      localStorage.removeItem(CONSENT_KEY);
      localStorage.removeItem(CONSENT_TIMESTAMP_KEY);
      this.listeners.forEach(listener => listener('pending'));
    } catch (error) {
      console.warn('Could not reset consent status:', error);
    }
  }

  // Subscribe to consent changes
  onConsentChange(listener: (status: ConsentStatus) => void): () => void {
    this.listeners.push(listener);
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Accept all cookies
  acceptAll(): void {
    this.setConsentStatus('accepted');
  }

  // Decline all non-essential cookies
  declineAll(): void {
    this.setConsentStatus('declined');
  }
}

// Export singleton instance
export const cookieConsent = CookieConsent.getInstance();