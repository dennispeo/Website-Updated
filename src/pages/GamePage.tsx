import React, { useState, useEffect } from 'react';
import { ArrowLeft, Play, Download } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useInView } from '../hooks/useInView';
import { useAnalytics } from '../hooks/useAnalytics';
import { supabase, Game } from '../lib/supabase';
import Footer from '../components/Footer';

const GamePage = () => {
  const [heroRef, heroInView] = useInView();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { gameSlug } = useParams();
  const { trackButtonClick, trackDownload } = useAnalytics();

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

  const handlePlayDemo = () => {
    if (game) {
      trackButtonClick('Play Demo', 'game-demo-button');
      // Here you would typically open the game demo
      alert('Demo functionality would be implemented here');
    }
  };

  const handleDownloadAssets = () => {
    if (game) {
      trackDownload('Game Assets', `/downloads/${game.title.toLowerCase().replace(/\s+/g, '-')}-assets.zip`);
      trackButtonClick('Download Assets', 'download-assets-button');
      // Here you would typically trigger the download
      alert('Asset download would be implemented here');
    }
  };

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

  return (
    <>
      <div className="min-h-screen bg-brand-dark-gradient">
        {/* Hero Section with Background Image */}
        <section className="relative pt-20 pb-12 overflow-hidden">
          {/* Background Image with Maximum Visibility */}
          <div className="absolute inset-0">
            {game.image_url && (
              <img 
                src={game.image_url} 
                alt={game.title}
                className="w-full h-full object-cover opacity-90"
                onError={(e) => {
                  console.log('🎮 GamePage: Hero image failed to load');
                  e.currentTarget.style.display = 'none';
                }}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/70 via-brand-dark/40 to-brand-dark/20"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-transparent to-brand-dark/20"></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Back Button */}
            <div className="mb-8">
              <Link 
                to="/"
                className="inline-flex items-center space-x-2 text-brand-orange hover:text-brand-yellow transition-colors duration-300 font-body"
                onClick={() => trackButtonClick('Back to Games', 'back-button', '/')}
              >
                <ArrowLeft size={20} />
                <span>Back to Games</span>
              </Link>
            </div>

            {/* Game Content - Single Column Layout */}
            <div ref={heroRef} className="max-w-4xl mx-auto text-center space-y-8">
              {/* Game Title and Description */}
              <div>
                <h1 className="text-5xl md:text-7xl font-heading font-black uppercase text-white mb-6 drop-shadow-lg">
                  {titleParts.main}{titleParts.sub && <>: <span className="text-brand-orange">{titleParts.sub}</span></>}
                </h1>
                <p className="text-xl text-white leading-relaxed font-body max-w-3xl mx-auto drop-shadow-md">
                  {game.description}
                </p>
              </div>

              {/* Expanded Stats Grid - Now includes 7 items with Features */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
                <div className="bg-black/80 backdrop-blur-sm p-4 rounded-lg border border-gray-500/60 shadow-lg">
                  <div className="text-2xl font-bold text-brand-orange font-heading">{game.rtp}</div>
                  <div className="text-sm text-white uppercase tracking-wider font-body">RTP</div>
                </div>
                <div className="bg-black/80 backdrop-blur-sm p-4 rounded-lg border border-gray-500/60 shadow-lg">
                  <div className="text-2xl font-bold text-brand-orange font-heading">{game.max_win}</div>
                  <div className="text-sm text-white uppercase tracking-wider font-body">Max Win</div>
                </div>
                <div className="bg-black/80 backdrop-blur-sm p-4 rounded-lg border border-gray-500/60 shadow-lg">
                  <div className="text-2xl font-bold text-brand-orange font-heading">{game.volatility}</div>
                  <div className="text-sm text-white uppercase tracking-wider font-body">Volatility</div>
                </div>
                <div className="bg-black/80 backdrop-blur-sm p-4 rounded-lg border border-gray-500/60 shadow-lg">
                  <div className="text-2xl font-bold text-brand-orange font-heading">{game.hit_frequency}</div>
                  <div className="text-sm text-white uppercase tracking-wider font-body">Hit Rate</div>
                </div>
                <div className="bg-black/80 backdrop-blur-sm p-4 rounded-lg border border-gray-500/60 shadow-lg">
                  <div className="text-2xl font-bold text-brand-orange font-heading">{game.reels_rows}</div>
                  <div className="text-sm text-white uppercase tracking-wider font-body">Reel Layout</div>
                </div>
                <div className="bg-black/80 backdrop-blur-sm p-4 rounded-lg border border-gray-500/60 shadow-lg">
                  <div className="text-2xl font-bold text-brand-orange font-heading">{game.free_spins}</div>
                  <div className="text-sm text-white uppercase tracking-wider font-body">Free Spins</div>
                </div>
                <div className="bg-black/80 backdrop-blur-sm p-4 rounded-lg border border-gray-500/60 shadow-lg col-span-2 md:col-span-1">
                  <div className="text-2xl font-bold text-brand-orange font-heading">{game.features || 'Standard'}</div>
                  <div className="text-sm text-white uppercase tracking-wider font-body">Features</div>
                </div>
              </div>

              {/* Betting Range */}
              <div className="bg-black/80 backdrop-blur-sm p-6 rounded-xl border border-gray-500/60 shadow-lg max-w-md mx-auto">
                <h3 className="text-lg font-heading font-bold text-white mb-4">Betting Range</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xl font-bold text-brand-orange font-heading">{game.min_bet}</div>
                    <div className="text-sm text-white font-body">Minimum Bet</div>
                  </div>
                  <div className="text-gray-300">—</div>
                  <div>
                    <div className="text-xl font-bold text-brand-orange font-heading">{game.max_bet}</div>
                    <div className="text-sm text-white font-body">Maximum Bet</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={handlePlayDemo}
                  className="group flex items-center justify-center space-x-3 bg-brand-gradient text-brand-dark font-bold uppercase tracking-wider py-4 px-8 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(234,163,56,0.6)] font-body shadow-lg"
                >
                  <Play size={20} />
                  <span>Play Demo</span>
                </button>
                <button 
                  onClick={handleDownloadAssets}
                  className="group flex items-center justify-center space-x-3 border-2 border-brand-orange text-brand-orange font-bold uppercase tracking-wider py-4 px-8 rounded-lg transition-all duration-300 hover:bg-brand-orange hover:text-brand-dark font-body shadow-lg"
                >
                  <Download size={20} />
                  <span>Download Assets</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Game Details Section - Only Release Dates */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-6">
                Release <span className="text-brand-orange">Timeline</span>
              </h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto font-body">
                Important dates for {game.title} availability and launch.
              </p>
            </div>

            {/* Release Timeline - Only the dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="bg-black/30 p-8 rounded-xl border border-gray-800 hover:border-brand-orange/30 transition-all duration-300">
                <h3 className="text-xl font-heading font-bold text-brand-orange mb-4">Early Access</h3>
                <div className="text-3xl font-bold text-white mb-2 font-heading">
                  {formatDate(game.early_access_date)}
                </div>
                <p className="text-gray-400 font-body">Exclusive partner preview and testing phase</p>
              </div>
              <div className="bg-black/30 p-8 rounded-xl border border-gray-800 hover:border-brand-orange/30 transition-all duration-300">
                <h3 className="text-xl font-heading font-bold text-brand-orange mb-4">Full Release</h3>
                <div className="text-3xl font-bold text-white mb-2 font-heading">
                  {formatDate(game.release_date)}
                </div>
                <p className="text-gray-400 font-body">Global market launch and wide availability</p>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default GamePage;