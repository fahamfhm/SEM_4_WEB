import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/Sidebar.css';

interface SidebarProps {
  role: 'kitchen' | 'admin';
}

const Sidebar = ({ role }: SidebarProps) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const kitchenLinks = [
    { to: '/', icon: '🏠', label: 'Home' },
    { to: '/kitchen/orders', icon: '📋', label: 'Orders' },
    { to: '/kitchen/inventory', icon: '📦', label: 'Inventory' },
    { to: '/kitchen/menu-availability', icon: '🍽️', label: 'Menu Availability' },
  ];

  const adminLinks = [
    { to: '/', icon: '🏠', label: 'Home' },
    { to: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
    { to: '/admin/menu', icon: '🍽️', label: 'Menu' },
    { to: '/admin/orders', icon: '📋', label: 'Orders' },
    { to: '/admin/users', icon: '👥', label: 'Users' },
    { to: '/admin/analytics', icon: '📈', label: 'Analytics' },
  ];

  const links = role === 'kitchen' ? kitchenLinks : adminLinks;

  return (
    <aside className="sb-container">
      
      <nav className="sb-nav">
        <ul className="sb-nav-list">
          {links.map((link) => (
            <li key={link.to} className="sb-nav-item">
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `sb-nav-link ${isActive ? 'sb-nav-link-active' : ''}`
                }
                end={link.to === '/'}
                title={link.label}
              >
                <span className="sb-nav-icon">{link.icon}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sb-footer">
        <button
          className="sb-logout-btn"
          onClick={handleLogout}
          aria-label="Logout"
          title="Logout"
        >
          <span className="sb-logout-icon">🚪</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
