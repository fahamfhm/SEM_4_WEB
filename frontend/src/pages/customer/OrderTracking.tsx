import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/OrderTracking.css';

interface OrderStatus {
  stage: 'placed' | 'accepted' | 'preparing' | 'ready' | 'delivered';
  timestamp?: string;
  completed: boolean;
}

interface TrackingOrder {
  id: string;
  orderNumber: string;
  estimatedTime: number;
  currentStatus: OrderStatus['stage'];
  statuses: OrderStatus[];
  items: Array<{ name: string; quantity: number }>;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const OrderTracking: React.FC = () => {
  const [order, setOrder] = useState<TrackingOrder | null>(null);
  const [orderId, setOrderId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchOrder = async (id: string) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/orders/${id}/tracking`);
      setOrder(response.data.data);
      setError('');
    } catch (err) {
      console.error('Error fetching order:', err);
      setError('Order not found');
    } finally {
      setLoading(false);
    }
  };

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderId.trim()) {
      fetchOrder(orderId);
    }
  };

  const statusStages: OrderStatus['stage'][] = ['placed', 'accepted', 'preparing', 'ready', 'delivered'];
  const statusLabels: Record<OrderStatus['stage'], string> = {
    placed: '📝 Order Placed',
    accepted: '✅ Accepted',
    preparing: '🍳 Preparing',
    ready: '📦 Ready for Pickup',
    delivered: '🎉 Delivered'
  };

  return (
    <div className="order-tracking-page">
      <div className="tracking-header">
        <h1>📍 Track Your Order</h1>
        <p className="subtitle">Enter your order number to track status</p>
      </div>

      <div className="tracking-form-container">
        <form onSubmit={handleTrack} className="tracking-form">
          <div className="form-group">
            <input
              type="text"
              placeholder="Enter Order Number (e.g., #ORD-001)"
              value={orderId}
              onChange={e => setOrderId(e.target.value)}
              className="tracking-input"
            />
            <button type="submit" className="tracking-btn">Track Order</button>
          </div>
        </form>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading && <div className="loading">Loading order details...</div>}

      {order && (
        <div className="order-tracking-container">
          <div className="order-header-info">
            <div>
              <h2>{order.orderNumber}</h2>
              <p>Estimated time: {order.estimatedTime} mins</p>
            </div>
          </div>

          <div className="status-timeline">
            {statusStages.map((stage, index) => {
              const isCompleted = statusStages.indexOf(order.currentStatus) >= index;
              const isActive = order.currentStatus === stage;

              return (
                <div key={stage} className={`timeline-item ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}>
                  <div className="timeline-dot"></div>
                  {index < statusStages.length - 1 && <div className="timeline-line"></div>}
                  <div className="timeline-label">
                    <p className="status-text">{statusLabels[stage]}</p>
                    {isCompleted && order.statuses[index]?.timestamp && (
                      <p className="status-time">{new Date(order.statuses[index].timestamp!).toLocaleTimeString()}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="order-items-section">
            <h3>Order Items</h3>
            <div className="items-list">
              {order.items.map((item, idx) => (
                <div key={idx} className="item-row">
                  <span>{item.name}</span>
                  <span>× {item.quantity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTracking;
