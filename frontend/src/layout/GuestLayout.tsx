import { Outlet } from "react-router-dom";
import { CartProvider } from "../context/CartContext";
import '../styles/GuestLayout.css';

const GuestLayout = () => (
  <div className="guest-layout">
    <CartProvider>
      
      <main>
        <Outlet />
      </main>
    </CartProvider>
  </div>
);

export default GuestLayout;
