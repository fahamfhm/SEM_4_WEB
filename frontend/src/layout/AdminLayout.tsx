import { Outlet } from 'react-router-dom';
import NavBar from '../components/Common/NavBar';

const AdminLayout = () => (
  <>
    <NavBar role="admin" />
    <main>
      <Outlet />
    </main>
  </>
);

export default AdminLayout;
