import React from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from './firebase';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importing Bootstrap CSS
import './styles/LoginPage.css';

function Login() {
  const navigate = useNavigate();

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      navigate('/dashboard', { state: { userId: result.user.uid } });
    } catch (error) {
      console.error('Error signing in with Google', error);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100">
      <div className="card text-center shadow p-3 mb-5 bg-white rounded">
        <div className="card-body">
          <h5 className="card-title">Login</h5>
          <div className="mb-3">
            <button className="btn btn-light border shadow-sm" onClick={signInWithGoogle}>
              <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google Logo" className="google-icon" />
              <span className="btn-text">Sign in with Google</span>
            </button>
          </div>
          <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank" rel="noopener noreferrer" className="card-link">Forgot Password?</a>
        </div>
      </div>
    </div>
  );
}

export default Login;
