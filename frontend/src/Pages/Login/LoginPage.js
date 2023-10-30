import React from 'react';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import {signInWithPopup} from 'firebase/auth';
import {auth, googleProvider} from '../../firebase';
import './LoginPage.css';
import logo from "../../logo.png";

function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const sessionExpired = location.state?.sessionExpired || false;

    const signInWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            navigate('/dashboard', {state: {userId: result.user.uid}});
        } catch (error) {
            console.error('Error signing in with Google', error);
        }
    };

    return (
        <div className={"loginwrapper"}>
            {sessionExpired && (
                <div className="session-expired-banner">
                    Your session has expired. Please log in again.
                </div>
            )}

            <div className="login-container">
                <div className="logo-container">
                    <Link to="/">
                        <img src={logo} alt="Logo" className="loginlogo"/>
                    </Link>
                    {/* Removed the .app-name <h1> */}
                </div>

                <div className="login-content">
                    <h5 className="mb-4">Login</h5>
                    <button className="btn btn-accent login-btn" onClick={signInWithGoogle}>
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/2048px-Google_%22G%22_Logo.svg.png"
                            alt="Google Logo" className="google-icon"/>
                        <span className="btn-text">Sign in with Google</span>
                    </button>
                    <a href="#" className="forgot-password-link mt-3 d-block">Forgot Password?</a>
                </div>
            </div>
        </div>
    );
}

export default Login;
