import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import '../../styles/AdminDashboard.css';

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalUsers: number;
  totalMenuItems: number;
  recentOrders: Array<{
    _id: string;
    orderNumber: string;
    customerName: string;
    total: number;
    status: string;
    createdAt: string;
  }>;
  ordersByStatus: {
    pending: number;
    confirmed: number;
    preparing: number;
    ready: number;
    served: number;
    completed: number;
  };
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (!token || !userStr) {
      alert('Please login to access admin dashboard');
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

    fetchDashboardData();
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all data in parallel
      const [ordersRes, usersRes, menuRes] = await Promise.all([
        api.get('/orders/admin/all'),
        api.get('/auth/me').catch(() => ({ data: { data: [] } })),
        api.get('/menu/items')
      ]);

      const orders = ordersRes.data.orders || [];
      const menuItems = menuRes.data.data || [];

      // Calculate stats
      const totalRevenue = orders.reduce((sum: number, order: any) => {
        if (order.status !== 'cancelled') {
          return sum + order.total;
        }
        return sum;
      }, 0);

      const ordersByStatus = orders.reduce((acc: any, order: any) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      }, {
        pending: 0,
        confirmed: 0,
        preparing: 0,
        ready: 0,
        served: 0,
        completed: 0
      });

      const recentOrders = orders
        .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 10);

      setStats({
        totalOrders: orders.length,
        totalRevenue,
        totalUsers: 0, // Would need user endpoint
        totalMenuItems: menuItems.length,
        recentOrders,
        ordersByStatus
      });
    } catch (err: any) {
      console.error('Error fetching dashboard data:', err);
      setError(err.response?.data?.error || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: '#f59e0b',
      confirmed: '#3b82f6',
      preparing: '#ff6b35',
      ready: '#10b981',
      served: '#8b5cf6',
      completed: '#6b7280',
      cancelled: '#ef4444'
    };
    return colors[status] || '#6b7280';
  };

  const getTimeAgo = (dateString: string) => {
    const minutes = Math.floor((Date.now() - new Date(dateString).getTime()) / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes === 1) return '1 min ago';
    if (minutes < 60) return `${minutes} mins ago`;
    const hours = Math.floor(minutes / 60);
    if (hours === 1) return '1 hour ago';
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    return days === 1 ? '1 day ago' : `${days} days ago`;
  };

  if (loading) {
    return (
      <div className="admin-dash-container">
        <div className="admin-dash-loading">
          <div className="admin-dash-spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-dash-container">
        <div className="admin-dash-error">
          <span className="admin-dash-error-icon">⚠️</span>
          <p>{error}</p>
          <button onClick={fetchDashboardData} className="admin-dash-retry">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dash-container">
      {/* Header */}
      <div className="admin-dash-header">
        <div className="admin-dash-header-content">
          <h1 className="admin-dash-title">📊 Admin Dashboard</h1>
          <p className="admin-dash-subtitle">Welcome back! Here's what's happening today</p>
        </div>
        <button onClick={fetchDashboardData} className="admin-dash-refresh">
          🔄 Refresh
        </button>
      </div>

      {/* Stats Grid */}
      <div className="admin-dash-stats">
        <div className="admin-dash-stat-card admin-dash-stat-orders">
          <div className="admin-dash-stat-icon">📦</div>
          <div className="admin-dash-stat-info">
            <div className="admin-dash-stat-value">{stats?.totalOrders || 0}</div>
            <div className="admin-dash-stat-label">Total Orders</div>
          </div>
        </div>

        <div className="admin-dash-stat-card admin-dash-stat-revenue">
          <div className="admin-dash-stat-icon">💰</div>
          <div className="admin-dash-stat-info">
            <div className="admin-dash-stat-value">Rs. {(stats?.totalRevenue || 0).toLocaleString()}</div>
            <div className="admin-dash-stat-label">Total Revenue</div>
          </div>
        </div>

        <div className="admin-dash-stat-card admin-dash-stat-menu">
          <div className="admin-dash-stat-icon">🍽️</div>
          <div className="admin-dash-stat-info">
            <div className="admin-dash-stat-value">{stats?.totalMenuItems || 0}</div>
            <div className="admin-dash-stat-label">Menu Items</div>
          </div>
        </div>

        <div className="admin-dash-stat-card admin-dash-stat-active">
          <div className="admin-dash-stat-icon">⚡</div>
          <div className="admin-dash-stat-info">
            <div className="admin-dash-stat-value">
              {(stats?.ordersByStatus.pending || 0) + (stats?.ordersByStatus.confirmed || 0) + (stats?.ordersByStatus.preparing || 0)}
            </div>
            <div className="admin-dash-stat-label">Active Orders</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="admin-dash-content">
        {/* Orders by Status */}
        <div className="admin-dash-section">
          <h2 className="admin-dash-section-title">📊 Orders by Status</h2>
          <div className="admin-dash-status-grid">
            {Object.entries(stats?.ordersByStatus || {}).map(([status, count]) => (
              <div key={status} className="admin-dash-status-card">
                <div 
                  className="admin-dash-status-indicator" 
                  style={{ backgroundColor: getStatusColor(status) }}
                ></div>
                <div className="admin-dash-status-info">
                  <div className="admin-dash-status-count">{count}</div>
                  <div className="admin-dash-status-label">{status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="admin-dash-section">
          <h2 className="admin-dash-section-title">🕒 Recent Orders</h2>
          <div className="admin-dash-orders-list">
            {stats?.recentOrders && stats.recentOrders.length > 0 ? (
              stats.recentOrders.map((order) => (
                <div key={order._id} className="admin-dash-order-item">
                  <div className="admin-dash-order-left">
                    <div className="admin-dash-order-number">{order.orderNumber}</div>
                    <div className="admin-dash-order-customer">👤 {order.customerName}</div>
                  </div>
                  <div className="admin-dash-order-right">
                    <div 
                      className="admin-dash-order-status"
                      style={{ 
                        backgroundColor: `${getStatusColor(order.status)}20`,
                        color: getStatusColor(order.status)
                      }}
                    >
                      {order.status}
                    </div>
                    <div className="admin-dash-order-amount">Rs. {order.total.toFixed(2)}</div>
                    <div className="admin-dash-order-time">{getTimeAgo(order.createdAt)}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="admin-dash-empty">No recent orders</div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="admin-dash-section">
          <h2 className="admin-dash-section-title">⚡ Quick Actions</h2>
          <div className="admin-dash-actions">
            <button 
              onClick={() => navigate('/admin/menu')}
              className="admin-dash-action-btn admin-dash-action-menu"
            >
              <span className="admin-dash-action-icon">🍽️</span>
              <span className="admin-dash-action-text">Manage Menu</span>
            </button>
            <button 
              onClick={() => navigate('/admin/users')}
              className="admin-dash-action-btn admin-dash-action-users"
            >
              <span className="admin-dash-action-icon">👥</span>
              <span className="admin-dash-action-text">Manage Users</span>
            </button>
            <button 
              onClick={() => navigate('/admin/analytics')}
              className="admin-dash-action-btn admin-dash-action-analytics"
            >
              <span className="admin-dash-action-icon">📈</span>
              <span className="admin-dash-action-text">View Analytics</span>
            </button>
            <button 
              onClick={() => navigate('/kitchen/orders')}
              className="admin-dash-action-btn admin-dash-action-kitchen"
            >
              <span className="admin-dash-action-icon">🍳</span>
              <span className="admin-dash-action-text">Kitchen View</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
