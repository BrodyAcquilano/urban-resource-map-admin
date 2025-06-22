// src/components/Header.jsx
import React from "react";
import { Link } from "react-router-dom";
import "../styles/Header.css";

function Header() {
  return (
    <header className="app-header">
      <div className="site-title">Urban Resource Map</div>
      <nav className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/editor">Editor</Link>
        <Link to="/export">Export</Link>
        <Link to="/analysis">Analysis</Link>
      </nav>
    </header>
  );
}

export default Header;
