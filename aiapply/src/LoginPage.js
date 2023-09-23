import React from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, githubProvider } from './firebase'; // adjust the import to your file structure
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/LoginPage.css';

function Login() {
  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      console.log('User signed in with Google');
    } catch (error) {
      console.error('Error signing in with Google', error);
    }
  };

  const signInWithGithub = async () => {
    try {
      await signInWithPopup(auth, githubProvider);
      console.log('User signed in with Github');
    } catch (error) {
      console.error('Error signing in with Github', error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h5 className="login-title">Sign in</h5>
        <button className="btn btn-primary login-btn" onClick={signInWithGoogle}>
          Sign in with Google
        </button>
        <button className="btn btn-dark login-btn" onClick={signInWithGithub}>
          Sign in with GitHub
        </button>
      </div>
    </div>
  );
}

export default Login;
