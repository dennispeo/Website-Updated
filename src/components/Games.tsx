import React, { useState, useEffect } from 'react';
import { useInView } from '../hooks/useInView';
import { Link } from 'react-router-dom';
import { supabase, Game } from '../lib/supabase';

const Games = () => {
  const [titleRef, titleInView] = useInView();
  const [cardsRef, cardsInView] = useInView();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  // Define Zeus game data as a constant to ensure it's always available
  const zeusGame: Game = {
    id: '1',
    title: "Zeus: Clockwork Tyrant",
    description: "An oppressive myth-tech world where wilds move, merge, and explode. Powered by our wavE™ mechanic, this game turns tension into payoff.",
    image_url: "https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    route: "/games/zeus-clockwork-tyrant",
    available: true,
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
    features: 'wavE',
    created_at: '2025-01-01',
    updated_at: '2025-01-01'
  };

  useEffect(() => {
    fetchGames();
  }, []);

  // Add useEffect to log games state changes
  useEffect(() => {
    console.log('🎮 Games state updated:', games);
  }, [games]);

  const fetchGames = async () => {
    console.log('🎮 fetchGames started');
    
    // Initialize with fallback data
    let finalGames: Game[] = [zeusGame];
    
    try {
      console.log('🎮 Attempting to fetch from Supabase...');
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .eq('available', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.log('🎮 Supabase error occurred:', error);
        console.log('🎮 Using fallback data (Zeus game only)');
        // finalGames already set to [zeusGame]
      } else if (data && data.length > 0) {
        console.log('🎮 Supabase data received:', data);
        
        // Check if Zeus is already in the Supabase data
        const hasZeus = data.some(game => game.title.includes('Zeus'));
        console.log('🎮 Does Supabase data include Zeus?', hasZeus);
        
        if (hasZeus) {
          console.log('🎮 Using Supabase data (includes Zeus)');
          finalGames = data;
        } else {
          console.log('🎮 Adding Zeus to Supabase data');
          finalGames = [zeusGame, ...data];
        }
      } else {
        console.log('🎮 No data from Supabase, using Zeus game only');
        // finalGames already set to [zeusGame]
      }
    } catch (error) {
      console.log('🎮 Error fetching games:', error);
      console.log('🎮 Using fallback (Zeus game only)');
      // finalGames already set to [zeusGame]
    } finally {
      console.log('🎮 Final games array to set:', finalGames);
      
      // Single state update with final data
      setGames(finalGames);
      setLoading(false);
      
      console.log('🎮 State updates completed');
    }
  };

  const comingSoonGame = {
    id: 'coming-soon',
    title: "Coming Soon",
    description: "More innovative games in development. Stay tuned for our next breakthrough in slot mechanics.",
    image_url: "",
    route: "",
    available: false,
    rtp: '',
    volatility: '',
    hit_frequency: '',
    max_win: '',
    free_spins: '',
    reels_rows: '',
    min_bet: '',
    max_bet: '',
    release_date: '',
    early_access_date: '',
    features: '',
    created_at: '',
    updated_at: ''
  };

  const allGames = [...games, comingSoonGame];
  
  console.log('🎮 Render - loading:', loading);
  console.log('🎮 Render - games:', games);
  console.log('🎮 Render - allGames:', allGames);

  return (
    <section id="games" className="py-20 bg-brand-dark-gradient">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div ref={titleRef} className="text-center mb-16">
          <h2 className={`text-4xl md:text-6xl font-heading font-black uppercase mb-8 transition-all duration-500 ${
            titleInView ? 'opacity-100' : 'opacity-0'
          }`}>
            <span className={`inline-block transition-all duration-500 ${
              titleInView ? 'translate-y-0' : 'translate-y-4'
            }`}>From Concept</span>{' '}
            <span className={`inline-block text-brand-orange transition-all duration-500 delay-100 ${
              titleInView ? 'translate-y-0' : 'translate-y-4'
            }`}>to Chaos</span>
          </h2>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-brand-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white font-body">Loading games...</p>
          </div>
        )}

        {/* Game Cards */}
        {!loading && (
          <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {allGames.map((game, index) => {
              console.log('🎮 Rendering game:', game.title, 'Available:', game.available);
              
              return (
                <div
                  key={game.id}
                  className={`game-card bg-black/30 rounded-xl overflow-hidden border border-gray-800 hover:border-brand-orange/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(234,163,56,0.2)] ${!game.available ? 'opacity-60' : ''}`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  {/* Game Image */}
                  {game.image_url && (
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={game.image_url} 
                        alt={game.title}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        onError={(e) => {
                          console.log('🎮 Image failed to load for:', game.title);
                          // Hide image container if it fails to load
                          const container = e.currentTarget.parentElement;
                          if (container) {
                            container.style.display = 'none';
                          }
                        }}
                        onLoad={() => {
                          console.log('🎮 Image loaded successfully for:', game.title);
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    </div>
                  )}

                  {/* Game Content */}
                  <div className="p-8">
                    <h3 className="text-2xl font-heading font-bold text-white mb-4">
                      {game.title}
                    </h3>

                    <p className="text-gray-300 leading-relaxed mb-8 font-body">
                      {game.description}
                    </p>
                    
                    {game.available && game.route ? (
                      <Link
                        to={game.route}
                        className="block w-full py-3 px-6 border-2 border-white text-white hover:bg-white hover:text-brand-dark font-bold uppercase tracking-wider transition-all duration-300 rounded-lg font-body text-center"
                      >
                        Enter Game
                      </Link>
                    ) : (
                      <button
                        className="w-full py-3 px-6 border-2 border-gray-600 text-gray-600 cursor-not-allowed font-bold uppercase tracking-wider transition-all duration-300 rounded-lg font-body"
                        disabled={!game.available}
                      >
                        Coming Soon
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Debug Info */}
        {!loading && allGames.length === 0 && (
          <div className="text-center py-12">
            <p className="text-red-400 font-body">No games found. Debug info:</p>
            <p className="text-gray-400 font-body text-sm mt-2">
              Games array length: {games.length}, Loading: {loading.toString()}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Games;