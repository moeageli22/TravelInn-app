
import { Link } from 'react-router-dom'
import './Navbar.css'

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    <svg className="logo-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Travelinn</span>
                </Link>

                <ul className="navbar-menu">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/hotels">Hotels</Link></li>
                    <li><Link to="/groups">Groups</Link></li>
                    <li><Link to="/chatbot">Chatbot</Link></li>
                    <li><Link to="/about">About Us</Link></li>
                </ul>

                <Link to="/signin" className="navbar-signin">
                    SIGN IN
                </Link>
            </div>
        </nav>
    )
}

export default Navbar