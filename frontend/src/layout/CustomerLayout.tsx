import { Outlet } from "react-router-dom";
import { CartProvider } from "../context/CartContext";
import NavBar from '../components/Common/NavBar';

const CustomerLayout = () => (
  <>
    <NavBar role="customer" />
    <CartProvider>
      <main>
        <Outlet />
      </main>
    </CartProvider>
  </>
);

export default CustomerLayout;
