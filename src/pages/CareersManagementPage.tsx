import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2, Save, X, GripVertical, Eye, EyeOff } from 'lucide-react';
import { supabase, Career } from '../lib/supabase';

const CareersManagementPage = () => {
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCareer, setEditingCareer] = useState<Career | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    requirements: [''],
    description: '',
    department: 'General',
    location: 'Remote',
    employment_type: 'Full-time',
    active: true,
    sort_order: 0
  });

  useEffect(() => {
    fetchCareers();
  }, []);

  const fetchCareers = async () => {
    try {
      const { data, error } = await supabase
        .from('careers')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setCareers(data || []);
    } catch (error) {
      console.error('Error fetching careers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const careerData = {
        ...formData,
        requirements: formData.requirements.filter(req => req.trim() !== '')
      };

      if (editingCareer) {
        const { error } = await supabase
          .from('careers')
          .update(careerData)
          .eq('id', editingCareer.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('careers')
          .insert([careerData]);

        if (error) throw error;
      }

      await fetchCareers();
      resetForm();
    } catch (error) {
      console.error('Error saving career:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (career: Career) => {
    setEditingCareer(career);
    setFormData({
      title: career.title,
      requirements: career.requirements.length > 0 ? career.requirements : [''],
      description: career.description,
      department: career.department,
      location: career.location,
      employment_type: career.employment_type,
      active: career.active,
      sort_order: career.sort_order
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this career position?')) return;

    try {
      const { error } = await supabase
        .from('careers')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchCareers();
    } catch (error) {
      console.error('Error deleting career:', error);
    }
  };

  const toggleActive = async (id: string, active: boolean) => {
    try {
      const { error } = await supabase
        .from('careers')
        .update({ active: !active })
        .eq('id', id);

      if (error) throw error;
      await fetchCareers();
    } catch (error) {
      console.error('Error updating career status:', error);
    }
  };

  const updateSortOrder = async (id: string, newOrder: number) => {
    try {
      const { error } = await supabase
        .from('careers')
        .update({ sort_order: newOrder })
        .eq('id', id);

      if (error) throw error;
      await fetchCareers();
    } catch (error) {
      console.error('Error updating sort order:', error);
    }
  };

  const moveCareer = (index: number, direction: 'up' | 'down') => {
    const newCareers = [...careers];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= newCareers.length) return;
    
    // Swap positions
    [newCareers[index], newCareers[targetIndex]] = [newCareers[targetIndex], newCareers[index]];
    
    // Update sort orders
    newCareers.forEach((career, idx) => {
      updateSortOrder(career.id, idx);
    });
    
    setCareers(newCareers);
  };

  const addRequirement = () => {
    setFormData({
      ...formData,
      requirements: [...formData.requirements, '']
    });
  };

  const updateRequirement = (index: number, value: string) => {
    const newRequirements = [...formData.requirements];
    newRequirements[index] = value;
    setFormData({
      ...formData,
      requirements: newRequirements
    });
  };

  const removeRequirement = (index: number) => {
    const newRequirements = formData.requirements.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      requirements: newRequirements.length > 0 ? newRequirements : ['']
    });
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingCareer(null);
    setFormData({
      title: '',
      requirements: [''],
      description: '',
      department: 'General',
      location: 'Remote',
      employment_type: 'Full-time',
      active: true,
      sort_order: careers.length
    });
  };

  if (loading && careers.length === 0) {
    return (
      <div className="min-h-screen bg-brand-dark-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-brand-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white font-body">Loading careers...</p>
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
              <span>Add Position</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
            Careers Management
          </h1>
          <p className="text-lg text-gray-300 font-body">
            Manage job positions, requirements, and career opportunities.
          </p>
        </div>

        {/* Careers List */}
        <div className="space-y-4">
          {careers.map((career, index) => (
            <div key={career.id} className="bg-black/30 rounded-xl border border-gray-800 p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  {/* Drag Handle */}
                  <div className="flex flex-col space-y-1 pt-2">
                    <button
                      onClick={() => moveCareer(index, 'up')}
                      disabled={index === 0}
                      className="text-gray-400 hover:text-brand-orange transition-colors duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <GripVertical size={16} />
                    </button>
                    <button
                      onClick={() => moveCareer(index, 'down')}
                      disabled={index === careers.length - 1}
                      className="text-gray-400 hover:text-brand-orange transition-colors duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <GripVertical size={16} />
                    </button>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-4">
                      <h3 className="text-xl font-heading font-bold text-white">
                        {career.title}
                      </h3>
                      <span className={`px-2 py-1 rounded text-xs font-body ${
                        career.active 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-gray-500/20 text-gray-400'
                      }`}>
                        {career.active ? 'Active' : 'Inactive'}
                      </span>
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs font-body">
                        {career.department}
                      </span>
                    </div>
                    
                    {career.description && (
                      <p className="text-gray-300 mb-4 font-body">
                        {career.description}
                      </p>
                    )}
                    
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-brand-orange uppercase tracking-wider mb-2 font-body">
                        Requirements:
                      </h4>
                      <ul className="space-y-1">
                        {career.requirements.map((req, reqIndex) => (
                          <li key={reqIndex} className="text-gray-300 flex items-start font-body text-sm">
                            <span className="text-brand-orange mr-2">•</span>
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-400 font-body">
                      <span>{career.location}</span>
                      <span>{career.employment_type}</span>
                      <span>Order: {career.sort_order}</span>
                      <span>{new Date(career.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => toggleActive(career.id, career.active)}
                    className={`p-2 rounded transition-colors duration-200 ${
                      career.active
                        ? 'text-green-400 hover:text-green-300'
                        : 'text-gray-400 hover:text-white'
                    }`}
                    title={career.active ? 'Deactivate' : 'Activate'}
                  >
                    {career.active ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                  <button
                    onClick={() => handleEdit(career)}
                    className="text-brand-orange hover:text-brand-yellow transition-colors duration-200 p-2"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(career.id)}
                    className="text-red-400 hover:text-red-300 transition-colors duration-200 p-2"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {careers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 font-body">No career positions found. Add your first position to get started.</p>
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
                  {editingCareer ? 'Edit Career Position' : 'Add New Career Position'}
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
                    Job Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-black/30 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-colors duration-200 font-body"
                    placeholder="e.g., Senior Game Developer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-brand-orange uppercase tracking-wider mb-2 font-body">
                    Department
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-4 py-3 bg-black/30 border border-gray-700 rounded-lg text-white focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-colors duration-200 font-body"
                  >
                    <option value="General">General</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Design">Design</option>
                    <option value="Analytics">Analytics</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Operations">Operations</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-brand-orange uppercase tracking-wider mb-2 font-body">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 bg-black/30 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-colors duration-200 resize-none font-body"
                  placeholder="Brief description of the role and responsibilities"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-brand-orange uppercase tracking-wider mb-2 font-body">
                  Requirements
                </label>
                <div className="space-y-2">
                  {formData.requirements.map((requirement, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={requirement}
                        onChange={(e) => updateRequirement(index, e.target.value)}
                        className="flex-1 px-4 py-2 bg-black/30 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-colors duration-200 font-body"
                        placeholder="Enter requirement"
                      />
                      {formData.requirements.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeRequirement(index)}
                          className="text-red-400 hover:text-red-300 transition-colors duration-200 p-2"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addRequirement}
                    className="text-brand-orange hover:text-brand-yellow transition-colors duration-200 text-sm font-body"
                  >
                    + Add Requirement
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-brand-orange uppercase tracking-wider mb-2 font-body">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-3 bg-black/30 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-colors duration-200 font-body"
                    placeholder="e.g., Remote, New York, London"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-brand-orange uppercase tracking-wider mb-2 font-body">
                    Employment Type
                  </label>
                  <select
                    value={formData.employment_type}
                    onChange={(e) => setFormData({ ...formData, employment_type: e.target.value })}
                    className="w-full px-4 py-3 bg-black/30 border border-gray-700 rounded-lg text-white focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-colors duration-200 font-body"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="active"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="w-4 h-4 text-brand-orange bg-black/30 border-gray-700 rounded focus:ring-brand-orange focus:ring-2"
                />
                <label htmlFor="active" className="text-white font-body">
                  Position is active and visible on careers page
                </label>
              </div>

              <div className="flex space-x-4 pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex items-center justify-center space-x-2 bg-brand-gradient text-brand-dark font-bold uppercase tracking-wider py-3 px-6 rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 font-body"
                >
                  <Save size={18} />
                  <span>{loading ? 'Saving...' : 'Save Position'}</span>
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

export default CareersManagementPage;