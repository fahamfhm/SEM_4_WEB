import { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/KitchenOrders.css';

// ============================================
// API Configuration
// ============================================
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Set to false to disable demo data and use only backend
const USE_DEMO_DATA_AS_FALLBACK = true;

// ============================================
// Types
// ============================================
interface OrderItem {
  name: string;
  quantity: number;
  customizations?: string[];
}

interface KitchenOrder {
  id: string;
  orderNumber: string;
  tableNumber: string;
  status: 'pending' | 'preparing' | 'ready';
  items: OrderItem[];
  createdAt: string;
  specialNotes?: string;
}

// ============================================
// DEMO DATA - Remove this section after backend is ready
// ============================================
const DEMO_ORDERS: KitchenOrder[] = [
  {
    id: '1',
    orderNumber: '#ORD-001',
    tableNumber: 'Table 5',
    status: 'pending',
    items: [
      { name: 'Grilled Chicken Burger', quantity: 2, customizations: ['No onions', 'Extra cheese'] },
      { name: 'French Fries', quantity: 2 },
      { name: 'Coca Cola', quantity: 2 },
    ],
    createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
    specialNotes: 'Customer has nut allergy',
  },
  {
    id: '2',
    orderNumber: '#ORD-002',
    tableNumber: 'Table 3',
    status: 'pending',
    items: [
      { name: 'Margherita Pizza', quantity: 1 },
      { name: 'Caesar Salad', quantity: 1, customizations: ['Dressing on side'] },
    ],
    createdAt: new Date(Date.now() - 8 * 60000).toISOString(),
  },
  {
    id: '3',
    orderNumber: '#ORD-003',
    tableNumber: 'Table 8',
    status: 'preparing',
    items: [
      { name: 'Spaghetti Carbonara', quantity: 1 },
      { name: 'Garlic Bread', quantity: 1 },
      { name: 'Tiramisu', quantity: 1 },
    ],
    createdAt: new Date(Date.now() - 12 * 60000).toISOString(),
  },
  {
    id: '4',
    orderNumber: '#ORD-004',
    tableNumber: 'Table 2',
    status: 'preparing',
    items: [
      { name: 'Fish & Chips', quantity: 2 },
      { name: 'Lemonade', quantity: 2 },
    ],
    createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
  },
  {
    id: '5',
    orderNumber: '#ORD-005',
    tableNumber: 'Table 10',
    status: 'ready',
    items: [
      { name: 'Veggie Wrap', quantity: 1, customizations: ['Gluten-free wrap'] },
      { name: 'Smoothie Bowl', quantity: 1 },
    ],
    createdAt: new Date(Date.now() - 20 * 60000).toISOString(),
  },
];
// ============================================
// END DEMO DATA
// ============================================

type FilterType = 'all' | 'pending' | 'preparing' | 'ready';

const KitchenOrders = () => {
  const [orders, setOrders] = useState<KitchenOrder[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch orders from backend
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_BASE_URL}/orders/kitchen`);
      setOrders(response.data.data || response.data);
    } catch (err) {
      console.error('Error fetching orders:', err);
      // Fallback to demo data if enabled
      if (USE_DEMO_DATA_AS_FALLBACK) {
        console.log('Using demo data as fallback');
        setOrders(DEMO_ORDERS);
        setError(null);
      } else {
        setError('Failed to load orders. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Update order status via API
  const updateOrderStatus = async (orderId: string, newStatus: KitchenOrder['status']) => {
    try {
      await axios.patch(`${API_BASE_URL}/orders/${orderId}/status`, { status: newStatus });
      // Update local state
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      console.error('Error updating order status:', err);
      // If API fails but demo mode is on, still update locally
      if (USE_DEMO_DATA_AS_FALLBACK) {
        setOrders(prevOrders =>
          prevOrders.map(order =>
            order.id === orderId ? { ...order, status: newStatus } : order
          )
        );
      } else {
        alert('Failed to update order status. Please try again.');
      }
    }
  };

  // Complete and remove order
  const completeOrder = async (orderId: string) => {
    try {
      await axios.patch(`${API_BASE_URL}/orders/${orderId}/status`, { status: 'delivered' });
      setOrders(prev => prev.filter(o => o.id !== orderId));
    } catch (err) {
      console.error('Error completing order:', err);
      // If API fails but demo mode is on, still remove locally
      if (USE_DEMO_DATA_AS_FALLBACK) {
        setOrders(prev => prev.filter(o => o.id !== orderId));
      } else {
        alert('Failed to complete order. Please try again.');
      }
    }
  };

  // Load orders on mount and set up polling
  useEffect(() => {
    fetchOrders();

    // Poll for new orders every 30 seconds
    // TODO: Replace with WebSocket for real-time updates
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
        {(['all', 'pending', 'preparing', 'ready'] as FilterType[]).map(filter => (
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
              key={order.id} 
              className="order-card"
              style={{ 
                borderLeftColor: order.status === 'pending' 
                  ? '#fbbf24' 
                  : order.status === 'preparing' 
                    ? '#f97316' 
                    : '#10b981' 
              }}
            >
              {/* Order Header */}
              <div className="order-header">
                <div>
                  <span className="order-id">{order.orderNumber}</span>
                  <span style={{ 
                    display: 'block', 
                    fontSize: '13px', 
                    color: '#6b7280',
                    marginTop: '4px'
                  }}>
                    {order.tableNumber} • {getTimeAgo(order.createdAt)}
                  </span>
                </div>
                <span className={`order-status status-${order.status}`}>
                  {order.status}
                </span>
              </div>

              {/* Order Items */}
              <div className="order-items">
                {order.items.map((item, idx) => (
                  <div key={idx} className="order-item">
                    <span className="order-item-name">
                      {item.name}
                      {item.customizations && item.customizations.length > 0 && (
                        <span style={{ 
                          display: 'block', 
                          fontSize: '12px', 
                          color: '#9ca3af',
                          fontStyle: 'italic'
                        }}>
                          {item.customizations.join(', ')}
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

              {/* Action Buttons */}
              <div className="order-actions">
                {order.status === 'pending' && (
                  <button
                    className="btn-action btn-preparing"
                    onClick={() => updateOrderStatus(order.id, 'preparing')}
                  >
                    🍳 Start Preparing
                  </button>
                )}
                {order.status === 'preparing' && (
                  <button
                    className="btn-action btn-ready"
                    onClick={() => updateOrderStatus(order.id, 'ready')}
                  >
                    ✅ Mark Ready
                  </button>
                )}
                {order.status === 'ready' && (
                  <button
                    className="btn-action btn-complete"
                    onClick={() => completeOrder(order.id)}
                  >
                    🎉 Complete & Remove
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
