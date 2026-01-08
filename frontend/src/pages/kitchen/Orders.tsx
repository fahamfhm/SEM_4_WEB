import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OrderService from '../../services/orderService';
import type { Order } from '../../services/orderService';
import '../../styles/KitchenOrders.css';

// Kitchen order status type matching database
type KitchenStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'served';
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
  const fetchOrders = async () => {
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
    } catch (err: any) {
      console.error('Error fetching orders:', err);
      if (err.response?.status === 403) {
        setError('Access denied. Please login with kitchen or admin credentials.');
      } else if (err.response?.status === 401) {
        setError('Session expired. Please login again.');
        setTimeout(() => navigate('/auth/login'), 2000);
      } else {
        setError('Failed to load orders. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

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
  }, []);

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
  const getCounts = () => ({
    all: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    preparing: orders.filter(o => o.status === 'preparing').length,
    ready: orders.filter(o => o.status === 'ready').length,
  });

  const counts = getCounts();

  // Loading state
  if (loading && orders.length === 0) {
    return (
      <div className="kitchen-orders-container">
        <h2>🍳 Kitchen Orders</h2>
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#6b7280' }}>
          <p style={{ fontSize: '24px' }}>Loading orders...</p>
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
        <div style={{
          background: '#fef2f2',
          color: '#dc2626',
          padding: '12px 16px',
          borderRadius: '8px',
          marginBottom: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span>⚠️ {error}</span>
          <button onClick={fetchOrders} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', fontWeight: 600 }}>
            Retry
          </button>
        </div>
      )}

      {/* Filter Buttons */}
      <div className="order-filters" style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {(['all', 'pending', 'confirmed', 'preparing', 'ready', 'served'] as FilterType[]).map(filter => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            style={{
              padding: '10px 20px',
              borderRadius: '25px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              textTransform: 'capitalize',
              background: activeFilter === filter 
                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                : '#f3f4f6',
              color: activeFilter === filter ? 'white' : '#374151',
              transition: 'all 0.2s ease',
            }}
          >
            {filter} ({counts[filter]})
          </button>
        ))}
        {/* Refresh Button */}
        <button
          onClick={fetchOrders}
          style={{
            padding: '10px 20px',
            borderRadius: '25px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 600,
            background: '#e5e7eb',
            color: '#374151',
            marginLeft: 'auto',
          }}
        >
          🔄 Refresh
        </button>
      </div>

      {/* Orders Grid */}
      {filteredOrders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#6b7280' }}>
          <p style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</p>
          <p style={{ fontSize: '18px' }}>No {activeFilter !== 'all' ? activeFilter : ''} orders right now!</p>
        </div>
      ) : (
        <div className="orders-grid">
          {filteredOrders.map(order => (
            <div 
              key={order._id} 
              className="order-card"
              style={{ 
                borderLeftColor: ['pending', 'confirmed'].includes(order.status)
                  ? '#fbbf24' 
                  : order.status === 'preparing' 
                    ? '#f97316' 
                    : order.status === 'ready'
                      ? '#10b981'
                      : '#6366f1'
              }}
            >
              {/* Order Header */}
              <div className="order-header">
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span className="order-id">{order.orderNumber}</span>
                    <span className={`order-status status-${order.status}`}>
                      {order.status}
                    </span>
                  </div>
                  
                  {/* Customer/Guest Name */}
                  <div style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginBottom: '6px'
                  }}>
                    <span style={{ fontSize: '13px', color: '#6b7280' }}>👤</span>
                    <span style={{ 
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#374151'
                    }}>
                      {order.customerName || order.guestInfo?.name || 'Customer'}
                    </span>
                    {order.guestInfo?.phone && (
                      <span style={{ 
                        fontSize: '12px',
                        color: '#9ca3af',
                        marginLeft: '4px'
                      }}>
                        • {order.guestInfo.phone}
                      </span>
                    )}
                  </div>

                  {/* Order Type & Time */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ 
                      fontSize: '13px',
                      color: '#6b7280',
                      background: '#f3f4f6',
                      padding: '3px 10px',
                      borderRadius: '12px',
                      fontWeight: 500
                    }}>
                      {order.orderType === 'dine-in' ? '🍽️' : '🥡'} {order.orderType === 'dine-in' && order.tableNumber ? `Table ${order.tableNumber}` : order.orderType}
                    </span>
                    <span style={{ fontSize: '12px', color: '#9ca3af' }}>
                      ⏰ {getTimeAgo(order.createdAt)}
                    </span>
                  </div>

                  {/* Payment Info */}
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <span style={{ 
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '12px',
                      background: order.paymentMethod === 'card' ? '#dbeafe' : '#fef3c7',
                      color: order.paymentMethod === 'card' ? '#1e40af' : '#92400e',
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontWeight: 600
                    }}>
                      {order.paymentMethod === 'card' ? '💳 Card' : '💵 Cash'}
                    </span>
                    <span style={{ 
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '12px',
                      background: order.paymentStatus === 'paid' ? '#dcfce7' : '#fef9c3',
                      color: order.paymentStatus === 'paid' ? '#166534' : '#854d0e',
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontWeight: 600
                    }}>
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
                        <span style={{ 
                          display: 'block', 
                          fontSize: '12px', 
                          color: '#9ca3af',
                          fontStyle: 'italic'
                        }}>
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
                <div style={{
                  background: '#fef3c7',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  marginBottom: '16px',
                  fontSize: '13px',
                  color: '#92400e',
                }}>
                  ⚠️ {order.specialNotes}
                </div>
              )}

              {/* Total Amount */}
              <div style={{
                background: '#f9fafb',
                padding: '10px 14px',
                borderRadius: '8px',
                marginBottom: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                fontWeight: 600,
              }}>
                <span>Total:</span>
                <span style={{ color: '#f7931e' }}>Rs. {order.total.toFixed(2)}</span>
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
                    className="btn-action btn-complete"
                    style={{ background: '#6366f1' }}
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
