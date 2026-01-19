import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Common/Sidebar';
import '../styles/AdminLayout.css';

const AdminLayout = () => (
  <div className="admin-layout">
    <Sidebar role="admin" />
    <main className="admin-main">
      <Outlet />
    </main>
  </div>
);

export default AdminLayout;
