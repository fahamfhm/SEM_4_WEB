
import "../styles/Home.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect} from "react";
import { useTable } from "../context/TableContext";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { tableNumber, diningType, setTableInfo } = useTable();
  const { user, isAuthenticated, logout } = useAuth();

  // Check for table parameter in URL when component mounts
  useEffect(() => {
    const tableParam = searchParams.get('table');
    
    if (tableParam) {
      // QR code scanned with table number
      setTableInfo(tableParam, 'table');
      // Remove the query parameter from URL for cleaner look
      window.history.replaceState({}, '', '/');
    } else if (!tableNumber && !diningType) {
      // No table info and no QR scan - default to takeaway
      setTableInfo(null, 'takeaway');
    }
  }, [searchParams, tableNumber, diningType, setTableInfo]);

  // Derive showTableInfo from context state instead of managing it separately
  // const showTableInfo = diningType === 'table' && tableNumber;
  
  const HandleLoginClick = () => {
    navigate("/auth/login");
  };
  
  const handleGuestOrderClick = () => {
    navigate("/guest/menu");
  };

  const handleContinueAsUser = () => {
    // Redirect based on user role
    if (user?.role === 'admin') {
      navigate('/admin/dashboard');
    } else if (user?.role === 'kitchen') {
      navigate('/kitchen/orders');
    } else {
      navigate('/customer/menu');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return '👑';
      case 'kitchen': return '🍳';
      case 'customer': return '👤';
      default: return '👤';
    }
  };

  return (
    <div className="home-root">
      {/* vignette over wooden background */}
      <div className="home-vignette" />

      {/* many floating food icons in background */}
      <div className="home-bg-icon home-bg-icon-1">🍕</div>
      <div className="home-bg-icon home-bg-icon-2">🥤</div>
      <div className="home-bg-icon home-bg-icon-3">🍟</div>
      <div className="home-bg-icon home-bg-icon-4">🌶️</div>
      <div className="home-bg-icon home-bg-icon-5">🥗</div>
      <div className="home-bg-icon home-bg-icon-6">🍅</div>
      <div className="home-bg-icon home-bg-icon-7">🧀</div>
      <div className="home-bg-icon home-bg-icon-8">🥓</div>
      <div className="home-bg-icon home-bg-icon-9">🍩</div>
      <div className="home-bg-icon home-bg-icon-10">🧅</div>
      <div className="home-bg-icon home-bg-icon-11">🍇</div>

      <div className="home-content">
        {/* LEFT: logo, text & buttons */}
        <section className="home-left">
          <div className="home-logo-row">
            {/* <div className="home-logo-icon-wrapper">
              <div className="home-logo-icon-glow" />
              <div className="fc-icon-circle home-logo-icon home-logo-icon-large">
                🍔
              </div>
            </div> */}

            {/* centre this block relative to left column, not including icon */}
            <div className="home-logo-and-text">
              <div className="home-logo-text">
                <span className="home-logo-small">WELCOME TO</span>
                <h1 className="home-logo-main">
                  FOOD <span>COURT</span>
                </h1>
              </div>

              <p className="home-tagline">
                From sizzling burgers to stone‑baked pizza, customise every bite
                just the way you crave.
              </p>

              {/* User Info Badge */}
              {isAuthenticated && user && (
                <div className="home-user-info">
                  <div className="home-user-badge">
                    <span className="home-user-icon">{getRoleIcon(user.role)}</span>
                    <div className="home-user-details">
                      <span className="home-user-name">{user.name}</span>
                      <span className="home-user-role">{user.role}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="home-actions">
                {isAuthenticated && user ? (
                  <>
                    <button
                      className="fc-primary-btn home-btn home-btn-glow"
                      onClick={handleContinueAsUser}
                      aria-label={`Continue to ${user.role} dashboard`}
                    >
                      ✨ Go to Dashboard
                    </button>
                    <button
                      className="fc-secondary-btn home-btn home-btn-outline"
                      onClick={handleGuestOrderClick}
                      aria-label="Order as guest without logging in"
                    >
                      🍔 Order as Guest
                    </button>
                    <button
                      className="home-btn home-btn-logout"
                      onClick={handleLogout}
                      aria-label="Logout from your account"
                    >
                      🚪 Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="fc-primary-btn home-btn home-btn-glow"
                      onClick={handleGuestOrderClick}
                      aria-label="Start ordering as guest"
                    >
                      🍔 Order as Guest
                    </button>
                    <button
                      className="fc-secondary-btn home-btn home-btn-outline"
                      onClick={HandleLoginClick}
                      aria-label="Sign in or create account"
                    >
                      👤 Sign In / Register
                    </button>
                  </>
                )}
              </div>

              <div className="home-badges">
                <span className="fc-chip" role="status" aria-label="No account needed">
                  <span className="home-dot-live" aria-hidden="true" /> No account needed
                </span>
                <span className="fc-chip" aria-label="Quick and easy ordering">
                  <span aria-hidden="true">✨</span> Quick & Easy ordering
                </span>
                {diningType === 'table' && tableNumber && (
                  <span className="fc-chip home-chip-table" aria-label={`Dining at table ${tableNumber}`}>
                    <span aria-hidden="true">🪑</span> Table {tableNumber}
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT: rounded rectangle with burger image */}
        <section className="home-right">
          <div className="home-card">
            <div className="home-fire-glow" />
            <img
              src="/burger.png" /* or /burger.jpg */
              alt="Cheesy burger"
              className="home-burger-image tilted"
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
