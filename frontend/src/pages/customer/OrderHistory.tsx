import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/OrderHistory.css';

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  total: number;
  status: 'pending' | 'accepted' | 'preparing' | 'ready' | 'delivered';
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const OrderHistory: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/orders/history`);
        setOrders(response.data.data || []);
        setError('');
      } catch (err) {
        console.error('Error fetching order history:', err);
        setError('Failed to load order history');
        // Demo data
        setOrders([
          {
            id: '1',
            orderNumber: '#ORD-001',
            date: '2025-01-02',
            total: 1250,
            status: 'delivered',
            items: [
              { name: 'Classic Burger', quantity: 2, price: 450 },
              { name: 'Fried Chicken', quantity: 1, price: 350 }
            ]
          },
          {
            id: '2',
            orderNumber: '#ORD-002',
            date: '2025-01-01',
            total: 890,
            status: 'delivered',
            items: [
              { name: 'Hot Dog Combo', quantity: 1, price: 890 }
            ]
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderHistory();
  }, []);

  if (loading) return <div className="order-history-loading">Loading order history...</div>;

  return (
    <div className="order-history-page">
      <div className="order-history-header">
        <h1>📦 Order History</h1>
        <p className="subtitle">View all your past orders</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="orders-list">
        {orders.length === 0 ? (
          <div className="no-orders">
            <p>No orders yet. Start ordering now!</p>
          </div>
        ) : (
          orders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-header-row">
                <div className="order-info">
                  <h3>{order.orderNumber}</h3>
                  <p className="order-date">{new Date(order.date).toLocaleDateString()}</p>
                </div>
                <div className="order-status" data-status={order.status}>
                  <span className={`status-badge status-badge--${order.status}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                  <span className="order-total">LKR {order.total.toFixed(2)}</span>
                </div>
              </div>
              <div className="order-items-list">
                {order.items.map((item, idx) => (
                  <div key={idx} className="order-item-row">
                    <span className="item-name">{item.name} × {item.quantity}</span>
                    <span className="item-price">LKR {(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
