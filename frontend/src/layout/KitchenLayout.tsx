import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Common/Sidebar';
import '../styles/KitchenLayout.css';

const KitchenLayout = () => (
  <div className="kitchen-layout">
    <Sidebar role="kitchen" />
    <main className="kitchen-main">
      <Outlet />
    </main>
  </div>
);

export default KitchenLayout;
