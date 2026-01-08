import React from "react";
import { Link } from "react-router-dom";
import "../../styles/NavBar.css";

interface NavBarProps {
  role: "customer" | "admin" | "kitchen";
}

const navLinks = {
  customer: [
    { to: "customer/menu", label: "Menu" },
    { to: "customer/cart", label: "Cart" },
    { to: "customer/orders", label: "My Orders" },
    { to: "customer/profile", label: "Profile" },
  ],
  admin: [
    { to: "/admin/dashboard", label: "Dashboard" },
    { to: "/admin/users", label: "Users" },
    { to: "/admin/settings", label: "Settings" },
  ],
  kitchen: [
    { to: "/kitchen/orders", label: "Orders" },
    { to: "/kitchen/inventory", label: "Inventory" },
  ]
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
