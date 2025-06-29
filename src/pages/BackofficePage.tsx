import React from 'react';
import { useInView } from '../hooks/useInView';
import { BarChart3, Eye, Shield, Zap, Database, TrendingUp, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

const BackofficePage = () => {
  const [titleRef, titleInView] = useInView();
  const [introRef, introInView] = useInView();
  const [featuresRef, featuresInView] = useInView();

  const features = [
    {
      icon: <Eye size={32} />,
      title: "Real-Time Sessions",
      description: "Watch every spin, every win, every player action as it happens. No delays, no gaps."
    },
    {
      icon: <BarChart3 size={32} />,
      title: "Performance Analytics",
      description: "Deep dive into game performance, player behavior, and revenue streams with surgical precision."
    },
    {
      icon: <Shield size={32} />,
      title: "Compliance Logs",
      description: "Complete audit trails and regulatory reporting. Stay compliant, stay confident."
    },
    {
      icon: <Database size={32} />,
      title: "Multi-Brand Management",
      description: "Manage multiple brands from one dashboard. Switch contexts without losing focus."
    },
    {
      icon: <TrendingUp size={32} />,
      title: "Market Intelligence",
      description: "Cross-market insights that turn regional data into global strategy."
    },
    {
      icon: <Zap size={32} />,
      title: "Instant Alerts",
      description: "Critical events, performance spikes, compliance issues — know immediately."
    }
  ];

  return (
    <>
      <section className="pt-24 pb-20 bg-brand-dark-gradient min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <div className="mb-8">
            <Link 
              to="/"
              className="inline-flex items-center space-x-2 text-brand-orange hover:text-brand-yellow transition-colors duration-300 font-body"
            >
              <ArrowLeft size={20} />
              <span>Back to Home</span>
            </Link>
          </div>

          {/* Section Title */}
          <div ref={titleRef} className={`text-center mb-8 transition-all duration-500 ${
            titleInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            <h1 className="text-4xl md:text-6xl font-heading font-black uppercase tracking-wider text-white mb-6">
              Built for{' '}
              <span className="text-brand-orange">Operators</span>
            </h1>
          </div>

          {/* Intro Copy */}
          <div ref={introRef} className={`text-center mb-16 transition-all duration-600 delay-200 ${
            introInView ? 'opacity-100' : 'opacity-0'
          }`}>
            <div className="max-w-4xl mx-auto space-y-6">
              <p className="text-2xl md:text-3xl font-heading font-bold text-white leading-tight">
                Most backoffices are made for studios.<br />
                <span className="text-brand-orange">Ours is built for you.</span>
              </p>
            </div>
          </div>

          {/* Features Grid */}
          <div ref={featuresRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className={`feature-card group relative bg-black/30 p-8 rounded-xl border-2 border-gray-800 hover:border-brand-orange/50 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(234,163,56,0.3)] ${
                  featuresInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-brand-gradient opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-300"></div>
                
                <div className="relative z-10">
                  {/* Icon */}
                  <div className="text-brand-orange group-hover:text-white transition-colors duration-300 mb-4">
                    {feature.icon}
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-xl font-heading font-bold text-white mb-4 group-hover:text-brand-orange transition-colors duration-300">
                    {feature.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300 font-body">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default BackofficePage;