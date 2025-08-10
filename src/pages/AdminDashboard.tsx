import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Gamepad2, Newspaper, Users, BarChart3, LogOut, Briefcase } from 'lucide-react';

const AdminDashboard = () => {
  const { user, profile, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    // Navigation will happen automatically via the auth state change
  };

  const dashboardCards = [
    {
      title: 'Game Management',
      description: 'Add, edit, and manage game content',
      icon: <Gamepad2 size={32} />,
      link: '/admin/games',
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'News Management',
      description: 'Create and publish news articles',
      icon: <Newspaper size={32} />,
      link: '/admin/news',
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Careers Management',
      description: 'Manage job positions and requirements',
      icon: <Briefcase size={32} />,
      link: '/admin/careers',
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'User Management',
      description: 'Manage user accounts and permissions',
      icon: <Users size={32} />,
      link: '/admin/users',
      color: 'from-orange-500 to-orange-600'
    },
    {
      title: 'Analytics',
      description: 'View site statistics and performance',
      icon: <BarChart3 size={32} />,
      link: '/admin/analytics',
      color: 'from-red-500 to-red-600'
    }
  ];

  return (
    <div className="min-h-screen bg-brand-dark-gradient">
      {/* Header */}
      <header className="bg-black/30 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <img 
                  src="/PLAY_E_OLA_Logo White-gold.png" 
                  alt="PlayEola" 
                  className="h-8 w-auto"
                />
              </Link>
              <div className="text-brand-orange font-body text-sm">
                Admin Dashboard
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-white font-body">
                Welcome, {profile?.email || user?.email}
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-200 font-body"
              >
                <LogOut size={18} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
            Content Management System
          </h1>
          <p className="text-lg text-gray-300 font-body">
            Manage your website content, games, news, careers, and users from this central dashboard.
          </p>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboardCards.map((card, index) => (
            <Link
              key={card.title}
              to={card.link}
              className="group bg-black/30 p-6 rounded-xl border border-gray-800 hover:border-brand-orange/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(234,163,56,0.2)]"
            >
              <div className={`w-16 h-16 bg-gradient-to-r ${card.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <div className="text-white">
                  {card.icon}
                </div>
              </div>
              
              <h3 className="text-xl font-heading font-bold text-white mb-2 group-hover:text-brand-orange transition-colors duration-300">
                {card.title}
              </h3>
              
              <p className="text-gray-400 font-body group-hover:text-gray-300 transition-colors duration-300">
                {card.description}
              </p>
            </Link>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-black/30 p-6 rounded-xl border border-gray-800">
            <div className="text-2xl font-bold text-brand-orange mb-2 font-heading">1</div>
            <div className="text-white font-semibold mb-1 font-body">Active Games</div>
            <div className="text-gray-400 text-sm font-body">Currently published</div>
          </div>
          
          <div className="bg-black/30 p-6 rounded-xl border border-gray-800">
            <div className="text-2xl font-bold text-brand-orange mb-2 font-heading">0</div>
            <div className="text-white font-semibold mb-1 font-body">News Articles</div>
            <div className="text-gray-400 text-sm font-body">Published this month</div>
          </div>

          <div className="bg-black/30 p-6 rounded-xl border border-gray-800">
            <div className="text-2xl font-bold text-brand-orange mb-2 font-heading">3</div>
            <div className="text-white font-semibold mb-1 font-body">Career Positions</div>
            <div className="text-gray-400 text-sm font-body">Currently open</div>
          </div>
          
          <div className="bg-black/30 p-6 rounded-xl border border-gray-800">
            <div className="text-2xl font-bold text-brand-orange mb-2 font-heading">
              {profile?.is_admin ? '1' : '0'}
            </div>
            <div className="text-white font-semibold mb-1 font-body">Admin Users</div>
            <div className="text-gray-400 text-sm font-body">Total administrators</div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;