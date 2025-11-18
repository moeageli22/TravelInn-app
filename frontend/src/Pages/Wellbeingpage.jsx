import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Wellbeingpage.css'

export default function Wellbeingpage() {
    const navigate = useNavigate()
    const [chatOpen, setChatOpen] = useState(false)
    const [soloTravelerEnabled, setSoloTravelerEnabled] = useState(false)
    const [messages, setMessages] = useState([
        {
            text: "Hello! 👋 I'm your wellbeing assistant. I can help you with health tips, safety advice, and wellness recommendations during your travels. How can I support you today?",
            sender: 'ai',
            time: 'Just now'
        }
    ])
    const [inputValue, setInputValue] = useState('')
    const [showTyping, setShowTyping] = useState(false)

    const wellbeingFeatures = [
        {
            icon: '❤️',
            title: 'Health Monitoring',
            description: 'Connect your health apps to track wellness during your trip',
            color: '#ef4444'
        },
        {
            icon: '🏃',
            title: 'Fitness Integration',
            description: 'Find gyms, running routes, and wellness activities nearby',
            color: '#f97316'
        },
        {
            icon: '🧘',
            title: 'Mental Wellbeing',
            description: 'Access meditation, relaxation resources, and quiet spaces',
            color: '#8b5cf6'
        },
        {
            icon: '👥',
            title: 'Stay Connected',
            description: 'Regular check-ins for solo travelers to maintain social connection',
            color: '#3b82f6'
        },
        {
            icon: '🛡️',
            title: 'Safety Tracking',
            description: 'Share your location with trusted contacts for peace of mind',
            color: '#10b981'
        },
        {
            icon: '📞',
            title: 'Emergency Support',
            description: '24/7 access to emergency services and local healthcare information',
            color: '#dc2626'
        }
    ]

    const checkInSchedules = [
        { time: 'Morning', description: 'Start your day with a wellness check' },
        { time: 'Midday', description: 'Quick status update during activities' },
        { time: 'Evening', description: 'End-of-day reflection and safety confirmation' }
    ]

    const getAIResponse = (message) => {
        const lower = message.toLowerCase()

        if (lower.includes('health') || lower.includes('medical')) {
            return "I can help you with health-related information! 🏥 Here's what I can assist with:\n\n• Finding nearby hospitals and clinics\n• Connecting your health tracking apps\n• Providing wellness tips for travelers\n• Emergency medical contacts\n\nWhat specific health information do you need?"
        }

        if (lower.includes('fitness') || lower.includes('gym') || lower.includes('exercise')) {
            return "Great choice to stay active! 🏃 I can help you:\n\n• Find nearby gyms and fitness centers\n• Discover running and walking routes\n• Locate yoga studios and wellness centers\n• Plan outdoor activities\n\nWhich city are you currently in?"
        }

        if (lower.includes('meditation') || lower.includes('relax') || lower.includes('stress')) {
            return "Mental wellbeing is so important! 🧘 Here are some resources:\n\n• Guided meditation sessions\n• Breathing exercises\n• Quiet spaces near you\n• Mindfulness activities\n• Local wellness retreats\n\nWould you like me to recommend some peaceful locations?"
        }

        if (lower.includes('emergency') || lower.includes('help') || lower.includes('urgent')) {
            return "🚨 For emergencies:\n\n• Local Emergency Number: 112 (EU) / 911 (US)\n• Hotel Security: Available 24/7\n• Embassy Contact: +44 20 7XXX XXXX\n• Medical Hotline: 116 117\n\nIf this is urgent, please call emergency services immediately. How else can I assist you?"
        }

        if (lower.includes('safety') || lower.includes('alone') || lower.includes('solo')) {
            return "Your safety is our priority! 🛡️ Here's how we support solo travelers:\n\n• Real-time location sharing with trusted contacts\n• Regular check-in reminders\n• 24/7 support hotline\n• Safe area recommendations\n• Local safety tips\n\nWould you like to enable solo traveler support?"
        }

        if (lower.includes('check in') || lower.includes('check-in')) {
            return "Check-in reminders help keep you safe! ✅\n\nWe can set up:\n• Morning wellness checks\n• Midday activity updates\n• Evening safety confirmations\n\nYou can also share your itinerary with loved ones. Would you like to enable this feature?"
        }

        if (lower.includes('thank')) {
            return "You're very welcome! 😊 Your health and safety are our top priorities. I'm here 24/7 if you need anything. Stay safe and enjoy your travels!"
        }

        return "I'm here to help with your health and wellbeing needs! 🌟 I can assist with:\n\n• Health monitoring and medical info\n• Fitness and wellness activities\n• Mental health resources\n• Safety and emergency support\n• Solo traveler check-ins\n\nWhat would you like to know more about?"
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

    const handleEnableSoloSupport = () => {
        setSoloTravelerEnabled(!soloTravelerEnabled)
        if (!soloTravelerEnabled) {
            alert('✅ Solo Traveler Support Enabled!\n\nYou will now receive:\n• Regular check-in reminders\n• Safety notifications\n• Emergency contact access\n• Location sharing options\n\nStay safe on your journey!')
        }
    }

    return (
        <div className="wellbeing-page">
            <nav>
                <div className="logo" onClick={() => navigate('/')}>Travelinn</div>
                <ul className="nav-links">
                    <li><a href="/" onClick={(e) => { e.preventDefault(); navigate('/') }}>Home</a></li>
                    <li><a href="/hotels" onClick={(e) => { e.preventDefault(); navigate('/hotels') }}>Hotels</a></li>
                    <li><a href="/wellbeing" className="active">Wellbeing</a></li>
                    <li><a href="#groups" onClick={(e) => { e.preventDefault(); navigate('/groups') }}>Groups</a></li>
                    <li><a href="#about">About</a></li>
                </ul>
                <button className="sign-in-btn" onClick={() => navigate('/signin')}>Sign In</button>
            </nav>

            <div className="container">
                {/* Hero Section */}
                <div className="wellbeing-hero">
                    <div className="hero-backdrop"></div>
                    <h1>Health & Wellbeing Support</h1>
                    <p>Your health and safety matter. Stay connected, supported, and secure throughout your journey.</p>
                </div>

                {/* Solo Traveler Section */}
                <div className="solo-traveler-section">
                    <div className="solo-traveler-card">
                        <div className="solo-traveler-content">
                            <h2>Traveling Alone?</h2>
                            <p>Our solo traveler support system helps you stay connected and safe. Set up check-in reminders, share your itinerary with loved ones, and access local support networks.</p>
                            <button
                                className={`enable-solo-btn ${soloTravelerEnabled ? 'enabled' : ''}`}
                                onClick={handleEnableSoloSupport}
                            >
                                {soloTravelerEnabled ? (
                                    <>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <polyline points="20 6 9 17 4 12"/>
                                        </svg>
                                        Solo Support Enabled
                                    </>
                                ) : (
                                    <>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                                        </svg>
                                        Enable Solo Traveler Support
                                    </>
                                )}
                            </button>
                        </div>
                        <div className="solo-traveler-image">
                            <img src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800" alt="Solo Traveler" />
                        </div>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="features-section">
                    <h2>Comprehensive Wellbeing Features</h2>
                    <div className="features-grid">
                        {wellbeingFeatures.map((feature, idx) => (
                            <div key={idx} className="feature-card" style={{ borderColor: `${feature.color}40` }}>
                                <div className="feature-icon" style={{ background: `${feature.color}20`, color: feature.color }}>
                                    <span>{feature.icon}</span>
                                </div>
                                <h3>{feature.title}</h3>
                                <p>{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Check-in Schedule */}
                <div className="checkin-section">
                    <h2>Regular Check-in Schedule</h2>
                    <p className="checkin-subtitle">Stay connected with automated wellness checks throughout the day</p>
                    <div className="checkin-grid">
                        {checkInSchedules.map((schedule, idx) => (
                            <div key={idx} className="checkin-card">
                                <div className="checkin-time">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10"/>
                                        <polyline points="12 6 12 12 16 14"/>
                                    </svg>
                                    <span>{schedule.time}</span>
                                </div>
                                <p>{schedule.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Emergency Contact Section */}
                <div className="emergency-section">
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
                </div>

                {/* Health Tips Section */}
                <div className="tips-section">
                    <h2>Travel Health Tips</h2>
                    <div className="tips-grid">
                        <div className="tip-card">
                            <div className="tip-number">1</div>
                            <h4>Stay Hydrated</h4>
                            <p>Drink plenty of water, especially during flights and in warm climates</p>
                        </div>
                        <div className="tip-card">
                            <div className="tip-number">2</div>
                            <h4>Regular Exercise</h4>
                            <p>Maintain your fitness routine with local gyms or outdoor activities</p>
                        </div>
                        <div className="tip-card">
                            <div className="tip-number">3</div>
                            <h4>Healthy Eating</h4>
                            <p>Balance local cuisine with nutritious meals to maintain energy</p>
                        </div>
                        <div className="tip-card">
                            <div className="tip-number">4</div>
                            <h4>Quality Sleep</h4>
                            <p>Adjust to local time zones and maintain a consistent sleep schedule</p>
                        </div>
                        <div className="tip-card">
                            <div className="tip-number">5</div>
                            <h4>Mental Breaks</h4>
                            <p>Take time for meditation, relaxation, and self-care activities</p>
                        </div>
                        <div className="tip-card">
                            <div className="tip-number">6</div>
                            <h4>Stay Connected</h4>
                            <p>Regular contact with friends and family supports mental wellbeing</p>
                        </div>
                    </div>
                </div>
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
                    <button className="close-chat" onClick={() => setChatOpen(false)}>×</button>
                </div>

                <div className="chat-messages">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`chat-message ${msg.sender}`}>
                            <div className="message-avatar">{msg.sender === 'user' ? 'You' : 'AI'}</div>
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
                        ❤️ Health
                    </button>
                    <button className="quick-action-btn" onClick={() => sendQuickMessage('Find fitness centers')}>
                        🏃 Fitness
                    </button>
                    <button className="quick-action-btn" onClick={() => sendQuickMessage('Emergency help')}>
                        🚨 Emergency
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