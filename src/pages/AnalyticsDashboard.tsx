import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BarChart3, TrendingUp, Users, Eye, Clock, MousePointer, Target, Globe, Smartphone, Monitor, Tablet } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface UserBehaviorAnalytics {
  // Traffic Overview
  totalPageViews: number;
  uniqueVisitors: number;
  totalSessions: number;
  averageSessionDuration: number;
  bounceRate: number;
  
  // User Engagement
  totalInteractions: number;
  averageInteractionsPerSession: number;
  averageTimeOnPage: number;
  averageScrollDepth: number;
  
  // Popular Content
  topPages: Array<{ page: string; views: number; avgTimeOnPage: number }>;
  topInteractions: Array<{ type: string; count: number; element: string }>;
  
  // Conversion Metrics
  totalConversions: number;
  conversionRate: number;
  topConversions: Array<{ type: string; count: number; rate: number }>;
  
  // Device & Browser Analytics
  deviceBreakdown: Array<{ device: string; count: number; percentage: number }>;
  browserBreakdown: Array<{ browser: string; count: number; percentage: number }>;
  
  // Geographic Data
  topCountries: Array<{ country: string; sessions: number; percentage: number }>;
  
  // Traffic Sources
  topReferrers: Array<{ referrer: string; sessions: number; percentage: number }>;
  utmSources: Array<{ source: string; sessions: number; conversions: number }>;
  
  // User Journey
  entryPages: Array<{ page: string; sessions: number; bounceRate: number }>;
  exitPages: Array<{ page: string; exits: number; percentage: number }>;
}

