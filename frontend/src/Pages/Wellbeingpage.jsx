import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import UserMenu from '../components/UserMenu'
import './Wellbeingpage.css'

// Background images for the slideshow (Blue themed - Ocean, Sky, Nature)
const backgroundImages = [
    'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1920&q=80', // Blue ocean waves
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80', // Mountain landscape blue sky
    'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1920&q=80', // Blue starry sky
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80', // Tropical beach blue water
    'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=1920&q=80', // Blue lake and mountains
]

export default function Wellbeingpage() {
    const navigate = useNavigate()
    const { user } = useAuth()
    const [currentSlide, setCurrentSlide] = useState(0)
    const [chatOpen, setChatOpen] = useState(false)
    const [soloTravelerEnabled, setSoloTravelerEnabled] = useState(false)
    const [messages, setMessages] = useState([
        {
            text: "Hello! I am your wellbeing assistant. I can help you with health tips, safety advice, and wellness recommendations during your travels. How can I support you today?",
            sender: 'ai',
            time: 'Just now'
        }
    ])
    const [inputValue, setInputValue] = useState('')
    const [showTyping, setShowTyping] = useState(false)
    const [visibleSections, setVisibleSections] = useState(new Set())
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [healthStats, setHealthStats] = useState({
        steps: 0,
        heartRate: 0,
        sleep: 0,
        hydration: 0
    })
    const [animateStats, setAnimateStats] = useState(false)

    const sectionRefs = useRef({})
    const chatMessagesRef = useRef(null)

    // Slideshow Logic - cycles through background images every 6 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % backgroundImages.length)
        }, 6000) // Change image every 6 seconds
        return () => clearInterval(interval)
    }, [])

    // Intersection Observer for scroll animations
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setVisibleSections((prev) => new Set([...prev, entry.target.dataset.section]))
                    }
                })
            },
            { threshold: 0.1 }
        )

        Object.values(sectionRefs.current).forEach((ref) => {
            if (ref) observer.observe(ref)
        })

        return () => observer.disconnect()
    }, [])

    // Animate health stats when visible
    useEffect(() => {
        if (visibleSections.has('health-stats') && !animateStats) {
            setAnimateStats(true)
            animateStatCounters()
        }
    }, [visibleSections, animateStats])

    // Auto-scroll chat messages
    useEffect(() => {
        if (chatMessagesRef.current) {
            chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight
        }
    }, [messages, showTyping])

    const animateStatCounters = () => {
        const targets = { steps: 8547, heartRate: 72, sleep: 7.5, hydration: 65 }
        const duration = 2000
        const steps = 60

        let currentStep = 0
        const interval = setInterval(() => {
            currentStep++
            const progress = currentStep / steps

            setHealthStats({
                steps: Math.floor(targets.steps * progress),
                heartRate: Math.floor(targets.heartRate * progress),
                sleep: (targets.sleep * progress).toFixed(1),
                hydration: Math.floor(targets.hydration * progress)
            })

            if (currentStep >= steps) clearInterval(interval)
        }, duration / steps)
    }

    // Enhanced Features Data
    const wellbeingFeatures = [
        {
            icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"></path></svg>,
            title: 'Health Monitoring',
            description: 'Connect your health apps to track wellness during your trip',
            color: '#ef4444'
        },
        {
            icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 20V10"></path><path d="M12 20V4"></path><path d="M6 20v-6"></path></svg>,
            title: 'Fitness Integration',
            description: 'Find gyms, running routes, and wellness activities nearby',
            color: '#f97316'
        },
        {
            icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>,
            title: 'Mental Wellbeing',
            description: 'Access meditation, relaxation resources, and quiet spaces',
            color: '#8b5cf6'
        },
        {
            icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>,
            title: 'Stay Connected',
            description: 'Regular check-ins for solo travelers to maintain social connection',
            color: '#3b82f6'
        },
        {
            icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>,
            title: 'Safety Tracking',
            description: 'Share your location with trusted contacts for peace of mind',
            color: '#10b981'
        },
        {
            icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>,
            title: 'Emergency Support',
            description: '24/7 access to emergency services and local healthcare information',
            color: '#dc2626'
        }
    ]

    const checkInSchedules = [
        { time: 'Morning', description: 'Start your day with a wellness check', icon: '🌅' },
        { time: 'Midday', description: 'Quick status update during activities', icon: '☀️' },
        { time: 'Evening', description: 'End-of-day reflection and safety confirmation', icon: '🌙' }
    ]

    const getAIResponse = (message) => {
        const lower = message.toLowerCase()

        if (lower.includes('health') || lower.includes('medical')) {
            return "I can help you with health-related information! Here's what I can assist with:\n\n• Finding nearby hospitals and clinics\n• Connecting your health tracking apps\n• Providing wellness tips for travelers\n• Emergency medical contacts\n\nWhat specific health information do you need?"
        }
        if (lower.includes('fitness') || lower.includes('gym') || lower.includes('exercise')) {
            return "Great choice to stay active! I can help you:\n\n• Find nearby gyms and fitness centers\n• Discover running and walking routes\n• Locate yoga studios and wellness centers\n• Plan outdoor activities\n\nWhich city are you currently in?"
        }
        if (lower.includes('meditation') || lower.includes('relax') || lower.includes('stress')) {
            return "Mental wellbeing is so important! Here are some resources:\n\n• Guided meditation sessions\n• Breathing exercises\n• Quiet spaces near you\n• Mindfulness activities\n• Local wellness retreats\n\nWould you like me to recommend some peaceful locations?"
        }
        if (lower.includes('emergency') || lower.includes('help') || lower.includes('urgent')) {
            return "For emergencies:\n\n• Local Emergency Number: 112 (EU) / 911 (US)\n• Hotel Security: Available 24/7\n• Embassy Contact: +44 20 7XXX XXXX\n• Medical Hotline: 116 117\n\nIf this is urgent, please call emergency services immediately. How else can I assist you?"
        }
        if (lower.includes('safety') || lower.includes('alone') || lower.includes('solo')) {
            return "Your safety is our priority! Here's how we support solo travelers:\n\n• Real-time location sharing with trusted contacts\n• Regular check-in reminders\n• 24/7 support hotline\n• Safe area recommendations\n• Local safety tips\n\nWould you like to enable solo traveler support?"
        }
        if (lower.includes('check in') || lower.includes('check-in')) {
            return "Check-in reminders help keep you safe!\n\nWe can set up:\n• Morning wellness checks\n• Midday activity updates\n• Evening safety confirmations\n\nYou can also share your itinerary with loved ones. Would you like to enable this feature?"
        }
        if (lower.includes('thank')) {
            return "You're very welcome! Your health and safety are our top priorities. I'm here 24/7 if you need anything. Stay safe and enjoy your travels!"
        }

        return "I'm here to help with your health and wellbeing needs! I can assist with:\n\n• Health monitoring and medical info\n• Fitness and wellness activities\n• Mental health resources\n• Safety and emergency support\n• Solo traveler check-ins\n\nWhat would you like to know more about?"
    }

    const sendMessage = () => {
        if (!inputValue.trim()) return

        const newMessage = {
            text: inputValue,
            sender: 'user',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
        setMessages(prev => [...prev, newMessage])
        setInputValue('')
        setShowTyping(true)

        setTimeout(() => {
            setShowTyping(false)
            const response = {
                text: getAIResponse(inputValue),
                sender: 'ai',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
            setMessages(prev => [...prev, response])
        }, 1500)
    }

    const sendQuickMessage = (text) => {
        const newMessage = {
            text,
            sender: 'user',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
        setMessages(prev => [...prev, newMessage])
        setShowTyping(true)

        setTimeout(() => {
            setShowTyping(false)
            const response = {
                text: getAIResponse(text),
                sender: 'ai',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
            setMessages(prev => [...prev, response])
        }, 1500)
    }

    return (
        <div className="wellbeing-page">
            {/* Background Slideshow */}
            <div className="background-slideshow">
                {backgroundImages.map((image, index) => (
                    <div
                        key={index}
                        className={`background-slide ${index === currentSlide ? 'active' : ''}`}
                        style={{ backgroundImage: `url(${image})` }}
                    />
                ))}
                <div className="background-overlay"></div>
            </div>

            {/* Navigation */}
            <nav>
                <div className="logo" onClick={() => navigate('/')}>Travelinn</div>

                {/* Hamburger Menu Button */}
                <button
                    className={`hamburger ${mobileMenuOpen ? 'active' : ''}`}
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                <ul className={`nav-links ${mobileMenuOpen ? 'mobile-active' : ''}`}>
                    <li><a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); setMobileMenuOpen(false); }}>Home</a></li>
                    <li><a href="/hotels" onClick={(e) => { e.preventDefault(); navigate('/hotels'); setMobileMenuOpen(false); }}>Hotels</a></li>
                    <li><a href="/wellbeing" onClick={(e) => { e.preventDefault(); navigate('/wellbeing'); setMobileMenuOpen(false); }} className="active">Wellbeing</a></li>
                    <li><a href="/groups" onClick={(e) => { e.preventDefault(); navigate('/groups'); setMobileMenuOpen(false); }}>Groups</a></li>
                    <li><a href="/about" onClick={(e) => { e.preventDefault(); navigate('/about'); setMobileMenuOpen(false); }}>About</a></li>
                </ul>
                {user ? (
                    <UserMenu />
                ) : (
                    <button className="sign-in-btn" onClick={() => navigate('/signin')}>Sign In</button>
                )}
            </nav>

            <div className="container">
                {/* Hero Section */}
                <section
                    className={`wellbeing-hero ${visibleSections.has('hero') ? 'visible' : ''}`}
                    ref={el => sectionRefs.current['hero'] = el}
                    data-section="hero"
                >
                    <div className="hero-backdrop"></div>
                    <h1>Your Health & Wellbeing Matters</h1>
                    <p>
                        Comprehensive health monitoring, fitness tracking, and wellness support
                        designed specifically for travelers. Stay healthy, stay safe, wherever you go.
                    </p>
                </section>

                {/* Health Stats Dashboard */}
                <section
                    className={`health-stats-section ${visibleSections.has('health-stats') ? 'visible' : ''}`}
                    ref={el => sectionRefs.current['health-stats'] = el}
                    data-section="health-stats"
                >
                    <h2>Today's Health Overview</h2>
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-icon steps-icon">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="8.5" cy="7" r="4"></circle>
                                    <polyline points="17 11 19 13 23 9"></polyline>
                                </svg>
                            </div>
                            <div className="stat-content">
                                <h3 className="stat-value">{healthStats.steps.toLocaleString()}</h3>
                                <p className="stat-label">Steps Today</p>
                                <div className="stat-progress">
                                    <div className="progress-bar" style={{ width: `${(healthStats.steps / 10000) * 100}%` }}></div>
                                </div>
                                <span className="stat-target">Goal: 10,000</span>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon heart-icon">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"></path>
                                </svg>
                            </div>
                            <div className="stat-content">
                                <h3 className="stat-value">{healthStats.heartRate}</h3>
                                <p className="stat-label">Heart Rate (BPM)</p>
                                <div className="stat-badge">Normal</div>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon sleep-icon">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                                </svg>
                            </div>
                            <div className="stat-content">
                                <h3 className="stat-value">{healthStats.sleep}h</h3>
                                <p className="stat-label">Sleep Duration</p>
                                <div className="stat-progress">
                                    <div className="progress-bar sleep-bar" style={{ width: `${(parseFloat(healthStats.sleep) / 8) * 100}%` }}></div>
                                </div>
                                <span className="stat-target">Goal: 8h</span>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon hydration-icon">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
                                </svg>
                            </div>
                            <div className="stat-content">
                                <h3 className="stat-value">{healthStats.hydration}%</h3>
                                <p className="stat-label">Hydration Level</p>
                                <div className="stat-progress">
                                    <div className="progress-bar hydration-bar" style={{ width: `${healthStats.hydration}%` }}></div>
                                </div>
                                <span className="stat-target">Goal: 100%</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Solo Traveler Section */}
                <section
                    className={`solo-traveler-section ${visibleSections.has('solo') ? 'visible' : ''}`}
                    ref={el => sectionRefs.current['solo'] = el}
                    data-section="solo"
                >
                    <div className="solo-traveler-card">
                        <div className="solo-traveler-content">
                            <h2>Solo Traveler Support</h2>
                            <p>
                                Traveling alone? Enable our comprehensive safety features including
                                real-time location sharing, scheduled check-ins, and 24/7 emergency support
                                to give you and your loved ones peace of mind.
                            </p>
                            <button
                                className={`enable-solo-btn ${soloTravelerEnabled ? 'enabled' : ''}`}
                                onClick={() => setSoloTravelerEnabled(!soloTravelerEnabled)}
                            >
                                {soloTravelerEnabled ? (
                                    <>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                        </svg>
                                        <span>Solo Mode Active</span>
                                    </>
                                ) : (
                                    <>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                                        </svg>
                                        <span>Enable Solo Mode</span>
                                    </>
                                )}
                            </button>
                        </div>
                        <div className="solo-traveler-image">
                            <img
                                src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800"
                                alt="Solo Traveler"
                            />
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section
                    className={`features-section ${visibleSections.has('features') ? 'visible' : ''}`}
                    ref={el => sectionRefs.current['features'] = el}
                    data-section="features"
                >
                    <h2>Complete Wellbeing Suite</h2>
                    <div className="features-grid">
                        {wellbeingFeatures.map((feature, idx) => (
                            <div key={idx} className="feature-card" style={{ '--feature-color': feature.color }}>
                                <div className="feature-icon" style={{ background: feature.color }}>
                                    {feature.icon}
                                </div>
                                <h3>{feature.title}</h3>
                                <p>{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Check-in Section */}
                <section
                    className={`checkin-section ${visibleSections.has('checkin') ? 'visible' : ''}`}
                    ref={el => sectionRefs.current['checkin'] = el}
                    data-section="checkin"
                >
                    <h2>Regular Check-in Schedule</h2>
                    <p className="checkin-subtitle">Stay connected with automated wellness checks throughout your day</p>
                    <div className="checkin-grid">
                        {checkInSchedules.map((schedule, idx) => (
                            <div key={idx} className="checkin-card">
                                <div className="checkin-icon">{schedule.icon}</div>
                                <div className="checkin-time">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <polyline points="12 6 12 12 16 14"></polyline>
                                    </svg>
                                    {schedule.time}
                                </div>
                                <p>{schedule.description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Emergency Contact Section */}
                <section
                    className={`emergency-section ${visibleSections.has('emergency') ? 'visible' : ''}`}
                    ref={el => sectionRefs.current['emergency'] = el}
                    data-section="emergency"
                >
                    <div className="emergency-card">
                        <div className="emergency-icon">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                            </svg>
                        </div>
                        <h3>24/7 Emergency Support</h3>
                        <p>Access emergency services, local healthcare, and support hotlines anytime you need assistance.</p>
                        <div className="emergency-contacts">
                            <div className="contact-item">
                                <span>Emergency Services:</span>
                                <strong>112 / 911</strong>
                            </div>
                            <div className="contact-item">
                                <span>Travelinn Support:</span>
                                <strong>+44 800 123 4567</strong>
                            </div>
                            <div className="contact-item">
                                <span>Medical Hotline:</span>
                                <strong>116 117</strong>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Health Tips Section */}
                <section
                    className={`tips-section ${visibleSections.has('tips') ? 'visible' : ''}`}
                    ref={el => sectionRefs.current['tips'] = el}
                    data-section="tips"
                >
                    <h2>Travel Health Tips</h2>
                    <div className="tips-grid">
                        {[
                            { num: 1, title: "Stay Hydrated", desc: "Drink plenty of water, especially during flights and in warm climates", icon: "💧" },
                            { num: 2, title: "Regular Exercise", desc: "Maintain your fitness routine with local gyms or outdoor activities", icon: "🏃" },
                            { num: 3, title: "Healthy Eating", desc: "Balance local cuisine with nutritious meals to maintain energy", icon: "🥗" },
                            { num: 4, title: "Quality Sleep", desc: "Adjust to local time zones and maintain a consistent sleep schedule", icon: "😴" },
                            { num: 5, title: "Mental Breaks", desc: "Take time for meditation, relaxation, and self-care activities", icon: "🧘" },
                            { num: 6, title: "Stay Connected", desc: "Regular contact with friends and family supports mental wellbeing", icon: "💬" }
                        ].map((tip, idx) => (
                            <div key={idx} className="tip-card">
                                <div className="tip-header">
                                    <div className="tip-number">{tip.num}</div>
                                    <span className="tip-icon">{tip.icon}</span>
                                </div>
                                <h4>{tip.title}</h4>
                                <p>{tip.desc}</p>
                            </div>
                        ))}
                    </div>
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
                        <h3>Wellbeing Assistant</h3>
                        <p>Health & Safety Support 24/7</p>
                    </div>
                    <button className="close-chat" onClick={() => setChatOpen(false)}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                <div className="chat-messages" ref={chatMessagesRef}>
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
                                <div className="message-content" style={{ whiteSpace: 'pre-line' }}>{msg.text}</div>
                                <div className="message-time">{msg.time}</div>
                            </div>
                        </div>
                    ))}
                    {showTyping && (
                        <div className="typing-indicator active">
                            <div className="typing-dot"></div>
                            <div className="typing-dot"></div>
                            <div className="typing-dot"></div>
                        </div>
                    )}
                </div>

                <div className="quick-actions">
                    <button className="quick-action-btn" onClick={() => sendQuickMessage('Health tips')}>
                        Health
                    </button>
                    <button className="quick-action-btn" onClick={() => sendQuickMessage('Find fitness centers')}>
                        Fitness
                    </button>
                    <button className="quick-action-btn" onClick={() => sendQuickMessage('Emergency help')}>
                        Emergency
                    </button>
                </div>

                <div className="chat-input-container">
                    <input
                        type="text"
                        className="chat-input"
                        placeholder="Ask about health or safety..."
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