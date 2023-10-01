import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import HomePage from './HomePage'; 
import AboutPage from './AboutPage'; 
import LoginPage from './LoginPage'; 
import NewResume from './NewResume'; 
import Examples from './Examples'; 
import Dashboard from './Dashboard';
import { initializeApp } from 'firebase/app';
import { UserProvider } from './UserContext'; // Import the UserProvider
function App() {
  return (
    <UserProvider>
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/examples" element={<Examples />} />
          <Route path="/team" element={<AboutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/new-resume" element={<NewResume />} />
          <Route path="/dashboard" element={<Dashboard />} /> {/* Added new Route for /dashboard */}
        </Routes>
      </div>
    </Router>
    </UserProvider>
  );
}

export default App;

