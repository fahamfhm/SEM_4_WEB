import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../styles/OrderHistory.css';
import { useAuth } from '../../context/AuthContext';
import OrderService, { type Order } from '../../services/orderService';

const OrderHistory: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
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

  const handleTrackOrder = (orderId: string) => {
    const basePath = isGuestMode ? '/guest' : '/customer';
    navigate(`${basePath}/order-tracking`, { state: { orderId } });
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, string> = {
      pending: '⏳',
      confirmed: '✅',
      preparing: '🍳',
      ready: '📦',
      served: '🍽️',
      delivered: '🚚',
      completed: '🎉',
      cancelled: '❌'
    };
    return icons[status] || '📋';
  };

  if (loading) {
    return (
      <div className="oh-container">
        <div className="oh-loading">
          <div className="oh-loading-spinner"></div>
          <p className="oh-loading-text">Loading your order history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="oh-container">
      <div className="oh-header">
        <div className="oh-header-content">
          <h1 className="oh-title">📦 Order History</h1>
          <p className="oh-subtitle">Track and view all your past orders</p>
        </div>
        {isGuestMode && (
          <div className="oh-guest-notice">
            <span className="oh-guest-notice-icon">🔒</span>
            <span className="oh-guest-notice-text">
              These orders are only visible in this browser session. Create an account to save orders permanently.
            </span>
          </div>
        )}
      </div>

      {error && (
        <div className="oh-error">
          <span className="oh-error-icon">⚠️</span>
          <span className="oh-error-text">{error}</span>
        </div>
      )}

      <div className="oh-content">
        {orders.length === 0 ? (
          <div className="oh-empty">
            <div className="oh-empty-icon">📭</div>
            <h3 className="oh-empty-title">No Orders Yet</h3>
            <p className="oh-empty-text">Start ordering your favorite meals now!</p>
            <button className="oh-empty-btn" onClick={() => navigate(isGuestMode ? '/guest/menu' : '/customer/menu')}>
              Browse Menu
            </button>
          </div>
        ) : (
          <div className="oh-orders-list">
            {orders.map(order => (
              <div key={order._id} className="oh-order-card">
                {/* Order Header */}
                <div className="oh-order-header">
                  <div className="oh-order-info">
                    <div className="oh-order-number">
                      <span className="oh-order-number-label">Order</span>
                      <span className="oh-order-number-value">#{order.orderNumber}</span>
                    </div>
                    <div className="oh-order-meta">
                      <span className="oh-order-date">
                        <span className="oh-order-date-icon">📅</span>
                        {new Date(order.orderedAt).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </span>
                      <span className="oh-order-time">
                        <span className="oh-order-time-icon">🕐</span>
                        {new Date(order.orderedAt).toLocaleTimeString('en-US', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="oh-order-status-wrapper">
                    <span className={`oh-order-status oh-order-status-${order.status}`}>
                      <span className="oh-order-status-icon">{getStatusIcon(order.status)}</span>
                      <span className="oh-order-status-text">{order.status}</span>
                    </span>
                  </div>
                </div>

                {/* Order Details */}
                <div className="oh-order-details">
                  <div className="oh-order-type-badge">
                    <span className="oh-order-type-icon">
                      {order.orderType === 'dine-in' ? '🍽️' : '🥡'}
                    </span>
                    <span className="oh-order-type-text">
                      {order.orderType === 'dine-in' && order.tableNumber 
                        ? `Table ${order.tableNumber}` 
                        : order.orderType === 'dine-in' ? 'Dine-In' : 'Takeaway'
                      }
                    </span>
                  </div>
                  {order.guestInfo && (
                    <div className="oh-guest-info">
                      <span className="oh-guest-info-icon">👤</span>
                      <span className="oh-guest-info-text">{order.guestInfo.name}</span>
                    </div>
                  )}
                </div>

                {/* Order Items */}
                <div className="oh-order-items">
                  <div className="oh-items-header">
                    <span className="oh-items-title">Items</span>
                    <span className="oh-items-count">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="oh-items-list">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="oh-item">
                        <div className="oh-item-info">
                          <span className="oh-item-name">{item.name}</span>
                          {item.customizations && Object.keys(item.customizations).length > 0 && (
                            <span className="oh-item-customizations">
                              {Object.entries(item.customizations).map(([key, value]) => 
                                `${key}: ${value}`
                              ).join(', ')}
                            </span>
                          )}
                        </div>
                        <div className="oh-item-details">
                          <span className="oh-item-quantity">×{item.quantity}</span>
                          <span className="oh-item-price">Rs. {item.itemTotal.toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Footer */}
                <div className="oh-order-footer">
                  <div className="oh-order-total">
                    <span className="oh-order-total-label">Total Amount</span>
                    <span className="oh-order-total-value">Rs. {order.total.toFixed(2)}</span>
                  </div>
                  <button 
                    className="oh-track-btn"
                    onClick={() => handleTrackOrder(order._id)}
                  >
                    <span className="oh-track-btn-icon">📍</span>
                    <span className="oh-track-btn-text">Track Order</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
