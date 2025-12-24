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


// Customer Pages
import CustomerMenu from "./pages/customer/Menu";

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
          </Route>

        </Routes>
    </BrowserRouter>
  );
}

export default App;
