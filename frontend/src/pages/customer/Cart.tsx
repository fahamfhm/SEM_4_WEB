import React from "react";
import styles from "../../styles/Cart.module.css";

// Example static cart data
const cart = {
  items: [
    { id: 1, name: "Margherita Pizza", qty: 2, price: 9.99 },
    { id: 2, name: "Caesar Salad", qty: 1, price: 6.5 },
    { id: 3, name: "Lemonade", qty: 3, price: 2.5 },
  ],
};

const total = cart.items.reduce((sum, item) => sum + item.qty * item.price, 0);


const Cart: React.FC = () => {
  return (
    <div className={styles["cart-page-center"]}>
      <div className={styles["cart-container"]}>
        <div className={styles["cart-header"]}>
          <h2>Cart</h2>
          <p>Review your order before checkout</p>
        </div>
        <div className={styles["cart-details"]}>
          {cart.items.map((item) => (
            <div key={item.id} className={styles["cart-item"]}>
              <span className={styles["cart-item-label"]}>{item.name}<span className={styles["cart-item-qty"]}>&times;{item.qty}</span></span>
              <span className={styles["cart-item-value"]}>${(item.price * item.qty).toFixed(2)}</span>
            </div>
          ))}
          <div className={styles["cart-total"]}>
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
