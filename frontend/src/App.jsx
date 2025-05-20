import './assets/App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import NotFoundPage from './pages/NotFoundPage';
import Navbar from './components/Navbar';


function App() {
  return (
    <Router>
        <Navbar />
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    </Router>
  )
}

export default App
