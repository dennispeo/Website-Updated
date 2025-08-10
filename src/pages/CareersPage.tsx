import React from 'react';
import { useInView } from '../hooks/useInView';
import { Mail, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

const CareersPage = () => {
  const [titleRef, titleInView] = useInView();
  const [introRef, introInView] = useInView();
  const [cardsRef, cardsInView] = useInView();

  const roles = [
    {
      title: "Game Artists & Designers",
      requirements: [
        "3+ years in game art",
        "Strong portfolio",
        "UI/UX expertise"
      ]
    },
    {
      title: "Game Developers",
      requirements: [
        "JavaScript/TypeScript",
        "WebGL/Three.js",
        "React expertise"
      ]
    },
    {
      title: "Mathematicians & Game Analysts",
      requirements: [
        "Statistics background",
        "Game theory",
        "Data analysis"
      ]
    }
  ];

  const handleApply = (role: string) => {
    const subject = encodeURIComponent(`Application for ${role} Position`);
    const body = encodeURIComponent(`Hi Play E Ola Team,\n\nI'm interested in applying for the ${role} position. Please find my application details below.\n\nBest regards,`);
    window.open(`mailto:careers@playeola.com?subject=${subject}&body=${body}`);
  };

  return (
    <>
      <section className="pt-24 pb-20 bg-brand-dark-gradient min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <div className="mb-8">
            <Link 
              to="/about-us"
              className="inline-flex items-center space-x-2 text-brand-orange hover:text-brand-yellow transition-colors duration-300 font-body"
            >
              <ArrowLeft size={20} />
              <span>Back to About Us</span>
            </Link>
          </div>

          {/* Section Title */}
          <div ref={titleRef} className={`text-center mb-8 transition-all duration-500 ${
            titleInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            <h1 className="text-4xl md:text-6xl font-heading font-black uppercase tracking-wider text-white">
              Join <span className="text-brand-orange">Play E Ola</span>
            </h1>
          </div>

          {/* Intro Copy */}
          <div ref={introRef} className={`text-center mb-16 transition-all duration-600 delay-200 ${
            introInView ? 'opacity-100' : 'opacity-0'
          }`}>
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-4xl mx-auto font-body">
              Shape the Future of iGaming! We're looking for creatives, engineers, and innovators 
              who are ready to disrupt the status quo.
            </p>
          </div>

          {/* Role Cards */}
          <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {roles.map((role, index) => (
              <div
                key={role.title}
                className={`career-card bg-black/30 p-8 rounded-xl border border-gray-800 hover:border-brand-orange/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(234,163,56,0.2)] ${
                  cardsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <h3 className="text-xl font-heading font-bold text-white mb-6">
                  {role.title}
                </h3>
                
                <div className="mb-8">
                  <h4 className="text-sm font-semibold text-brand-orange uppercase tracking-wider mb-4 font-body">
                    Requirements:
                  </h4>
                  <ul className="space-y-2">
                    {role.requirements.map((req, reqIndex) => (
                      <li key={reqIndex} className="text-gray-300 flex items-start font-body">
                        <span className="text-brand-orange mr-2">•</span>
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => handleApply(role.title)}
                  className="w-full group bg-brand-gradient text-brand-dark font-bold uppercase tracking-wider py-3 px-6 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(234,163,56,0.5)] flex items-center justify-center space-x-2 font-body"
                >
                  <Mail size={18} />
                  <span>Apply Now</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default CareersPage;