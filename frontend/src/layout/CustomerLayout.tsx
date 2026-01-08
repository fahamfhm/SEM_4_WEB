import { Outlet } from "react-router-dom";
import { CartProvider } from "../context/CartContext";
// import NavBar from '../components/Common/NavBar';
import '../styles/CustomerLayout.css';

const CustomerLayout = () => (
  <div className="customer-layout">
    {/* <NavBar role="customer" /> */}
    <CartProvider>
      <main>
        <Outlet />
      </main>
    </CartProvider>
  </div>
);

export default CustomerLayout;
