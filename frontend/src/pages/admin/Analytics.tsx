import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import '../../styles/Analytics.css';

interface AnalyticsData {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  topItems: Array<{ name: string; count: number; revenue: number }>;
  dailySales: Array<{ date: string; sales: number; orderCount: number }>;
  ordersByStatus: Record<string, number>;
  revenueByCategory: Record<string, number>;
}

const Analytics: React.FC = () => {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'year'>('month');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (!token || !userStr) {
      alert('Please login to access analytics');
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

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch orders
      const ordersRes = await api.get('/orders/admin/all');
      const orders = ordersRes.data.orders || [];

      // Filter orders by date range
      const now = new Date();
      const filteredOrders = orders.filter((order: any) => {
        const orderDate = new Date(order.createdAt);
        const daysDiff = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (dateRange === 'week') return daysDiff <= 7;
        if (dateRange === 'month') return daysDiff <= 30;
        if (dateRange === 'year') return daysDiff <= 365;
        return true;
      });

      // Calculate total revenue (excluding cancelled orders)
      const activeOrders = filteredOrders.filter((o: any) => o.status !== 'cancelled');
      const totalRevenue = activeOrders.reduce((sum: number, order: any) => sum + order.total, 0);
      const totalOrders = activeOrders.length;
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

      // Top items
      const itemsMap: Record<string, { count: number; revenue: number }> = {};
      activeOrders.forEach((order: any) => {
        order.items.forEach((item: any) => {
          if (!itemsMap[item.name]) {
            itemsMap[item.name] = { count: 0, revenue: 0 };
          }
          itemsMap[item.name].count += item.quantity;
          itemsMap[item.name].revenue += item.itemTotal;
        });
      });

      const topItems = Object.entries(itemsMap)
        .map(([name, data]) => ({ name, ...data }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Orders by status
      const ordersByStatus = activeOrders.reduce((acc: any, order: any) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      }, {});

      // Daily sales
      const salesByDate: Record<string, { sales: number; orderCount: number }> = {};
      activeOrders.forEach((order: any) => {
        const date = new Date(order.createdAt).toISOString().split('T')[0];
        if (!salesByDate[date]) {
          salesByDate[date] = { sales: 0, orderCount: 0 };
        }
        salesByDate[date].sales += order.total;
        salesByDate[date].orderCount += 1;
      });

      const dailySales = Object.entries(salesByDate)
        .map(([date, data]) => ({ date, ...data }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(-14); // Last 14 days

      // Revenue by category
      const revenueByCategory: Record<string, number> = {};
      activeOrders.forEach((order: any) => {
        order.items.forEach((item: any) => {
          const category = item.category || 'Other';
          revenueByCategory[category] = (revenueByCategory[category] || 0) + item.itemTotal;
        });
      });

      setAnalytics({
        totalOrders,
        totalRevenue,
        averageOrderValue,
        topItems,
        dailySales,
        ordersByStatus,
        revenueByCategory
      });
    } catch (err: any) {
      console.error('Error fetching analytics:', err);
      setError(err.response?.data?.error || 'Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-analytics-container">
        <div className="admin-analytics-loading">
          <div className="admin-analytics-spinner"></div>
          <p>Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="admin-analytics-container">
        <div className="admin-analytics-error">
          <span className="admin-analytics-error-icon">⚠️</span>
          <p>{error || 'No data available'}</p>
          <button onClick={fetchAnalytics} className="admin-analytics-retry">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-analytics-container">
      {/* Header */}
      <div className="admin-analytics-header">
        <div className="admin-analytics-header-content">
          <h1 className="admin-analytics-title">📊 Analytics & Reports</h1>
          <p className="admin-analytics-subtitle">Track your business performance and insights</p>
        </div>
        <div className="admin-analytics-filters">
          {(['week', 'month', 'year'] as const).map(range => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`admin-analytics-filter-btn ${dateRange === range ? 'admin-analytics-filter-active' : ''}`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="admin-analytics-stats">
        <div className="admin-analytics-stat-card">
          <div className="admin-analytics-stat-icon">📦</div>
          <div className="admin-analytics-stat-content">
            <p className="admin-analytics-stat-label">Total Orders</p>
            <h3 className="admin-analytics-stat-value">{analytics.totalOrders}</h3>
          </div>
        </div>

        <div className="admin-analytics-stat-card">
          <div className="admin-analytics-stat-icon">💰</div>
          <div className="admin-analytics-stat-content">
            <p className="admin-analytics-stat-label">Total Revenue</p>
            <h3 className="admin-analytics-stat-value">Rs. {analytics.totalRevenue.toLocaleString()}</h3>
          </div>
        </div>

        <div className="admin-analytics-stat-card">
          <div className="admin-analytics-stat-icon">📈</div>
          <div className="admin-analytics-stat-content">
            <p className="admin-analytics-stat-label">Avg Order Value</p>
            <h3 className="admin-analytics-stat-value">Rs. {analytics.averageOrderValue.toFixed(2)}</h3>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="admin-analytics-sections">
        {/* Top Items */}
        <section className="admin-analytics-section">
          <h2 className="admin-analytics-section-title">🏆 Top Selling Items</h2>
          <div className="admin-analytics-top-items">
            {analytics.topItems.map((item, idx) => {
              const maxCount = analytics.topItems[0].count;
              const percentage = (item.count / maxCount) * 100;
              return (
                <div key={idx} className="admin-analytics-top-item">
                  <div className="admin-analytics-item-rank">#{idx + 1}</div>
                  <div className="admin-analytics-item-info">
                    <p className="admin-analytics-item-name">{item.name}</p>
                    <div className="admin-analytics-item-bar">
                      <div
                        className="admin-analytics-bar-fill"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="admin-analytics-item-details">
                      <span>{item.count} orders</span>
                      <span>Rs. {item.revenue.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Orders by Status */}
        <section className="admin-analytics-section">
          <h2 className="admin-analytics-section-title">📊 Orders by Status</h2>
          <div className="admin-analytics-status-breakdown">
            {Object.entries(analytics.ordersByStatus).map(([status, count]) => {
              const total = Object.values(analytics.ordersByStatus).reduce((a, b) => a + b, 0);
              const percentage = ((count / total) * 100).toFixed(1);
              return (
                <div key={status} className="admin-analytics-status-item">
                  <div className="admin-analytics-status-info">
                    <p className="admin-analytics-status-name">
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </p>
                    <p className="admin-analytics-status-count">{count} orders</p>
                  </div>
                  <div className="admin-analytics-status-bar">
                    <div
                      className={`admin-analytics-status-fill admin-analytics-status-${status}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="admin-analytics-percentage">{percentage}%</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Daily Sales Chart */}
        <section className="admin-analytics-section admin-analytics-full-width">
          <h2 className="admin-analytics-section-title">📈 Daily Sales Trend</h2>
          <div className="admin-analytics-sales-chart">
            {analytics.dailySales.map((day, idx) => {
              const maxSales = Math.max(...analytics.dailySales.map(d => d.sales));
              const barHeight = (day.sales / maxSales) * 100;
              return (
                <div key={idx} className="admin-analytics-chart-bar">
                  <div
                    className="admin-analytics-bar"
                    style={{ height: `${barHeight}%` }}
                    title={`Rs. ${day.sales.toLocaleString()}`}
                  >
                    <span className="admin-analytics-bar-value">Rs. {day.sales.toLocaleString()}</span>
                  </div>
                  <span className="admin-analytics-bar-label">
                    {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Revenue by Category */}
        {Object.keys(analytics.revenueByCategory).length > 0 && (
          <section className="admin-analytics-section">
            <h2 className="admin-analytics-section-title">🍽️ Revenue by Category</h2>
            <div className="admin-analytics-category-list">
              {Object.entries(analytics.revenueByCategory)
                .sort(([, a], [, b]) => b - a)
                .map(([category, revenue]) => {
                  const totalRevenue = Object.values(analytics.revenueByCategory).reduce((a, b) => a + b, 0);
                  const percentage = ((revenue / totalRevenue) * 100).toFixed(1);
                  return (
                    <div key={category} className="admin-analytics-category-item">
                      <div className="admin-analytics-category-name">{category}</div>
                      <div className="admin-analytics-category-bar">
                        <div
                          className="admin-analytics-category-fill"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <div className="admin-analytics-category-value">
                        <span>Rs. {revenue.toFixed(2)}</span>
                        <span>({percentage}%)</span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Analytics;
