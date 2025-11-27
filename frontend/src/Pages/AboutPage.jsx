import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import UserMenu from '../components/UserMenu.jsx'
import logo from '../assets/IMG_3327.png'
import './AboutPage.css'

const backgroundImages = [
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920',
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1920',
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1920'
]

export default function AboutPage() {
    const navigate = useNavigate()
    const { user } = useAuth()
    const [currentSlide, setCurrentSlide] = useState(0)
    const [chatOpen, setChatOpen] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % backgroundImages.length)
        }, 4000)
        return () => clearInterval(interval)
    }, [])

    // Close mobile menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (mobileMenuOpen && !e.target.closest('.mobile-menu') && !e.target.closest('.hamburger-menu')) {
                setMobileMenuOpen(false)
            }
        }

        document.addEventListener('click', handleClickOutside)
        return () => document.removeEventListener('click', handleClickOutside)
    }, [mobileMenuOpen])

    const [messages, setMessages] = useState([
        {
            text: "Hi there! I can tell you more about Travelinn's mission or help you navigate the site. What would you like to know?",
            sender: 'ai',
            time: 'Just now'
        }
    ])
    const [inputValue, setInputValue] = useState('')
    const [showTyping, setShowTyping] = useState(false)

    const getAIResponse = (message) => {
        const lower = message.toLowerCase()
        if (lower.includes('mission') || lower.includes('goal')) return "Our mission is to help travelers make informed, confident decisions by providing clear information, smart tools, and an environment where people can connect."
        if (lower.includes('vision')) return "Our vision is to redefine modern travel by combining innovation, community interaction, and smart technology into one unified platform."
        if (lower.includes('provide') || lower.includes('offer')) return "We provide Hotel Discovery, an AI Travel Assistant, Traveler Communities, and a completely User-Focused Experience."
        return "I can tell you about our Mission, Vision, or what we provide at Travelinn. Ask me anything!"
    }

    const sendMessage = () => {
        if (!inputValue.trim()) return
        const newMessage = { text: inputValue, sender: 'user', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
        setMessages(prev => [...prev, newMessage])
        setInputValue('')
        setShowTyping(true)
        setTimeout(() => {
            setShowTyping(false)
            setMessages(prev => [...prev, { text: getAIResponse(inputValue), sender: 'ai', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }])
        }, 1000)
    }

    const handleNavClick = (path) => {
        setMobileMenuOpen(false)
        navigate(path)
    }

    return (
        <div className="about-page">
            <nav>
                <div className="logo" onClick={() => navigate('/')}>Travelinn</div>
                <ul className="nav-links">
                    <li><a href="/" onClick={(e) => { e.preventDefault(); navigate('/') }}>Home</a></li>
                    <li><a href="/hotels" onClick={(e) => { e.preventDefault(); navigate('/hotels') }}>Hotels</a></li>
                    <li><a href="/wellbeing" onClick={(e) => { e.preventDefault(); navigate('/wellbeing') }}>Wellbeing</a></li>
                    <li><a href="/groups" onClick={(e) => { e.preventDefault(); navigate('/groups') }}>Groups</a></li>
                    <li><a href="/about" className="active">About</a></li>
                </ul>
                <div className="nav-right">
                    {user ? (
                        <UserMenu />
                    ) : (
                        <button className="sign-in-btn" onClick={() => navigate('/signin')}>Sign In</button>
                    )}

                    {/* Hamburger Menu Button - Mobile Only */}
                    <button
                        className="hamburger-menu"
                        onClick={(e) => {
                            e.stopPropagation()
                            setMobileMenuOpen(!mobileMenuOpen)
                        }}
                        aria-label="Menu"
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && <div className="mobile-menu-overlay" onClick={() => setMobileMenuOpen(false)}></div>}

            {/* Mobile Menu */}
            <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
                <div className="mobile-menu-header">
                    <div className="mobile-menu-logo">Travelinn</div>
                    <button className="close-mobile-menu" onClick={() => setMobileMenuOpen(false)}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                <ul className="mobile-menu-links">
                    <li><a href="#home" onClick={() => handleNavClick('/')}>Home</a></li>
                    <li><a href="#hotels" onClick={() => handleNavClick('/hotels')}>Hotels</a></li>
                    <li><a href="#wellbeing" onClick={() => handleNavClick('/wellbeing')}>Wellbeing</a></li>
                    <li><a href="#groups" onClick={() => handleNavClick('/groups')}>Groups</a></li>
                    <li><a href="#about" onClick={() => handleNavClick('/about')}>About</a></li>
                </ul>
            </div>

            {/* Hero Section */}
            <div className="about-hero">
                <div className="background-slideshow">
                    {backgroundImages.map((img, idx) => (
                        <div
                            key={idx}
                            className={`background-slide ${idx === currentSlide ? 'active' : ''}`}
                            style={{ backgroundImage: `url(${img})` }}
                        />
                    ))}
                </div>
                <div className="hero-content">
                    <img src={logo} alt="Travelinn Logo" className="hero-logo" />
                    <h1>About Travelinn</h1>
                    <p style={{ fontSize: '1.2rem', marginTop: '1rem', maxWidth: '800px', marginInline: 'auto', lineHeight: '1.6' }}>
                        Travelinn is a modern travel platform designed to simplify the way people explore destinations, discover hotels, and connect with other travelers.
                        <br /><br />
                        The platform brings together intelligent trip planning, personalised recommendations, and community-driven social features to create a complete travel experience.
                    </p>
                </div>
            </div>

            <div className="container">
                {/* Mission Section */}
                <section className="mission-section">
                    <h2>Our Mission</h2>
                    <p>
                        To help travelers make informed, confident decisions by providing clear information, smart tools, and an environment where people can connect and share knowledge.
                        <br /><br />
                        Travelinn aims to create a seamless, intuitive, and enjoyable experience for users at every stage of their journey.
                    </p>
                </section>

                {/* What We Provide */}
                <section className="values-section">
                    <h2 style={{ marginBottom: '3rem', textAlign: 'center', color: 'white' }}>What We Provide</h2>
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon" style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}>
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M3 21h18"/>
                                    <path d="M5 21V7l8-4 8 4v14"/>
                                    <path d="M9 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/>
                                </svg>
                            </div>
                            <h3>Hotel Discovery and Booking</h3>
                            <p>A curated selection of hotels with detailed descriptions, room options, prices, amenities, and a secure booking process.</p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M12 2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/>
                                    <path d="M12 8v6"/>
                                    <path d="M12 14a4 4 0 0 1-4 4H6"/>
                                    <path d="M12 14a4 4 0 0 0 4 4h2"/>
                                    <rect x="4" y="18" width="4" height="4" rx="1"/>
                                    <rect x="16" y="18" width="4" height="4" rx="1"/>
                                </svg>
                            </div>
                            <h3>AI Travel Assistant</h3>
                            <p>A built-in assistant that answers travel questions, suggests options, and guides users through the planning process.</p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                                    <circle cx="9" cy="7" r="4"/>
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                                </svg>
                            </div>
                            <h3>Traveler Communities</h3>
                            <p>Groups based on shared interests where users can join discussions, ask questions, and meet others exploring similar destinations or activities.</p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon" style={{ background: 'rgba(236, 72, 153, 0.1)', color: '#ec4899' }}>
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                                    <path d="M2 17l10 5 10-5"/>
                                    <path d="M2 12l10 5 10-5"/>
                                </svg>
                            </div>
                            <h3>User-Focused Experience</h3>
                            <p>A clean interface, accessible design principles, and efficient navigation ensure that every feature is simple, practical, and easy to use.</p>
                        </div>
                    </div>
                </section>

                {/* Vision Section */}
                <section className="cta-section">
                    <h2>Our Vision</h2>
                    <p>
                        To redefine modern travel by combining innovation, community interaction, and smart technology into one unified platform.
                        <br /><br />
                        Travelinn is built to support travelers before, during, and after their trip, making each journey more meaningful, organised, and enjoyable.
                    </p>
                    <button className="cta-btn" onClick={() => navigate('/hotels')}>Start Your Journey</button>
                </section>
            </div>

            {/* Chatbot */}
            <div className="chat-bot" onClick={() => setChatOpen(!chatOpen)}>
                <dotlottie-wc
                    src="https://lottie.host/b3e4cac4-349a-4761-b167-2bf30a257e55/Xas0LWY1sY.lottie"
                    style={{ width: '100%', height: '100%' }}
                    autoplay
                    loop
                />
            </div>

            <div className={`chat-window ${chatOpen ? 'active' : ''}`}>
                <div className="chat-header">
                    <div>
                        <h3>About Travelinn AI</h3>
                        <p>Ask about our platform</p>
                    </div>
                    <button className="close-chat" onClick={() => setChatOpen(false)}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                <div className="chat-messages">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`chat-message ${msg.sender}`}>
                            <div className="message-avatar">
                                {msg.sender === 'user' ? (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                ) : (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"></path><path d="M12 8v6"></path><path d="M12 14a4 4 0 0 1-4 4H6"></path><path d="M12 14a4 4 0 0 0 4 4h2"></path><rect x="4" y="18" width="4" height="4" rx="1"></rect><rect x="16" y="18" width="4" height="4" rx="1"></rect></svg>
                                )}
                            </div>
                            <div>
                                <div className="message-content">{msg.text}</div>
                                <div className="message-time">{msg.time}</div>
                            </div>
                        </div>
                    ))}
                    {showTyping && (
                        <div className="typing-indicator active">
                            <div className="typing-dot"></div><div className="typing-dot"></div><div className="typing-dot"></div>
                        </div>
                    )}
                </div>

                <div className="chat-input-container">
                    <input
                        type="text"
                        className="chat-input"
                        placeholder="Ask about us..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    />
                    <button className="send-btn" onClick={sendMessage}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    )
}