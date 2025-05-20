import { Link } from 'react-router-dom';
import './Navbar.css'

function Navbar() {
    return (
        <nav>
            <ul className="nav">
                <li><Link to="/">Start</Link></li>
                <li><Link to="/login">Logowanie</Link></li>
                <li><Link to="/settings">Ustawienia</Link></li>
            </ul>
        </nav>
    );
}

export default Navbar;