
import "../styles/Home.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect} from "react";
import { useTable } from "../context/TableContext";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { tableNumber, diningType, setTableInfo } = useTable();
  const { user, isAuthenticated } = useAuth();

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

              <div className="home-actions">
                {isAuthenticated && user ? (
                  <>
                    <button
                      className="fc-primary-btn home-btn home-btn-glow"
                      onClick={handleContinueAsUser}
                    >
                      👋 Continue as {user.name}
                    </button>
                    <button
                      className="fc-secondary-btn home-btn home-btn-outline"
                      onClick={handleGuestOrderClick}
                    >
                      🍔 Order as Guest
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="fc-primary-btn home-btn home-btn-glow"
                      onClick={handleGuestOrderClick}
                    >
                      🍔 Order as Guest
                    </button>
                    <button
                      className="fc-secondary-btn home-btn home-btn-outline"
                      onClick={HandleLoginClick}
                    >
                      👤 Sign In / Register
                    </button>
                  </>
                )}
              </div>

              <div className="home-badges">
                <span className="fc-chip">
                  <span className="home-dot-live" /> No account needed
                </span>
                <span className="fc-chip">
                  <span>✨</span> Quick & Easy ordering
                </span>
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
