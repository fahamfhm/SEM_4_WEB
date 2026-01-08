import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import OrderService from '../../services/orderService';
import type { Order } from '../../services/orderService';
import '../../styles/OrderTracking.css';

type TrackingStage = 'placed' | 'accepted' | 'preparing' | 'ready' | 'served' | 'delivered';

interface OrderStatus {
  stage: TrackingStage;
  timestamp?: string;
  completed: boolean;
}

const OrderTracking: React.FC = () => {
  const location = useLocation();
  const isGuestMode = location.pathname.includes('/guest');
  
  const [order, setOrder] = useState<Order | null>(null);
  const [orderId, setOrderId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Map database status to tracking stage
  const mapStatusToStage = (status: Order['status'], orderType: Order['orderType']): TrackingStage => {
    switch (status) {
      case 'pending':
        return 'placed';
      case 'confirmed':
        return 'accepted';
      case 'preparing':
        return 'preparing';
      case 'ready':
        return 'ready';
      case 'served':
        return orderType === 'dine-in' ? 'served' : 'delivered';
      case 'completed':
        return orderType === 'dine-in' ? 'served' : 'delivered';
      default:
        return 'placed';
    }
  };

  // Get status stages based on order type
  const getStatusStages = (orderType: Order['orderType']): TrackingStage[] => {
    if (orderType === 'dine-in') {
      return ['placed', 'accepted', 'preparing', 'ready', 'served'];
    } else {
      return ['placed', 'accepted', 'preparing', 'ready', 'delivered'];
    }
  };

  // Get payment status position
  const getPaymentStatusStage = (paymentMethod: Order['paymentMethod'], orderType: Order['orderType']): TrackingStage => {
    if (paymentMethod === 'card') {
      return 'placed'; // Show paid status right after placing order for card
    } else {
      return orderType === 'dine-in' ? 'served' : 'delivered'; // Show paid status after delivery/serving for cash
    }
  };

  // Load order from navigation state or database
  useEffect(() => {
    const loadOrder = async () => {
      // Check if orderId was passed from Checkout success
      const stateOrderId = location.state?.orderId;
      
      if (stateOrderId) {
        try {
          setLoading(true);
          const guestSessionId = OrderService.hasGuestSession() ? OrderService.getGuestSessionId() : undefined;
          const fetchedOrder = await OrderService.getOrder(stateOrderId, guestSessionId);
          setOrder(fetchedOrder);
          setOrderId(fetchedOrder.orderNumber);
          setError('');
        } catch (err) {
          console.error('Error fetching order:', err);
          setError('Failed to load order details');
        } finally {
          setLoading(false);
        }
      }
    };

    loadOrder();
  }, [location.state]);

  const fetchOrder = async (orderNumberOrId: string) => {
    try {
      setLoading(true);
      setError('');
      
      // Check if it's a guest user
      const guestSessionId = OrderService.hasGuestSession() ? OrderService.getGuestSessionId() : undefined;
      
      // Try to find order by order number or ID
      const orders = await OrderService.getOrders(guestSessionId);
      const foundOrder = orders.find(
        o => o.orderNumber === orderNumberOrId || o._id === orderNumberOrId
      );
      
      if (foundOrder) {
        setOrder(foundOrder);
      } else {
        // If not found in list, try fetching directly by ID
        try {
          const fetchedOrder = await OrderService.getOrder(orderNumberOrId, guestSessionId);
          setOrder(fetchedOrder);
        } catch {
          setError('Order not found. Please check your order number.');
        }
      }
    } catch (err) {
      console.error('Error fetching order:', err);
      setError('Failed to fetch order. Please try again.');
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

  const statusLabels: Record<TrackingStage, string> = {
    placed: '📝 Order Placed',
    accepted: '✅ Accepted',
    preparing: '🍳 Preparing',
    ready: '📦 Ready',
    served: '🍽️ Served',
    delivered: '🎉 Delivered'
  };

  const getCurrentStage = (): TrackingStage => {
    if (!order) return 'placed';
    return mapStatusToStage(order.status, order.orderType);
  };

  const getEstimatedTime = (): number => {
    if (!order) return 0;
    const currentStage = getCurrentStage();
    switch (currentStage) {
      case 'placed':
      case 'accepted':
        return 25;
      case 'preparing':
        return 15;
      case 'ready':
        return 5;
      case 'delivered':
        return 0;
      default:
        return 20;
    }
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
              <p>Estimated time: {getEstimatedTime()} mins</p>
              <p className="order-type-badge">
                {order.orderType === 'dine-in' ? '🍽️ Dine-In' : '🥡 Takeaway'}
                {order.tableNumber && ` • Table ${order.tableNumber}`}
              </p>
            </div>
            <div className="order-total">
              <span>Total</span>
              <strong>Rs. {order.total.toFixed(2)}</strong>
            </div>
          </div>

          <div className="status-timeline">
            {getStatusStages(order.orderType).map((stage, index, stages) => {
              const currentStageIndex = stages.indexOf(getCurrentStage());
              const isCompleted = currentStageIndex >= index;
              const isActive = getCurrentStage() === stage;
              const paymentStage = getPaymentStatusStage(order.paymentMethod, order.orderType);
              const showPaymentStatus = stage === paymentStage;
              const isPaymentCompleted = order.paymentStatus === 'paid' && (paymentStage === 'placed' ? true : isCompleted);

              // Get timestamp based on stage
              let timestamp: string | undefined;
              if (stage === 'placed') timestamp = order.orderedAt || order.createdAt;
              else if (stage === 'accepted') timestamp = order.confirmedAt;
              else if (stage === 'preparing') timestamp = order.preparedAt;
              else if (stage === 'ready') timestamp = order.confirmedAt; // Use confirmedAt as placeholder
              else if (stage === 'served') timestamp = order.completedAt;
              else if (stage === 'delivered') timestamp = order.completedAt;

              return (
                <div key={stage} className={`timeline-item ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}>
                  <div className="timeline-dot"></div>
                  {index < stages.length - 1 && <div className="timeline-line"></div>}
                  <div className="timeline-label">
                    <p className="status-text">{statusLabels[stage]}</p>
                    {isCompleted && timestamp && (
                      <p className="status-time">{new Date(timestamp).toLocaleTimeString()}</p>
                    )}
                    {showPaymentStatus && (
                      <div className={`payment-indicator ${isPaymentCompleted ? 'paid' : 'pending'}`}>
                        {isPaymentCompleted ? '💳 Paid' : '💰 Payment Pending'}
                      </div>
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
                  <span className="item-quantity">× {item.quantity}</span>
                  <span className="item-price">Rs. {item.itemTotal.toFixed(2)}</span>
                </div>
              ))}
            </div>
            {order.specialNotes && (
              <div className="special-notes">
                <strong>Special Instructions:</strong>
                <p>{order.specialNotes}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTracking;
