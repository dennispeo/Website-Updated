import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2, Save, X, Shield, ShieldOff, Eye, EyeOff, User, Mail, Calendar, Crown } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface UserProfile {
  id: string;
  email: string;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

interface CreateUserForm {
  email: string;
  password: string;
  is_admin: boolean;
}

const UserManagementPage = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<CreateUserForm>({
    email: '',
    password: '',
    is_admin: false
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Fetch profiles only - no admin API calls from client
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      setUsers(profiles || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Note: User creation from client-side is limited
      // In a production environment, this should be handled by a secure backend
      setError('User creation must be handled through a secure backend. Please contact your system administrator.');
    } catch (error: any) {
      console.error('Error creating user:', error);
      setError(error.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user: UserProfile) => {
    setEditingUser(user);
    setFormData({
      email: user.email,
      password: '',
      is_admin: user.is_admin
    });
    setShowCreateForm(true);
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Update profile (email and admin status changes should be handled by backend)
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          is_admin: formData.is_admin
        })
        .eq('id', editingUser.id);

      if (profileError) throw profileError;

      // Handle admin status change
      if (formData.is_admin !== editingUser.is_admin) {
        if (formData.is_admin) {
          // Add to admin_users
          const { error: adminError } = await supabase
            .from('admin_users')
            .insert([{ user_id: editingUser.id }])
            .onConflict('user_id')
            .ignoreDuplicates();

          if (adminError) {
            console.warn('Could not add to admin_users:', adminError);
          }
        } else {
          // Remove from admin_users
          const { error: adminError } = await supabase
            .from('admin_users')
            .delete()
            .eq('user_id', editingUser.id);

          if (adminError) {
            console.warn('Could not remove from admin_users:', adminError);
          }
        }
      }

      if (formData.email !== editingUser.email || formData.password) {
        setSuccess('Admin status updated. Email and password changes must be handled through a secure backend.');
      } else {
        setSuccess('User updated successfully');
      }
      
      await fetchUsers();
      resetForm();
    } catch (error: any) {
      console.error('Error updating user:', error);
      setError(error.message || 'Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string, userEmail: string) => {
    if (!confirm(`Are you sure you want to delete user "${userEmail}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Note: User deletion from client-side is not secure
      // In a production environment, this should be handled by a secure backend
      setError('User deletion must be handled through a secure backend. Please contact your system administrator.');
    } catch (error: any) {
      console.error('Error deleting user:', error);
      setError(error.message || 'Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  const toggleAdminStatus = async (user: UserProfile) => {
    try {
      setLoading(true);
      setError(null);

      const newAdminStatus = !user.is_admin;

      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ is_admin: newAdminStatus })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // Handle admin_users table
      if (newAdminStatus) {
        const { error: adminError } = await supabase
          .from('admin_users')
          .insert([{ user_id: user.id }])
          .onConflict('user_id')
          .ignoreDuplicates();

        if (adminError) {
          console.warn('Could not add to admin_users:', adminError);
        }
      } else {
        const { error: adminError } = await supabase
          .from('admin_users')
          .delete()
          .eq('user_id', user.id);

        if (adminError) {
          console.warn('Could not remove from admin_users:', adminError);
        }
      }

      setSuccess(`User ${newAdminStatus ? 'promoted to' : 'removed from'} admin`);
      await fetchUsers();
    } catch (error: any) {
      console.error('Error toggling admin status:', error);
      setError(error.message || 'Failed to update admin status');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setShowCreateForm(false);
    setEditingUser(null);
    setFormData({
      email: '',
      password: '',
      is_admin: false
    });
    setShowPassword(false);
    setError(null);
    setSuccess(null);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading && users.length === 0) {
    return (
      <div className="min-h-screen bg-brand-dark-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-brand-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white font-body">Loading users...</p>
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
              onClick={() => setShowCreateForm(true)}
              className="flex items-center space-x-2 bg-brand-gradient text-brand-dark font-bold uppercase tracking-wider py-2 px-4 rounded-lg transition-all duration-300 hover:scale-105 font-body"
            >
              <Plus size={18} />
              <span>Add User</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
            User Management
          </h1>
          <p className="text-lg text-gray-300 font-body">
            Manage user accounts, permissions, and access levels.
          </p>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
            <p className="text-red-400 text-sm font-body">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-6">
            <p className="text-green-400 text-sm font-body">{success}</p>
          </div>
        )}

        {/* Users Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-black/30 p-6 rounded-xl border border-gray-800">
            <div className="flex items-center space-x-3">
              <User className="text-brand-orange" size={24} />
              <div>
                <div className="text-2xl font-bold text-white font-heading">{users.length}</div>
                <div className="text-sm text-gray-400 font-body">Total Users</div>
              </div>
            </div>
          </div>
          
          <div className="bg-black/30 p-6 rounded-xl border border-gray-800">
            <div className="flex items-center space-x-3">
              <Crown className="text-brand-orange" size={24} />
              <div>
                <div className="text-2xl font-bold text-white font-heading">
                  {users.filter(u => u.is_admin).length}
                </div>
                <div className="text-sm text-gray-400 font-body">Admin Users</div>
              </div>
            </div>
          </div>
          
          <div className="bg-black/30 p-6 rounded-xl border border-gray-800">
            <div className="flex items-center space-x-3">
              <Calendar className="text-brand-orange" size={24} />
              <div>
                <div className="text-2xl font-bold text-white font-heading">
                  {users.filter(u => u.created_at && 
                    new Date(u.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                  ).length}
                </div>
                <div className="text-sm text-gray-400 font-body">Created This Week</div>
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-black/30 rounded-xl border border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-black/50 border-b border-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-brand-orange uppercase tracking-wider font-body">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-brand-orange uppercase tracking-wider font-body">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-brand-orange uppercase tracking-wider font-body">
                    Created
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-brand-orange uppercase tracking-wider font-body">
                    Updated
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-brand-orange uppercase tracking-wider font-body">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-black/20 transition-colors duration-200">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-brand-gradient rounded-full flex items-center justify-center">
                          <User className="text-brand-dark" size={18} />
                        </div>
                        <div>
                          <div className="text-white font-semibold font-body">{user.email}</div>
                          <div className="text-gray-400 text-sm font-body">ID: {user.id.slice(0, 8)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {user.is_admin ? (
                          <>
                            <Crown className="text-brand-orange" size={16} />
                            <span className="px-2 py-1 bg-brand-orange/20 text-brand-orange rounded text-sm font-body">
                              Admin
                            </span>
                          </>
                        ) : (
                          <>
                            <User className="text-gray-400" size={16} />
                            <span className="px-2 py-1 bg-gray-500/20 text-gray-400 rounded text-sm font-body">
                              User
                            </span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-300 text-sm font-body">
                      {formatDate(user.created_at)}
                    </td>
                    <td className="px-6 py-4 text-gray-300 text-sm font-body">
                      {formatDate(user.updated_at)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleAdminStatus(user)}
                          className={`p-2 rounded transition-colors duration-200 ${
                            user.is_admin
                              ? 'text-brand-orange hover:text-brand-yellow'
                              : 'text-gray-400 hover:text-brand-orange'
                          }`}
                          title={user.is_admin ? 'Remove admin privileges' : 'Grant admin privileges'}
                        >
                          {user.is_admin ? <Shield size={18} /> : <ShieldOff size={18} />}
                        </button>
                        <button
                          onClick={() => handleEditUser(user)}
                          className="text-blue-400 hover:text-blue-300 transition-colors duration-200 p-2"
                          title="Edit user"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id, user.email)}
                          className="text-red-400 hover:text-red-300 transition-colors duration-200 p-2"
                          title="Delete user"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {users.length === 0 && (
            <div className="text-center py-12">
              <User className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-400 font-body">No users found.</p>
            </div>
          )}
        </div>
      </main>

      {/* Create/Edit User Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <div className="bg-brand-dark rounded-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-800">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-heading font-bold text-white">
                  {editingUser ? 'Edit User' : 'Create New User'}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <form onSubmit={editingUser ? handleUpdateUser : handleCreateUser} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-brand-orange uppercase tracking-wider mb-2 font-body">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    disabled={loading || !!editingUser}
                    className="w-full pl-10 pr-4 py-3 bg-black/30 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-colors duration-200 font-body disabled:opacity-50"
                    placeholder="user@example.com"
                  />
                  {editingUser && (
                    <p className="text-xs text-gray-400 mt-1 font-body">
                      Email changes must be handled through a secure backend
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-brand-orange uppercase tracking-wider mb-2 font-body">
                  Password {editingUser ? '(leave blank to keep current)' : '*'}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required={!editingUser}
                    disabled={loading || !!editingUser}
                    className="w-full pr-12 pl-4 py-3 bg-black/30 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-colors duration-200 font-body disabled:opacity-50"
                    placeholder={editingUser ? "Password changes require backend" : "Enter password"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading || !!editingUser}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200 disabled:opacity-50"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {editingUser && (
                  <p className="text-xs text-gray-400 mt-1 font-body">
                    Password changes must be handled through a secure backend
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="is_admin"
                  checked={formData.is_admin}
                  onChange={(e) => setFormData({ ...formData, is_admin: e.target.checked })}
                  disabled={loading}
                  className="w-4 h-4 text-brand-orange bg-black/30 border-gray-700 rounded focus:ring-brand-orange focus:ring-2 disabled:opacity-50"
                />
                <label htmlFor="is_admin" className="text-white font-body flex items-center space-x-2">
                  <Crown size={16} className="text-brand-orange" />
                  <span>Grant admin privileges</span>
                </label>
              </div>

              <div className="flex space-x-4 pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex items-center justify-center space-x-2 bg-brand-gradient text-brand-dark font-bold uppercase tracking-wider py-3 px-6 rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 font-body"
                >
                  <Save size={18} />
                  <span>{loading ? 'Saving...' : (editingUser ? 'Update User' : 'Create User')}</span>
                </button>
                
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={loading}
                  className="px-6 py-3 border-2 border-gray-600 text-gray-300 font-bold uppercase tracking-wider rounded-lg transition-all duration-300 hover:border-white hover:text-white font-body disabled:opacity-50"
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

export default UserManagementPage;