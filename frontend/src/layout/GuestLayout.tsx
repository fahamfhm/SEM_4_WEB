import { Outlet } from "react-router-dom";
import { CartProvider } from "../context/CartContext";
import NavBar from '../components/Common/NavBar';

const GuestLayout = () => (
  <CartProvider>
    <NavBar role="guest" />
    <main>
      <Outlet />
    </main>
  </CartProvider>
);

export default GuestLayout;