const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState<UserBehaviorAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    fetchUserAnalytics();
  }, [timeRange]);

  const fetchUserAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      // Calculate date range
      const now = new Date();
      const daysAgo = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
      const startDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

      // Fetch all analytics data in parallel
      const [
        pageViewsResult,
        interactionsResult,
        sessionsResult,
        conversionsResult
      ] = await Promise.all([
        supabase
          .from('page_views')
          .select('*')
          .gte('created_at', startDate.toISOString()),
        supabase
          .from('user_interactions')
          .select('*')
          .gte('created_at', startDate.toISOString()),
        supabase
          .from('user_sessions')
          .select('*')
          .gte('started_at', startDate.toISOString()),
        supabase
          .from('conversion_events')
          .select('*')
          .gte('created_at', startDate.toISOString())
      ]);

      if (pageViewsResult.error) throw pageViewsResult.error;
      if (interactionsResult.error) throw interactionsResult.error;
      if (sessionsResult.error) throw sessionsResult.error;
      if (conversionsResult.error) throw conversionsResult.error;

      const pageViews = pageViewsResult.data || [];
      const interactions = interactionsResult.data || [];
      const sessions = sessionsResult.data || [];
      const conversions = conversionsResult.data || [];

      // Calculate metrics
      const totalPageViews = pageViews.length;
      const uniqueVisitors = new Set(pageViews.map(pv => pv.session_id)).size;
      const totalSessions = sessions.length;
      
      const sessionDurations = sessions
        .filter(s => s.session_duration)
        .map(s => s.session_duration);
      const averageSessionDuration = sessionDurations.length > 0
        ? Math.round(sessionDurations.reduce((sum, dur) => sum + dur, 0) / sessionDurations.length)
        : 0;

      const bounceRate = totalSessions > 0
        ? Math.round((sessions.filter(s => s.bounce).length / totalSessions) * 100)
        : 0;

      const totalInteractions = interactions.length;
      const averageInteractionsPerSession = totalSessions > 0
        ? Math.round(totalInteractions / totalSessions * 10) / 10
        : 0;

      const timeOnPageValues = pageViews
        .filter(pv => pv.time_on_page && pv.time_on_page > 0)
        .map(pv => pv.time_on_page);
      const averageTimeOnPage = timeOnPageValues.length > 0
        ? Math.round(timeOnPageValues.reduce((sum, time) => sum + time, 0) / timeOnPageValues.length)
        : 0;

      const scrollDepthValues = pageViews
        .filter(pv => pv.scroll_depth && pv.scroll_depth > 0)
        .map(pv => pv.scroll_depth);
      const averageScrollDepth = scrollDepthValues.length > 0
        ? Math.round(scrollDepthValues.reduce((sum, depth) => sum + depth, 0) / scrollDepthValues.length)
        : 0;

      // Top pages
      const pageViewCounts = pageViews.reduce((acc, pv) => {
        const page = pv.page_path || 'Unknown';
        if (!acc[page]) {
          acc[page] = { views: 0, totalTime: 0, count: 0 };
        }
        acc[page].views++;
        if (pv.time_on_page) {
          acc[page].totalTime += pv.time_on_page;
          acc[page].count++;
        }
        return acc;
      }, {} as Record<string, { views: number; totalTime: number; count: number }>);

      const topPages = Object.entries(pageViewCounts)
        .map(([page, data]) => ({
          page,
          views: data.views,
          avgTimeOnPage: data.count > 0 ? Math.round(data.totalTime / data.count) : 0
        }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 10);

      // Top interactions
      const interactionCounts = interactions.reduce((acc, interaction) => {
        const key = `${interaction.interaction_type}_${interaction.element_text || interaction.button_text || interaction.element_id || 'unknown'}`;
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const topInteractions = Object.entries(interactionCounts)
        .map(([key, count]) => {
          const [type, element] = key.split('_', 2);
          return { type, element: element || 'Unknown', count };
        })
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      // Conversion metrics
      const totalConversions = conversions.length;
      const conversionRate = totalSessions > 0
        ? Math.round((totalConversions / totalSessions) * 100 * 10) / 10
        : 0;

      const conversionCounts = conversions.reduce((acc, conv) => {
        acc[conv.event_type] = (acc[conv.event_type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const topConversions = Object.entries(conversionCounts)
        .map(([type, count]) => ({
          type,
          count,
          rate: totalSessions > 0 ? Math.round((count / totalSessions) * 100 * 10) / 10 : 0
        }))
        .sort((a, b) => b.count - a.count);

      // Device breakdown
      const deviceCounts = sessions.reduce((acc, session) => {
        const device = session.device_type || 'unknown';
        acc[device] = (acc[device] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const deviceBreakdown = Object.entries(deviceCounts)
        .map(([device, count]) => ({
          device,
          count,
          percentage: Math.round((count / totalSessions) * 100)
        }))
        .sort((a, b) => b.count - a.count);

      // Browser breakdown
      const browserCounts = sessions.reduce((acc, session) => {
        const browser = session.browser || 'unknown';
        acc[browser] = (acc[browser] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const browserBreakdown = Object.entries(browserCounts)
        .map(([browser, count]) => ({
          browser,
          count,
          percentage: Math.round((count / totalSessions) * 100)
        }))
        .sort((a, b) => b.count - a.count);

      // Geographic data (mock for now - would need IP geolocation service)
      const topCountries = [
        { country: 'United States', sessions: Math.round(totalSessions * 0.4), percentage: 40 },
        { country: 'United Kingdom', sessions: Math.round(totalSessions * 0.2), percentage: 20 },
        { country: 'Germany', sessions: Math.round(totalSessions * 0.15), percentage: 15 },
        { country: 'Canada', sessions: Math.round(totalSessions * 0.1), percentage: 10 },
        { country: 'Other', sessions: Math.round(totalSessions * 0.15), percentage: 15 }
      ].filter(country => country.sessions > 0);

      // Traffic sources
      const referrerCounts = sessions.reduce((acc, session) => {
        const referrer = session.referrer || 'Direct';
        acc[referrer] = (acc[referrer] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const topReferrers = Object.entries(referrerCounts)
        .map(([referrer, count]) => ({
          referrer: referrer === '' ? 'Direct' : referrer,
          sessions: count,
          percentage: Math.round((count / totalSessions) * 100)
        }))
        .sort((a, b) => b.sessions - a.sessions)
        .slice(0, 5);

      // UTM sources
      const utmCounts = sessions.reduce((acc, session) => {
        const source = session.utm_source || 'organic';
        if (!acc[source]) {
          acc[source] = { sessions: 0, conversions: 0 };
        }
        acc[source].sessions++;
        if (session.conversion) {
          acc[source].conversions++;
        }
        return acc;
      }, {} as Record<string, { sessions: number; conversions: number }>);

      const utmSources = Object.entries(utmCounts)
        .map(([source, data]) => ({
          source,
          sessions: data.sessions,
          conversions: data.conversions
        }))
        .sort((a, b) => b.sessions - a.sessions);

      // Entry and exit pages
      const entryPageCounts = sessions.reduce((acc, session) => {
        const page = session.first_page || 'Unknown';
        if (!acc[page]) {
          acc[page] = { sessions: 0, bounces: 0 };
        }
        acc[page].sessions++;
        if (session.bounce) {
          acc[page].bounces++;
        }
        return acc;
      }, {} as Record<string, { sessions: number; bounces: number }>);

      const entryPages = Object.entries(entryPageCounts)
        .map(([page, data]) => ({
          page,
          sessions: data.sessions,
          bounceRate: Math.round((data.bounces / data.sessions) * 100)
        }))
        .sort((a, b) => b.sessions - a.sessions)
        .slice(0, 5);

      const exitPageCounts = sessions.reduce((acc, session) => {
        const page = session.last_page || 'Unknown';
        acc[page] = (acc[page] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const exitPages = Object.entries(exitPageCounts)
        .map(([page, exits]) => ({
          page,
          exits,
          percentage: Math.round((exits / totalSessions) * 100)
        }))
        .sort((a, b) => b.exits - a.exits)
        .slice(0, 5);

      const analyticsData: UserBehaviorAnalytics = {
        totalPageViews,
        uniqueVisitors,
        totalSessions,
        averageSessionDuration,
        bounceRate,
        totalInteractions,
        averageInteractionsPerSession,
        averageTimeOnPage,
        averageScrollDepth,
        topPages,
        topInteractions,
        totalConversions,
        conversionRate,
        topConversions,
        deviceBreakdown,
        browserBreakdown,
        topCountries,
        topReferrers,
        utmSources,
        entryPages,
        exitPages
      };

      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error fetching user analytics:', error);
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const getTimeRangeLabel = () => {
    switch (timeRange) {
      case '7d': return 'Last 7 Days';
      case '30d': return 'Last 30 Days';
      case '90d': return 'Last 90 Days';
      default: return 'Last 30 Days';
    }
  };

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getDeviceIcon = (device: string) => {
    switch (device.toLowerCase()) {
      case 'mobile': return <Smartphone size={16} />;
      case 'tablet': return <Tablet size={16} />;
      case 'desktop': return <Monitor size={16} />;
      default: return <Monitor size={16} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-dark-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-brand-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white font-body">Loading user analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-brand-dark-gradient flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-heading font-bold text-white mb-4">Analytics Error</h1>
          <p className="text-gray-400 mb-6 font-body">{error}</p>
          <button
            onClick={fetchUserAnalytics}
            className="bg-brand-gradient text-brand-dark font-bold uppercase tracking-wider py-3 px-6 rounded-lg transition-all duration-300 hover:scale-105 font-body"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-dark-gradient">
      {/* Header */}
      <header className="bg-black/30 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link 
                to="/admin"
                className="flex items-center space-x-2 text-brand-orange hover:text-brand-yellow transition-colors duration-300 font-body"
              >
                <ArrowLeft size={20} />
                <span>Back to Dashboard</span>
              </Link>
            </div>
            
            {/* Time Range Selector */}
            <div className="flex items-center space-x-2">
              <span className="text-gray-400 text-sm font-body">Time Range:</span>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as '7d' | '30d' | '90d')}
                className="bg-black/30 border border-gray-700 rounded-lg text-white px-3 py-1 text-sm font-body focus:border-brand-orange focus:ring-1 focus:ring-brand-orange"
              >
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
            User Behavior Analytics
          </h1>
          <p className="text-lg text-gray-300 font-body">
            Track how users interact with your website and identify optimization opportunities.
          </p>
        </div>

        {analytics && (
          <>
            {/* Key Metrics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
              <div className="bg-black/30 p-6 rounded-xl border border-gray-800 hover:border-brand-orange/30 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Eye className="text-blue-400" size={24} />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white font-heading">{analytics.totalPageViews.toLocaleString()}</div>
                    <div className="text-sm text-gray-400 font-body">Page Views</div>
                  </div>
                </div>
                <div className="text-xs text-gray-500 font-body">
                  {analytics.uniqueVisitors.toLocaleString()} unique visitors
                </div>
              </div>

              <div className="bg-black/30 p-6 rounded-xl border border-gray-800 hover:border-brand-orange/30 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <Users className="text-green-400" size={24} />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white font-heading">{analytics.totalSessions.toLocaleString()}</div>
                    <div className="text-sm text-gray-400 font-body">Sessions</div>
                  </div>
                </div>
                <div className="text-xs text-gray-500 font-body">
                  {formatDuration(analytics.averageSessionDuration)} avg duration
                </div>
              </div>

              <div className="bg-black/30 p-6 rounded-xl border border-gray-800 hover:border-brand-orange/30 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <MousePointer className="text-purple-400" size={24} />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white font-heading">{analytics.totalInteractions.toLocaleString()}</div>
                    <div className="text-sm text-gray-400 font-body">Interactions</div>
                  </div>
                </div>
                <div className="text-xs text-gray-500 font-body">
                  {analytics.averageInteractionsPerSession} per session
                </div>
              </div>

              <div className="bg-black/30 p-6 rounded-xl border border-gray-800 hover:border-brand-orange/30 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                    <Target className="text-orange-400" size={24} />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white font-heading">{analytics.totalConversions}</div>
                    <div className="text-sm text-gray-400 font-body">Conversions</div>
                  </div>
                </div>
                <div className="text-xs text-gray-500 font-body">
                  {analytics.conversionRate}% conversion rate
                </div>
              </div>

              <div className="bg-black/30 p-6 rounded-xl border border-gray-800 hover:border-brand-orange/30 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                    <TrendingUp className="text-red-400" size={24} />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white font-heading">{analytics.bounceRate}%</div>
                    <div className="text-sm text-gray-400 font-body">Bounce Rate</div>
                  </div>
                </div>
                <div className="text-xs text-gray-500 font-body">
                  {analytics.averageScrollDepth}% avg scroll depth
                </div>
              </div>
            </div>

            {/* Content Performance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {/* Top Pages */}
              <div className="bg-black/30 p-8 rounded-xl border border-gray-800">
                <h3 className="text-xl font-heading font-bold text-white mb-6 flex items-center space-x-2">
                  <BarChart3 className="text-brand-orange" size={20} />
                  <span>Most Visited Pages</span>
                </h3>
                
                <div className="space-y-4">
                  {analytics.topPages.slice(0, 5).map((page, index) => (
                    <div key={page.page} className="flex items-center justify-between p-4 bg-black/40 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-brand-orange/20 rounded-full flex items-center justify-center text-brand-orange font-bold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <div className="text-white font-body font-semibold">{page.page}</div>
                          <div className="text-gray-400 text-sm font-body">
                            {formatDuration(page.avgTimeOnPage)} avg time
                          </div>
                        </div>
                      </div>
                      <span className="text-brand-orange font-bold font-heading">
                        {page.views.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Interactions */}
              <div className="bg-black/30 p-8 rounded-xl border border-gray-800">
                <h3 className="text-xl font-heading font-bold text-white mb-6 flex items-center space-x-2">
                  <MousePointer className="text-brand-orange" size={20} />
                  <span>Most Clicked Elements</span>
                </h3>
                
                <div className="space-y-4">
                  {analytics.topInteractions.slice(0, 5).map((interaction, index) => (
                    <div key={`${interaction.type}-${interaction.element}`} className="flex items-center justify-between p-4 bg-black/40 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-400 font-bold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <div className="text-white font-body font-semibold">{interaction.element}</div>
                          <div className="text-gray-400 text-sm font-body capitalize">
                            {interaction.type.replace('_', ' ')}
                          </div>
                        </div>
                      </div>
                      <span className="text-purple-400 font-bold font-heading">
                        {interaction.count.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Device & Browser Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {/* Device Breakdown */}
              <div className="bg-black/30 p-8 rounded-xl border border-gray-800">
                <h3 className="text-xl font-heading font-bold text-white mb-6 flex items-center space-x-2">
                  <Smartphone className="text-brand-orange" size={20} />
                  <span>Device Types</span>
                </h3>
                
                <div className="space-y-4">
                  {analytics.deviceBreakdown.map((device, index) => (
                    <div key={device.device} className="flex items-center justify-between p-4 bg-black/40 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="text-brand-orange">
                          {getDeviceIcon(device.device)}
                        </div>
                        <div>
                          <div className="text-white font-body font-semibold capitalize">{device.device}</div>
                          <div className="text-gray-400 text-sm font-body">
                            {device.count.toLocaleString()} sessions
                          </div>
                        </div>
                      </div>
                      <span className="text-brand-orange font-bold font-heading">
                        {device.percentage}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Browser Breakdown */}
              <div className="bg-black/30 p-8 rounded-xl border border-gray-800">
                <h3 className="text-xl font-heading font-bold text-white mb-6 flex items-center space-x-2">
                  <Globe className="text-brand-orange" size={20} />
                  <span>Browsers</span>
                </h3>
                
                <div className="space-y-4">
                  {analytics.browserBreakdown.slice(0, 5).map((browser, index) => (
                    <div key={browser.browser} className="flex items-center justify-between p-4 bg-black/40 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 font-bold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <div className="text-white font-body font-semibold capitalize">{browser.browser}</div>
                          <div className="text-gray-400 text-sm font-body">
                            {browser.count.toLocaleString()} sessions
                          </div>
                        </div>
                      </div>
                      <span className="text-blue-400 font-bold font-heading">
                        {browser.percentage}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Conversion Funnel */}
            <div className="bg-black/30 p-8 rounded-xl border border-gray-800 mb-12">
              <h3 className="text-xl font-heading font-bold text-white mb-6 flex items-center space-x-2">
                <Target className="text-brand-orange" size={20} />
                <span>Conversion Events</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {analytics.topConversions.map((conversion, index) => (
                  <div key={conversion.type} className="text-center p-6 bg-black/40 rounded-lg">
                    <div className="text-3xl font-bold text-brand-orange mb-2 font-heading">
                      {conversion.count}
                    </div>
                    <div className="text-white font-body font-semibold capitalize mb-1">
                      {conversion.type.replace('_', ' ')}
                    </div>
                    <div className="text-sm text-gray-400 font-body">
                      {conversion.rate}% conversion rate
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* User Journey */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Entry Pages */}
              <div className="bg-black/30 p-8 rounded-xl border border-gray-800">
                <h3 className="text-xl font-heading font-bold text-white mb-6 flex items-center space-x-2">
                  <TrendingUp className="text-brand-orange" size={20} />
                  <span>Top Entry Pages</span>
                </h3>
                
                <div className="space-y-4">
                  {analytics.entryPages.map((page, index) => (
                    <div key={page.page} className="flex items-center justify-between p-4 bg-black/40 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center text-green-400 font-bold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <div className="text-white font-body font-semibold">{page.page}</div>
                          <div className="text-gray-400 text-sm font-body">
                            {page.bounceRate}% bounce rate
                          </div>
                        </div>
                      </div>
                      <span className="text-green-400 font-bold font-heading">
                        {page.sessions.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Traffic Sources */}
              <div className="bg-black/30 p-8 rounded-xl border border-gray-800">
                <h3 className="text-xl font-heading font-bold text-white mb-6 flex items-center space-x-2">
                  <Globe className="text-brand-orange" size={20} />
                  <span>Traffic Sources</span>
                </h3>
                
                <div className="space-y-4">
                  {analytics.topReferrers.map((referrer, index) => (
                    <div key={referrer.referrer} className="flex items-center justify-between p-4 bg-black/40 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center text-yellow-400 font-bold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <div className="text-white font-body font-semibold">
                            {referrer.referrer === 'Direct' ? 'Direct Traffic' : referrer.referrer}
                          </div>
                          <div className="text-gray-400 text-sm font-body">
                            {referrer.percentage}% of traffic
                          </div>
                        </div>
                      </div>
                      <span className="text-yellow-400 font-bold font-heading">
                        {referrer.sessions.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default AnalyticsDashboard;