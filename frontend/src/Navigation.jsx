import './Navigation.css'

const Navigation = () => {
    return (
        <nav className="navigation">
            <div className="logo" onClick={() => window.location.href = '/'}>
                Travelinn
            </div>
            <ul className="nav-links">
                <li><a href="/">Home</a></li>
                <li><a href="/hotels" className="active">Hotels</a></li>
                <li><a href="#groups">Groups</a></li>
                <li><a href="#wellbeing">Wellbeing</a></li>
                <li><a href="#concierge">Concierge</a></li>
                <li><a href="#about">About Us</a></li>
            </ul>
            <div className="nav-right">
                <button className="sign-in-btn">SIGN IN</button>
            </div>
        </nav>
    )
}

export default Navigation