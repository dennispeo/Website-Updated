// Analytics tracking utilities
import { supabase } from './supabase';
import { cookieConsent } from './cookieConsent';

interface PageViewData {
  sessionId: string;
  pagePath: string;
  pageTitle: string;
  referrer?: string;
  userAgent?: string;
  ipAddress?: string;
  country?: string;
  screenResolution?: string;
  viewportSize?: string;
}

interface InteractionData {
  sessionId: string;
  pagePath: string;
  interactionType: string;
  elementId?: string;
  elementClass?: string;
  elementText?: string;
  targetUrl?: string;
  formName?: string;
  buttonText?: string;
  positionX?: number;
  positionY?: number;
}

class Analytics {
  private sessionId: string;
  private startTime: number;
  private pageStartTime: number;
  private maxScrollDepth: number = 0;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.startTime = Date.now();
    this.pageStartTime = Date.now();
    this.setupScrollTracking();
    this.setupUnloadTracking();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getDeviceInfo() {
    const userAgent = navigator.userAgent;
    
    return {
      screen_resolution: `${screen.width}x${screen.height}`,
      viewport_size: `${window.innerWidth}x${window.innerHeight}`,
      user_agent: userAgent
    };
  }

  private setupScrollTracking() {
    let ticking = false;
    
    const updateScrollDepth = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((scrollTop / docHeight) * 100);
      
      if (scrollPercent > this.maxScrollDepth) {
        this.maxScrollDepth = Math.min(scrollPercent, 100);
      }
      
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollDepth);
        ticking = true;
      }
    });
  }

  private setupUnloadTracking() {
    window.addEventListener('beforeunload', () => {
      this.trackPageView({
        timeOnPage: Math.round((Date.now() - this.pageStartTime) / 1000),
        scrollDepth: this.maxScrollDepth
      });
    });
  }

  // Check if analytics tracking is allowed
  private canTrack(): boolean {
    return cookieConsent.hasConsent();
  }

  private isSupabaseAvailable(): boolean {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    // Check if environment variables exist and are not placeholder values
    return !!(supabaseUrl && supabaseAnonKey && 
             supabaseUrl !== 'your_supabase_project_url' && 
             supabaseAnonKey !== 'your_supabase_anon_key');
  }

  async trackPageView(additionalData: Partial<PageViewData & { timeOnPage?: number; scrollDepth?: number }> = {}) {
    // Only track if user has consented to cookies
    if (!this.canTrack()) {
      const reason = !cookieConsent.hasConsent() ? 'no consent' : 'Supabase not configured';
      console.log(`Analytics: Page view tracking skipped - ${reason}`);
      return;
    }

    // Check if Supabase is available before attempting to track
    if (!this.isSupabaseAvailable()) {
      console.log('Analytics: Supabase not configured - tracking disabled');
      return;
    }

    try {
      const deviceInfo = this.getDeviceInfo();
      
      const pageViewData = {
        session_id: this.sessionId,
        page_path: window.location.pathname,
        page_title: document.title,
        referrer: document.referrer || null,
        time_on_page: additionalData.timeOnPage || null,
        scroll_depth: additionalData.scrollDepth || null,
        ...deviceInfo
      };

      // Test Supabase connection first
      const { error } = await supabase.from('page_views').insert([pageViewData]);
      
      if (error) {
        console.warn('Analytics page view insert failed:', error.message || error);
        return;
      }
      
      // Update or create session
      await this.updateSession();
    } catch (error) {
      // Handle network errors gracefully
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        console.warn('Analytics: Supabase connection failed - tracking disabled for this session');
        // Disable further tracking attempts for this session
        this.sessionId = 'disabled';
        return;
      }
      console.warn('Analytics page view tracking failed:', error);
    }
  }

  async trackInteraction(data: Omit<InteractionData, 'sessionId' | 'pagePath'>) {
    // Only track if user has consented to cookies
    if (!this.canTrack()) {
      const reason = !cookieConsent.hasConsent() ? 'no consent' : 'Supabase not configured';
      console.log(`Analytics: Interaction tracking skipped - ${reason}`);
      return;
    }

    // Check if Supabase is available before attempting to track
    if (!this.isSupabaseAvailable()) {
      console.log('Analytics: Supabase not configured - interaction tracking disabled');
      return;
    }

    // Skip if session is disabled due to connection issues
    if (this.sessionId === 'disabled') {
      return;
    }
    try {
      const interactionData = {
        session_id: this.sessionId,
        page_path: window.location.pathname,
        interaction_type: data.interactionType,
        element_id: data.elementId || null,
        element_class: data.elementClass || null,
        element_text: data.elementText || null,
        target_url: data.targetUrl || null,
        form_name: data.formName || null,
        button_text: data.buttonText || null,
        position_x: data.positionX || null,
        position_y: data.positionY || null
      };

      const { error } = await supabase.from('user_interactions').insert([interactionData]);
      
      if (error) {
        console.warn('Analytics interaction insert failed:', error.message || error);
      }
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        console.warn('Analytics: Supabase connection failed - disabling interaction tracking');
        this.sessionId = 'disabled';
        return;
      }
      console.warn('Analytics interaction tracking failed:', error);
    }
  }

  private async updateSession() {
    // Only update if user has consented to cookies
    if (!this.canTrack()) {
      return;
    }

    // Check if Supabase is available before attempting to update
    if (!this.isSupabaseAvailable()) {
      console.log('Analytics: Supabase not configured - session tracking disabled');
      return;
    }

    // Skip if session is disabled due to connection issues
    if (this.sessionId === 'disabled') {
      return;
    }
    try {
      const urlParams = new URLSearchParams(window.location.search);
      
      const sessionData = {
        session_id: this.sessionId,
        first_page: window.location.pathname,
        last_page: window.location.pathname,
        total_pages_viewed: 1,
        referrer: document.referrer || null,
        utm_source: urlParams.get('utm_source'),
        utm_medium: urlParams.get('utm_medium'),
        utm_campaign: urlParams.get('utm_campaign')
      };

      // Try to update existing session, or insert new one
      const { error } = await supabase
        .from('user_sessions')
        .upsert(sessionData, { 
          onConflict: 'session_id',
          ignoreDuplicates: false 
        });

      if (error) {
        console.warn('Analytics session upsert failed:', error.message || error);
      }
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        console.warn('Analytics: Supabase connection failed - disabling session tracking');
        this.sessionId = 'disabled';
        return;
      }
      console.warn('Analytics session tracking failed:', error);
    }
  }

  // Helper methods for common tracking scenarios
  trackButtonClick(buttonText: string, elementId?: string, targetUrl?: string) {
    this.trackInteraction({
      interactionType: 'button_click',
      buttonText,
      elementId,
      targetUrl
    });
  }

  trackFormSubmit(formName: string) {
    this.trackInteraction({
      interactionType: 'form_submit',
      formName
    });
  }

  trackDownload(fileName: string, downloadUrl: string) {
    this.trackInteraction({
      interactionType: 'download',
      elementText: fileName,
      targetUrl: downloadUrl
    });
  }

  // Page transition tracking
  onPageChange() {
    // Track time on previous page (only if consent given)
    if (this.canTrack()) {
      this.trackPageView({
        timeOnPage: Math.round((Date.now() - this.pageStartTime) / 1000),
        scrollDepth: this.maxScrollDepth
      });
    }
    
    // Reset for new page
    this.pageStartTime = Date.now();
    this.maxScrollDepth = 0;
    
    // Track new page view (only if consent given)
    if (this.canTrack()) {
      setTimeout(() => {
        this.trackPageView();
      }, 100);
    }
  }
}

// Create global analytics instance
export const analytics = new Analytics();

// Auto-track initial page view only if consent is given
if (typeof window !== 'undefined') {
  // Check consent status and track initial page view
  setTimeout(() => {
    if (cookieConsent.hasConsent()) {
      analytics.trackPageView();
    }
  }, 1000);

  // Listen for consent changes and start tracking if consent is given
  cookieConsent.onConsentChange((status) => {
    if (status === 'accepted') {
      // User just accepted cookies, start tracking
      analytics.trackPageView();
    }
  });
}