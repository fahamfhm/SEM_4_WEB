import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import OrderService from '../../services/orderService';
import type { Order } from '../../services/orderService';
import '../../styles/OrderManagement.css';

type FilterType = 'all' | 'pending' | 'confirmed' | 'preparing' | 'ready' | 'served' | 'delivered' | 'completed' | 'cancelled';

const OrderManagement: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (!token || !userStr) {
      alert('Please login to access order management');
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

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await OrderService.getAllOrders({
        status: undefined,
      });
      setOrders(result.orders);
    } catch (err: any) {
      console.error('Error fetching orders:', err);
      setError(err.response?.data?.error || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      await OrderService.updateOrderStatus(orderId, newStatus);
      await fetchOrders();
      if (selectedOrder?._id === orderId) {
        const updatedOrder = orders.find(o => o._id === orderId);
        if (updatedOrder) {
          setSelectedOrder({ ...updatedOrder, status: newStatus });
        }
      }
    } catch (err: any) {
      console.error('Error updating order status:', err);
      alert(err.response?.data?.error || 'Failed to update order status');
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    const icons: Record<Order['status'], string> = {
      pending: '⏳',
      confirmed: '✅',
      preparing: '🍳',
      ready: '📦',
      served: '🍽️',
      delivered: '🚚',
      completed: '🎉',
      cancelled: '❌'
    };
    return icons[status];
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

  const getCounts = (): Record<FilterType, number> => ({
    all: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    confirmed: orders.filter(o => o.status === 'confirmed').length,
    preparing: orders.filter(o => o.status === 'preparing').length,
    ready: orders.filter(o => o.status === 'ready').length,
    served: orders.filter(o => o.status === 'served').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    completed: orders.filter(o => o.status === 'completed').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
  });

  const counts = getCounts();

  const filteredOrders = orders.filter(order => {
    const matchesFilter = activeFilter === 'all' || order.status === activeFilter;
    const matchesSearch = searchTerm === '' ||
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.guestInfo?.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalRevenue = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, order) => sum + order.total, 0);

  if (loading && orders.length === 0) {
    return (
      <div className="or-man-ad-container">
        <div className="or-man-ad-loading">
          <div className="or-man-ad-spinner"></div>
          <p>Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="or-man-ad-container">
      {/* Header */}
      <div className="or-man-ad-header">
        <div className="or-man-ad-header-content">
          <h1 className="or-man-ad-title">📋 Order Management</h1>
          <p className="or-man-ad-subtitle">Monitor and manage all customer orders</p>
        </div>
        <button onClick={fetchOrders} className="or-man-ad-refresh" title="Refresh Orders">
          <span className="or-man-ad-refresh-icon">🔄</span>
          <span className="or-man-ad-refresh-text">Refresh</span>
        </button>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="or-man-ad-error-banner">
          <span className="or-man-ad-error-icon">⚠️</span>
          <span className="or-man-ad-error-message">{error}</span>
          <button onClick={fetchOrders} className="or-man-ad-error-retry">Retry</button>
        </div>
      )}

      {/* Stats */}
      <div className="or-man-ad-stats">
        <div className="or-man-ad-stat-card or-man-ad-stat-total">
          <div className="or-man-ad-stat-icon">📊</div>
          <div className="or-man-ad-stat-info">
            <div className="or-man-ad-stat-value">{orders.length}</div>
            <div className="or-man-ad-stat-label">Total Orders</div>
          </div>
        </div>
        <div className="or-man-ad-stat-card or-man-ad-stat-revenue">
          <div className="or-man-ad-stat-icon">💰</div>
          <div className="or-man-ad-stat-info">
            <div className="or-man-ad-stat-value">Rs. {totalRevenue.toLocaleString()}</div>
            <div className="or-man-ad-stat-label">Total Revenue</div>
          </div>
        </div>
        <div className="or-man-ad-stat-card or-man-ad-stat-active">
          <div className="or-man-ad-stat-icon">⚡</div>
          <div className="or-man-ad-stat-info">
            <div className="or-man-ad-stat-value">
              {orders.filter(o => !['completed', 'cancelled'].includes(o.status)).length}
            </div>
            <div className="or-man-ad-stat-label">Active Orders</div>
          </div>
        </div>
        <div className="or-man-ad-stat-card or-man-ad-stat-completed">
          <div className="or-man-ad-stat-icon">✅</div>
          <div className="or-man-ad-stat-info">
            <div className="or-man-ad-stat-value">{counts.completed}</div>
            <div className="or-man-ad-stat-label">Completed Today</div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="or-man-ad-controls">
        <div className="or-man-ad-search-wrapper">
          <span className="or-man-ad-search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search by order number or customer name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="or-man-ad-search-input"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="or-man-ad-filters">
        {(['all', 'pending', 'confirmed', 'preparing', 'ready', 'served', 'delivered', 'completed', 'cancelled'] as FilterType[]).map(filter => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`or-man-ad-filter-btn ${activeFilter === filter ? 'or-man-ad-filter-active' : ''}`}
          >
            <span className="or-man-ad-filter-label">{filter.charAt(0).toUpperCase() + filter.slice(1)}</span>
            <span className="or-man-ad-filter-badge">{counts[filter]}</span>
          </button>
        ))}
      </div>

      {/* Orders Table */}
      {filteredOrders.length === 0 ? (
        <div className="or-man-ad-empty">
          <div className="or-man-ad-empty-icon">📦</div>
          <h3 className="or-man-ad-empty-title">No Orders Found</h3>
          <p className="or-man-ad-empty-text">
            {searchTerm ? 'No orders match your search' : `No ${activeFilter !== 'all' ? activeFilter : ''} orders at the moment`}
          </p>
        </div>
      ) : (
        <div className="or-man-ad-table-wrapper">
          <table className="or-man-ad-table">
            <thead className="or-man-ad-thead">
              <tr>
                <th className="or-man-ad-th">Order #</th>
                <th className="or-man-ad-th">Customer</th>
                <th className="or-man-ad-th">Items</th>
                <th className="or-man-ad-th">Type</th>
                <th className="or-man-ad-th">Total</th>
                <th className="or-man-ad-th">Payment</th>
                <th className="or-man-ad-th">Status</th>
                <th className="or-man-ad-th">Time</th>
                <th className="or-man-ad-th">Actions</th>
              </tr>
            </thead>
            <tbody className="or-man-ad-tbody">
              {filteredOrders.map(order => (
                <tr key={order._id} className="or-man-ad-tr" onClick={() => setSelectedOrder(order)}>
                  <td className="or-man-ad-td">
                    <span className="or-man-ad-order-number">{order.orderNumber}</span>
                  </td>
                  <td className="or-man-ad-td">
                    <div className="or-man-ad-customer">
                      <div className="or-man-ad-customer-avatar">
                        {(order.customerName || order.guestInfo?.name || 'G').charAt(0).toUpperCase()}
                      </div>
                      <div className="or-man-ad-customer-info">
                        <div className="or-man-ad-customer-name">
                          {order.customerName || order.guestInfo?.name || 'Guest'}
                        </div>
                        {order.guestInfo?.phone && (
                          <div className="or-man-ad-customer-phone">{order.guestInfo.phone}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="or-man-ad-td">
                    <span className="or-man-ad-items-count">{order.items.length} items</span>
                  </td>
                  <td className="or-man-ad-td">
                    <div className="or-man-ad-type-badge">
                      <span className="or-man-ad-type-icon">
                        {order.orderType === 'dine-in' ? '🍽️' : '🥡'}
                      </span>
                      <span className="or-man-ad-type-text">
                        {order.orderType === 'dine-in' && order.tableNumber 
                          ? `Table ${order.tableNumber}` 
                          : order.orderType === 'dine-in' ? 'Dine-In' : 'Takeaway'
                        }
                      </span>
                    </div>
                  </td>
                  <td className="or-man-ad-td">
                    <span className="or-man-ad-total">Rs. {order.total.toFixed(2)}</span>
                  </td>
                  <td className="or-man-ad-td">
                    <div className="or-man-ad-payment">
                      <span className={`or-man-ad-payment-method or-man-ad-payment-${order.paymentMethod}`}>
                        {order.paymentMethod === 'card' ? '💳' : '💵'}
                      </span>
                      <span className={`or-man-ad-payment-status or-man-ad-payment-${order.paymentStatus}`}>
                        {order.paymentStatus}
                      </span>
                    </div>
                  </td>
                  <td className="or-man-ad-td">
                    <span className={`or-man-ad-status or-man-ad-status-${order.status}`}>
                      {getStatusIcon(order.status)} {order.status}
                    </span>
                  </td>
                  <td className="or-man-ad-td">
                    <span className="or-man-ad-time">{getTimeAgo(order.createdAt)}</span>
                  </td>
                  <td className="or-man-ad-td">
                    <button
                      className="or-man-ad-action-btn or-man-ad-view-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedOrder(order);
                      }}
                      title="View Details"
                    >
                      👁️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="or-man-ad-modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="or-man-ad-modal" onClick={(e) => e.stopPropagation()}>
            <div className="or-man-ad-modal-header">
              <h2 className="or-man-ad-modal-title">Order Details</h2>
              <button
                className="or-man-ad-modal-close"
                onClick={() => setSelectedOrder(null)}
              >
                ✕
              </button>
            </div>

            <div className="or-man-ad-modal-content">
              {/* Order Info */}
              <div className="or-man-ad-detail-section">
                <h3 className="or-man-ad-detail-heading">Order Information</h3>
                <div className="or-man-ad-detail-grid">
                  <div className="or-man-ad-detail-item">
                    <span className="or-man-ad-detail-label">Order Number:</span>
                    <span className="or-man-ad-detail-value">{selectedOrder.orderNumber}</span>
                  </div>
                  <div className="or-man-ad-detail-item">
                    <span className="or-man-ad-detail-label">Customer:</span>
                    <span className="or-man-ad-detail-value">
                      {selectedOrder.customerName || selectedOrder.guestInfo?.name || 'Guest'}
                    </span>
                  </div>
                  <div className="or-man-ad-detail-item">
                    <span className="or-man-ad-detail-label">Phone:</span>
                    <span className="or-man-ad-detail-value">
                      {selectedOrder.guestInfo?.phone || 'N/A'}
                    </span>
                  </div>
                  <div className="or-man-ad-detail-item">
                    <span className="or-man-ad-detail-label">Order Type:</span>
                    <span className="or-man-ad-detail-value">
                      {selectedOrder.orderType === 'dine-in' && selectedOrder.tableNumber 
                        ? `Dine-In (Table ${selectedOrder.tableNumber})` 
                        : selectedOrder.orderType === 'dine-in' ? 'Dine-In' : 'Takeaway'
                      }
                    </span>
                  </div>
                  <div className="or-man-ad-detail-item">
                    <span className="or-man-ad-detail-label">Status:</span>
                    <span className={`or-man-ad-status or-man-ad-status-${selectedOrder.status}`}>
                      {getStatusIcon(selectedOrder.status)} {selectedOrder.status}
                    </span>
                  </div>
                  <div className="or-man-ad-detail-item">
                    <span className="or-man-ad-detail-label">Payment:</span>
                    <span className="or-man-ad-detail-value">
                      {selectedOrder.paymentMethod} - {selectedOrder.paymentStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="or-man-ad-detail-section">
                <h3 className="or-man-ad-detail-heading">Order Items</h3>
                <div className="or-man-ad-items-list">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="or-man-ad-item-row">
                      <div className="or-man-ad-item-details">
                        <span className="or-man-ad-item-name">{item.name}</span>
                        {item.customizations && Object.keys(item.customizations).length > 0 && (
                          <span className="or-man-ad-item-custom">
                            {Object.entries(item.customizations).map(([key, value]) => 
                              `${key}: ${value}`
                            ).join(', ')}
                          </span>
                        )}
                      </div>
                      <span className="or-man-ad-item-qty">×{item.quantity}</span>
                      <span className="or-man-ad-item-price">Rs. {item.itemTotal.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Special Notes */}
              {selectedOrder.specialNotes && (
                <div className="or-man-ad-detail-section">
                  <h3 className="or-man-ad-detail-heading">Special Notes</h3>
                  <p className="or-man-ad-notes">{selectedOrder.specialNotes}</p>
                </div>
              )}

              {/* Order Summary */}
              <div className="or-man-ad-detail-section">
                <h3 className="or-man-ad-detail-heading">Order Summary</h3>
                <div className="or-man-ad-summary">
                  <div className="or-man-ad-summary-row">
                    <span className="or-man-ad-summary-label">Subtotal:</span>
                    <span className="or-man-ad-summary-value">Rs. {selectedOrder.subtotal.toFixed(2)}</span>
                  </div>
                  {selectedOrder.deliveryFee > 0 && (
                    <div className="or-man-ad-summary-row">
                      <span className="or-man-ad-summary-label">Delivery Fee:</span>
                      <span className="or-man-ad-summary-value">Rs. {selectedOrder.deliveryFee.toFixed(2)}</span>
                    </div>
                  )}
                  {selectedOrder.tax > 0 && (
                    <div className="or-man-ad-summary-row">
                      <span className="or-man-ad-summary-label">Tax:</span>
                      <span className="or-man-ad-summary-value">Rs. {selectedOrder.tax.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="or-man-ad-summary-row or-man-ad-summary-total">
                    <span className="or-man-ad-summary-label">Total:</span>
                    <span className="or-man-ad-summary-value">Rs. {selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Status Update Actions */}
              <div className="or-man-ad-detail-section">
                <h3 className="or-man-ad-detail-heading">Update Status</h3>
                <div className="or-man-ad-status-actions">
                  {selectedOrder.status === 'pending' && (
                    <>
                      <button
                        className="or-man-ad-status-btn or-man-ad-btn-confirm"
                        onClick={() => updateOrderStatus(selectedOrder._id, 'confirmed')}
                      >
                        ✅ Confirm
                      </button>
                      <button
                        className="or-man-ad-status-btn or-man-ad-btn-cancel"
                        onClick={() => updateOrderStatus(selectedOrder._id, 'cancelled')}
                      >
                        ❌ Cancel
                      </button>
                    </>
                  )}
                  {selectedOrder.status === 'confirmed' && (
                    <button
                      className="or-man-ad-status-btn or-man-ad-btn-preparing"
                      onClick={() => updateOrderStatus(selectedOrder._id, 'preparing')}
                    >
                      🍳 Start Preparing
                    </button>
                  )}
                  {selectedOrder.status === 'preparing' && (
                    <button
                      className="or-man-ad-status-btn or-man-ad-btn-ready"
                      onClick={() => updateOrderStatus(selectedOrder._id, 'ready')}
                    >
                      📦 Mark Ready
                    </button>
                  )}
                  {selectedOrder.status === 'ready' && (
                    <button
                      className="or-man-ad-status-btn or-man-ad-btn-serve"
                      onClick={() => updateOrderStatus(selectedOrder._id, selectedOrder.orderType === 'dine-in' ? 'served' : 'delivered')}
                    >
                      {selectedOrder.orderType === 'dine-in' ? '🍽️ Served' : '🚚 Delivered'}
                    </button>
                  )}
                  {(selectedOrder.status === 'served' || selectedOrder.status === 'delivered') && (
                    <button
                      className="or-man-ad-status-btn or-man-ad-btn-complete"
                      onClick={() => updateOrderStatus(selectedOrder._id, 'completed')}
                    >
                      🎉 Complete
                    </button>
                  )}
                  {selectedOrder.status === 'completed' && (
                    <div className="or-man-ad-completed-badge">✅ Order Completed</div>
                  )}
                  {selectedOrder.status === 'cancelled' && (
                    <div className="or-man-ad-cancelled-badge">❌ Order Cancelled</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
