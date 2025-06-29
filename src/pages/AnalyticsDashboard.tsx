import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BarChart3, TrendingUp, Users, Gamepad2, Newspaper, Eye, Calendar, Activity, Target } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AnalyticsData {
  totalGames: number;
  availableGames: number;
  totalNews: number;
  publishedNews: number;
  totalUsers: number;
  adminUsers: number;
  recentActivity: {
    newGamesThisWeek: number;
    newNewsThisWeek: number;
    newUsersThisWeek: number;
  };
  gameStats: {
    highVolatilityGames: number;
    mediumVolatilityGames: number;
    lowVolatilityGames: number;
  };
  contentMetrics: {
    averageRTP: string;
    mostCommonVolatility: string;
    totalFeatures: number;
  };
}

const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      // Calculate date range
      const now = new Date();
      const daysAgo = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
      const startDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

      // Fetch all data in parallel
      const [
        gamesResult,
        newsResult,
        profilesResult,
        adminUsersResult
      ] = await Promise.all([
        supabase.from('games').select('*'),
        supabase.from('news').select('*'),
        supabase.from('profiles').select('*'),
        supabase.from('admin_users').select('*')
      ]);

      // Handle potential errors
      if (gamesResult.error) throw gamesResult.error;
      if (newsResult.error) throw newsResult.error;
      if (profilesResult.error) throw profilesResult.error;
      if (adminUsersResult.error) console.warn('Admin users query failed:', adminUsersResult.error);

      const games = gamesResult.data || [];
      const news = newsResult.data || [];
      const profiles = profilesResult.data || [];
      const adminUsers = adminUsersResult.data || [];

      // Calculate metrics
      const totalGames = games.length;
      const availableGames = games.filter(g => g.available).length;
      const totalNews = news.length;
      const publishedNews = news.filter(n => n.published).length;
      const totalUsers = profiles.length;
      const adminUserCount = adminUsers.length;

      // Recent activity (within selected time range)
      const recentGames = games.filter(g => 
        g.created_at && new Date(g.created_at) >= startDate
      );
      const recentNews = news.filter(n => 
        n.created_at && new Date(n.created_at) >= startDate
      );
      const recentUsers = profiles.filter(p => 
        p.created_at && new Date(p.created_at) >= startDate
      );

      // Game statistics
      const volatilityStats = games.reduce((acc, game) => {
        const vol = game.volatility?.toLowerCase() || 'medium';
        if (vol.includes('high')) acc.high++;
        else if (vol.includes('low')) acc.low++;
        else acc.medium++;
        return acc;
      }, { high: 0, medium: 0, low: 0 });

      // Content metrics
      const rtpValues = games
        .map(g => parseFloat(g.rtp?.replace('%', '') || '0'))
        .filter(rtp => rtp > 0);
      
      const averageRTP = rtpValues.length > 0 
        ? (rtpValues.reduce((sum, rtp) => sum + rtp, 0) / rtpValues.length).toFixed(2) + '%'
        : 'N/A';

      const volatilityCounts = games.reduce((acc, game) => {
        const vol = game.volatility || 'Medium';
        acc[vol] = (acc[vol] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const mostCommonVolatility = Object.entries(volatilityCounts)
        .sort(([,a], [,b]) => b - a)[0]?.[0] || 'Medium';

      const totalFeatures = games.filter(g => g.features && g.features.trim()).length;

      const analyticsData: AnalyticsData = {
        totalGames,
        availableGames,
        totalNews,
        publishedNews,
        totalUsers,
        adminUsers: adminUserCount,
        recentActivity: {
          newGamesThisWeek: recentGames.length,
          newNewsThisWeek: recentNews.length,
          newUsersThisWeek: recentUsers.length,
        },
        gameStats: {
          highVolatilityGames: volatilityStats.high,
          mediumVolatilityGames: volatilityStats.medium,
          lowVolatilityGames: volatilityStats.low,
        },
        contentMetrics: {
          averageRTP,
          mostCommonVolatility,
          totalFeatures,
        }
      };

      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error fetching analytics:', error);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-dark-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-brand-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white font-body">Loading analytics...</p>
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
            onClick={fetchAnalytics}
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
            Analytics Dashboard
          </h1>
          <p className="text-lg text-gray-300 font-body">
            Comprehensive insights into your content, users, and platform performance.
          </p>
        </div>

        {analytics && (
          <>
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {/* Total Games */}
              <div className="bg-black/30 p-6 rounded-xl border border-gray-800 hover:border-brand-orange/30 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Gamepad2 className="text-blue-400" size={24} />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white font-heading">{analytics.totalGames}</div>
                    <div className="text-sm text-gray-400 font-body">Total Games</div>
                  </div>
                </div>
                <div className="text-xs text-gray-500 font-body">
                  {analytics.availableGames} available • {analytics.totalGames - analytics.availableGames} coming soon
                </div>
              </div>

              {/* Total News */}
              <div className="bg-black/30 p-6 rounded-xl border border-gray-800 hover:border-brand-orange/30 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <Newspaper className="text-green-400" size={24} />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white font-heading">{analytics.totalNews}</div>
                    <div className="text-sm text-gray-400 font-body">News Articles</div>
                  </div>
                </div>
                <div className="text-xs text-gray-500 font-body">
                  {analytics.publishedNews} published • {analytics.totalNews - analytics.publishedNews} drafts
                </div>
              </div>

              {/* Total Users */}
              <div className="bg-black/30 p-6 rounded-xl border border-gray-800 hover:border-brand-orange/30 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <Users className="text-purple-400" size={24} />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white font-heading">{analytics.totalUsers}</div>
                    <div className="text-sm text-gray-400 font-body">Total Users</div>
                  </div>
                </div>
                <div className="text-xs text-gray-500 font-body">
                  {analytics.adminUsers} admins • {analytics.totalUsers - analytics.adminUsers} regular users
                </div>
              </div>

              {/* Activity Score */}
              <div className="bg-black/30 p-6 rounded-xl border border-gray-800 hover:border-brand-orange/30 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-brand-orange/20 rounded-lg flex items-center justify-center">
                    <Activity className="text-brand-orange" size={24} />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white font-heading">
                      {analytics.recentActivity.newGamesThisWeek + analytics.recentActivity.newNewsThisWeek + analytics.recentActivity.newUsersThisWeek}
                    </div>
                    <div className="text-sm text-gray-400 font-body">Recent Activity</div>
                  </div>
                </div>
                <div className="text-xs text-gray-500 font-body">
                  {getTimeRangeLabel().toLowerCase()}
                </div>
              </div>
            </div>

            {/* Recent Activity Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {/* Recent Activity Breakdown */}
              <div className="bg-black/30 p-8 rounded-xl border border-gray-800">
                <h3 className="text-xl font-heading font-bold text-white mb-6 flex items-center space-x-2">
                  <Calendar className="text-brand-orange" size={20} />
                  <span>Recent Activity ({getTimeRangeLabel()})</span>
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-black/40 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Gamepad2 className="text-blue-400" size={18} />
                      <span className="text-white font-body">New Games</span>
                    </div>
                    <span className="text-2xl font-bold text-blue-400 font-heading">
                      {analytics.recentActivity.newGamesThisWeek}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-black/40 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Newspaper className="text-green-400" size={18} />
                      <span className="text-white font-body">New Articles</span>
                    </div>
                    <span className="text-2xl font-bold text-green-400 font-heading">
                      {analytics.recentActivity.newNewsThisWeek}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-black/40 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Users className="text-purple-400" size={18} />
                      <span className="text-white font-body">New Users</span>
                    </div>
                    <span className="text-2xl font-bold text-purple-400 font-heading">
                      {analytics.recentActivity.newUsersThisWeek}
                    </span>
                  </div>
                </div>
              </div>

              {/* Game Statistics */}
              <div className="bg-black/30 p-8 rounded-xl border border-gray-800">
                <h3 className="text-xl font-heading font-bold text-white mb-6 flex items-center space-x-2">
                  <BarChart3 className="text-brand-orange" size={20} />
                  <span>Game Portfolio Analysis</span>
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-black/40 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <TrendingUp className="text-red-400" size={18} />
                      <span className="text-white font-body">High Volatility</span>
                    </div>
                    <span className="text-2xl font-bold text-red-400 font-heading">
                      {analytics.gameStats.highVolatilityGames}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-black/40 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <BarChart3 className="text-yellow-400" size={18} />
                      <span className="text-white font-body">Medium Volatility</span>
                    </div>
                    <span className="text-2xl font-bold text-yellow-400 font-heading">
                      {analytics.gameStats.mediumVolatilityGames}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-black/40 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Target className="text-green-400" size={18} />
                      <span className="text-white font-body">Low Volatility</span>
                    </div>
                    <span className="text-2xl font-bold text-green-400 font-heading">
                      {analytics.gameStats.lowVolatilityGames}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Metrics */}
            <div className="bg-black/30 p-8 rounded-xl border border-gray-800">
              <h3 className="text-xl font-heading font-bold text-white mb-6 flex items-center space-x-2">
                <Eye className="text-brand-orange" size={20} />
                <span>Content Quality Metrics</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-black/40 rounded-lg">
                  <div className="text-3xl font-bold text-brand-orange mb-2 font-heading">
                    {analytics.contentMetrics.averageRTP}
                  </div>
                  <div className="text-sm text-gray-400 font-body">Average RTP</div>
                  <div className="text-xs text-gray-500 mt-1 font-body">
                    Across all games
                  </div>
                </div>
                
                <div className="text-center p-6 bg-black/40 rounded-lg">
                  <div className="text-3xl font-bold text-brand-orange mb-2 font-heading">
                    {analytics.contentMetrics.mostCommonVolatility}
                  </div>
                  <div className="text-sm text-gray-400 font-body">Most Common Volatility</div>
                  <div className="text-xs text-gray-500 mt-1 font-body">
                    Portfolio preference
                  </div>
                </div>
                
                <div className="text-center p-6 bg-black/40 rounded-lg">
                  <div className="text-3xl font-bold text-brand-orange mb-2 font-heading">
                    {analytics.contentMetrics.totalFeatures}
                  </div>
                  <div className="text-sm text-gray-400 font-body">Games with Features</div>
                  <div className="text-xs text-gray-500 mt-1 font-body">
                    Special mechanics
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link
                to="/admin/games"
                className="group bg-black/30 p-6 rounded-xl border border-gray-800 hover:border-brand-orange/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(234,163,56,0.2)]"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Gamepad2 className="text-blue-400" size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-heading font-bold text-white group-hover:text-brand-orange transition-colors duration-300">
                      Manage Games
                    </h4>
                    <p className="text-sm text-gray-400 font-body">Add or edit game content</p>
                  </div>
                </div>
              </Link>

              <Link
                to="/admin/news"
                className="group bg-black/30 p-6 rounded-xl border border-gray-800 hover:border-brand-orange/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(234,163,56,0.2)]"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Newspaper className="text-green-400" size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-heading font-bold text-white group-hover:text-brand-orange transition-colors duration-300">
                      Manage News
                    </h4>
                    <p className="text-sm text-gray-400 font-body">Create and publish articles</p>
                  </div>
                </div>
              </Link>

              <Link
                to="/admin/users"
                className="group bg-black/30 p-6 rounded-xl border border-gray-800 hover:border-brand-orange/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(234,163,56,0.2)]"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Users className="text-purple-400" size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-heading font-bold text-white group-hover:text-brand-orange transition-colors duration-300">
                      Manage Users
                    </h4>
                    <p className="text-sm text-gray-400 font-body">User accounts and permissions</p>
                  </div>
                </div>
              </Link>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default AnalyticsDashboard;