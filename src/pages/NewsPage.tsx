import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, User, Clock } from 'lucide-react';
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

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNews(data || []);
    } catch (error) {
      console.error('Error fetching news:', error);
      setError('Failed to load news articles');
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <h2 className="text-2xl font-heading font-bold text-white mb-4">Unable to Load News</h2>
              <p className="text-gray-400 mb-6 font-body">{error}</p>
              <button
                onClick={fetchNews}
                className="bg-brand-gradient text-brand-dark font-bold uppercase tracking-wider py-3 px-6 rounded-lg transition-all duration-300 hover:scale-105 font-body"
              >
                Try Again
              </button>
            </div>
          )}

          {/* News Articles */}
          {!loading && !error && (
            <div ref={newsRef} className="space-y-8">
              {news.length > 0 ? (
                news.map((article, index) => (
                  <article
                    key={article.id}
                    className={`bg-black/30 rounded-xl border border-gray-800 overflow-hidden hover:border-brand-orange/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(234,163,56,0.2)] ${
                      newsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <div className="flex flex-col lg:flex-row">
                      {/* Article Image */}
                      {article.image_url && (
                        <div className="lg:w-1/3">
                          <div className="aspect-video lg:aspect-square lg:h-full relative overflow-hidden">
                            <img 
                              src={article.image_url}
                              alt={article.title}
                              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                              onError={(e) => {
                                // Hide image container if it fails to load
                                const container = e.currentTarget.parentElement?.parentElement;
                                if (container) {
                                  container.style.display = 'none';
                                }
                              }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-black/20"></div>
                          </div>
                        </div>
                      )}

                      {/* Article Content */}
                      <div className={`${article.image_url ? 'lg:w-2/3' : 'w-full'} p-8 lg:p-12 flex flex-col justify-center`}>
                        {/* Article Meta */}
                        <div className="flex items-center space-x-6 text-sm text-gray-400 mb-4 font-body">
                          <div className="flex items-center space-x-2">
                            <Calendar size={16} />
                            <span>{formatDate(article.created_at)}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <User size={16} />
                            <span>{article.author}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock size={16} />
                            <span>{getReadingTime(article.content)}</span>
                          </div>
                        </div>

                        {/* Article Title */}
                        <h2 className="text-2xl md:text-3xl font-heading font-bold text-white mb-4 hover:text-brand-orange transition-colors duration-300">
                          {article.title}
                        </h2>

                        {/* Article Excerpt */}
                        {article.excerpt && (
                          <p className="text-gray-300 leading-relaxed font-body text-base md:text-lg mb-6">
                            {article.excerpt}
                          </p>
                        )}

                        {/* Article Preview */}
                        <div className="text-gray-400 leading-relaxed font-body mb-6">
                          <p className="line-clamp-3">
                            {article.content.substring(0, 200)}...
                          </p>
                        </div>

                        {/* Read More Button */}
                        <div>
                          <button className="group inline-flex items-center space-x-2 text-brand-orange hover:text-brand-yellow transition-colors duration-300 font-body font-semibold">
                            <span>Read Full Article</span>
                            <ArrowLeft size={16} className="rotate-180 group-hover:translate-x-1 transition-transform duration-300" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <div className="text-center py-12">
                  <h2 className="text-2xl font-heading font-bold text-white mb-4">No News Articles</h2>
                  <p className="text-gray-400 font-body">
                    We haven't published any news articles yet. Check back soon for updates!
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default NewsPage;