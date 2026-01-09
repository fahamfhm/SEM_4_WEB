
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
    <div className="hm-container">
      {/* Decorative overlay */}
      <div className="hm-overlay" />

      {/* Floating food icons in background */}
      <div className="hm-deco-icon">🍕</div>
      <div className="hm-deco-icon">🥤</div>
      <div className="hm-deco-icon">🍟</div>
      <div className="hm-deco-icon">🌶️</div>
      <div className="hm-deco-icon">🥗</div>
      <div className="hm-deco-icon">🍅</div>

      <div className="hm-wrapper">
        {/* LEFT: logo, text & buttons */}
        <section className="hm-content-left">
          <div className="hm-brand-header">
            {/* <div className="home-logo-icon-wrapper">
              <div className="home-logo-icon-glow" />
              <div className="fc-icon-circle home-logo-icon home-logo-icon-large">
                🍔
              </div>
            </div> */}

            {/* centre this block relative to left column, not including icon */}
            <div className="hm-brand-text-wrap">
              <span className="hm-brand-subtitle">WELCOME TO</span>
              <h1 className="hm-brand-title">
                FOOD <span className="hm-brand-title-highlight">COURT</span>
              </h1>

              <p className="hm-tagline">
                From sizzling burgers to stone‑baked pizza, customise every bite
                just the way you crave.
              </p>

              {/* User Info Badge */}
              {isAuthenticated && user && (
                <div className="hm-user-badge">
                  <span className="hm-user-icon">{getRoleIcon(user.role)}</span>
                  <div className="hm-user-details">
                    <span className="hm-user-name">{user.name}</span>
                    <span className="hm-user-role">{user.role}</span>
                  </div>
                </div>
              )}

              <div className="hm-action-group">
                {isAuthenticated && user ? (
                  <>
                    {user.role === 'customer' ? (
                      <>
                        <button
                          className="hm-btn hm-btn-primary hm-btn-shimmer"
                          onClick={handleContinueAsUser}
                          aria-label={`Order as ${user.name}`}
                        >
                          🍔 Order as {user.name}
                        </button>
                        <button
                          className="hm-btn hm-btn-secondary"
                          onClick={handleLogout}
                          aria-label="Logout from your account"
                        >
                          🚪 Logout
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="hm-btn hm-btn-primary hm-btn-shimmer"
                          onClick={handleContinueAsUser}
                          aria-label={`Continue to ${user.role} dashboard`}
                        >
                          ✨ Go to Dashboard
                        </button>
                        <button
                          className="hm-btn hm-btn-secondary"
                          onClick={handleLogout}
                          aria-label="Logout from your account"
                        >
                          🚪 Logout
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <button
                      className="hm-btn hm-btn-primary hm-btn-shimmer"
                      onClick={handleGuestOrderClick}
                      aria-label="Start ordering as guest"
                    >
                      🍔 Order as Guest
                    </button>
                    <button
                      className="hm-btn hm-btn-secondary"
                      onClick={HandleLoginClick}
                      aria-label="Sign in or create account"
                    >
                      👤 Sign In / Register
                    </button>
                  </>
                )}
              </div>

              <div className="hm-badge-group">
                <span className="hm-badge" role="status" aria-label="No account needed">
                  <span className="hm-status-dot" aria-hidden="true" /> No account needed
                </span>
                <span className="hm-badge" aria-label="Quick and easy ordering">
                  <span aria-hidden="true">✨</span> Quick & Easy ordering
                </span>
                {diningType === 'table' && tableNumber && (
                  <span className="hm-badge" aria-label={`Dining at table ${tableNumber}`}>
                    <span aria-hidden="true">🪑</span> Table {tableNumber}
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT: rounded rectangle with burger image */}
        <section className="hm-content-right">
          <div className="hm-showcase-card">
            <div className="hm-showcase-glow" />
            <img
              src="/burger.png" /* or /burger.jpg */
              alt="Cheesy burger"
              className="hm-showcase-image hm-tilted"
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
