import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import logo from '../../logo.png'; // Please ensure this path is correct.

function Navbar() {
  return (
      <nav className="navbar navbar-expand navbar-light bg-white"> {/* White navbar */}
        <div className="container-fluid">
          <Link className="navbar-brand d-flex align-items-center" to="/">
            <img src={logo} alt="Logo" className="logo" />
          </Link>

          <div className="ml-auto d-flex align-items-center">
            <Link className="nav-link custom-login-link mr-2" to="/login">Login</Link> {/* Added margin to the right of the login text */}
            <Link className="btn btn-get-started" to="/about">Learn More</Link>
          </div>
        </div>
      </nav>
  );
}

export default Navbar;
