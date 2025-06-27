import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { supabase, Game } from '../lib/supabase';

const GameManagementPage = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    route: '',
    rtp: '96.00%',
    volatility: 'Medium',
    hit_frequency: '25.00%',
    max_win: '1000x',
    free_spins: '1 in 100',
    reels_rows: '5x3',
    min_bet: '€0.10',
    max_bet: '€50.00',
    release_date: '',
    early_access_date: '',
    available: false
  });

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGames(data || []);
    } catch (error) {
      console.error('Error fetching games:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingGame) {
        const { error } = await supabase
          .from('games')
          .update(formData)
          .eq('id', editingGame.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('games')
          .insert([formData]);

        if (error) throw error;
      }

      await fetchGames();
      resetForm();
    } catch (error) {
      console.error('Error saving game:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (game: Game) => {
    setEditingGame(game);
    setFormData({
      title: game.title,
      description: game.description,
      image_url: game.image_url,
      route: game.route,
      rtp: game.rtp,
      volatility: game.volatility,
      hit_frequency: game.hit_frequency,
      max_win: game.max_win,
      free_spins: game.free_spins,
      reels_rows: game.reels_rows,
      min_bet: game.min_bet,
      max_bet: game.max_bet,
      release_date: game.release_date,
      early_access_date: game.early_access_date,
      available: game.available
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this game?')) return;

    try {
      const { error } = await supabase
        .from('games')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchGames();
    } catch (error) {
      console.error('Error deleting game:', error);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingGame(null);
    setFormData({
      title: '',
      description: '',
      image_url: '',
      route: '',
      rtp: '96.00%',
      volatility: 'Medium',
      hit_frequency: '25.00%',
      max_win: '1000x',
      free_spins: '1 in 100',
      reels_rows: '5x3',
      min_bet: '€0.10',
      max_bet: '€50.00',
      release_date: '',
      early_access_date: '',
      available: false
    });
  };

  if (loading && games.length === 0) {
    return (
      <div className="min-h-screen bg-brand-dark-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-brand-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white font-body">Loading games...</p>
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
              <span>Add Game</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
            Game Management
          </h1>
          <p className="text-lg text-gray-300 font-body">
            Manage your game library and content.
          </p>
        </div>

        {/* Games List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <div key={game.id} className="bg-black/30 rounded-xl border border-gray-800 overflow-hidden">
              {game.image_url && (
                <img 
                  src={game.image_url} 
                  alt={game.title}
                  className="w-full h-48 object-cover"
                />
              )}
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-heading font-bold text-white">
                    {game.title}
                  </h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(game)}
                      className="text-brand-orange hover:text-brand-yellow transition-colors duration-200"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(game.id)}
                      className="text-red-400 hover:text-red-300 transition-colors duration-200"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                
                <p className="text-gray-300 text-sm mb-4 font-body line-clamp-3">
                  {game.description}
                </p>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400 font-body">RTP:</span>
                    <span className="text-white ml-2 font-body">{game.rtp}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 font-body">Max Win:</span>
                    <span className="text-white ml-2 font-body">{game.max_win}</span>
                  </div>
                </div>
                
                <div className="mt-4 flex items-center justify-between">
                  <span className={`px-2 py-1 rounded text-xs font-body ${
                    game.available 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {game.available ? 'Available' : 'Coming Soon'}
                  </span>
                  <span className="text-xs text-gray-500 font-body">
                    {new Date(game.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {games.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 font-body">No games found. Add your first game to get started.</p>
          </div>
        )}
      </main>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <div className="bg-brand-dark rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-800">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-heading font-bold text-white">
                  {editingGame ? 'Edit Game' : 'Add New Game'}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    placeholder="Game title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-brand-orange uppercase tracking-wider mb-2 font-body">
                    Route *
                  </label>
                  <input
                    type="text"
                    value={formData.route}
                    onChange={(e) => setFormData({ ...formData, route: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-black/30 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-colors duration-200 font-body"
                    placeholder="/games/game-name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-brand-orange uppercase tracking-wider mb-2 font-body">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={4}
                  className="w-full px-4 py-3 bg-black/30 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-colors duration-200 resize-none font-body"
                  placeholder="Game description"
                />
              </div>

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

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-brand-orange uppercase tracking-wider mb-2 font-body">
                    RTP
                  </label>
                  <input
                    type="text"
                    value={formData.rtp}
                    onChange={(e) => setFormData({ ...formData, rtp: e.target.value })}
                    className="w-full px-4 py-3 bg-black/30 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-colors duration-200 font-body"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-brand-orange uppercase tracking-wider mb-2 font-body">
                    Volatility
                  </label>
                  <select
                    value={formData.volatility}
                    onChange={(e) => setFormData({ ...formData, volatility: e.target.value })}
                    className="w-full px-4 py-3 bg-black/30 border border-gray-700 rounded-lg text-white focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-colors duration-200 font-body"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-brand-orange uppercase tracking-wider mb-2 font-body">
                    Hit Frequency
                  </label>
                  <input
                    type="text"
                    value={formData.hit_frequency}
                    onChange={(e) => setFormData({ ...formData, hit_frequency: e.target.value })}
                    className="w-full px-4 py-3 bg-black/30 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-colors duration-200 font-body"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-brand-orange uppercase tracking-wider mb-2 font-body">
                    Max Win
                  </label>
                  <input
                    type="text"
                    value={formData.max_win}
                    onChange={(e) => setFormData({ ...formData, max_win: e.target.value })}
                    className="w-full px-4 py-3 bg-black/30 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-colors duration-200 font-body"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-brand-orange uppercase tracking-wider mb-2 font-body">
                    Release Date
                  </label>
                  <input
                    type="date"
                    value={formData.release_date}
                    onChange={(e) => setFormData({ ...formData, release_date: e.target.value })}
                    className="w-full px-4 py-3 bg-black/30 border border-gray-700 rounded-lg text-white focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-colors duration-200 font-body"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-brand-orange uppercase tracking-wider mb-2 font-body">
                    Early Access Date
                  </label>
                  <input
                    type="date"
                    value={formData.early_access_date}
                    onChange={(e) => setFormData({ ...formData, early_access_date: e.target.value })}
                    className="w-full px-4 py-3 bg-black/30 border border-gray-700 rounded-lg text-white focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-colors duration-200 font-body"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="available"
                  checked={formData.available}
                  onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                  className="w-4 h-4 text-brand-orange bg-black/30 border-gray-700 rounded focus:ring-brand-orange focus:ring-2"
                />
                <label htmlFor="available" className="text-white font-body">
                  Game is available for play
                </label>
              </div>

              <div className="flex space-x-4 pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex items-center justify-center space-x-2 bg-brand-gradient text-brand-dark font-bold uppercase tracking-wider py-3 px-6 rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 font-body"
                >
                  <Save size={18} />
                  <span>{loading ? 'Saving...' : 'Save Game'}</span>
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

export default GameManagementPage;