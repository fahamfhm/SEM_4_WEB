import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import '../../styles/UserManagement.css';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'staff' | 'admin';
  phone: string;
  isActive: boolean;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'customer' | 'staff' | 'admin'>('all');

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const url = filter === 'all' 
        ? `${API_BASE_URL}/users`
        : `${API_BASE_URL}/users?role=${filter}`;
      const response = await axios.get(url);
      setUsers(response.data.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleToggleActive = async (userId: string, isActive: boolean) => {
    try {
      await axios.patch(`${API_BASE_URL}/users/${userId}`, { isActive: !isActive });
      setUsers(users.map(u => u.id === userId ? { ...u, isActive: !isActive } : u));
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Error updating user status');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`${API_BASE_URL}/users/${userId}`);
        setUsers(users.filter(u => u.id !== userId));
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Error deleting user');
      }
    }
  };

  const getRoleIcon = (role: User['role']) => {
    const icons: Record<User['role'], string> = {
      customer: '👤',
      staff: '👨‍🍳',
      admin: '👨‍💼'
    };
    return icons[role];
  };

  if (loading) return <div className="loading">Loading users...</div>;

  return (
    <div className="user-management-page">
      <div className="management-header">
        <h1>👥 User Management</h1>
      </div>

      <div className="filters">
        {(['all', 'customer', 'staff', 'admin'] as const).map(role => (
          <button
            key={role}
            onClick={() => setFilter(role)}
            className={`filter-btn ${filter === role ? 'active' : ''}`}
          >
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </button>
        ))}
      </div>

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className={!user.isActive ? 'inactive' : ''}>
                <td className="name-cell">{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className="role-badge">
                    {getRoleIcon(user.role)} {user.role}
                  </span>
                </td>
                <td>{user.phone}</td>
                <td>
                  <span className={`status-badge ${user.isActive ? 'active' : 'inactive'}`}>
                    {user.isActive ? '✓ Active' : '✗ Inactive'}
                  </span>
                </td>
                <td className="actions-cell">
                  <button
                    onClick={() => handleToggleActive(user.id, user.isActive)}
                    className={`btn-action ${user.isActive ? 'btn-deactivate' : 'btn-activate'}`}
                  >
                    {user.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="btn-action btn-delete"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {users.length === 0 && (
        <div className="no-users">
          <p>No users found</p>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
