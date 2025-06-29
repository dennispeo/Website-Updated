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
    image_url: "/image.png",
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
    created_at: '2025-01-01',
    updated_at: '2025-01-01'
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    // Always start with Zeus game to ensure it's visible
    setGames([zeusGame]);
    
    try {
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .eq('available', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.log('Supabase connection issue, using fallback data');
        // Keep Zeus game as fallback
      } else if (data && data.length > 0) {
        // Use Supabase data but ensure Zeus is included
        const hasZeus = data.some(game => game.title.includes('Zeus'));
        if (hasZeus) {
          setGames(data);
        } else {
          setGames([zeusGame, ...data]);
        }
      }
      // If no data from Supabase, Zeus game is already set
    } catch (error) {
      console.log('Error fetching games, using fallback:', error);
      // Zeus game is already set as fallback
    } finally {
      setLoading(false);
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
    created_at: '',
    updated_at: ''
  };

  const allGames = [...games, comingSoonGame];

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
            {allGames.map((game, index) => (
              <div
                key={game.id}
                className={`game-card bg-black/30 rounded-xl overflow-hidden border border-gray-800 hover:border-brand-orange/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(234,163,56,0.2)] ${
                  cardsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                } ${!game.available ? 'opacity-60' : ''}`}
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
                        // Hide image container if it fails to load
                        const container = e.currentTarget.parentElement;
                        if (container) {
                          container.style.display = 'none';
                        }
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
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Games;