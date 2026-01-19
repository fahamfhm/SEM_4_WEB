import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/Analytics.css';

interface AnalyticsData {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  topItems: Array<{ name: string; count: number }>;
  dailySales: Array<{ date: string; sales: number }>;
  ordersByStatus: Record<string, number>;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Analytics: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'year'>('month');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/analytics`, {
          params: { range: dateRange }
        });
        setAnalytics(response.data.data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
        // Demo data
        setAnalytics({
          totalOrders: 247,
          totalRevenue: 58920,
          averageOrderValue: 238.5,
          topItems: [
            { name: 'Classic Burger', count: 87 },
            { name: 'Hot Dog Combo', count: 64 },
            { name: 'Fried Chicken', count: 52 },
            { name: 'Cheese Pizza', count: 44 }
          ],
          dailySales: [
            { date: '2025-01-01', sales: 8450 },
            { date: '2025-01-02', sales: 9200 },
            { date: '2025-01-03', sales: 7800 },
            { date: '2025-01-04', sales: 9800 }
          ],
          ordersByStatus: {
            delivered: 200,
            pending: 30,
            preparing: 15,
            cancelled: 2
          }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [dateRange]);

  if (loading || !analytics) return <div className="loading">Loading analytics...</div>;

  return (
    <div className="analytics-page">
      <div className="analytics-header">
        <h1>📊 Analytics & Reports</h1>
        <div className="date-range-filter">
          {(['week', 'month', 'year'] as const).map(range => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`range-btn ${dateRange === range ? 'active' : ''}`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <p className="stat-label">Total Orders</p>
            <h3 className="stat-value">{analytics.totalOrders}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <p className="stat-label">Total Revenue</p>
            <h3 className="stat-value">LKR {analytics.totalRevenue.toLocaleString()}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <p className="stat-label">Avg Order Value</p>
            <h3 className="stat-value">LKR {analytics.averageOrderValue.toFixed(2)}</h3>
          </div>
        </div>
      </div>

      <div className="analytics-sections">
        {/* Top Items */}
        <section className="analytics-section">
          <h2>🏆 Top Selling Items</h2>
          <div className="top-items-list">
            {analytics.topItems.map((item, idx) => {
              const percentage = (item.count / analytics.topItems[0].count) * 100;
              return (
                <div key={idx} className="top-item">
                  <div className="item-rank">#{idx + 1}</div>
                  <div className="item-info">
                    <p className="item-name">{item.name}</p>
                    <div className="item-bar">
                      <div
                        className="bar-fill"
                        data-width={percentage}
                      ></div>
                    </div>
                  </div>
                  <div className="item-count">{item.count} orders</div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Orders by Status */}
        <section className="analytics-section">
          <h2>📊 Orders by Status</h2>
          <div className="status-breakdown">
            {Object.entries(analytics.ordersByStatus).map(([status, count]) => {
              const total = Object.values(analytics.ordersByStatus).reduce((a, b) => a + b, 0);
              const percentage = ((count / total) * 100).toFixed(1);
              return (
                <div key={status} className="status-item">
                  <div className="status-info">
                    <p className="status-name">{status.charAt(0).toUpperCase() + status.slice(1)}</p>
                    <p className="status-count">{count} orders</p>
                  </div>
                  <div className="status-bar">
                    <div
                      className={`bar-fill status-${status}`}
                      data-width={percentage}
                    ></div>
                  </div>
                  <span className="percentage">{percentage}%</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Daily Sales Chart */}
        <section className="analytics-section full-width">
          <h2>📈 Daily Sales Trend</h2>
          <div className="sales-chart">
            {analytics.dailySales.map((day, idx) => {
              const maxSales = Math.max(...analytics.dailySales.map(d => d.sales));
              const barHeight = (day.sales / maxSales) * 200;
              return (
                <div key={idx} className="chart-bar">
                  <div
                    className="bar"
                    data-height={barHeight}
                  >
                    <span className="bar-value">LKR {day.sales}</span>
                  </div>
                  <span className="bar-label">{new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Analytics;
