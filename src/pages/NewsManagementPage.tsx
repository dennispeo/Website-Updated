import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2, Save, X, Eye } from 'lucide-react';
import { supabase, News } from '../lib/supabase';

const NewsManagementPage = () => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    image_url: '',
    author: 'Play E Ola Team',
    published: false
  });

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNews(data || []);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingNews) {
        const { error } = await supabase
          .from('news')
          .update(formData)
          .eq('id', editingNews.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('news')
          .insert([formData]);

        if (error) throw error;
      }

      await fetchNews();
      resetForm();
    } catch (error) {
      console.error('Error saving news:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (newsItem: News) => {
    setEditingNews(newsItem);
    setFormData({
      title: newsItem.title,
      content: newsItem.content,
      excerpt: newsItem.excerpt,
      image_url: newsItem.image_url,
      author: newsItem.author,
      published: newsItem.published
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this news article?')) return;

    try {
      const { error } = await supabase
        .from('news')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchNews();
    } catch (error) {
      console.error('Error deleting news:', error);
    }
  };

  const togglePublished = async (id: string, published: boolean) => {
    try {
      const { error } = await supabase
        .from('news')
        .update({ published: !published })
        .eq('id', id);

      if (error) throw error;
      await fetchNews();
    } catch (error) {
      console.error('Error updating news:', error);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingNews(null);
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      image_url: '',
      author: 'Play E Ola Team',
      published: false
    });
  };

  if (loading && news.length === 0) {
    return (
      <div className="min-h-screen bg-brand-dark-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-brand-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white font-body">Loading news...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-dark-gradient">
      {/* Header */}
      <header className="bg-black/30 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link 
                to="/admin"
                className="flex items-center space-x-2 text-brand-orange hover:text-brand-yellow transition-colors duration-300 font-body"
              >
                <ArrowLeft size={20} />
                <span>Back to Dashboard</span>
              </Link>
            </div>
            
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center space-x-2 bg-brand-gradient text-brand-dark font-bold uppercase tracking-wider py-2 px-4 rounded-lg transition-all duration-300 hover:scale-105 font-body"
            >
              <Plus size={18} />
              <span>Add News</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
            News Management
          </h1>
          <p className="text-lg text-gray-300 font-body">
            Create and manage news articles and announcements.
          </p>
        </div>

        {/* News List */}
        <div className="space-y-6">
          {news.map((newsItem) => (
            <div key={newsItem.id} className="bg-black/30 rounded-xl border border-gray-800 p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-4">
                    <h3 className="text-xl font-heading font-bold text-white">
                      {newsItem.title}
                    </h3>
                    <span className={`px-2 py-1 rounded text-xs font-body ${
                      newsItem.published 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {newsItem.published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  
                  {newsItem.excerpt && (
                    <p className="text-gray-300 mb-4 font-body">
                      {newsItem.excerpt}
                    </p>
                  )}
                  
                  <div className="flex items-center space-x-6 text-sm text-gray-400 font-body">
                    <span>By {newsItem.author}</span>
                    <span>{new Date(newsItem.created_at).toLocaleDateString()}</span>
                    {newsItem.updated_at !== newsItem.created_at && (
                      <span>Updated {new Date(newsItem.updated_at).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => togglePublished(newsItem.id, newsItem.published)}
                    className={`p-2 rounded transition-colors duration-200 ${
                      newsItem.published
                        ? 'text-green-400 hover:text-green-300'
                        : 'text-gray-400 hover:text-white'
                    }`}
                    title={newsItem.published ? 'Unpublish' : 'Publish'}
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    onClick={() => handleEdit(newsItem)}
                    className="text-brand-orange hover:text-brand-yellow transition-colors duration-200 p-2"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(newsItem.id)}
                    className="text-red-400 hover:text-red-300 transition-colors duration-200 p-2"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {news.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 font-body">No news articles found. Create your first article to get started.</p>
          </div>
        )}
      </main>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <div className="bg-brand-dark rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-800">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-heading font-bold text-white">
                  {editingNews ? 'Edit News Article' : 'Create News Article'}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-brand-orange uppercase tracking-wider mb-2 font-body">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-black/30 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-colors duration-200 font-body"
                  placeholder="Article title"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-brand-orange uppercase tracking-wider mb-2 font-body">
                  Excerpt
                </label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-3 bg-black/30 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-colors duration-200 resize-none font-body"
                  placeholder="Brief summary of the article"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-brand-orange uppercase tracking-wider mb-2 font-body">
                  Content *
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  required
                  rows={12}
                  className="w-full px-4 py-3 bg-black/30 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-colors duration-200 resize-none font-body"
                  placeholder="Article content (supports markdown)"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-brand-orange uppercase tracking-wider mb-2 font-body">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    className="w-full px-4 py-3 bg-black/30 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-colors duration-200 font-body"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-brand-orange uppercase tracking-wider mb-2 font-body">
                    Author
                  </label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full px-4 py-3 bg-black/30 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-colors duration-200 font-body"
                    placeholder="Author name"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="published"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="w-4 h-4 text-brand-orange bg-black/30 border-gray-700 rounded focus:ring-brand-orange focus:ring-2"
                />
                <label htmlFor="published" className="text-white font-body">
                  Publish immediately
                </label>
              </div>

              <div className="flex space-x-4 pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex items-center justify-center space-x-2 bg-brand-gradient text-brand-dark font-bold uppercase tracking-wider py-3 px-6 rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 font-body"
                >
                  <Save size={18} />
                  <span>{loading ? 'Saving...' : 'Save Article'}</span>
                </button>
                
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 border-2 border-gray-600 text-gray-300 font-bold uppercase tracking-wider rounded-lg transition-all duration-300 hover:border-white hover:text-white font-body"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsManagementPage;