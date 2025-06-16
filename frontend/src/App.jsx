import './assets/App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import CreateGraphPage from "./pages/CreateGraphPage.jsx";
import TextProcessor from "./pages/TextProcessor.jsx";
import NotFoundPage from './pages/NotFoundPage';
import Navbar from './components/Navbar';
import AuthPage from "./pages/AuthPage.jsx";
import GoogleRedirect from "./components/GoogleRedirectHandler.jsx";
import WordSets from "./pages/WordSets.jsx";
import AuthCallback from "./components/AuthCallback.jsx";
import SettingsPage from "./pages/SettingsPage.jsx"
import { AuthMaster } from "./auth/AuthContext.jsx";
import { useContext } from "react";
import AuthContext from "./auth/AuthContext.jsx";
import GraphManager from "./pages/GraphManager.jsx";

function AppRoutes() {
    const { isAuthenticated, loading } = useContext(AuthContext);
    console.log("current context auth:", isAuthenticated, "loading:", loading);

    if (loading) return <div>Loading...</div>;

    const ProtectedLogin = () => {
        return isAuthenticated ? <Navigate to={'/'} /> : <AuthPage initialMethod={'login'} />;
    }

    const ProtectedRegister = () => {
        return isAuthenticated ? <Navigate to={'/'} /> : <AuthPage initialMethod={'register'} />;
    }

    return (
        <>
            <Navbar />
            <div className="main-content">
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<ProtectedLogin />} />
                    <Route path="/register" element={<ProtectedRegister />} />
                    <Route path="/graphs" element={<GraphManager />} />
                    <Route path="/process-text" element={<TextProcessor />} />
                    <Route path="/login/callback" element={<GoogleRedirect />} />
                    <Route path="/auth/callback" element={<AuthCallback />} />
                    <Route path="/sets" element={isAuthenticated ? <WordSets /> : <Navigate to="/login" />} />
                    <Route path="/settings" element={isAuthenticated ? <SettingsPage /> : <Navigate to="/login" />} />
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </div>
        </>
    );
}

function App() {
    return (
        <Router>
            <AuthMaster>
                <AppRoutes />
            </AuthMaster>
        </Router>
    );
}

export default App;