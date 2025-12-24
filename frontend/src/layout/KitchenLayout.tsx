import { Outlet } from 'react-router-dom';
import NavBar from '../components/Common/NavBar';

const KitchenLayout = () => (
  <>
    <NavBar role="kitchen" />
    <main>
      <Outlet />
    </main>
  </>
);

export default KitchenLayout;
