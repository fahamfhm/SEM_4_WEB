import { Outlet } from "react-router-dom";
import { CartProvider } from "../context/CartContext";
import NavBar from '../components/Common/NavBar';
import '../styles/GuestLayout.css';

const GuestLayout = () => (
  <div className="guest-layout">
    <CartProvider>
      <NavBar role="guest" />
      <main>
        <Outlet />
      </main>
    </CartProvider>
  </div>
);

export default GuestLayout;
