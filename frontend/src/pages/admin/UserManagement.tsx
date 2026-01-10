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
  const [showAddModal, setShowAddModal] = useState(false);
  const [addUserForm, setAddUserForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'customer' as User['role']
  });
  const [addUserLoading, setAddUserLoading] = useState(false);

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
      
      // Fetch all users from backend
      const response = await api.get('/auth/users');
      setUsers(response.data.data || []);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      console.error('Error fetching users:', error);
      setError(error.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleRoleChange = async (userId: string, newRole: User['role']) => {
    if (window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
      try {
        await api.put(`/auth/users/${userId}/role`, { role: newRole });
        alert('User role updated successfully!');
        fetchUsers();
      } catch (err: unknown) {
        const error = err as { response?: { data?: { message?: string } } };
        console.error('Error updating user role:', error);
        alert(error.response?.data?.message || 'Failed to update user role');
      }
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (window.confirm(`Are you sure you want to delete ${userName}? This action cannot be undone.`)) {
      try {
        await api.delete(`/auth/users/${userId}`);
        alert('User deleted successfully!');
        fetchUsers();
      } catch (err: unknown) {
        const error = err as { response?: { data?: { message?: string } } };
        console.error('Error deleting user:', error);
        alert(error.response?.data?.message || 'Failed to delete user');
      }
    }
  };
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!addUserForm.name || !addUserForm.email || !addUserForm.phone || !addUserForm.password) {
      alert('Please fill in all fields');
      return;
    }

    if (addUserForm.password.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }

    setAddUserLoading(true);
    try {
      await api.post('/auth/register', addUserForm);
      alert('User added successfully!');
      setShowAddModal(false);
      setAddUserForm({
        name: '',
        email: '',
        phone: '',
        password: '',
        role: 'customer'
      });
      fetchUsers();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      console.error('Error adding user:', error);
      alert(error.response?.data?.message || 'Failed to add user');
    } finally {
      setAddUserLoading(false);
    }
  };
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
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return date.toLocaleDateString('en-US', options);
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
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => setShowAddModal(true)} className="admin-users-add-btn">
            ➕ Add User
          </button>
          <button onClick={fetchUsers} className="admin-users-refresh">
            🔄 Refresh
          </button>
        </div>
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
                  <td className="admin-users-td" data-label="User">
                    <div className="admin-users-user-cell">
                      <div className="admin-users-avatar">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="admin-users-name">{user.name}</span>
                    </div>
                  </td>
                  <td className="admin-users-td" data-label="Email">
                    <span className="admin-users-email">{user.email}</span>
                  </td>
                  <td className="admin-users-td" data-label="Role">
                    <span className={`admin-users-role-badge ${getRoleBadgeClass(user.role)}`}>
                      {getRoleIcon(user.role)} {user.role}
                    </span>
                  </td>
                  <td className="admin-users-td" data-label="Phone">
                    <span className="admin-users-phone">{user.phone || 'N/A'}</span>
                  </td>
                  <td className="admin-users-td" data-label="Joined">
                    <span className="admin-users-date">{getTimeAgo(user.createdAt)}</span>
                  </td>
                  <td className="admin-users-td" data-label="Actions">
                    <div className="admin-users-actions">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user._id, e.target.value as User['role'])}
                        className="admin-users-role-select"
                        title="Change Role"
                      >
                        <option value="customer">Customer</option>
                        <option value="kitchen">Kitchen</option>
                        <option value="admin">Admin</option>
                      </select>
                      <button
                        className="admin-users-action admin-users-action-delete"
                        title="Delete User"
                        onClick={() => handleDeleteUser(user._id, user.name)}
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
          Use the dropdown to change user roles. Delete button removes users from the system permanently.
        </span>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="admin-users-modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="admin-users-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-users-modal-header">
              <h2>➕ Add New User</h2>
              <button 
                className="admin-users-modal-close" 
                onClick={() => setShowAddModal(false)}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleAddUser} className="admin-users-modal-form">
              <div className="admin-users-form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  placeholder="Enter full name"
                  value={addUserForm.name}
                  onChange={(e) => setAddUserForm({...addUserForm, name: e.target.value})}
                  required
                  disabled={addUserLoading}
                />
              </div>
              <div className="admin-users-form-group">
                <label>Email *</label>
                <input
                  type="email"
                  placeholder="Enter email address"
                  value={addUserForm.email}
                  onChange={(e) => setAddUserForm({...addUserForm, email: e.target.value})}
                  required
                  disabled={addUserLoading}
                />
              </div>
              <div className="admin-users-form-group">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  placeholder="Enter phone number"
                  value={addUserForm.phone}
                  onChange={(e) => setAddUserForm({...addUserForm, phone: e.target.value})}
                  pattern="[0-9]{10,15}"
                  required
                  disabled={addUserLoading}
                />
              </div>
              <div className="admin-users-form-group">
                <label>Password *</label>
                <input
                  type="password"
                  placeholder="Enter password (min 6 characters)"
                  value={addUserForm.password}
                  onChange={(e) => setAddUserForm({...addUserForm, password: e.target.value})}
                  minLength={6}
                  required
                  disabled={addUserLoading}
                />
              </div>
              <div className="admin-users-form-group">
                <label>Role *</label>
                <select
                  value={addUserForm.role}
                  onChange={(e) => setAddUserForm({...addUserForm, role: e.target.value as User['role']})}
                  disabled={addUserLoading}
                >
                  <option value="customer">Customer</option>
                  <option value="kitchen">Kitchen Staff</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="admin-users-modal-actions">
                <button 
                  type="button" 
                  className="admin-users-modal-cancel"
                  onClick={() => setShowAddModal(false)}
                  disabled={addUserLoading}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="admin-users-modal-submit"
                  disabled={addUserLoading}
                >
                  {addUserLoading ? 'Adding...' : 'Add User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
