import { useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import styles from '../../styles/Cart.module.css'

const Cart = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const isGuestMode = location.pathname.includes('/guest')

  const { items, removeFromCart, updateQuantity, clearCart, cartTotal, cartItemCount } = useCart()

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity > 0) {
      updateQuantity(itemId, newQuantity)
    }
  }

  const handleRemove = (itemId: string) => {
    if (confirm('Remove this item from cart?')) {
      removeFromCart(itemId)
    }
  }

  const handleCheckout = () => {
    if (items.length > 0) {
      navigate(isGuestMode ? '/guest/checkout' : '/customer/checkout')
    }
  }

  const handleContinueShopping = () => {
    navigate(isGuestMode ? '/guest/menu' : '/customer/menu')
    
  }

  if (items.length === 0) {
    return (
      <div className={styles['cart-page']}>
        <div className={styles['cart-container']}>
          <div className={styles['cart-header']}>
            <h2>🛒 Your Cart</h2>
            <p>Your shopping cart is empty</p>
          </div>
          <div className={styles['empty-cart']}>
            <div className={styles['empty-icon']}>🍽️</div>
            <p>No items in your cart yet</p>
            <button className={styles['continue-shopping-btn']} onClick={handleContinueShopping}>
              Browse Menu
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles['cart-page']}>
      <div className={styles['cart-container']}>
        <div className={styles['cart-header']}>
          <h2>🛒 Your Cart</h2>
          <p>{cartItemCount} {cartItemCount === 1 ? 'item' : 'items'} in your cart</p>
        </div>

        <div className={styles['cart-content']}>
          <div className={styles['cart-items']}>
            {items.map((item) => (
              <div key={item.id} className={styles['cart-item']}>
                <div className={styles['cart-item-details']}>
                  <h3 className={styles['cart-item-name']}>{item.name}</h3>
                  <p className={styles['cart-item-base-price']}>Base Price: LKR {item.basePrice.toFixed(2)}</p>
                  
                  {item.customizations.length > 0 && (
                    <div className={styles['cart-item-customizations']}>
                      <p className={styles['customization-title']}>Customizations:</p>
                      {item.customizations.map((group, groupIndex) => (
                        <div key={groupIndex} className={styles['customization-group']}>
                          <span className={styles['group-name']}>{group.groupName}:</span>
                          <ul className={styles['customization-list']}>
                            {group.selectedOptions.map((option) => (
                              <li key={option.id}>
                                {option.name}
                                {option.price > 0 && (
                                  <span className={styles['option-price']}>
                                    {' '}+LKR {option.price.toFixed(2)}
                                  </span>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}

                  {item.removals && item.removals.length > 0 && (
                    <div className={styles['cart-item-removals']}>
                      <p className={styles['removal-title']}>🚫 Removed:</p>
                      <p className={styles['removal-list']}>{item.removals.join(', ')}</p>
                    </div>
                  )}

                  {item.specialNote && (
                    <div className={styles['cart-item-note']}>
                      <p className={styles['note-title']}>📝 Special Instructions:</p>
                      <p className={styles['note-text']}>{item.specialNote}</p>
                    </div>
                  )}
                </div>

                <div className={styles['cart-item-actions']}>
                  <div className={styles['quantity-control']}>
                    <button
                      className={styles['qty-btn']}
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      −
                    </button>
                    <span className={styles['quantity-display']}>{item.quantity}</span>
                    <button
                      className={styles['qty-btn']}
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>

                  <div className={styles['cart-item-price']}>
                    <span className={styles['price-label']}>Total:</span>
                    <span className={styles['price-value']}>LKR {item.itemTotal.toFixed(2)}</span>
                  </div>

                  <button
                    className={styles['remove-btn']}
                    onClick={() => handleRemove(item.id)}
                    title="Remove item"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className={styles['cart-summary']}>
            <h3 className={styles['summary-title']}>Order Summary</h3>
            
            <div className={styles['summary-details']}>
              <div className={styles['summary-row']}>
                <span>Items ({cartItemCount})</span>
                <span>LKR {cartTotal.toFixed(2)}</span>
              </div>
              <div className={styles['summary-row']}>
                <span>Delivery Fee</span>
                <span>LKR 0.00</span>
              </div>
              <div className={styles['summary-divider']}></div>
              <div className={styles['summary-total']}>
                <span>Total</span>
                <span>LKR {cartTotal.toFixed(2)}</span>
              </div>
            </div>

            <button className={styles['checkout-btn']} onClick={handleCheckout}>
              Proceed to Checkout
            </button>
            
            <button className={styles['continue-shopping-btn']} onClick={handleContinueShopping}>
              Continue Shopping
            </button>

            <button className={styles['clear-cart-btn']} onClick={() => {
              if (confirm('Clear all items from cart?')) {
                clearCart()
              }
            }}>
              Clear Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart

