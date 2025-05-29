import {useNavigate} from "react-router-dom";
import {ACCESS_TOKEN, REFRESH_TOKEN} from "../auth/token.js";
import "./AuthForm.css";
import React, {useState} from "react";
import api from "../auth/api.js";

const AuthForm = ({route, method}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const res = await api.post(route, {
                'username': username,
                'password': password
            })

            if (method === 'login') {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                navigate("/")
                window.location.reload()
            } else {
                setSuccess("Registration successful, please login");
                setTimeout(() => {
                    navigate("/login")
                }, 2000)
            }
        } catch (err) {
            console.error(err)
            if (err.response) {
                if (err.response.status === 401) {
                    setError("Wrong username or password");
                } else if (err.response.status === 400) {
                    setError("Username taken");
                } else {
                    setError("Something went wrong");
                }
            } else if (err.request) {
                setError("Error. Please check your internet connection");
            } else {
                setError("Something went wrong");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = "http://localhost:8080/accounts/google/login"
    };

    return (
        <div className="form-container">
            {loading && (
                <div className="loading-indicator">
                    {error ? <span className="error-message">{error}</span> : <div className="spinner"></div>}
                </div>
            )}
            {!loading && (
                <form onSubmit={handleSubmit} className="form">
                    <h2>{method === "register" ? "Register" : "Login"}</h2>
                    {error && <div className="error-message">{error}</div>}
                    {success && <div className="success-message">{success}</div>}
                    <div className="form-group">
                        <label htmlFor="username">Username:</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="form-button">
                        {method === "register" ? "Register" : "Login"}
                    </button>
                    <button type="button" className="google-button" onClick={handleGoogleLogin}>
                        <img
                            src="https://developers.google.com/identity/images/btn_google_signin_light_normal_web.png"
                            alt="Google icon"
                            className="google-icon"
                        />
                        {method === "register" ? "Register with Google" : "Login with Google"}
                    </button>
                    {method === "login" && (
                        <p className="toggle-text">
                            Don't have an account?
                            <span className="toggle-link" onClick={() => navigate("/register")}>
                                Register
                            </span>
                        </p>
                    )}
                    {method === "register" && (
                        <p className="toggle-text">
                            Already have an account?
                            <span className="toggle-link" onClick={() => navigate("/login")}>
                                Login
                            </span>
                        </p>
                    )}
                </form>
            )}
        </div>
    );
};


export default AuthForm;

