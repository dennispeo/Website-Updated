// Analytics tracking utilities
import { supabase } from './supabase';

interface PageViewData {
  sessionId: string;
  pagePath: string;
  pageTitle: string;
  referrer?: string;
  userAgent?: string;
  deviceType?: string;
  browser?: string;
  os?: string;
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

interface ConversionData {
  sessionId: string;
  eventType: string;
  eventValue?: string;
  pagePath: string;
  funnelStep?: number;
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
    const screenWidth = screen.width;
    const viewportWidth = window.innerWidth;
    
    let deviceType = 'desktop';
    if (screenWidth <= 768) deviceType = 'mobile';
    else if (screenWidth <= 1024) deviceType = 'tablet';

    let browser = 'unknown';
    if (userAgent.includes('Chrome')) browser = 'chrome';
    else if (userAgent.includes('Firefox')) browser = 'firefox';
    else if (userAgent.includes('Safari')) browser = 'safari';
    else if (userAgent.includes('Edge')) browser = 'edge';

    let os = 'unknown';
    if (userAgent.includes('Windows')) os = 'windows';
    else if (userAgent.includes('Mac')) os = 'macos';
    else if (userAgent.includes('Linux')) os = 'linux';
    else if (userAgent.includes('Android')) os = 'android';
    else if (userAgent.includes('iOS')) os = 'ios';

    return {
      deviceType,
      browser,
      os,
      screenResolution: `${screen.width}x${screen.height}`,
      viewportSize: `${window.innerWidth}x${window.innerHeight}`,
      userAgent
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

  async trackPageView(additionalData: Partial<PageViewData & { timeOnPage?: number; scrollDepth?: number }> = {}) {
    try {
      const deviceInfo = this.getDeviceInfo();
      
      const pageViewData = {
        session_id: this.sessionId,
        page_path: window.location.pathname,
        page_title: document.title,
        referrer: document.referrer || null,
        time_on_page: additionalData.timeOnPage || null,
        scroll_depth: additionalData.scrollDepth || null,
        ...deviceInfo,
        ...additionalData
      };

      await supabase.from('page_views').insert([pageViewData]);
      
      // Update or create session
      await this.updateSession();
    } catch (error) {
      console.warn('Analytics tracking failed:', error);
    }
  }

  async trackInteraction(data: Omit<InteractionData, 'sessionId' | 'pagePath'>) {
    try {
      const interactionData = {
        session_id: this.sessionId,
        page_path: window.location.pathname,
        ...data
      };

      await supabase.from('user_interactions').insert([interactionData]);
    } catch (error) {
      console.warn('Interaction tracking failed:', error);
    }
  }

  async trackConversion(data: Omit<ConversionData, 'sessionId' | 'pagePath'>) {
    try {
      const conversionData = {
        session_id: this.sessionId,
        page_path: window.location.pathname,
        ...data
      };

      await supabase.from('conversion_events').insert([conversionData]);
      
      // Mark session as converted
      await supabase
        .from('user_sessions')
        .update({ 
          conversion: true, 
          conversion_type: data.eventType 
        })
        .eq('session_id', this.sessionId);
    } catch (error) {
      console.warn('Conversion tracking failed:', error);
    }
  }

  private async updateSession() {
    try {
      const deviceInfo = this.getDeviceInfo();
      const urlParams = new URLSearchParams(window.location.search);
      
      const sessionData = {
        session_id: this.sessionId,
        first_page: window.location.pathname,
        last_page: window.location.pathname,
        total_pages_viewed: 1,
        referrer: document.referrer || null,
        utm_source: urlParams.get('utm_source'),
        utm_medium: urlParams.get('utm_medium'),
        utm_campaign: urlParams.get('utm_campaign'),
        ...deviceInfo
      };

      // Try to update existing session, or insert new one
      const { error } = await supabase
        .from('user_sessions')
        .upsert(sessionData, { 
          onConflict: 'session_id',
          ignoreDuplicates: false 
        });

      if (error) {
        console.warn('Session update failed:', error);
      }
    } catch (error) {
      console.warn('Session tracking failed:', error);
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

  trackGameDemo(gameTitle: string) {
    this.trackConversion({
      eventType: 'game_demo',
      eventValue: gameTitle,
      funnelStep: 1
    });
  }

  trackContactForm(inquiryType: string) {
    this.trackConversion({
      eventType: 'contact_form',
      eventValue: inquiryType,
      funnelStep: 2
    });
  }

  trackCareerApplication(position: string) {
    this.trackConversion({
      eventType: 'career_apply',
      eventValue: position,
      funnelStep: 3
    });
  }

  // Page transition tracking
  onPageChange() {
    // Track time on previous page
    this.trackPageView({
      timeOnPage: Math.round((Date.now() - this.pageStartTime) / 1000),
      scrollDepth: this.maxScrollDepth
    });
    
    // Reset for new page
    this.pageStartTime = Date.now();
    this.maxScrollDepth = 0;
    
    // Track new page view
    setTimeout(() => {
      this.trackPageView();
    }, 100);
  }
}

// Create global analytics instance
export const analytics = new Analytics();

// Auto-track initial page view
if (typeof window !== 'undefined') {
  // Track initial page view after a short delay to ensure DOM is ready
  setTimeout(() => {
    analytics.trackPageView();
  }, 1000);
}