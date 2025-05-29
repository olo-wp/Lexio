import './assets/App.css'
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import NotFoundPage from './pages/NotFoundPage';
import Navbar from './components/Navbar';
import AuthPage from "./pages/AuthPage.jsx";

import {useAuthentication} from "./auth/Auth.js";
import GoogleRedirect from "./components/GoogleRedirectHandler.jsx";





function App() {
    const {isAuthorised} = useAuthentication();
    const ProtectedLogin = () => {
        return isAuthorised ? <Navigate to={'/'}/> : <AuthPage initialMethod={'login'} />
    }
    const ProtectedRegister = () => {
        return isAuthorised ? <Navigate to={'/'}/> : <AuthPage initialMethod={'register'} />
    }

  return (
    <Router>
        <Navbar />
        <Routes>
            <Route path={"/login/callback"} element={<GoogleRedirect />} />
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<ProtectedLogin />} />
            <Route path="/register" element={<ProtectedRegister />} />
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    </Router>
  )
}

export default App
