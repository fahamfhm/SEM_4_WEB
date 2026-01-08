import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import authService from '../../services/authService';
import type { User } from '../../services/authService';
import '../../styles/Profile.css';

interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const CustomerProfile: React.FC = () => {
  const { user: contextUser, setUser } = useAuth();
  const [user, setLocalUser] = useState<User | null>(contextUser);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [editForm, setEditForm] = useState({
    name: '',
    phone: '',
    email: ''
  });

  const [passwordForm, setPasswordForm] = useState<PasswordChangeData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const userData = await authService.getCurrentUser();
      setLocalUser(userData);
      setEditForm({
        name: userData.name || '',
        phone: userData.phone || '',
        email: userData.email || ''
      });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to load profile' });
    } finally {
      setLoading(false);
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Reset form when canceling
      setEditForm({
        name: user?.name || '',
        phone: user?.phone || '',
        email: user?.email || ''
      });
    }
    setIsEditing(!isEditing);
    setMessage({ type: '', text: '' });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const updatedUser = await authService.updateProfile({
        name: editForm.name,
        phone: editForm.phone
      });
      
      setLocalUser(updatedUser);
      setUser(updatedUser);
      setIsEditing(false);
      setMessage({ type: 'success', text: '✅ Profile updated successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    // Validation
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'New password must be at least 6 characters' });
      return;
    }

    setLoading(true);

    try {
      await authService.updatePassword(
        passwordForm.currentPassword,
        passwordForm.newPassword
      );
      
      setMessage({ type: 'success', text: '✅ Password changed successfully!' });
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setIsChangingPassword(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to change password' });
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading && !user) {
    return (
      <div className="cust-profile-page">
        <div className="cust-profile-loading">
          <div className="cust-profile-spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cust-profile-page">
      <div className="cust-profile-container">
        {/* Header */}
        <div className="cust-profile-header">
          <div className="cust-profile-avatar">
            {user?.name && getInitials(user.name)}
          </div>
          <h1>{user?.name}</h1>
          <p className="cust-profile-role">🛍️ {user?.role}</p>
        </div>

        {/* Message */}
        {message.text && (
          <div className={`cust-profile-message cust-profile-message-${message.type}`}>
            {message.text}
          </div>
        )}

        {/* Profile Information */}
        <div className="cust-profile-card">
          <div className="cust-profile-card-header">
            <h2>👤 Profile Information</h2>
            <button
              className="cust-profile-btn-secondary"
              onClick={handleEditToggle}
              disabled={loading}
            >
              {isEditing ? '✖ Cancel' : '✏️ Edit Profile'}
            </button>
          </div>

          {isEditing ? (
            <form className="cust-profile-form" onSubmit={handleEditSubmit}>
              <div className="cust-profile-form-group">
                <label htmlFor="edit-name">Full Name *</label>
                <input
                  id="edit-name"
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  required
                  placeholder="Enter your full name"
                />
              </div>

              <div className="cust-profile-form-group">
                <label htmlFor="edit-email">Email Address</label>
                <input
                  id="edit-email"
                  type="email"
                  value={editForm.email}
                  disabled
                  className="cust-profile-input-disabled"
                />
                <small>Email cannot be changed</small>
              </div>

              <div className="cust-profile-form-group">
                <label htmlFor="edit-phone">Phone Number</label>
                <input
                  id="edit-phone"
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  placeholder="+1 234 567 8900"
                />
              </div>

              <button
                type="submit"
                className="cust-profile-btn-primary"
                disabled={loading}
              >
                {loading ? 'Saving...' : '💾 Save Changes'}
              </button>
            </form>
          ) : (
            <div className="cust-profile-details">
              <div className="cust-profile-field">
                <span className="cust-profile-label">Full Name</span>
                <span className="cust-profile-value">{user?.name || 'Not provided'}</span>
              </div>

              <div className="cust-profile-field">
                <span className="cust-profile-label">Email Address</span>
                <span className="cust-profile-value">{user?.email || 'Not provided'}</span>
              </div>

              <div className="cust-profile-field">
                <span className="cust-profile-label">Phone Number</span>
                <span className="cust-profile-value">{user?.phone || 'Not provided'}</span>
              </div>

              <div className="cust-profile-field">
                <span className="cust-profile-label">Account Role</span>
                <span className="cust-profile-value">
                  <span className="cust-profile-badge">{user?.role}</span>
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Security Section */}
        <div className="cust-profile-card">
          <div className="cust-profile-card-header">
            <h2>🔒 Security</h2>
            {!isChangingPassword && (
              <button
                className="cust-profile-btn-secondary"
                onClick={() => {
                  setIsChangingPassword(true);
                  setMessage({ type: '', text: '' });
                }}
                disabled={loading}
              >
                🔑 Change Password
              </button>
            )}
          </div>

          {isChangingPassword ? (
            <form className="cust-profile-form" onSubmit={handlePasswordSubmit}>
              <div className="cust-profile-form-group">
                <label htmlFor="current-password">Current Password *</label>
                <input
                  id="current-password"
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  required
                  placeholder="Enter current password"
                  autoComplete="current-password"
                />
              </div>

              <div className="cust-profile-form-group">
                <label htmlFor="new-password">New Password *</label>
                <input
                  id="new-password"
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  required
                  placeholder="Enter new password (min 6 characters)"
                  minLength={6}
                  autoComplete="new-password"
                />
              </div>

              <div className="cust-profile-form-group">
                <label htmlFor="confirm-password">Confirm New Password *</label>
                <input
                  id="confirm-password"
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  required
                  placeholder="Confirm new password"
                  minLength={6}
                  autoComplete="new-password"
                />
              </div>

              <div className="cust-profile-form-actions">
                <button
                  type="button"
                  className="cust-profile-btn-cancel"
                  onClick={() => {
                    setIsChangingPassword(false);
                    setPasswordForm({
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: ''
                    });
                    setMessage({ type: '', text: '' });
                  }}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="cust-profile-btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Updating...' : '🔒 Update Password'}
                </button>
              </div>
            </form>
          ) : (
            <div className="cust-profile-details">
              <div className="cust-profile-field">
                <span className="cust-profile-label">Password</span>
                <span className="cust-profile-value">••••••••••••</span>
              </div>
              <p className="cust-profile-hint">
                💡 Keep your password secure and change it regularly
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;
