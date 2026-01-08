import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../../styles/OrderHistory.css';
import { useAuth } from '../../context/AuthContext';
import OrderService, { type Order } from '../../services/orderService';

const OrderHistory: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const isGuestMode = location.pathname.includes('/guest');
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        setLoading(true);
        
        // Get orders based on authentication status
        let fetchedOrders: Order[];
        if (isAuthenticated && !isGuestMode) {
          // Fetch authenticated user's orders
          fetchedOrders = await OrderService.getOrders();
        } else {
          // Fetch guest orders using session ID
          const guestSessionId = OrderService.getGuestSessionId();
          fetchedOrders = await OrderService.getOrders(guestSessionId);
        }
        
        setOrders(fetchedOrders);
        setError('');
      } catch (err: any) {
        console.error('Error fetching order history:', err);
        setError(err.response?.data?.error || 'Failed to load order history');
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderHistory();
  }, [isAuthenticated, isGuestMode]);

  if (loading) return <div className="order-history-loading">Loading order history...</div>;

  return (
    <div className="order-history-page">
      <div className="order-history-header">
        <h1>📦 Order History</h1>
        <p className="subtitle">View all your past orders</p>
        {isGuestMode && (
          <div className="guest-session-notice">
            🔒 These orders are only visible in this browser session. Create an account to save orders permanently.
          </div>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="orders-list">
        {orders.length === 0 ? (
          <div className="no-orders">
            <p>No orders yet. Start ordering now!</p>
          </div>
        ) : (
          orders.map(order => (
            <div key={order._id} className="order-card">
              <div className="order-header-row">
                <div className="order-info">
                  <h3>{order.orderNumber}</h3>
                  <p className="order-date">{new Date(order.orderedAt).toLocaleDateString()}</p>
                  <p className="order-type">{order.orderType === 'dine-in' ? 'Dine-In' : 'Takeaway'}</p>
                  {order.guestInfo && (
                    <p className="guest-info">Guest: {order.guestInfo.name}</p>
                  )}
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
                    <span className="item-name">{item.name}</span>
                    <span className="item-quantity">x{item.quantity}</span>
                    <span className="item-price">LKR {item.itemTotal.toFixed(2)}</span>
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
