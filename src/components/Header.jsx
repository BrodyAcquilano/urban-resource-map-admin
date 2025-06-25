// Header.jsx
import React from "react";
import { Link } from "react-router-dom";
import "../styles/Header.css";

function Header({ isLoading }) {
  return (
    <header className="app-header">
      <div className="site-title">Urban Resource Map</div>
      <nav className="nav-links">
        <Link to="/" className={isLoading ? "disabled-link" : ""}>Home</Link>
        <Link to="/editor" className={isLoading ? "disabled-link" : ""}>Editor</Link>
        <Link to="/export" className={isLoading ? "disabled-link" : ""}>Export</Link>
        <Link to="/analysis" className={isLoading ? "disabled-link" : ""}>Analysis</Link>
      </nav>
    </header>
  );
}

export default Header;
