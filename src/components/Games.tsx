import React from 'react';
import { useInView } from '../hooks/useInView';
import { Link } from 'react-router-dom';

const Games = () => {
  const [titleRef, titleInView] = useInView();
  const [cardsRef, cardsInView] = useInView();

  const games = [
    {
      title: "Zeus: Clockwork Tyrant",
      description: "An oppressive myth-tech world where wilds move, merge, and explode. Powered by our wavE™ mechanic, this game turns tension into payoff.",
      available: true,
      hasImage: true,
      imagePath: "/image.png",
      route: "/games/zeus-clockwork-tyrant"
    },
    {
      title: "Coming Soon",
      description: "More innovative games in development. Stay tuned for our next breakthrough in slot mechanics.",
      available: false,
      hasImage: false
    }
  ];

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

        {/* Game Cards */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {games.map((game, index) => (
            <div
              key={game.title}
              className={`game-card bg-black/30 rounded-xl overflow-hidden border border-gray-800 hover:border-brand-orange/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(234,163,56,0.2)] ${
                cardsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              } ${!game.available ? 'opacity-60' : ''}`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Game Image */}
              {game.hasImage && (
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={game.imagePath} 
                    alt={game.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
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
      </div>
    </section>
  );
};

export default Games;