import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import '../../styles/UserManagement.css';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'customer' | 'kitchen' | 'admin';
  phone?: string;
  createdAt: string;
}

const UserManagement: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'customer' | 'kitchen' | 'admin'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (!token || !userStr) {
      alert('Please login to access user management');
      navigate('/auth/login');
      return;
    }

    try {
      const user = JSON.parse(userStr);
      if (user.role !== 'admin') {
        alert('Access denied. Admin role required.');
        navigate('/');
        return;
      }
    } catch (err) {
      console.error('Invalid user data:', err);
      navigate('/auth/login');
    }
  }, [navigate]);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Since we don't have a users endpoint, we'll show current user and mock data
      const response = await api.get('/auth/me');
      const currentUser = response.data.data;
      
      // Add current user to list (in real app, would fetch all users)
      setUsers([currentUser]);
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setError(err.response?.data?.error || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const getRoleIcon = (role: User['role']) => {
    const icons: Record<User['role'], string> = {
      customer: '👤',
      kitchen: '👨‍🍳',
      admin: '👨‍💼'
    };
    return icons[role];
  };

  const getRoleBadgeClass = (role: User['role']) => {
    const classes: Record<User['role'], string> = {
      customer: 'admin-users-role-customer',
      kitchen: 'admin-users-role-kitchen',
      admin: 'admin-users-role-admin'
    };
    return classes[role];
  };

  const getTimeAgo = (dateString: string) => {
    const days = Math.floor((Date.now() - new Date(dateString).getTime()) / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    if (days < 365) return `${Math.floor(days / 30)} months ago`;
    return `${Math.floor(days / 365)} years ago`;
  };

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesFilter = filter === 'all' || user.role === filter;
    const matchesSearch = searchTerm === '' || 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="admin-users-container">
        <div className="admin-users-loading">
          <div className="admin-users-spinner"></div>
          <p>Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-users-container">
      {/* Header */}
      <div className="admin-users-header">
        <div className="admin-users-header-content">
          <h1 className="admin-users-title">👥 User Management</h1>
          <p className="admin-users-subtitle">Manage all registered users</p>
        </div>
        <button onClick={fetchUsers} className="admin-users-refresh">
          🔄 Refresh
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="admin-users-error">
          <span className="admin-users-error-icon">⚠️</span>
          <span>{error}</span>
          <button onClick={fetchUsers} className="admin-users-error-retry">Retry</button>
        </div>
      )}

      {/* Stats */}
      <div className="admin-users-stats">
        <div className="admin-users-stat-card">
          <div className="admin-users-stat-icon">👥</div>
          <div className="admin-users-stat-info">
            <div className="admin-users-stat-value">{users.length}</div>
            <div className="admin-users-stat-label">Total Users</div>
          </div>
        </div>
        <div className="admin-users-stat-card">
          <div className="admin-users-stat-icon">👤</div>
          <div className="admin-users-stat-info">
            <div className="admin-users-stat-value">
              {users.filter(u => u.role === 'customer').length}
            </div>
            <div className="admin-users-stat-label">Customers</div>
          </div>
        </div>
        <div className="admin-users-stat-card">
          <div className="admin-users-stat-icon">👨‍🍳</div>
          <div className="admin-users-stat-info">
            <div className="admin-users-stat-value">
              {users.filter(u => u.role === 'kitchen').length}
            </div>
            <div className="admin-users-stat-label">Kitchen Staff</div>
          </div>
        </div>
        <div className="admin-users-stat-card">
          <div className="admin-users-stat-icon">👨‍💼</div>
          <div className="admin-users-stat-info">
            <div className="admin-users-stat-value">
              {users.filter(u => u.role === 'admin').length}
            </div>
            <div className="admin-users-stat-label">Admins</div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="admin-users-controls">
        <div className="admin-users-search">
          <span className="admin-users-search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="admin-users-search-input"
          />
        </div>
        <div className="admin-users-filters">
          {(['all', 'customer', 'kitchen', 'admin'] as const).map(role => (
            <button
              key={role}
              onClick={() => setFilter(role)}
              className={`admin-users-filter ${filter === role ? 'admin-users-filter-active' : ''}`}
            >
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Users List */}
      {filteredUsers.length === 0 ? (
        <div className="admin-users-empty">
          <div className="admin-users-empty-icon">👥</div>
          <p className="admin-users-empty-text">No users found</p>
        </div>
      ) : (
        <div className="admin-users-table-wrapper">
          <table className="admin-users-table">
            <thead className="admin-users-thead">
              <tr>
                <th className="admin-users-th">User</th>
                <th className="admin-users-th">Email</th>
                <th className="admin-users-th">Role</th>
                <th className="admin-users-th">Phone</th>
                <th className="admin-users-th">Joined</th>
                <th className="admin-users-th">Actions</th>
              </tr>
            </thead>
            <tbody className="admin-users-tbody">
              {filteredUsers.map(user => (
                <tr key={user._id} className="admin-users-tr">
                  <td className="admin-users-td">
                    <div className="admin-users-user-cell">
                      <div className="admin-users-avatar">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="admin-users-name">{user.name}</span>
                    </div>
                  </td>
                  <td className="admin-users-td">
                    <span className="admin-users-email">{user.email}</span>
                  </td>
                  <td className="admin-users-td">
                    <span className={`admin-users-role-badge ${getRoleBadgeClass(user.role)}`}>
                      {getRoleIcon(user.role)} {user.role}
                    </span>
                  </td>
                  <td className="admin-users-td">
                    <span className="admin-users-phone">{user.phone || 'N/A'}</span>
                  </td>
                  <td className="admin-users-td">
                    <span className="admin-users-date">{getTimeAgo(user.createdAt)}</span>
                  </td>
                  <td className="admin-users-td">
                    <div className="admin-users-actions">
                      <button
                        className="admin-users-action admin-users-action-view"
                        title="View Details"
                      >
                        👁️
                      </button>
                      <button
                        className="admin-users-action admin-users-action-edit"
                        title="Edit User"
                      >
                        ✏️
                      </button>
                      <button
                        className="admin-users-action admin-users-action-delete"
                        title="Delete User"
                        disabled={user.role === 'admin'}
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Info Note */}
      <div className="admin-users-note">
        <span className="admin-users-note-icon">ℹ️</span>
        <span className="admin-users-note-text">
          Note: Full user management features (edit, delete, etc.) would require additional backend endpoints.
          Currently showing authenticated user data.
        </span>
      </div>
    </div>
  );
};

export default UserManagement;
