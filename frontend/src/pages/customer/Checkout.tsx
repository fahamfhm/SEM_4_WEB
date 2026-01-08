import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../styles/Checkout.css';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import OrderService from '../../services/orderService';

interface CheckoutFormData {
  orderType: 'dine-in' | 'takeaway';
  tableNumber?: string;
  paymentMethod: 'card' | 'cash';
  specialNotes: string;
  // Guest info
  customerName?: string;
  customerPhone?: string;
}

interface CardDetails {
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
}

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartTotal, items, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const isGuestMode = location.pathname.includes('/guest');
  
  const [formData, setFormData] = useState<CheckoutFormData>({
    orderType: 'dine-in',
    paymentMethod: 'cash',
    specialNotes: '',
    customerName: '',
    customerPhone: ''
  });
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placedOrderNumber, setPlacedOrderNumber] = useState('');
  const [showCardModal, setShowCardModal] = useState(false);
  const [cardDetails, setCardDetails] = useState<CardDetails>({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCardInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Format card number with spaces every 4 digits
    if (name === 'cardNumber') {
      formattedValue = value
        .replace(/\s/g, '')
        .replace(/(\d{4})/g, '$1 ')
        .trim()
        .substring(0, 19); // 16 digits + 3 spaces
    }
    
    // Format expiry date as MM/YY
    if (name === 'expiryDate') {
      formattedValue = value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '$1/$2')
        .substring(0, 5);
    }

    // Limit CVV to 3 digits
    if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '').substring(0, 3);
    }

    // Uppercase card name
    if (name === 'cardName') {
      formattedValue = value.toUpperCase();
    }

    setCardDetails(prev => ({
      ...prev,
      [name]: formattedValue
    }));
  };

  const handlePaymentMethodChange = (method: 'card' | 'cash') => {
    setFormData(prev => ({
      ...prev,
      paymentMethod: method
    }));
  };

  const handleCardPayment = async () => {
    if (!cardDetails.cardNumber || !cardDetails.cardName || !cardDetails.expiryDate || !cardDetails.cvv) {
      alert('Please fill in all card details');
      return;
    }
    setShowCardModal(false);
    
    // Process order
    await processOrder();
  };

  const processOrder = async () => {
    if (items.length === 0) {
      alert('Cart is empty!');
      return;
    }

    // Validate guest info if in guest mode
    if (isGuestMode) {
      if (!formData.customerName || !formData.customerPhone) {
        alert('Please enter your name and phone number');
        return;
      }
    }

    try {
      
      // Prepare order data
      const orderData = {
        items: items.map(item => ({
          menuItemId: item.id,
          name: item.name,
          basePrice: item.basePrice,
          quantity: item.quantity,
          customizations: item.customizations || {},
          itemTotal: item.itemTotal || (item.basePrice * item.quantity)
        })),
        orderType: formData.orderType,
        tableNumber: formData.tableNumber,
        paymentMethod: formData.paymentMethod,
        specialNotes: formData.specialNotes,
      };

      // Add guest info if guest mode
      if (isGuestMode || !isAuthenticated) {
        const guestSessionId = OrderService.getGuestSessionId();
        Object.assign(orderData, {
          guestSessionId,
          guestInfo: {
            name: formData.customerName || 'Guest',
            phone: formData.customerPhone || ''
          }
        });
      }

      // Create order in database
      const order = await OrderService.createOrder(orderData);
      
      console.log('Order created:', order);
      setPlacedOrderNumber(order.orderNumber);
      setOrderPlaced(true);
      clearCart();
      
      setTimeout(() => {
        navigate(isGuestMode ? '/guest/order-tracking' : '/customer/order-tracking', {
          state: { orderId: order._id }
        });
      }, 3000);
    } catch (err: unknown) {
      console.error('Order creation failed:', err);
      const error = err as { response?: { data?: { error?: string } }; message?: string };
      alert('Failed to place order: ' + (error.response?.data?.error || error.message || 'Unknown error'));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      alert('Cart is empty!');
      return;
    }

    // Validate guest info if in guest mode
    if (isGuestMode) {
      if (!formData.customerName || !formData.customerPhone) {
        alert('Please enter your name and phone number');
        return;
      }
    }

    // If card payment selected, show card modal
    if (formData.paymentMethod === 'card' && !showCardModal) {
      setShowCardModal(true);
      return;
    }
    
    // Process order
    await processOrder();
  };

  if (orderPlaced) {
    return (
      <div className="checkout-success">
        <div className="success-animation">
          <div className="success-checkmark">
            <div className="checkmark-circle">
              <svg className="checkmark-svg" viewBox="0 0 52 52">
                <circle className="checkmark-circle-path" cx="26" cy="26" r="25" fill="none"/>
                <path className="checkmark-check" fill="none" d="M14 27l7.5 7.5L38 18"/>
              </svg>
            </div>
          </div>
          
          <div className="success-content">
            <h1 className="success-title">Order Placed Successfully!</h1>
            <p className="success-subtitle">Thank you for your order</p>
            
            <div className="order-details-box">
              <div className="order-detail-row">
                <span className="detail-label">Order Number</span>
                <span className="detail-value">#{placedOrderNumber}</span>
              </div>
              <div className="order-detail-row">
                <span className="detail-label">Total Amount</span>
                <span className="detail-value">LKR {(cartTotal + 200).toFixed(2)}</span>
              </div>
              <div className="order-detail-row">
                <span className="detail-label">Payment Method</span>
                <span className="detail-value">{formData.paymentMethod === 'card' ? '💳 Card' : '💵 Cash'}</span>
              </div>
            </div>
            
            <div className="success-message">
              <p className="message-text">🍳 Your order is being prepared</p>
              <p className="redirect-text">Redirecting to order tracking...</p>
            </div>
            
            <div className="loading-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-main">
          <h1>🛒 Checkout</h1>

          <form onSubmit={handleSubmit} className="checkout-form">
            {/* Guest Information (if guest mode) */}
            {isGuestMode && (
              <section className="form-section">
                <h2>👤 Your Information</h2>
                <div className="form-group">
                  <input
                    type="text"
                    name="customerName"
                    placeholder="Enter your name *"
                    value={formData.customerName || ''}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="tel"
                    name="customerPhone"
                    placeholder="Enter your phone number *"
                    value={formData.customerPhone || ''}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>
                <p className="guest-note">📱 We'll use this to notify you when your order is ready</p>
              </section>
            )}

            {/* Order Type Section */}
            <section className="form-section">
              <h2>Order Type</h2>
              <div className="order-type-tags">
                <div 
                  className={`order-tag ${formData.orderType === 'dine-in' ? 'active' : ''}`}
                  onClick={() => setFormData(prev => ({ ...prev, orderType: 'dine-in' }))}
                >
                  <span className="tag-icon">🍽️</span>
                  <span className="tag-text">Dine-In</span>
                </div>
                <div 
                  className={`order-tag ${formData.orderType === 'takeaway' ? 'active' : ''}`}
                  onClick={() => setFormData(prev => ({ ...prev, orderType: 'takeaway' }))}
                >
                  <span className="tag-icon">🛍️</span>
                  <span className="tag-text">Takeaway</span>
                </div>
              </div>
            </section>

            {/* Table Number (if Dine-In) */}
            {formData.orderType === 'dine-in' && (
              <section className="form-section">
                <h2>Table Number</h2>
                <input
                  type="number"
                  name="tableNumber"
                  placeholder="Enter table number"
                  value={formData.tableNumber || ''}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </section>
            )}

            {/* Payment Method Section */}
            <section className="form-section">
              <h2>Payment Method</h2>
              <div className="payment-methods">
                <div 
                  className={`payment-option ${formData.paymentMethod === 'card' ? 'active' : ''}`}
                  onClick={() => handlePaymentMethodChange('card')}
                >
                  <div className="payment-icon">💳</div>
                  <h3>Card Payment</h3>
                  <p>Pay with Credit/Debit Card</p>
                </div>
                <div 
                  className={`payment-option ${formData.paymentMethod === 'cash' ? 'active' : ''}`}
                  onClick={() => handlePaymentMethodChange('cash')}
                >
                  <div className="payment-icon">💵</div>
                  <h3>Cash on Table</h3>
                  <p>Pay when order arrives</p>
                </div>
              </div>
            </section>

            {/* Special Notes */}
            <section className="form-section">
              <h2>Special Notes (Optional)</h2>
              <textarea
                name="specialNotes"
                placeholder="Any special requests or dietary requirements?"
                value={formData.specialNotes}
                onChange={handleInputChange}
                className="form-textarea"
                rows={4}
              />
            </section>

            {/* Order Summary */}
            <div className="checkout-summary-inline">
              <div className="summary-row">
                <span>Items ({items.length})</span>
                <span>LKR {cartTotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Delivery Fee</span>
                <span>LKR 200.00</span>
              </div>
              <div className="summary-divider"></div>
              <div className="summary-total">
                <span>Total</span>
                <span>LKR {(cartTotal + 200).toFixed(2)}</span>
              </div>
            </div>

            <button type="submit" className="place-order-btn">
              {formData.paymentMethod === 'card' ? '💳 Proceed to Payment' : '✅ Place Order'}
            </button>
          </form>
        </div>
      </div>

      {/* Card Payment Modal */}
      {showCardModal && (
        <div className="card-modal-overlay" onClick={() => setShowCardModal(false)}>
          <div className="card-modal" onClick={(e) => e.stopPropagation()}>
            <div className="card-modal-header">
              <h2>💳 Card Payment</h2>
              <button className="close-btn" onClick={() => setShowCardModal(false)}>✕</button>
            </div>

            <div className="card-modal-content">
              {/* Interactive Card Visual */}
              <div className="credit-card">
                <div className="card-background">
                  <div className="card-chip"></div>
                  <div className="card-number">
                    {cardDetails.cardNumber || '#### #### #### ####'}
                  </div>
                  <div className="card-details">
                    <div className="card-holder">
                      <div className="card-label">Card Holder</div>
                      <div className="card-name">
                        {cardDetails.cardName || 'YOUR NAME'}
                      </div>
                    </div>
                    <div className="card-expiry">
                      <div className="card-label">Expires</div>
                      <div className="card-date">
                        {cardDetails.expiryDate || 'MM/YY'}
                      </div>
                    </div>
                  </div>
                  <div className="card-logo">VISA</div>
                </div>
              </div>

              {/* Card Input Form */}
              <div className="card-form">
                <div className="form-group">
                  <label>Card Number</label>
                  <input
                    type="text"
                    name="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={cardDetails.cardNumber}
                    onChange={handleCardInputChange}
                    className="card-input"
                    maxLength={19}
                  />
                </div>

                <div className="form-group">
                  <label>Card Holder Name</label>
                  <input
                    type="text"
                    name="cardName"
                    placeholder="JOHN DOE"
                    value={cardDetails.cardName}
                    onChange={handleCardInputChange}
                    className="card-input"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Expiry Date</label>
                    <input
                      type="text"
                      name="expiryDate"
                      placeholder="MM/YY"
                      value={cardDetails.expiryDate}
                      onChange={handleCardInputChange}
                      className="card-input"
                      maxLength={5}
                    />
                  </div>

                  <div className="form-group">
                    <label>CVV</label>
                    <input
                      type="text"
                      name="cvv"
                      placeholder="123"
                      value={cardDetails.cvv}
                      onChange={handleCardInputChange}
                      className="card-input"
                      maxLength={3}
                    />
                  </div>
                </div>

                <div className="payment-summary">
                  <div className="payment-amount">
                    <span>Amount to Pay</span>
                    <span className="amount">LKR {(cartTotal + 200).toFixed(2)}</span>
                  </div>
                </div>

                <button 
                  type="button" 
                  className="pay-now-btn"
                  onClick={handleCardPayment}
                >
                  💳 Pay Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
