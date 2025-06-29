import React, { useState, useEffect } from 'react';
import { ArrowLeft, Play, Download, Info, Zap, Target, TrendingUp, Shield, Gamepad2, BarChart3 } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useInView } from '../hooks/useInView';
import { supabase, Game } from '../lib/supabase';
import Footer from '../components/Footer';

const GamePage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [heroRef, heroInView] = useInView();
  const [statsRef, statsInView] = useInView();
  const [mechanicsRef, mechanicsInView] = useInView();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { gameSlug } = useParams();

  useEffect(() => {
    fetchGame();
  }, [gameSlug]);

  const fetchGame = async () => {
    console.log('🎮 GamePage: fetchGame started for slug:', gameSlug);
    
    if (!gameSlug) {
      setError('No game specified');
      setLoading(false);
      return;
    }

    try {
      console.log('🎮 GamePage: Attempting to fetch from Supabase...');
      
      // Try to find game by route first
      const route = `/games/${gameSlug}`;
      console.log('🎮 GamePage: Looking for route:', route);
      
      let { data, error: fetchError } = await supabase
        .from('games')
        .select('*')
        .eq('route', route)
        .eq('available', true)
        .single();

      if (fetchError || !data) {
        console.log('🎮 GamePage: Route match failed, trying slug-based search...');
        
        // Try to find by slug in title (convert slug to title format)
        const titleSearch = gameSlug
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        
        console.log('🎮 GamePage: Searching for title containing:', titleSearch);
        
        const titleResult = await supabase
          .from('games')
          .select('*')
          .ilike('title', `%${titleSearch}%`)
          .eq('available', true)
          .single();

        if (titleResult.error || !titleResult.data) {
          console.log('🎮 GamePage: Title search failed, trying exact slug match...');
          
          // Last attempt: try to find any available game that matches the slug pattern
          const slugResult = await supabase
            .from('games')
            .select('*')
            .eq('available', true);

          if (slugResult.error || !slugResult.data || slugResult.data.length === 0) {
            throw new Error(`Game "${gameSlug}" not found or not available`);
          }

          // Find the first matching game
          const matchingGame = slugResult.data.find(g => 
            g.route.includes(gameSlug) || 
            g.title.toLowerCase().includes(gameSlug.replace('-', ' '))
          );

          if (!matchingGame) {
            throw new Error(`Game "${gameSlug}" not found or not available`);
          }

          data = matchingGame;
        } else {
          data = titleResult.data;
        }
      }

      console.log('🎮 GamePage: Successfully loaded game:', data);
      setGame(data);
      
    } catch (error) {
      console.error('🎮 GamePage: Error fetching game:', error);
      setError(error instanceof Error ? error.message : 'Failed to load game');
    } finally {
      setLoading(false);
    }
  };

  // Dynamic mechanics based on game data - purely from database
  const getMechanics = (game: Game) => {
    const mechanics = [];

    // Add mechanics based on game characteristics
    if (game.volatility === 'High') {
      mechanics.push({
        name: 'High Volatility System',
        description: `Experience ${game.volatility.toLowerCase()} volatility gameplay with potential for massive wins up to ${game.max_win}`,
        icon: <TrendingUp className="text-brand-orange" size={24} />
      });
    } else {
      mechanics.push({
        name: `${game.volatility} Volatility`,
        description: `Balanced ${game.volatility.toLowerCase()} volatility gameplay designed for consistent entertainment`,
        icon: <TrendingUp className="text-brand-orange" size={24} />
      });
    }

    mechanics.push({
      name: 'Advanced RTP',
      description: `Optimized ${game.rtp} return-to-player rate ensuring fair and competitive gameplay`,
      icon: <BarChart3 className="text-brand-orange" size={24} />
    });

    mechanics.push({
      name: 'Hit Frequency',
      description: `${game.hit_frequency} hit frequency provides regular winning opportunities`,
      icon: <Target className="text-brand-orange" size={24} />
    });

    mechanics.push({
      name: 'Bonus Features',
      description: `Free spins trigger ${game.free_spins} with exciting bonus rounds and multipliers`,
      icon: <Zap className="text-brand-orange" size={24} />
    });

    return mechanics;
  };

  const getFeatures = (game: Game) => [
    { label: 'RTP', value: game.rtp, icon: <BarChart3 size={16} /> },
    { label: 'Volatility', value: game.volatility, icon: <TrendingUp size={16} /> },
    { label: 'Max Win', value: game.max_win, icon: <Target size={16} /> },
    { label: 'Reels Layout', value: game.reels_rows, icon: <Gamepad2 size={16} /> }
  ];

  // Helper function to safely format dates
  const formatDate = (dateString: string) => {
    if (!dateString) return 'TBA';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'TBA';
    }
  };

  // Helper function to split title safely
  const getTitleParts = (title: string) => {
    if (!title) return { main: 'Game', sub: '' };
    const parts = title.split(':');
    return {
      main: parts[0]?.trim() || title,
      sub: parts[1]?.trim() || ''
    };
  };

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

  if (error || !game) {
    return (
      <div className="min-h-screen bg-brand-dark-gradient flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-heading font-bold text-white mb-4">
            {error || 'Game Not Found'}
          </h1>
          <p className="text-gray-400 mb-6 font-body">
            The game you're looking for is not available or doesn't exist.
          </p>
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

  const titleParts = getTitleParts(game.title);
  const mechanics = getMechanics(game);
  const features = getFeatures(game);

  return (
    <>
      <div className="min-h-screen bg-brand-dark-gradient">
        {/* Hero Section */}
        <section className="relative pt-20 pb-12 overflow-hidden">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0">
            {game.image_url && (
              <img 
                src={game.image_url} 
                alt={game.title}
                className="w-full h-full object-cover opacity-30"
                onError={(e) => {
                  console.log('🎮 GamePage: Hero image failed to load');
                  e.currentTarget.style.display = 'none';
                }}
              />
            )}
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

            {/* Game Content */}
            <div ref={heroRef} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Game Info */}
              <div className="space-y-8">
                <div>
                  <h1 className="text-5xl md:text-7xl font-heading font-black uppercase text-white mb-4">
                    {titleParts.main}{titleParts.sub && <>: <span className="text-brand-orange">{titleParts.sub}</span></>}
                  </h1>
                  <p className="text-xl text-gray-300 leading-relaxed font-body">
                    {game.description}
                  </p>
                </div>

                {/* Expanded Stats Grid - Now includes 6 items */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
                  <div className="bg-black/40 p-4 rounded-lg border border-gray-800">
                    <div className="text-2xl font-bold text-brand-orange font-heading">{game.reels_rows}</div>
                    <div className="text-sm text-gray-400 uppercase tracking-wider font-body">Reel Layout</div>
                  </div>
                  <div className="bg-black/40 p-4 rounded-lg border border-gray-800">
                    <div className="text-2xl font-bold text-brand-orange font-heading">{game.free_spins}</div>
                    <div className="text-sm text-gray-400 uppercase tracking-wider font-body">Free Spins</div>
                  </div>
                </div>

                {/* Betting Range */}
                <div className="bg-black/30 p-6 rounded-xl border border-gray-800">
                  <h3 className="text-lg font-heading font-bold text-white mb-4">Betting Range</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xl font-bold text-brand-orange font-heading">{game.min_bet}</div>
                      <div className="text-sm text-gray-400 font-body">Minimum Bet</div>
                    </div>
                    <div className="text-gray-400">—</div>
                    <div>
                      <div className="text-xl font-bold text-brand-orange font-heading">{game.max_bet}</div>
                      <div className="text-sm text-gray-400 font-body">Maximum Bet</div>
                    </div>
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
                  {game.image_url ? (
                    <img 
                      src={game.image_url} 
                      alt={`${game.title} Preview`}
                      className="w-full rounded-lg shadow-2xl"
                      onError={(e) => {
                        console.log('🎮 GamePage: Preview image failed to load');
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-64 bg-gray-800 rounded-lg flex items-center justify-center">
                      <p className="text-gray-400 font-body">Game Preview Coming Soon</p>
                    </div>
                  )}
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
                    {game.title}
                  </h2>
                  <p className="text-lg text-gray-300 leading-relaxed font-body">
                    {game.description}
                  </p>
                </div>

                {/* Release Timeline */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                  <div className="bg-black/30 p-8 rounded-xl border border-gray-800">
                    <h3 className="text-xl font-heading font-bold text-brand-orange mb-4">Early Access</h3>
                    <div className="text-3xl font-bold text-white mb-2 font-heading">
                      {formatDate(game.early_access_date)}
                    </div>
                    <p className="text-gray-400 font-body">Exclusive partner preview</p>
                  </div>
                  <div className="bg-black/30 p-8 rounded-xl border border-gray-800">
                    <h3 className="text-xl font-heading font-bold text-brand-orange mb-4">Full Release</h3>
                    <div className="text-3xl font-bold text-white mb-2 font-heading">
                      {formatDate(game.release_date)}
                    </div>
                    <p className="text-gray-400 font-body">Global market launch</p>
                  </div>
                </div>
              </div>
            )}

            {/* Mechanics Tab */}
            {activeTab === 'mechanics' && (
              <div ref={mechanicsRef}>
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-6">
                    Game <span className="text-brand-orange">Mechanics</span>
                  </h2>
                  <p className="text-lg text-gray-300 max-w-3xl mx-auto font-body">
                    Advanced features designed to create engaging and rewarding gameplay experiences.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                  {mechanics.map((mechanic, index) => (
                    <div
                      key={mechanic.name}
                      className="bg-black/30 p-8 rounded-xl border border-gray-800 hover:border-brand-orange/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(234,163,56,0.2)]"
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
              <div ref={statsRef}>
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
                    { label: 'Release Date', value: formatDate(game.release_date), description: 'Official launch date' }
                  ].map((stat, index) => (
                    <div
                      key={stat.label}
                      className="bg-black/30 p-6 rounded-xl border border-gray-800 hover:border-brand-orange/30 transition-all duration-300"
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

export default GamePage;