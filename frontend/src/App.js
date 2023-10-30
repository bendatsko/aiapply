import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import HomePage from './Pages/Home/HomePage';
import LoginPage from './Pages/Login/LoginPage';
import Dashboard from './Pages/Dashboard/Dashboard';
import AboutPage from './Pages/About/AboutPage'; // Import the AboutPage
import { UserProvider } from './UserContext';

function App() {
  return (
      <UserProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/about" element={<AboutPage />} /> {/* Added new Route for /about */}
            </Routes>
          </div>
        </Router>
      </UserProvider>
  );
}

export default App;
