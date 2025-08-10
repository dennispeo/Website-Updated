import React from 'react';
import { useInView } from '../hooks/useInView';

const About = () => {
  const [titleRef, titleInView] = useInView();
  const [contentRef, contentInView] = useInView();
  const [gridRef, gridInView] = useInView();

  const features = [
  {
    "title": "Mechanics That Break Convention",
    "description": "We don't replicate features. Every mechanic is crafted to challenge the norm, built as a modular and dynamic system that expands what slot games are capable of."
  },
  {
    "title": "AI-Enhanced Development",
    "description": "We apply AI tools to speed up design and production cycles. This allows us to prototype faster, validate ideas quickly, and maintain a high creative standard throughout."
  },
  {
    "title": "Custom-Built, Fast to Market",
    "description": "Our platform enables rapid delivery of bespoke games tailored to your audience, market preferences, and regulatory needs. Speed never comes at the cost of precision."
  },
  {
    "title": "Co-Creation with Our Partners",
    "description": "We work side by side with our partners to align every game with their strategy and player base. From early design to final polish, you're involved in shaping a product built for your success."
  }
];

  return (
    <section id="about" className="py-20 bg-brand-dark-gradient">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div ref={titleRef} className={`text-center mb-16 transition-all duration-500 ${
          titleInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
        }`}>
          <h2 className="text-4xl md:text-6xl font-heading font-black uppercase tracking-wider text-white mb-4">
            Who We <span className="text-brand-orange">ARE</span>
          </h2>
        </div>

        {/* Content */}
        <div ref={contentRef} className={`text-center mb-16 transition-all duration-600 ${
          contentInView ? 'opacity-100' : 'opacity-0'
        }`}>
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-4xl mx-auto font-body">
            We founded PlayEola to offer something the market was missing: originality.
            Our games don't chase templates. They're powered by a modular system and a creative process designed to deliver real differentiation to our partners.
          </p>
        </div>

        {/* Feature Grid */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`feature-card bg-black/30 p-8 rounded-xl border border-gray-800 hover:border-brand-orange/50 transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(234,163,56,0.2)] ${
                gridInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <h3 className="text-xl font-heading font-bold uppercase tracking-wider text-brand-orange mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-300 leading-relaxed font-body">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;