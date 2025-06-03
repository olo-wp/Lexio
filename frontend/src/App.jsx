import './assets/App.css'
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import NotFoundPage from './pages/NotFoundPage';
import Navbar from './components/Navbar';
import AuthPage from "./pages/AuthPage.jsx";

import GoogleRedirect from "./components/GoogleRedirectHandler.jsx";
import WordSets from "./pages/WordSets.jsx";
import {useAuthentication} from "./auth/Auth.js";



function App() {
    const {isAuthenticated, loading} = useAuthentication();
    const ProtectedLogin = () => {
        return isAuthenticated ? <Navigate to={'/'}/> : <AuthPage initialMethod={'login'} />
    }
    const ProtectedRegister = () => {
        return isAuthenticated ? <Navigate to={'/'}/> : <AuthPage initialMethod={'register'} />
    }

    if(loading) return(<div>Loading.......</div>)

    return (
        <Router>
            <Navbar />
            <div className="main-content">
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<ProtectedLogin />} />
                    <Route path="/register" element={<ProtectedRegister />} />
                    <Route path="*" element={<NotFoundPage />} />
                    <Route path="/login/callback" element={<GoogleRedirect />} />
                    <Route path="/sets" element={isAuthenticated ? <WordSets /> : <Navigate to="/login" />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App
