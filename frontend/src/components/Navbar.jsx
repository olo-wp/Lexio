import { Link } from 'react-router-dom';
import './Navbar.css'
import {useAuthentication} from "../auth/Auth.js";
import ProfBar from "./ProfBar.jsx"


function Navbar() {

    const {isAuthenticated, logout} = useAuthentication();

    const handleLogout = async () => {
        logout();
    }

    return (
        <nav>
            <ul className="nav">
                {isAuthenticated ? (
                    <>
                        <li><ProfBar/></li>
                    </>
                ):(<></>)}
                <li><Link to="/">Start</Link></li>
                {isAuthenticated ? (
                    <>
                        <li><Link to="/settings">Settings</Link></li>
                        <li><Link to="/graphs">Generate!</Link></li>
                        <li><Link to="/sets">Your sets</Link></li>
                        <li><Link to onClick={handleLogout}>Logout</Link></li>
                    </>
                ) : (
                    <>
                        <li><Link to="/login">Login</Link></li>
                        <li><Link to="/register">Register</Link></li>
                    </>
                )}
            </ul>
        </nav>
    );
}

export default Navbar;