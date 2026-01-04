
import "../styles/Home.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTable } from "../context/TableContext";

const Home = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { tableNumber, diningType, setTableInfo } = useTable();

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
  const showTableInfo = diningType === 'table' && tableNumber;

  const handleMenuClick = () => {
    navigate("/menu");
  };
  
  const HandleLoginClick = () => {
    navigate("/auth/login");
  };
  return (
    <div className="home-container">
      {/* <div className="home-left">
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZB2Gowv5fYnRQWS7mMR5-mDUVeC8nfhbQaQ&s" alt="Burger" className="burger-img" />
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZB2Gowv5fYnRQWS7mMR5-mDUVeC8nfhbQaQ&s" alt="Flame" className="flame-img" />
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZB2Gowv5fYnRQWS7mMR5-mDUVeC8nfhbQaQ&s" alt="Onion" className="topping onion" />
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZB2Gowv5fYnRQWS7mMR5-mDUVeC8nfhbQaQ&s" alt="Tomato" className="topping tomato" />
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZB2Gowv5fYnRQWS7mMR5-mDUVeC8nfhbQaQ&s" alt="Leaf" className="topping leaf" />
      </div> */}
      <div className="home-right">
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZB2Gowv5fYnRQWS7mMR5-mDUVeC8nfhbQaQ&s" alt="Pizza" className="pizza-img" />
        
        {/* Table Info Display */}
        {showTableInfo && (
          <div className="table-info-banner">
            <span className="table-badge">📍 Table {tableNumber}</span>
          </div>
        )}
        {diningType === 'takeaway' && !tableNumber && (
          <div className="table-info-banner takeaway">
            <span className="table-badge">🛍️ Takeaway</span>
          </div>
        )}
        
        <h1 className="welcome-text">WELCOME TO</h1>
        <h1 className="foodcourt-text">
          FOOD<span className="flame-icon">🔥</span>
          <span className="court-red">COURT</span>
        </h1>
        <button className="view-menu-btn" onClick={handleMenuClick}>View Menu</button>
        <button className="view-menu-btn" onClick={HandleLoginClick}>Login</button>
      </div>
      
    </div>
  );
};

export default Home;
