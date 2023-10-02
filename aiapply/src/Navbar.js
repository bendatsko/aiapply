import React from 'react';
import { Link } from 'react-router-dom';
import './styles/Navbar.css';
import logo from './logo.png';

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white"> {/* Changed navbar-dark to navbar-light */}
      <div className="container-fluid">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img src={logo} alt="Logo" className="logo" />
        </Link>
        
        <div className="mx-auto order-0">
          <div className="navbar-nav">
            <Link className="nav-link" to="/products">Products</Link>
            <Link className="nav-link" to="/team">Team</Link>
            <Link className="nav-link" to="/purchase">Purchase</Link>
          </div>
        </div>
        
        <div className="d-flex ml-auto">
          <Link className="btn btn-primary" to="/login">Login</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
