import './HeroSection.css'

const HeroSection = () => {
    return (
        <section className="hero-section">
            <div className="hero-overlay"></div>
            <div className="hero-content">
                <h1 className="hero-title">
                    Plan your journey with AI — discover, connect, explore.
                </h1>
                <p className="hero-subtitle">
                    Your intelligent travel companion for finding perfect accommodations, connecting with fellow travelers, and creating unforgettable experiences.
                </p>
                <button className="hero-cta">
                    PLAN TRIP
                </button>
            </div>
        </section>
    )
}

export default HeroSection