import { Outlet } from 'react-router-dom';
import NavBar from '../components/Common/NavBar';
import '../styles/AdminLayout.css';

const AdminLayout = () => (
  <div className="admin-layout">
    <NavBar role="admin" />
    <main>
      <Outlet />
    </main>
  </div>
);

export default AdminLayout;
