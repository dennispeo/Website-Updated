import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, User, Clock, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useInView } from '../hooks/useInView';
import { supabase, News } from '../lib/supabase';
import Footer from '../components/Footer';

const NewsPage = () => {
  const [titleRef, titleInView] = useInView();
  const [newsRef, newsInView] = useInView();
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sample news data for demonstration (15 articles for 3x5 grid)
  const sampleNews: News[] = [
    {
      id: '1',
      title: 'Zeus: Clockwork Tyrant - Early Access Now Live',
      content: 'Our flagship game Zeus: Clockwork Tyrant is now available for early access to select partners. Experience the revolutionary wavE™ mechanic that transforms traditional slot gameplay.',
      excerpt: 'Experience the revolutionary wavE™ mechanic in our flagship title.',
      image_url: 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
      author: 'Play E Ola Team',
      published: true,
      created_at: '2025-01-15T10:00:00Z',
      updated_at: '2025-01-15T10:00:00Z'
    },
    {
      id: '2',
      title: 'Partnership Announcement: Major European Operator',
      content: 'We are excited to announce our strategic partnership with one of Europe\'s leading gaming operators, bringing our innovative slot mechanics to millions of players.',
      excerpt: 'Strategic partnership expands our reach across European markets.',
      image_url: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
      author: 'Alex Johnson',
      published: true,
      created_at: '2025-01-12T14:30:00Z',
      updated_at: '2025-01-12T14:30:00Z'
    },
    {
      id: '3',
      title: 'The Science Behind wavE™ Technology',
      content: 'Dive deep into the mathematical and technical foundations of our proprietary wavE™ mechanic that creates unprecedented player engagement.',
      excerpt: 'Technical deep-dive into our revolutionary game mechanic.',
      image_url: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
      author: 'Sarah Chen',
      published: true,
      created_at: '2025-01-10T09:15:00Z',
      updated_at: '2025-01-10T09:15:00Z'
    },
    {
      id: '4',
      title: 'Industry Recognition: Innovation Award 2025',
      content: 'Play E Ola receives the prestigious Innovation Award 2025 for breakthrough achievements in slot game mechanics and player experience design.',
      excerpt: 'Recognition for our innovative approach to game development.',
      image_url: 'https://images.pexels.com/photos/1181534/pexels-photo-1181534.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
      author: 'Marcus Rodriguez',
      published: true,
      created_at: '2025-01-08T16:45:00Z',
      updated_at: '2025-01-08T16:45:00Z'
    },
    {
      id: '5',
      title: 'Q1 2025 Roadmap: What\'s Coming Next',
      content: 'Get an exclusive preview of our upcoming game releases, new mechanics, and platform expansions planned for the first quarter of 2025.',
      excerpt: 'Exclusive preview of our Q1 2025 development roadmap.',
      image_url: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
      author: 'Play E Ola Team',
      published: true,
      created_at: '2025-01-05T11:20:00Z',
      updated_at: '2025-01-05T11:20:00Z'
    },
    {
      id: '6',
      title: 'Behind the Scenes: Game Art Creation Process',
      content: 'Take a journey through our creative process as we design the stunning visuals and immersive worlds that define our gaming experiences.',
      excerpt: 'Exclusive look at our creative design and art development process.',
      image_url: 'https://images.pexels.com/photos/1109541/pexels-photo-1109541.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
      author: 'Creative Team',
      published: true,
      created_at: '2025-01-03T13:10:00Z',
      updated_at: '2025-01-03T13:10:00Z'
    },
    {
      id: '7',
      title: 'Player Engagement Metrics: Record Breaking Results',
      content: 'Our latest analytics reveal unprecedented player engagement rates, with session times and retention metrics exceeding industry standards.',
      excerpt: 'Record-breaking player engagement across all our titles.',
      image_url: 'https://images.pexels.com/photos/590020/pexels-photo-590020.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
      author: 'Analytics Team',
      published: true,
      created_at: '2025-01-01T08:00:00Z',
      updated_at: '2025-01-01T08:00:00Z'
    },
    {
      id: '8',
      title: 'New Team Members: Expanding Our Talent Pool',
      content: 'We welcome five new exceptional talents to our team, bringing expertise in AI, game mathematics, and user experience design.',
      excerpt: 'Welcoming new talent to drive innovation forward.',
      image_url: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
      author: 'HR Team',
      published: true,
      created_at: '2024-12-28T15:30:00Z',
      updated_at: '2024-12-28T15:30:00Z'
    },
    {
      id: '9',
      title: 'Regulatory Compliance: New Market Certifications',
      content: 'Play E Ola achieves certification in three new regulated markets, expanding our global reach and compliance standards.',
      excerpt: 'New certifications open doors to additional regulated markets.',
      image_url: 'https://images.pexels.com/photos/5668473/pexels-photo-5668473.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
      author: 'Compliance Team',
      published: true,
      created_at: '2024-12-25T12:00:00Z',
      updated_at: '2024-12-25T12:00:00Z'
    },
    {
      id: '10',
      title: 'Technology Stack Evolution: Next-Gen Platform',
      content: 'Discover how we\'re evolving our technology stack to support next-generation gaming experiences and improved performance.',
      excerpt: 'Evolution of our technology platform for better performance.',
      image_url: 'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
      author: 'Tech Team',
      published: true,
      created_at: '2024-12-22T10:45:00Z',
      updated_at: '2024-12-22T10:45:00Z'
    },
    {
      id: '11',
      title: 'Community Spotlight: Player Success Stories',
      content: 'Celebrating our community with inspiring stories from players who have experienced the thrill of our innovative game mechanics.',
      excerpt: 'Celebrating our amazing gaming community and their stories.',
      image_url: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
      author: 'Community Team',
      published: true,
      created_at: '2024-12-20T14:15:00Z',
      updated_at: '2024-12-20T14:15:00Z'
    },
    {
      id: '12',
      title: 'Sustainability Initiative: Green Gaming Practices',
      content: 'Our commitment to environmental responsibility through sustainable development practices and carbon-neutral gaming operations.',
      excerpt: 'Our commitment to sustainable and environmentally responsible gaming.',
      image_url: 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
      author: 'Sustainability Team',
      published: true,
      created_at: '2024-12-18T09:30:00Z',
      updated_at: '2024-12-18T09:30:00Z'
    },
    {
      id: '13',
      title: 'Mobile Gaming Expansion: Cross-Platform Excellence',
      content: 'Announcing our mobile gaming expansion with seamless cross-platform experiences that maintain our signature quality.',
      excerpt: 'Expanding to mobile platforms with seamless cross-platform play.',
      image_url: 'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
      author: 'Mobile Team',
      published: true,
      created_at: '2024-12-15T16:20:00Z',
      updated_at: '2024-12-15T16:20:00Z'
    },
    {
      id: '14',
      title: 'AI Integration: Smart Game Personalization',
      content: 'Exploring how artificial intelligence enhances player experience through intelligent game personalization and adaptive mechanics.',
      excerpt: 'AI-powered personalization creates unique gaming experiences.',
      image_url: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
      author: 'AI Research Team',
      published: true,
      created_at: '2024-12-12T11:00:00Z',
      updated_at: '2024-12-12T11:00:00Z'
    },
    {
      id: '15',
      title: 'Year in Review: 2024 Achievements and Milestones',
      content: 'Reflecting on an incredible year of growth, innovation, and success as we built the foundation for the future of digital gaming.',
      excerpt: 'Celebrating our achievements and milestones from 2024.',
      image_url: 'https://images.pexels.com/photos/1181534/pexels-photo-1181534.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
      author: 'Play E Ola Team',
      published: true,
      created_at: '2024-12-10T17:00:00Z',
      updated_at: '2024-12-10T17:00:00Z'
    }
  ];

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      // Check if Supabase is properly configured
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseAnonKey || 
          supabaseUrl === 'your_supabase_project_url' || 
          supabaseAnonKey === 'your_supabase_anon_key') {
        console.log('Supabase not configured, using sample data');
        setNews(sampleNews);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase query error:', error);
        // Use sample data as fallback
        setNews(sampleNews);
        setLoading(false);
        return;
      }
      
      // Use sample data if no database articles exist
      const newsData = data && data.length > 0 ? data : sampleNews;
      setNews(newsData);
    } catch (error) {
      console.warn('Error fetching news, using sample data:', error);
      // Use sample data as fallback
      setNews(sampleNews);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(' ').length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readingTime} min read`;
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
              Latest <span className="text-brand-orange">News</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-4xl mx-auto font-body">
              Stay updated with the latest developments, game releases, and industry insights from Play E Ola.
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-brand-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-white font-body">Loading news articles...</p>
            </div>
          )}

          {/* News Grid - 3 columns, 5 rows */}
          {!loading && (
            <div ref={newsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {news.slice(0, 15).map((article, index) => (
                <article
                  key={article.id}
                  className={`bg-black/30 rounded-xl border border-gray-800 overflow-hidden hover:border-brand-orange/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(234,163,56,0.2)] ${
                    newsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  {/* Article Image */}
                  {article.image_url && (
                    <div className="aspect-video relative overflow-hidden">
                      <img 
                        src={article.image_url}
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        onError={(e) => {
                          // Hide image container if it fails to load
                          const container = e.currentTarget.parentElement;
                          if (container) {
                            container.style.display = 'none';
                          }
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    </div>
                  )}

                  {/* Article Content */}
                  <div className="p-6">
                    {/* Article Meta */}
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-3 font-body">
                      <div className="flex items-center space-x-2">
                        <Calendar size={12} />
                        <span>{formatDate(article.created_at)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock size={12} />
                        <span>{getReadingTime(article.content)}</span>
                      </div>
                    </div>

                    {/* Article Title */}
                    <h2 className="text-lg font-heading font-bold text-white mb-3 line-clamp-2 hover:text-brand-orange transition-colors duration-300">
                      {article.title}
                    </h2>

                    {/* Article Excerpt */}
                    {article.excerpt && (
                      <p className="text-gray-300 text-sm leading-relaxed font-body mb-4 line-clamp-3">
                        {article.excerpt}
                      </p>
                    )}

                    {/* Article Footer */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-xs text-gray-400 font-body">
                        <User size={12} />
                        <span>{article.author}</span>
                      </div>
                      
                      <button className="group inline-flex items-center space-x-1 text-brand-orange hover:text-brand-yellow transition-colors duration-300 font-body text-sm font-semibold">
                        <span>Read More</span>
                        <ExternalLink size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* No Articles State */}
          {!loading && news.length === 0 && (
            <div className="text-center py-12">
              <h2 className="text-2xl font-heading font-bold text-white mb-4">No News Articles</h2>
              <p className="text-gray-400 font-body">
                We haven't published any news articles yet. Check back soon for updates!
              </p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default NewsPage;