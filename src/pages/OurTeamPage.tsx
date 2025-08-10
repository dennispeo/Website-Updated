import React from 'react';
import { ArrowLeft, Linkedin, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useInView } from '../hooks/useInView';
import Footer from '../components/Footer';

interface TeamMember {
  id: string;
  name: string;
  title: string;
  description: string;
  imageUrl: string;
  linkedinUrl?: string;
  email: string;
}

const OurTeamPage = () => {
  const [titleRef, titleInView] = useInView();
  const [teamRef, teamInView] = useInView();

  // Team member data - easily editable
  const teamMembers: TeamMember[] = [
    {
      id: '1',
      name: 'Alex Johnson',
      title: 'CEO & Founder',
      description: 'Visionary leader with 15+ years in the gaming industry. Alex founded Play E Ola with the mission to revolutionize slot game mechanics through innovative technology and creative design. Previously led product development at major gaming studios.',
      imageUrl: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=1',
      linkedinUrl: 'https://linkedin.com/in/alexjohnson',
      email: 'alex@playeola.com'
    },
    {
      id: '2',
      name: 'Sarah Chen',
      title: 'Chief Technology Officer',
      description: 'Technical mastermind behind our cutting-edge game engine and wavE™ mechanic. Sarah brings deep expertise in WebGL, real-time graphics, and scalable gaming architectures. She ensures our games deliver exceptional performance across all platforms.',
      imageUrl: 'https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=1',
      linkedinUrl: 'https://linkedin.com/in/sarahchen',
      email: 'sarah@playeola.com'
    },
    {
      id: '3',
      name: 'Marcus Rodriguez',
      title: 'Head of Game Design',
      description: 'Creative force driving our unique game concepts and player experiences. Marcus combines mathematical precision with artistic vision to create games that are both engaging and fair. His innovative approach to game mechanics sets Play E Ola apart.',
      imageUrl: 'https://images.pexels.com/photos/3777931/pexels-photo-3777931.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=1',
      linkedinUrl: 'https://linkedin.com/in/marcusrodriguez',
      email: 'marcus@playeola.com'
    }
  ];

  const handleEmailClick = (email: string) => {
    window.open(`mailto:${email}`, '_blank');
  };

  const handleLinkedinClick = (linkedinUrl: string) => {
    window.open(linkedinUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <div className="min-h-screen bg-brand-dark-gradient pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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

          {/* Page Title */}
          <div ref={titleRef} className={`text-center mb-16 transition-all duration-500 ${
            titleInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            <h1 className="text-4xl md:text-6xl font-heading font-black uppercase tracking-wider text-white mb-6">
              Meet Our <span className="text-brand-orange">Team</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-4xl mx-auto font-body">
              The creative minds and technical experts behind Play E Ola's innovative gaming experiences.
            </p>
          </div>

          {/* Team Members */}
          <div ref={teamRef} className="space-y-16">
            {teamMembers.map((member, index) => (
              <div
                key={member.id}
                className={`transition-all duration-600 ${
                  teamInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                {/* Team Member Strip */}
                <div className="bg-black/30 rounded-2xl border border-gray-800 overflow-hidden hover:border-brand-orange/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(234,163,56,0.2)]">
                  <div className="flex flex-col lg:flex-row">
                    {/* Photo Section */}
                    <div className="lg:w-1/3 xl:w-1/4">
                      <div className="aspect-square lg:aspect-auto lg:h-full relative overflow-hidden">
                        <img 
                          src={member.imageUrl}
                          alt={member.name}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                          onError={(e) => {
                            // Fallback to a placeholder if image fails to load
                            e.currentTarget.src = 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=1';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-black/20"></div>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="lg:w-2/3 xl:w-3/4 p-8 lg:p-12 flex flex-col justify-center">
                      {/* Name and Title */}
                      <div className="mb-6">
                        <h2 className="text-2xl md:text-3xl font-heading font-bold text-white mb-2">
                          {member.name}
                        </h2>
                        <h3 className="text-lg md:text-xl font-heading font-semibold text-brand-orange uppercase tracking-wider">
                          {member.title}
                        </h3>
                      </div>

                      {/* Description */}
                      <div className="mb-8">
                        <p className="text-gray-300 leading-relaxed font-body text-base md:text-lg">
                          {member.description}
                        </p>
                      </div>

                      {/* Contact Icons */}
                      <div className="flex items-center space-x-6">
                        {/* LinkedIn */}
                        {member.linkedinUrl && (
                          <button
                            onClick={() => handleLinkedinClick(member.linkedinUrl!)}
                            className="group flex items-center space-x-2 text-gray-400 hover:text-brand-orange transition-all duration-300 hover:scale-110"
                            aria-label={`${member.name}'s LinkedIn profile`}
                          >
                            <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center group-hover:bg-brand-orange/20 transition-colors duration-300">
                              <Linkedin size={20} />
                            </div>
                            <span className="font-body font-semibold">LinkedIn</span>
                          </button>
                        )}

                        {/* Email */}
                        <button
                          onClick={() => handleEmailClick(member.email)}
                          className="group flex items-center space-x-2 text-gray-400 hover:text-brand-orange transition-all duration-300 hover:scale-110"
                          aria-label={`Email ${member.name}`}
                        >
                          <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center group-hover:bg-brand-orange/20 transition-colors duration-300">
                            <Mail size={20} />
                          </div>
                          <span className="font-body font-semibold">Email</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OurTeamPage;