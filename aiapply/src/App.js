import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import HomePage from './HomePage'; // Import your HomePage component
import AboutPage from './AboutPage'; // Import your AboutPage component
import LoginPage from './LoginPage'; // Import your LoginPage component
import NewResume from './NewResume'; // Import your NewResume component
import Examples from './Examples'; // Import your NewResume component
import { initializeApp } from 'firebase/app';


function App() {
  return (
    <Router>
      <div className="App">

        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/examples" element={<Examples />} />
            <Route path="/team" element={<AboutPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/new-resume" element={<NewResume />} />
          </Routes>
      </div>
    </Router>
  );
}

export default App;
