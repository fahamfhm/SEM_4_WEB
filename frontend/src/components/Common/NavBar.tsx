import React from "react";
import { Link } from "react-router-dom";
import "../../styles/NavBar.css";

interface NavBarProps {
  role: "customer" | "admin" | "kitchen" | "guest";
}

const navLinks = {
  customer: [
    { to: "/menu", label: "Menu" },
    { to: "/cart", label: "Cart" },
    { to: "/orders", label: "My Orders" },
    { to: "/profile", label: "Profile" },
  ],
  admin: [
    { to: "/admin/dashboard", label: "Dashboard" },
    { to: "/admin/users", label: "Users" },
    { to: "/admin/settings", label: "Settings" },
  ],
  kitchen: [
    { to: "/kitchen/orders", label: "Orders" },
    { to: "/kitchen/inventory", label: "Inventory" },
  ],
  guest: [
    { to: "/menu", label: "Menu" },
    { to: "/auth/login", label: "Login" },
    { to: "/auth/register", label: "Register" },
  ],
};

const NavBar: React.FC<NavBarProps> = ({ role }) => (
  <nav className="navbar">
    <ul>
      {navLinks[role].map((link) => (
        <li key={link.to}>
          <Link to={link.to}>{link.label}</Link>
        </li>
      ))}
    </ul>
  </nav>
);

export default NavBar;
