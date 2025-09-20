import React, { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('users');
  const [userFilter, setUserFilter] = useState('');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, user: null });
  const [user, setUser] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    // Fetch user data first
    const fetchUser = async () => {
      try {
        const response = await fetch(`${API_URL}/api/auth/me`, { credentials: 'include' });
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          // Only fetch admin data if user is authenticated and is admin
          if (data.user && data.user.role === 'ADMIN') {
            fetchData();
          } else {
            setError('Access denied. Admin privileges required.');
            setLoading(false);
          }
        } else if (response.status === 401) {
          setError('Please log in as an administrator to access this dashboard.');
          setLoading(false);
        } else if (response.status === 403) {
          setError('Access denied. You do not have administrator privileges.');
          setLoading(false);
        } else {
          setError('Unable to verify your credentials. Please try logging in again.');
          setLoading(false);
        }
      } catch (err) {
        console.error('Error fetching user:', err);
        if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
          setError('Server is currently unavailable. Please check your connection and try again.');
        } else if (err.message.includes('Unexpected token')) {
          setError('Server is not responding properly. Please ensure the backend server is running.');
        } else {
          setError('An error occurred while loading the dashboard. Please try refreshing the page.');
        }
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const usersRes = await fetch(`${API_URL}/api/admin/users`, { credentials: 'include' });
      const analyticsRes = await fetch(`${API_URL}/api/admin/analytics`, { credentials: 'include' });

      if (!usersRes.ok) {
        if (usersRes.status === 403) {
          throw new Error('Access denied. Please log in as an administrator.');
        } else if (usersRes.status === 401) {
          throw new Error('Authentication required. Please log in first.');
        } else {
          throw new Error(`Failed to fetch users: ${usersRes.status}`);
        }
      }

      if (!analyticsRes.ok) {
        if (analyticsRes.status === 403) {
          throw new Error('Access denied. Please log in as an administrator.');
        } else if (analyticsRes.status === 401) {
          throw new Error('Authentication required. Please log in first.');
        } else {
          throw new Error(`Failed to fetch analytics: ${analyticsRes.status}`);
        }
      }

      const usersData = await usersRes.json();
      const analyticsData = await analyticsRes.json();

      setUsers(usersData.users);
      setAnalytics(analyticsData);
    } catch (err) {
      console.error('Admin dashboard error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const approveUser = async (userId) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/users/${userId}/approve`, {
        method: 'PUT',
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Failed to approve user');
      // Refresh users
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  const openDeleteModal = (user) => {
    setDeleteModal({ isOpen: true, user });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, user: null });
  };

  const confirmDeleteUser = async () => {
    if (!deleteModal.user) return;

    try {
      const res = await fetch(`${API_URL}/api/admin/users/${deleteModal.user._id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to delete user');
      }

      fetchData();
      closeDeleteModal();
      // You could add a success toast notification here
    } catch (err) {
      alert('Failed to delete user: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <div className="text-xl text-gray-600">Loading admin dashboard...</div>
          <div className="text-sm text-gray-500 mt-2">Verifying your credentials</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Restricted</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={() => window.location.href = '/login'}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 px-6 rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Go to Login
            </button>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-gray-200 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-300 transition-all duration-200"
            >
              Try Again
            </button>
          </div>
          <div className="mt-6 text-xs text-gray-500">
            <p>Need admin access? Contact your system administrator.</p>
            <p className="mt-1">Default admin: admin@empathy.ai / Admin123!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Healthcare Admin Header */}
      <div className="bg-white shadow-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mb-2">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-600 to-indigo-600 bg-clip-text text-transparent">
                  Welcome back, {user?.name || 'Admin'}
                </h1>
                <div className="bg-gradient-to-r from-slate-500 to-indigo-500 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-semibold shadow-lg">
                  🏥 System Administrator
                </div>
              </div>
              <p className="text-gray-600 mt-2 text-sm sm:text-base md:text-lg">Managing healthcare excellence with comprehensive platform controls and oversight</p>
            </div>
            <div className="flex items-center space-x-3 sm:space-x-4 w-full sm:w-auto justify-end">
              <div className="text-right">
                <div className="text-xs sm:text-sm text-gray-500">System Status</div>
                <div className="font-semibold text-emerald-600 text-sm sm:text-base">All Systems Operational</div>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-slate-500 to-indigo-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm sm:text-lg">🏥</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Healthcare Quick Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-gradient-to-r from-slate-500 to-slate-600 p-4 sm:p-6 rounded-xl shadow-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-slate-100 text-xs sm:text-sm">Total Users</div>
                <div className="text-2xl sm:text-3xl font-bold">{analytics.totalUsers}</div>
                <div className="text-slate-100 text-xs mt-1">+12% this month</div>
              </div>
              <div className="text-3xl sm:text-4xl">👥</div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 p-4 sm:p-6 rounded-xl shadow-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-indigo-100 text-xs sm:text-sm">Active Sessions</div>
                <div className="text-2xl sm:text-3xl font-bold">{analytics.totalChats}</div>
                <div className="text-indigo-100 text-xs mt-1">Healthcare consultations</div>
              </div>
              <div className="text-3xl sm:text-4xl">💬</div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-4 sm:p-6 rounded-xl shadow-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-emerald-100 text-xs sm:text-sm">Pending Approvals</div>
                <div className="text-2xl sm:text-3xl font-bold">{analytics.pendingDoctors}</div>
                <div className="text-emerald-100 text-xs mt-1">Healthcare providers</div>
              </div>
              <div className="text-3xl sm:text-4xl">⏳</div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-4 sm:p-6 rounded-xl shadow-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-teal-100 text-xs sm:text-sm">System Health</div>
                <div className="text-2xl sm:text-3xl font-bold">98%</div>
                <div className="text-teal-100 text-xs mt-1">All systems operational</div>
              </div>
              <div className="text-3xl sm:text-4xl">🏥</div>
            </div>
          </div>
        </div>


        {/* User Management Section */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 space-y-4 sm:space-y-0">
            <div className="flex items-center">
              <div className="text-xl sm:text-2xl mr-3">👥</div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">User Management</h2>
            </div>
            <div className="flex items-center space-x-4 w-full sm:w-auto">
              <div className="relative w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Filter by name..."
                  value={userFilter}
                  onChange={(e) => setUserFilter(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-auto"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400">🔍</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('users')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                activeTab === 'users'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              👤 Patients ({users.filter(u => u.role === 'PATIENT').length})
            </button>
            <button
              onClick={() => setActiveTab('doctors')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                activeTab === 'doctors'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              👨‍⚕️ Doctors ({users.filter(u => u.role === 'DOCTOR').length})
            </button>
          </div>

          {/* Users Table */}
          {activeTab === 'users' && (
            <div className="overflow-x-auto">
              <table className="w-full table-auto bg-white rounded-lg overflow-hidden shadow-sm">
                <thead className="bg-gradient-to-r from-green-50 to-green-100">
                  <tr>
                    <th className="px-4 py-2 sm:px-6 sm:py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">Name</th>
                    <th className="px-4 py-2 sm:px-6 sm:py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">Email</th>
                    <th className="px-4 py-2 sm:px-6 sm:py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-2 sm:px-6 sm:py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users
                    .filter(user => user.role === 'PATIENT')
                    .filter(user => user.name.toLowerCase().includes(userFilter.toLowerCase()))
                    .map(user => (
                      <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                        <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-gray-600">{user.email}</td>
                        <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            Active
                          </span>
                        </td>
                        <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => openDeleteModal(user)}
                            className="px-2 py-1 sm:px-3 bg-red-600 text-white rounded text-xs sm:text-sm hover:bg-red-700 transition-colors"
                          >
                            🗑️ Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Doctors Table */}
          {activeTab === 'doctors' && (
            <div className="overflow-x-auto">
              <table className="w-full table-auto bg-white rounded-lg overflow-hidden shadow-sm">
                <thead className="bg-gradient-to-r from-blue-50 to-blue-100">
                  <tr>
                    <th className="px-4 py-2 sm:px-6 sm:py-3 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">Name</th>
                    <th className="px-4 py-2 sm:px-6 sm:py-3 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">Email</th>
                    <th className="px-4 py-2 sm:px-6 sm:py-3 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-2 sm:px-6 sm:py-3 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">Approval</th>
                    <th className="px-4 py-2 sm:px-6 sm:py-3 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users
                    .filter(user => user.role === 'DOCTOR')
                    .filter(user => user.name.toLowerCase().includes(userFilter.toLowerCase()))
                    .map(user => (
                      <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                        <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-gray-600">{user.email}</td>
                        <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            Doctor
                          </span>
                        </td>
                        <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.approved ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {user.approved ? '✓ Approved' : '⏳ Pending'}
                          </span>
                        </td>
                        <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm font-medium space-x-1 sm:space-x-2">
                          {user.role === 'DOCTOR' && !user.approved && (
                            <button
                              onClick={() => approveUser(user._id)}
                              className="px-2 py-1 sm:px-3 bg-green-600 text-white rounded text-xs sm:text-sm hover:bg-green-700 transition-colors"
                            >
                              ✅ Approve
                            </button>
                          )}
                          <button
                            onClick={() => openDeleteModal(user)}
                            className="px-2 py-1 sm:px-3 bg-red-600 text-white rounded text-xs sm:text-sm hover:bg-red-700 transition-colors"
                          >
                            🗑️ Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {deleteModal.isOpen && deleteModal.user && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 p-6">
              <div className="flex items-center mb-4">
                <div className="text-3xl mr-3">⚠️</div>
                <h3 className="text-xl font-bold text-gray-800">Confirm Deletion</h3>
              </div>

              <div className="mb-6">
                <p className="text-gray-600 mb-2">
                  Are you sure you want to delete this user?
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="font-medium text-gray-800">{deleteModal.user.name}</div>
                  <div className="text-sm text-gray-600">{deleteModal.user.email}</div>
                  <div className="text-sm text-blue-600 mt-1 capitalize">{deleteModal.user.role.toLowerCase()}</div>
                </div>
                <p className="text-red-600 text-sm mt-3 font-medium">
                  ⚠️ This action cannot be undone. All user data will be permanently removed.
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={closeDeleteModal}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteUser}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Delete User
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ResourceForm({ resource, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    title: resource?.title || '',
    description: resource?.description || '',
    content: resource?.content || '',
    type: resource?.type || 'ARTICLE',
    tags: resource?.tags?.join(', ') || '',
    isPublic: resource?.isPublic ?? true
  });
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      const url = resource
        ? `${API_URL}/api/meditation-resources/${resource._id}`
        : `${API_URL}/api/meditation-resources`;

      const res = await fetch(url, {
        method: resource ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data)
      });

      if (!res.ok) throw new Error('Failed to save resource');
      onSave();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-xl border border-gray-200 shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">📝 Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
              placeholder="Enter resource title..."
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">📖 Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
              rows="3"
              placeholder="Brief description of the resource..."
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">📄 Content</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
              rows="5"
              placeholder="Full content of the resource..."
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">🏷️ Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
            >
              <option value="VIDEO">🎥 Video</option>
              <option value="ARTICLE">📄 Article</option>
              <option value="AUDIO">🎵 Audio</option>
              <option value="GUIDED_MEDITATION">🧘 Guided Meditation</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">🏷️ Tags</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
              placeholder="anxiety, meditation, wellness"
            />
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="isPublic"
            checked={formData.isPublic}
            onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="isPublic" className="text-sm font-medium text-gray-700 flex items-center">
            🌐 Make this resource public
          </label>
        </div>
        <div className="flex space-x-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                💾 {resource ? 'Update' : 'Create'} Resource
              </>
            )}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            ❌ Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
