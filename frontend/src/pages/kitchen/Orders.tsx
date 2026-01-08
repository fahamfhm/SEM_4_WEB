import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OrderService from '../../services/orderService';
import type { Order } from '../../services/orderService';
import '../../styles/KitchenOrders.css';

// Kitchen order status type matching database
type FilterType = 'all' | 'pending' | 'confirmed' | 'preparing' | 'ready' | 'served';

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
      // Filter to show only active orders (not completed or cancelled)
      const activeOrders = result.orders.filter(
        o => !['completed', 'cancelled'].includes(o.status)
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
    ? orders 
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
    all: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    confirmed: orders.filter(o => o.status === 'confirmed').length,
    preparing: orders.filter(o => o.status === 'preparing').length,
    ready: orders.filter(o => o.status === 'ready').length,
    served: orders.filter(o => o.status === 'served').length,
  });

  const counts = getCounts();

  // Loading state
  if (loading && orders.length === 0) {
    return (
      <div className="kitchen-orders-container">
        <h2>🍳 Kitchen Orders</h2>
        <div className="loading-state">
          <p>Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="kitchen-orders-container">
      <h2>🍳 Kitchen Orders</h2>
      <p>Manage incoming orders and update their status in real-time.</p>

      {/* Error Banner */}
      {error && (
        <div className="error-banner">
          <span>⚠️ {error}</span>
          <button onClick={fetchOrders} className="error-retry-btn">
            Retry
          </button>
        </div>
      )}

      {/* Filter Buttons */}
      <div className="order-filters">
        {(['all', 'pending', 'confirmed', 'preparing', 'ready', 'served'] as FilterType[]).map(filter => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`filter-btn ${activeFilter === filter ? 'filter-btn-active' : ''}`}
          >
            {filter} ({counts[filter]})
          </button>
        ))}
        {/* Refresh Button */}
        <button onClick={fetchOrders} className="refresh-btn">
          🔄 Refresh
        </button>
      </div>

      {/* Orders Grid */}
      {filteredOrders.length === 0 ? (
        <div className="empty-state">
          <p className="empty-icon">🎉</p>
          <p className="empty-text">No {activeFilter !== 'all' ? activeFilter : ''} orders right now!</p>
        </div>
      ) : (
        <div className="orders-grid">
          {filteredOrders.map(order => (
            <div 
              key={order._id} 
              className={`order-card order-card-${order.status}`}
            >
              {/* Order Header */}
              <div className="order-header">
                <div className="order-header-content">
                  <div className="order-id-status">
                    <span className="order-id">{order.orderNumber}</span>
                    <span className={`order-status status-${order.status}`}>
                      {order.status}
                    </span>
                  </div>
                  
                  {/* Customer/Guest Name */}
                  <div className="customer-info">
                    <span className="customer-icon">👤</span>
                    <span className="customer-name">
                      {order.customerName || order.guestInfo?.name || 'Customer'}
                    </span>
                    {order.guestInfo?.phone && (
                      <span className="customer-phone">
                        • {order.guestInfo.phone}
                      </span>
                    )}
                  </div>

                  {/* Order Type & Time */}
                  <div className="order-meta">
                    <span className="order-type-badge">
                      {order.orderType === 'dine-in' ? '🍽️' : '🥡'} {order.orderType === 'dine-in' && order.tableNumber ? `Table ${order.tableNumber}` : order.orderType}
                    </span>
                    <span className="order-time">
                      ⏰ {getTimeAgo(order.createdAt)}
                    </span>
                  </div>

                  {/* Payment Info */}
                  <div className="payment-info">
                    <span className={`payment-method-badge payment-${order.paymentMethod}`}>
                      {order.paymentMethod === 'card' ? '💳 Card' : '💵 Cash'}
                    </span>
                    <span className={`payment-status-badge payment-status-${order.paymentStatus}`}>
                      {order.paymentStatus === 'paid' ? '✅ Paid' : '⏳ Pending'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="order-items">
                {order.items.map((item, idx) => (
                  <div key={idx} className="order-item">
                    <span className="order-item-name">
                      {item.name}
                      {item.customizations && Object.keys(item.customizations).length > 0 && (
                        <span className="order-item-customization">
                          {JSON.stringify(item.customizations)}
                        </span>
                      )}
                    </span>
                    <span className="order-item-qty">×{item.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Special Notes */}
              {order.specialNotes && (
                <div className="special-notes">
                  ⚠️ {order.specialNotes}
                </div>
              )}

              {/* Total Amount */}
              <div className="order-total">
                <span>Total:</span>
                <span className="order-total-amount">Rs. {order.total.toFixed(2)}</span>
              </div>

              {/* Action Buttons */}
              <div className="order-actions">
                {order.status === 'pending' && (
                  <button
                    className="btn-action btn-preparing"
                    onClick={() => updateOrderStatus(order._id, 'confirmed')}
                  >
                    ✅ Confirm Order
                  </button>
                )}
                {order.status === 'confirmed' && (
                  <button
                    className="btn-action btn-preparing"
                    onClick={() => updateOrderStatus(order._id, 'preparing')}
                  >
                    🍳 Start Preparing
                  </button>
                )}
                {order.status === 'preparing' && (
                  <button
                    className="btn-action btn-ready"
                    onClick={() => updateOrderStatus(order._id, 'ready')}
                  >
                    📦 Mark Ready
                  </button>
                )}
                {order.status === 'ready' && (
                  <button
                    className="btn-action btn-complete"
                    onClick={() => completeOrder(order._id)}
                  >
                    {order.orderType === 'dine-in' ? '🍽️ Served' : '🎉 Delivered'}
                  </button>
                )}
                {order.status === 'served' && (
                  <button
                    className="btn-action btn-complete btn-complete-final"
                    onClick={() => updateOrderStatus(order._id, 'completed')}
                  >
                    ✅ Complete Order
                  </button>
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
