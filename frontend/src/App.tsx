import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";

import PublicLayout from "./layout/GuestLayout";
import CustomerLayout from "./layout/CustomerLayout";
import AdminLayout from "./layout/AdminLayout";
import KitchenLayout from "./layout/KitchenLayout";
import { TableProvider } from "./context/TableContext";

//Auth Pages
import AuthPage from "./pages/auth/AuthPage";

// Customer Pages
import CustomerMenu from "./pages/customer/Menu";
import CustomerProfile from "./pages/customer/Profile";
import CustomerCart from "./pages/customer/Cart";
import Home from "./pages/Home";
import OrderHistory from "./pages/customer/OrderHistory";
import OrderTracking from "./pages/customer/OrderTracking";
import Checkout from "./pages/customer/Checkout";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import MenuManagement from "./pages/admin/MenuManagement";
import UserManagement from "./pages/admin/UserManagement";
import Analytics from "./pages/admin/Analytics";

// Kitchen Pages
import KitchenOrders from "./pages/kitchen/Orders";
import KitchenInventory from "./pages/kitchen/Inventory";

// import KitchenOrders from "./pages/kitchen/Orders";

function App() {
  return (
    <BrowserRouter>
      <TableProvider>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/auth">
              <Route index element={<Navigate to="/auth/login" />} />
              <Route path="login" element={<AuthPage mode="login" />} />
              <Route path="register" element={<AuthPage mode="register" />} />
            </Route>
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="menu" element={<MenuManagement />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="analytics" element={<Analytics />} />
          </Route>

          {/* Kitchen Routes */}
          <Route path="/kitchen" element={<KitchenLayout />}>
            <Route path="orders" element={<KitchenOrders />} />
            <Route path="inventory" element={<KitchenInventory />} />
          </Route>

          {/* Customer Routes */}
          <Route path="/" element={<CustomerLayout />}>
            <Route path="menu" element={<CustomerMenu />} />
            <Route path="profile" element={<CustomerProfile />} />
            <Route path="cart" element={<CustomerCart />} />
            <Route path="orders" element={<OrderHistory />} />
            <Route path="tracking" element={<OrderTracking />} />
            <Route path="checkout" element={<Checkout />} />
          </Route>
        </Routes>
      </TableProvider>
    </BrowserRouter>
  );
}

export default App;
