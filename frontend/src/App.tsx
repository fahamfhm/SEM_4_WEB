import {
  Routes,
  Route,
  Navigate,
  BrowserRouter,
} from "react-router-dom";

import PublicLayout from "./layout/GuestLayout";
import CustomerLayout from "./layout/CustomerLayout";
import AdminLayout from "./layout/AdminLayout";
import KitchenLayout from "./layout/KitchenLayout";


//Auth Pages
import AuthPage from "./pages/auth/AuthPage";
import { useLocation } from "react-router-dom";

// Customer Pages
import CustomerMenu from "./pages/customer/Menu";
import CustomerProfile from "./pages/customer/Profile";
import CustomerCart from "./pages/customer/Cart";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";

// Kitchen Pages
import KitchenOrders from "./pages/kitchen/Orders";

// import KitchenOrders from "./pages/kitchen/Orders";

function App() {
  return (
    <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={ <Navigate to="/menu" />} />
            <Route path="/auth">
              <Route index element={<Navigate to="/auth/login" />} />
              <Route path="login" element={<AuthPage mode="login" />} />
              <Route path="register" element={<AuthPage mode="register" />} />
            </Route>
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
          </Route>

          {/* Kitchen Routes */}
          <Route path="/kitchen" element={<KitchenLayout />}>
            <Route path="orders" element={<KitchenOrders />} />
          </Route>

          {/* Customer Routes */}
          <Route path="/" element={<CustomerLayout />}>
            <Route path="menu" element={<CustomerMenu />} />
            <Route path="profile" element={<CustomerProfile />} />
            <Route path="cart" element={<CustomerCart />} />
          </Route>

        </Routes>
    </BrowserRouter>
  );
}

export default App;
