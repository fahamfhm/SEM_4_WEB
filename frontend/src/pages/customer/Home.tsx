
import "../../styles/Home.css";
import { useNavigate } from "react-router-dom";


const Home = () => {
  const navigate = useNavigate();
  const handleMenuClick = () => {
    navigate("/menu");
  };
  return (
    <div className="home-container">
      <div className="home-left">
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZB2Gowv5fYnRQWS7mMR5-mDUVeC8nfhbQaQ&s" alt="Burger" className="burger-img" />
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZB2Gowv5fYnRQWS7mMR5-mDUVeC8nfhbQaQ&s" alt="Flame" className="flame-img" />
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZB2Gowv5fYnRQWS7mMR5-mDUVeC8nfhbQaQ&s" alt="Onion" className="topping onion" />
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZB2Gowv5fYnRQWS7mMR5-mDUVeC8nfhbQaQ&s" alt="Tomato" className="topping tomato" />
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZB2Gowv5fYnRQWS7mMR5-mDUVeC8nfhbQaQ&s" alt="Leaf" className="topping leaf" />
      </div>
      <div className="home-right">
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZB2Gowv5fYnRQWS7mMR5-mDUVeC8nfhbQaQ&s" alt="Pizza" className="pizza-img" />
        <h1 className="welcome-text">WELCOME TO</h1>
        <h1 className="foodcourt-text">
          FOOD<span className="flame-icon">🔥</span>
          <span className="court-red">COURT</span>
        </h1>
        <button className="view-menu-btn" onClick={handleMenuClick}>View Menu</button>
      </div>
    </div>
  );
};

export default Home;
