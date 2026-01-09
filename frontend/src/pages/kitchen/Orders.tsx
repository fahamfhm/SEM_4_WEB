import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OrderService from '../../services/orderService';
import type { Order } from '../../services/orderService';
import '../../styles/KitchenOrders.css';

// Kitchen order status type matching database
type FilterType = 'all' | 'pending' | 'confirmed' | 'preparing' | 'ready' | 'served' | 'delivered' | 'completed';

const KitchenOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (!token || !userStr) {
      alert('Please login to access kitchen orders');
      navigate('/auth/login');
      return;
    }

    try {
      const user = JSON.parse(userStr);
      if (user.role !== 'admin' && user.role !== 'kitchen') {
        alert('Access denied. Kitchen or Admin role required.');
        navigate('/');
        return;
      }
    } catch (err) {
      console.error('Invalid user data:', err);
      navigate('/auth/login');
    }
  }, [navigate]);

  // Fetch orders from backend
  const fetchOrders = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // Get all orders, can add filters for kitchen-specific statuses
      const result = await OrderService.getAllOrders({
        status: undefined, // Get all statuses
      });
      // Filter out only cancelled orders
      const activeOrders = result.orders.filter(
        o => o.status !== 'cancelled'
      );
      setOrders(activeOrders);
    } catch (err: unknown) {
      console.error('Error fetching orders:', err);
      const error = err as { response?: { status?: number } };
      if (error.response?.status === 403) {
        setError('Access denied. Please login with kitchen or admin credentials.');
      } else if (error.response?.status === 401) {
        setError('Session expired. Please login again.');
        setTimeout(() => navigate('/auth/login'), 2000);
      } else {
        setError('Failed to load orders. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // Update order status via API
  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      await OrderService.updateOrderStatus(orderId, newStatus);
      // Refresh orders
      await fetchOrders();
    } catch (err) {
      console.error('Error updating order status:', err);
      alert('Failed to update order status. Please try again.');
    }
  };

  // Complete and remove order
  const completeOrder = async (orderId: string) => {
    try {
      await OrderService.updateOrderStatus(orderId, 'served');
      // Remove from list after marking as served
      setOrders(prev => prev.filter(o => o._id !== orderId));
    } catch (err) {
      console.error('Error completing order:', err);
      alert('Failed to complete order. Please try again.');
    }
  };

  // Load orders on mount and set up polling
  useEffect(() => {
    fetchOrders();

    // Poll for new orders every 30 seconds
    const interval = setInterval(fetchOrders, 30000);

    return () => clearInterval(interval);
  }, [fetchOrders]);

  // Filter orders based on active filter
  const filteredOrders = activeFilter === 'all' 
    ? orders.filter(order => order.status !== 'completed')
    : orders.filter(order => order.status === activeFilter);

  // Get time ago string
  const getTimeAgo = (dateString: string) => {
    const minutes = Math.floor((Date.now() - new Date(dateString).getTime()) / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes === 1) return '1 min ago';
    return `${minutes} mins ago`;
  };

  // Get counts for filter badges
  const getCounts = (): Record<FilterType, number> => ({
    all: orders.filter(o => o.status !== 'completed').length,
    pending: orders.filter(o => o.status === 'pending').length,
    confirmed: orders.filter(o => o.status === 'confirmed').length,
    preparing: orders.filter(o => o.status === 'preparing').length,
    ready: orders.filter(o => o.status === 'ready').length,
    served: orders.filter(o => o.status === 'served').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    completed: orders.filter(o => o.status === 'completed').length,
  });

  const counts = getCounts();

  // Loading state
  if (loading && orders.length === 0) {
    return (
      <div className="kit-ord-container">
        <div className="kit-ord-header">
          <h2 className="kit-ord-title">🍳 Kitchen Orders</h2>
          <p className="kit-ord-subtitle">Manage all orders efficiently</p>
        </div>
        <div className="kit-ord-loading">
          <div className="kit-ord-loading-spinner"></div>
          <p className="kit-ord-loading-text">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="kit-ord-container">
      {/* Header Section */}
      <div className="kit-ord-header">
        <div className="kit-ord-header-content">
          <h2 className="kit-ord-title">🍳 Kitchen Orders</h2>
          <p className="kit-ord-subtitle">Manage incoming orders and update their status in real-time</p>
        </div>
        <button onClick={fetchOrders} className="kit-ord-refresh-btn" title="Refresh Orders">
          <span className="kit-ord-refresh-icon">🔄</span>
          <span className="kit-ord-refresh-text">Refresh</span>
        </button>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="kit-ord-error-banner">
          <div className="kit-ord-error-content">
            <span className="kit-ord-error-icon">⚠️</span>
            <span className="kit-ord-error-message">{error}</span>
          </div>
          <button onClick={fetchOrders} className="kit-ord-error-retry">
            Retry
          </button>
        </div>
      )}

      {/* Stats Summary */}
      <div className="kit-ord-stats">
        <div className="kit-ord-stat-card kit-ord-stat-total">
          <div className="kit-ord-stat-icon">📊</div>
          <div className="kit-ord-stat-info">
            <div className="kit-ord-stat-value">{counts.all}</div>
            <div className="kit-ord-stat-label">Total Orders</div>
          </div>
        </div>
        <div className="kit-ord-stat-card kit-ord-stat-pending">
          <div className="kit-ord-stat-icon">⏳</div>
          <div className="kit-ord-stat-info">
            <div className="kit-ord-stat-value">{counts.pending}</div>
            <div className="kit-ord-stat-label">Pending</div>
          </div>
        </div>
        <div className="kit-ord-stat-card kit-ord-stat-preparing">
          <div className="kit-ord-stat-icon">🍳</div>
          <div className="kit-ord-stat-info">
            <div className="kit-ord-stat-value">{counts.preparing}</div>
            <div className="kit-ord-stat-label">Preparing</div>
          </div>
        </div>
        <div className="kit-ord-stat-card kit-ord-stat-ready">
          <div className="kit-ord-stat-icon">✅</div>
          <div className="kit-ord-stat-info">
            <div className="kit-ord-stat-value">{counts.ready}</div>
            <div className="kit-ord-stat-label">Ready</div>
          </div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="kit-ord-filters">
        {(['all', 'pending', 'confirmed', 'preparing', 'ready', 'served', 'delivered', 'completed'] as FilterType[]).map(filter => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`kit-ord-filter-btn ${activeFilter === filter ? 'kit-ord-filter-btn-active' : ''}`}
          >
            <span className="kit-ord-filter-label">{filter.charAt(0).toUpperCase() + filter.slice(1)}</span>
            <span className="kit-ord-filter-badge">{counts[filter]}</span>
          </button>
        ))}
      </div>

      {/* Orders Grid */}
      {filteredOrders.length === 0 ? (
        <div className="kit-ord-empty">
          <div className="kit-ord-empty-icon">🎉</div>
          <h3 className="kit-ord-empty-title">All Clear!</h3>
          <p className="kit-ord-empty-text">
            No {activeFilter !== 'all' ? activeFilter : ''} orders at the moment
          </p>
        </div>
      ) : (
        <div className="kit-ord-grid">
          {filteredOrders.map(order => (
            <div 
              key={order._id} 
              className={`kit-ord-card kit-ord-card-${order.status}`}
            >
              {/* Order Header */}
              <div className="kit-ord-card-header">
                <div className="kit-ord-card-header-top">
                  <div className="kit-ord-order-info">
                    <span className="kit-ord-order-number">{order.orderNumber}</span>
                    <span className={`kit-ord-status kit-ord-status-${order.status}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="kit-ord-time">
                    <span className="kit-ord-time-icon">⏰</span>
                    <span className="kit-ord-time-text">{getTimeAgo(order.createdAt)}</span>
                  </div>
                </div>
                
                {/* Customer Info */}
                <div className="kit-ord-customer">
                  <div className="kit-ord-customer-avatar">👤</div>
                  <div className="kit-ord-customer-details">
                    <div className="kit-ord-customer-name">
                      {order.customerName || order.guestInfo?.name || 'Customer'}
                    </div>
                    {order.guestInfo?.phone && (
                      <div className="kit-ord-customer-phone">{order.guestInfo.phone}</div>
                    )}
                  </div>
                </div>

                {/* Order Type & Table */}
                <div className="kit-ord-meta">
                  <div className="kit-ord-type-badge">
                    <span className="kit-ord-type-icon">
                      {order.orderType === 'dine-in' ? '🍽️' : '🥡'}
                    </span>
                    <span className="kit-ord-type-text">
                      {order.orderType === 'dine-in' && order.tableNumber 
                        ? `Table ${order.tableNumber}` 
                        : order.orderType === 'dine-in' ? 'Dine-In' : 'Takeaway'
                      }
                    </span>
                  </div>
                </div>

                {/* Payment Info */}
                <div className="kit-ord-payment">
                  <span className={`kit-ord-payment-method kit-ord-payment-${order.paymentMethod}`}>
                    {order.paymentMethod === 'card' ? '💳 Card' : '💵 Cash'}
                  </span>
                  <span className={`kit-ord-payment-status kit-ord-payment-${order.paymentStatus}`}>
                    {order.paymentStatus === 'paid' ? '✅ Paid' : '⏳ Pending'}
                  </span>
                </div>
              </div>

              {/* Order Items */}
              <div className="kit-ord-items">
                <div className="kit-ord-items-header">
                  <span className="kit-ord-items-title">Order Items</span>
                  <span className="kit-ord-items-count">{order.items.length} items</span>
                </div>
                {order.items.map((item, idx) => (
                  <div key={idx} className="kit-ord-item">
                    <div className="kit-ord-item-details">
                      <span className="kit-ord-item-name">{item.name}</span>
                      {item.customizations && Object.keys(item.customizations).length > 0 && (
                        <span className="kit-ord-item-custom">
                          {Object.entries(item.customizations).map(([key, value]) => 
                            `${key}: ${value}`
                          ).join(', ')}
                        </span>
                      )}
                    </div>
                    <span className="kit-ord-item-qty">×{item.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Special Notes */}
              {order.specialNotes && (
                <div className="kit-ord-notes">
                  <span className="kit-ord-notes-icon">📝</span>
                  <span className="kit-ord-notes-text">{order.specialNotes}</span>
                </div>
              )}

              {/* Total Amount */}
              <div className="kit-ord-total">
                <span className="kit-ord-total-label">Total Amount:</span>
                <span className="kit-ord-total-amount">Rs. {order.total.toFixed(2)}</span>
              </div>

              {/* Action Buttons */}
              <div className="kit-ord-actions">
                {order.status === 'pending' && (
                  <button
                    className="kit-ord-btn kit-ord-btn-confirm"
                    onClick={() => updateOrderStatus(order._id, 'confirmed')}
                  >
                    <span className="kit-ord-btn-icon">✅</span>
                    <span className="kit-ord-btn-text">Confirm Order</span>
                  </button>
                )}
                {order.status === 'confirmed' && (
                  <button
                    className="kit-ord-btn kit-ord-btn-start"
                    onClick={() => updateOrderStatus(order._id, 'preparing')}
                  >
                    <span className="kit-ord-btn-icon">🍳</span>
                    <span className="kit-ord-btn-text">Start Preparing</span>
                  </button>
                )}
                {order.status === 'preparing' && (
                  <button
                    className="kit-ord-btn kit-ord-btn-ready"
                    onClick={() => updateOrderStatus(order._id, 'ready')}
                  >
                    <span className="kit-ord-btn-icon">📦</span>
                    <span className="kit-ord-btn-text">Mark Ready</span>
                  </button>
                )}
                {order.status === 'ready' && (
                  <button
                    className="kit-ord-btn kit-ord-btn-serve"
                    onClick={() => updateOrderStatus(order._id, order.orderType === 'dine-in' ? 'served' : 'delivered')}
                  >
                    <span className="kit-ord-btn-icon">
                      {order.orderType === 'dine-in' ? '🍽️' : '🚚'}
                    </span>
                    <span className="kit-ord-btn-text">
                      {order.orderType === 'dine-in' ? 'Served' : 'Delivered'}
                    </span>
                  </button>
                )}
                {(order.status === 'served' || order.status === 'delivered') && (
                  <button
                    className="kit-ord-btn kit-ord-btn-done"
                    onClick={() => updateOrderStatus(order._id, 'completed')}
                  >
                    <span className="kit-ord-btn-icon">✅</span>
                    <span className="kit-ord-btn-text">Complete Order</span>
                  </button>
                )}
                {order.status === 'completed' && (
                  <div className="kit-ord-completed-badge">
                    <span className="kit-ord-completed-icon">🎉</span>
                    <span className="kit-ord-completed-text">Order Completed</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default KitchenOrders;
