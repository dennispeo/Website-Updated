import React, { useState, useEffect } from 'react';
import { ArrowLeft, Play, Download, Info, Zap, Target, TrendingUp, Shield, Gamepad2, BarChart3 } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useInView } from '../hooks/useInView';
import { supabase, Game } from '../lib/supabase';
import Footer from '../components/Footer';

const ZeusGamePage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [heroRef, heroInView] = useInView();
  const [statsRef, statsInView] = useInView();
  const [mechanicsRef, mechanicsInView] = useInView();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const { gameSlug } = useParams();

  useEffect(() => {
    fetchGame();
  }, [gameSlug]);

  const fetchGame = async () => {
    try {
      // Try to fetch from Supabase first
      const route = `/games/${gameSlug || 'zeus-clockwork-tyrant'}`;
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .eq('route', route)
        .single();

      if (error) throw error;
      setGame(data);
    } catch (error) {
      console.error('Error fetching game:', error);
      // Fallback to static Zeus data
      setGame({
        id: '1',
        title: 'Zeus: Clockwork Tyrant',
        description: 'Enter an oppressive myth-tech world where ancient power meets mechanical precision. Experience the revolutionary wavE™ mechanic that transforms every spin into digital chaos.',
        image_url: '/image.png',
        route: '/games/zeus-clockwork-tyrant',
        rtp: '96.06%',
        volatility: 'High',
        hit_frequency: '31.41%',
        max_win: '99,999x',
        free_spins: '1 in 249',
        reels_rows: '3-2-3-2-3',
        min_bet: '€0.20',
        max_bet: '€100.00',
        release_date: '2025-03-25',
        early_access_date: '2025-03-17',
        available: true,
        created_at: '2025-01-01',
        updated_at: '2025-01-01'
      });
    } finally {
      setLoading(false);
    }
  };

  const mechanics = [
    {
      name: 'wavE™ Mechanic',
      description: 'Revolutionary wild movement system that creates cascading wins',
      icon: <Zap className="text-brand-orange" size={24} />
    },
    {
      name: 'Clockwork Wilds',
      description: 'Mechanical wilds that expand and merge across reels',
      icon: <Target className="text-brand-orange" size={24} />
    },
    {
      name: 'Tyrant Mode',
      description: 'High-tension bonus round with multiplying chaos',
      icon: <TrendingUp className="text-brand-orange" size={24} />
    },
    {
      name: 'Divine Intervention',
      description: 'Random feature triggers that amplify winning potential',
      icon: <Shield className="text-brand-orange" size={24} />
    }
  ];

  const features = [
    { label: 'Feature Buy-in', value: 'Yes', icon: <Gamepad2 size={16} /> },
    { label: 'Bonus Mode', value: 'Yes', icon: <Target size={16} /> },
    { label: 'Max Payout Probability', value: '1 in 16m', icon: <BarChart3 size={16} /> },
    { label: 'Game Features', value: 'Advanced', icon: <Zap size={16} /> }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-dark-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-brand-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white font-body">Loading game...</p>
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen bg-brand-dark-gradient flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-heading font-bold text-white mb-4">Game Not Found</h1>
          <Link 
            to="/"
            className="text-brand-orange hover:text-brand-yellow transition-colors duration-300 font-body"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-brand-dark-gradient">
        {/* Hero Section */}
        <section className="relative pt-20 pb-12 overflow-hidden">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0">
            <img 
              src={game.image_url} 
              alt={game.title}
              className="w-full h-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-brand-dark via-brand-dark/80 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-brand-dark/50"></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Back Button */}
            <div className="mb-8">
              <Link 
                to="/"
                className="inline-flex items-center space-x-2 text-brand-orange hover:text-brand-yellow transition-colors duration-300 font-body"
              >
                <ArrowLeft size={20} />
                <span>Back to Games</span>
              </Link>
            </div>

            <div ref={heroRef} className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center transition-all duration-800 ${
              heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              {/* Game Info */}
              <div className="space-y-8">
                <div>
                  <h1 className="text-5xl md:text-7xl font-heading font-black uppercase text-white mb-4">
                    {game.title.split(':')[0]}: <span className="text-brand-orange">{game.title.split(':')[1]?.trim()}</span>
                  </h1>
                  <p className="text-xl text-gray-300 leading-relaxed font-body">
                    {game.description}
                  </p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-black/40 p-4 rounded-lg border border-gray-800">
                    <div className="text-2xl font-bold text-brand-orange font-heading">{game.rtp}</div>
                    <div className="text-sm text-gray-400 uppercase tracking-wider font-body">RTP</div>
                  </div>
                  <div className="bg-black/40 p-4 rounded-lg border border-gray-800">
                    <div className="text-2xl font-bold text-brand-orange font-heading">{game.max_win}</div>
                    <div className="text-sm text-gray-400 uppercase tracking-wider font-body">Max Win</div>
                  </div>
                  <div className="bg-black/40 p-4 rounded-lg border border-gray-800">
                    <div className="text-2xl font-bold text-brand-orange font-heading">{game.volatility}</div>
                    <div className="text-sm text-gray-400 uppercase tracking-wider font-body">Volatility</div>
                  </div>
                  <div className="bg-black/40 p-4 rounded-lg border border-gray-800">
                    <div className="text-2xl font-bold text-brand-orange font-heading">{game.hit_frequency}</div>
                    <div className="text-sm text-gray-400 uppercase tracking-wider font-body">Hit Rate</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="group flex items-center justify-center space-x-3 bg-brand-gradient text-brand-dark font-bold uppercase tracking-wider py-4 px-8 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(234,163,56,0.6)] font-body">
                    <Play size={20} />
                    <span>Play Demo</span>
                  </button>
                  <button className="group flex items-center justify-center space-x-3 border-2 border-brand-orange text-brand-orange font-bold uppercase tracking-wider py-4 px-8 rounded-lg transition-all duration-300 hover:bg-brand-orange hover:text-brand-dark font-body">
                    <Download size={20} />
                    <span>Download Assets</span>
                  </button>
                </div>
              </div>

              {/* Game Preview */}
              <div className="relative">
                <div className="bg-black/20 p-8 rounded-2xl border border-gray-800 backdrop-blur-sm">
                  <img 
                    src={game.image_url} 
                    alt={`${game.title} Preview`}
                    className="w-full rounded-lg shadow-2xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-2xl"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Navigation Tabs */}
        <section className="sticky top-16 z-40 bg-brand-dark/90 backdrop-blur-sm border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-8 overflow-x-auto">
              {[
                { id: 'overview', label: 'Overview', icon: <Info size={18} /> },
                { id: 'mechanics', label: 'Mechanics', icon: <Zap size={18} /> },
                { id: 'statistics', label: 'Statistics', icon: <BarChart3 size={18} /> }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition-all duration-300 font-body whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-brand-orange text-brand-orange'
                      : 'border-transparent text-gray-400 hover:text-white'
                  }`}
                >
                  {tab.icon}
                  <span className="font-semibold uppercase tracking-wider">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Content Sections */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-16">
                {/* Game Description */}
                <div className="max-w-4xl mx-auto text-center">
                  <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-6">
                    Digital Chaos Unleashed
                  </h2>
                  <p className="text-lg text-gray-300 leading-relaxed font-body">
                    {game.title} represents the pinnacle of our Digital Chaos philosophy. 
                    This isn't just another slot game—it's a mechanical symphony where every component 
                    works in perfect discord to create moments of pure tension and explosive payoff.
                  </p>
                </div>

                {/* Release Timeline */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                  <div className="bg-black/30 p-8 rounded-xl border border-gray-800">
                    <h3 className="text-xl font-heading font-bold text-brand-orange mb-4">Early Access</h3>
                    <div className="text-3xl font-bold text-white mb-2 font-heading">
                      {new Date(game.early_access_date).toLocaleDateString()}
                    </div>
                    <p className="text-gray-400 font-body">Exclusive partner preview</p>
                  </div>
                  <div className="bg-black/30 p-8 rounded-xl border border-gray-800">
                    <h3 className="text-xl font-heading font-bold text-brand-orange mb-4">Full Release</h3>
                    <div className="text-3xl font-bold text-white mb-2 font-heading">
                      {new Date(game.release_date).toLocaleDateString()}
                    </div>
                    <p className="text-gray-400 font-body">Global market launch</p>
                  </div>
                </div>
              </div>
            )}

            {/* Mechanics Tab */}
            {activeTab === 'mechanics' && (
              <div ref={mechanicsRef} className={`transition-all duration-800 ${
                mechanicsInView ? 'opacity-100' : 'opacity-0'
              }`}>
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-6">
                    Revolutionary <span className="text-brand-orange">Mechanics</span>
                  </h2>
                  <p className="text-lg text-gray-300 max-w-3xl mx-auto font-body">
                    Each mechanic is designed to break convention and create unprecedented player engagement.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                  {mechanics.map((mechanic, index) => (
                    <div
                      key={mechanic.name}
                      className={`bg-black/30 p-8 rounded-xl border border-gray-800 hover:border-brand-orange/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(234,163,56,0.2)] ${
                        mechanicsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                      }`}
                      style={{ transitionDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 p-3 bg-brand-orange/10 rounded-lg">
                          {mechanic.icon}
                        </div>
                        <div>
                          <h3 className="text-xl font-heading font-bold text-white mb-3">
                            {mechanic.name}
                          </h3>
                          <p className="text-gray-300 leading-relaxed font-body">
                            {mechanic.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {features.map((feature, index) => (
                    <div
                      key={feature.label}
                      className="bg-black/30 p-6 rounded-lg border border-gray-800 text-center"
                    >
                      <div className="flex justify-center mb-3 text-brand-orange">
                        {feature.icon}
                      </div>
                      <div className="text-lg font-bold text-white mb-1 font-heading">{feature.value}</div>
                      <div className="text-sm text-gray-400 font-body">{feature.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Statistics Tab */}
            {activeTab === 'statistics' && (
              <div ref={statsRef} className={`transition-all duration-800 ${
                statsInView ? 'opacity-100' : 'opacity-0'
              }`}>
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-6">
                    Game <span className="text-brand-orange">Statistics</span>
                  </h2>
                  <p className="text-lg text-gray-300 max-w-3xl mx-auto font-body">
                    Comprehensive technical specifications and performance metrics.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[
                    { label: 'Return to Player', value: game.rtp, description: 'Theoretical return percentage' },
                    { label: 'Volatility Level', value: game.volatility, description: 'Risk and reward balance' },
                    { label: 'Hit Frequency', value: game.hit_frequency, description: 'Winning spin probability' },
                    { label: 'Maximum Win', value: game.max_win, description: 'Highest possible payout' },
                    { label: 'Free Spins Trigger', value: game.free_spins, description: 'Bonus round frequency' },
                    { label: 'Reel Configuration', value: game.reels_rows, description: 'Game grid layout' },
                    { label: 'Minimum Bet', value: game.min_bet, description: 'Lowest stake amount' },
                    { label: 'Maximum Bet', value: game.max_bet, description: 'Highest stake amount' },
                    { label: 'Max Win Probability', value: '1 in 16m', description: 'Jackpot hit frequency' }
                  ].map((stat, index) => (
                    <div
                      key={stat.label}
                      className={`bg-black/30 p-6 rounded-xl border border-gray-800 hover:border-brand-orange/30 transition-all duration-300 ${
                        statsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                      }`}
                      style={{ transitionDelay: `${index * 50}ms` }}
                    >
                      <div className="text-2xl font-bold text-brand-orange mb-2 font-heading">{stat.value}</div>
                      <div className="text-lg font-semibold text-white mb-2 font-heading">{stat.label}</div>
                      <div className="text-sm text-gray-400 font-body">{stat.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default ZeusGamePage;