import React, { useState } from 'react';
import '../../styles/Checkout.css';
import { useCart } from '../../context/CartContext';

interface CheckoutFormData {
  orderType: 'dine-in' | 'takeaway';
  tableNumber?: string;
  paymentMethod: 'cash' | 'online';
  specialNotes: string;
}

const Checkout: React.FC = () => {
  const { cartTotal, items, clearCart } = useCart();
  const [formData, setFormData] = useState<CheckoutFormData>({
    orderType: 'dine-in',
    paymentMethod: 'cash',
    specialNotes: ''
  });
  const [orderPlaced, setOrderPlaced] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      alert('Cart is empty!');
      return;
    }
    
    // Simulate order placement
    console.log('Order placed:', { ...formData, items, total: cartTotal });
    setOrderPlaced(true);
    clearCart();
    
    setTimeout(() => {
      setOrderPlaced(false);
    }, 5000);
  };

  if (orderPlaced) {
    return (
      <div className="checkout-success">
        <div className="success-content">
          <h2>✅ Order Placed Successfully!</h2>
          <p>Order Number: #ORD-2025-001234</p>
          <p>Total: LKR {cartTotal.toFixed(2)}</p>
          <p className="success-message">Thank you for ordering! Your order is being prepared.</p>
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
            {/* Order Type Section */}
            <section className="form-section">
              <h2>Order Type</h2>
              <div className="form-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="orderType"
                    value="dine-in"
                    checked={formData.orderType === 'dine-in'}
                    onChange={handleInputChange}
                  />
                  <span>🍽️ Dine-In</span>
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="orderType"
                    value="takeaway"
                    checked={formData.orderType === 'takeaway'}
                    onChange={handleInputChange}
                  />
                  <span>🛍️ Takeaway</span>
                </label>
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
                  min="1"
                />
              </section>
            )}

            {/* Payment Method Section */}
            <section className="form-section">
              <h2>Payment Method</h2>
              <div className="form-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash"
                    checked={formData.paymentMethod === 'cash'}
                    onChange={handleInputChange}
                  />
                  <span>💵 Cash</span>
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="online"
                    checked={formData.paymentMethod === 'online'}
                    onChange={handleInputChange}
                  />
                  <span>💳 Online Payment</span>
                </label>
              </div>
            </section>

            {/* Special Notes Section */}
            <section className="form-section">
              <h2>Special Notes</h2>
              <textarea
                name="specialNotes"
                placeholder="Any special requests or dietary requirements?"
                value={formData.specialNotes}
                onChange={handleInputChange}
                className="form-textarea"
                rows={4}
              />
            </section>

            <button type="submit" className="checkout-btn">
              Place Order - LKR {cartTotal.toFixed(2)}
            </button>
          </form>
        </div>

        {/* Order Summary Sidebar */}
        <aside className="order-summary">
          <h2>Order Summary</h2>
          <div className="summary-items">
            {items.map((item, idx) => (
              <div key={idx} className="summary-item">
                <span className="item-name">{item.name}</span>
                <span className="item-qty">× {item.quantity}</span>
                <span className="item-price">LKR {item.itemTotal.toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="summary-total">
            <span>Total</span>
            <span>LKR {cartTotal.toFixed(2)}</span>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Checkout;
