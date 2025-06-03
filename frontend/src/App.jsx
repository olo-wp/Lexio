import './assets/App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import CreateGraphPage from "./pages/CreateGraphPage.jsx";
import TextProcessor from "./pages/TextProcessor.jsx";
import NotFoundPage from './pages/NotFoundPage';
import Navbar from './components/Navbar';


function App() {
  return (
    <Router>
        <Navbar />
        <div className="main-content">
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/graphs" element={<CreateGraphPage />} />
                <Route path="/process-text" element={<TextProcessor />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </div>
    </Router>

  )
}

export default App
