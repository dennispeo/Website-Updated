import React, { useState, useEffect } from 'react';
import { useInView } from '../hooks/useInView';
import { Mail } from 'lucide-react';
import { supabase, Career } from '../lib/supabase';

const Careers = () => {
  const [titleRef, titleInView] = useInView();
  const [introRef, introInView] = useInView();
  const [cardsRef, cardsInView] = useInView();
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCareers();
  }, []);

  const fetchCareers = async () => {
    try {
      const { data, error } = await supabase
        .from('careers')
        .select('*')
        .eq('active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setCareers(data || []);
    } catch (error) {
      console.error('Error fetching careers:', error);
      // Fallback to default careers if database fails
      setCareers([
        {
          id: '1',
          title: "Game Artists & Designers",
          requirements: ["3+ years in game art", "Strong portfolio", "UI/UX expertise"],
          description: "Create stunning visual experiences and intuitive user interfaces for our innovative slot games.",
          department: "Design",
          location: "Remote",
          employment_type: "Full-time",
          active: true,
          sort_order: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '2',
          title: "Game Developers",
          requirements: ["JavaScript/TypeScript", "WebGL/Three.js", "React expertise"],
          description: "Build cutting-edge game mechanics and bring our creative visions to life with modern web technologies.",
          department: "Engineering",
          location: "Remote",
          employment_type: "Full-time",
          active: true,
          sort_order: 2,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '3',
          title: "Mathematicians & Game Analysts",
          requirements: ["Statistics background", "Game theory", "Data analysis"],
          description: "Design game mathematics, analyze player behavior, and optimize game performance through data-driven insights.",
          department: "Analytics",
          location: "Remote",
          employment_type: "Full-time",
          active: true,
          sort_order: 3,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = (role: string) => {
    const subject = encodeURIComponent(`Application for ${role} Position`);
    const body = encodeURIComponent(`Hi Play E Ola Team,\n\nI'm interested in applying for the ${role} position. Please find my application details below.\n\nBest regards,`);
    window.open(`mailto:careers@playeola.com?subject=${subject}&body=${body}`);
  };

  return (
    <section id="careers" className="py-20 bg-brand-dark-gradient">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div ref={titleRef} className={`text-center mb-8 transition-all duration-500 ${
          titleInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <h2 className="text-4xl md:text-6xl font-heading font-black uppercase tracking-wider text-white">
            Join <span className="text-brand-orange">Play E Ola</span>
          </h2>
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

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-brand-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white font-body">Loading career opportunities...</p>
          </div>
        )}

        {/* Role Cards */}
        {!loading && (
          <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {careers.map((career, index) => (
              <div
                key={career.id}
                className={`career-card bg-black/30 p-8 rounded-xl border border-gray-800 hover:border-brand-orange/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(234,163,56,0.2)] ${
                  cardsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <h3 className="text-xl font-heading font-bold text-white mb-6">
                  {career.title}
                </h3>
                
                {career.description && (
                  <p className="text-gray-300 mb-6 font-body text-sm">
                    {career.description}
                  </p>
                )}
                
                <div className="mb-8">
                  <h4 className="text-sm font-semibold text-brand-orange uppercase tracking-wider mb-4 font-body">
                    Requirements:
                  </h4>
                  <ul className="space-y-2">
                    {career.requirements.map((req, reqIndex) => (
                      <li key={reqIndex} className="text-gray-300 flex items-start font-body">
                        <span className="text-brand-orange mr-2">•</span>
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => handleApply(career.title)}
                  className="w-full group bg-brand-gradient text-brand-dark font-bold uppercase tracking-wider py-3 px-6 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(234,163,56,0.5)] flex items-center justify-center space-x-2 font-body"
                >
                  <Mail size={18} />
                  <span>Apply Now</span>
                </button>
              </div>
            ))}
          </div>
        )}

        {!loading && careers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 font-body">No career opportunities available at the moment. Check back soon!</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Careers;