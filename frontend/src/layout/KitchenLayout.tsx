import { Outlet } from 'react-router-dom';
import NavBar from '../components/Common/NavBar';
import '../styles/KitchenLayout.css';

const KitchenLayout = () => (
  <div className="kitchen-layout">
    <NavBar role="kitchen" />
    <main>
      <Outlet />
    </main>
  </div>
);

export default KitchenLayout;
