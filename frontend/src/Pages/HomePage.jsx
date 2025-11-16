import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './HomePage.css'

const backgroundImages = [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920',
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920',
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1920'
]

export default function HomePage() {
    const navigate = useNavigate()
    const [currentSlide, setCurrentSlide] = useState(0)
    const [chatOpen, setChatOpen] = useState(false)
    const [messages, setMessages] = useState([
        { text: "Hello! 👋 I'm your AI travel assistant. I can help you find perfect hotels, plan trips, and answer any travel questions. How can I assist you today?", sender: 'ai', time: 'Just now' }
    ])
    const [inputValue, setInputValue] = useState('')
    const [showTyping, setShowTyping] = useState(false)

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % backgroundImages.length)
        }, 3000)
        return () => clearInterval(interval)
    }, [])

    const getAIResponse = (message) => {
        const lower = message.toLowerCase()
        if (lower.includes('hotel') || lower.includes('accommodation')) {
            return "I'd be happy to help you find hotels! 🏨 We have amazing accommodations worldwide. Which destination are you interested in? I can show you options with great amenities, reviews, and competitive prices."
        } else if (lower.includes('paris')) {
            return "Paris is magnificent! 🗼 We have wonderful hotels near the Eiffel Tower, Louvre, and Champs-Élysées. Would you like to see luxury options or budget-friendly stays? I can also recommend the best neighborhoods for your trip!"
        } else if (lower.includes('destination') || lower.includes('where')) {
            return "Great question! ✈️ Popular destinations right now include Paris, Tokyo, Dubai, London, and Bali. Each offers unique experiences - from cultural landmarks to tropical beaches. What type of experience are you looking for?"
        } else if (lower.includes('tip') || lower.includes('advice')) {
            return "Here are my top travel tips: 💡<br/>1. Book accommodations in advance for better rates<br/>2. Join our travel groups to connect with fellow travelers<br/>3. Use our concierge service for personalized recommendations<br/>4. Check visa requirements early<br/>5. Pack light and smart!"
        } else if (lower.includes('thank')) {
            return "You're very welcome! 😊 I'm here anytime you need help planning your perfect trip. Feel free to ask me anything about hotels, destinations, or travel tips!"
        }
        return "I'm here to help with all your travel needs! 🌍 I can assist you with finding hotels, suggesting destinations, providing travel tips, connecting you with our community, and more. What would you like to know?"
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
        <div className="home-page">
            <nav>
                <div className="logo">Travelinn</div>
                <ul className="nav-links">
                    <li><a href="#home">Home</a></li>
                    <li><a href="#hotels" onClick={(e) => { e.preventDefault(); navigate('/hotels') }}>Hotels</a></li>
                    <li><a href="#destinations">Wellbeing</a></li>
                    <li><a href="#groups">Groups</a></li>
                    <li><a href="#about">About</a></li>
                </ul>
                <div className="nav-right">
                    <svg className="settings-icon" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                        <circle cx="12" cy="12" r="3"/>
                        <path d="M12 1v6m0 6v6m10-7h-6m-6 0H4m15.364 6.364l-4.243-4.243m-6.364 0l-4.243 4.243m16.485-12.728l-4.243 4.243m-6.364 0L4.222 4.222"/>
                    </svg>
                    <button className="sign-in-btn" onClick={() => navigate('/signin')}>Sign In</button>
                </div>
            </nav>

            <section className="hero-section">
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
                    <h1 className="hero-title">Discover Your Next Adventure</h1>
                    <p className="hero-subtitle">
                        Experience world-class accommodations, connect with fellow travelers, and create unforgettable experiences around the world.
                    </p>
                    <button className="explore-btn" onClick={() => navigate('/hotels')}>
                        EXPLORE HOTELS
                    </button>
                </div>
            </section>

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
                        <h3>Travelinn AI Assistant</h3>
                        <p>Here to help plan your perfect trip</p>
                    </div>
                    <button className="close-chat" onClick={() => setChatOpen(false)}>×</button>
                </div>

                <div className="chat-messages">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`chat-message ${msg.sender}`}>
                            <div className="message-avatar">{msg.sender === 'user' ? 'You' : 'AI'}</div>
                            <div>
                                <div className="message-content" dangerouslySetInnerHTML={{ __html: msg.text }} />
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
                    <button className="quick-action-btn" onClick={() => sendQuickMessage('Find hotels in Paris')}>
                        🏨 Find Hotels
                    </button>
                    <button className="quick-action-btn" onClick={() => sendQuickMessage('Best travel destinations')}>
                        ✈️ Destinations
                    </button>
                    <button className="quick-action-btn" onClick={() => sendQuickMessage('Travel tips')}>
                        💡 Travel Tips
                    </button>
                </div>

                <div className="chat-input-container">
                    <input
                        type="text"
                        className="chat-input"
                        placeholder="Ask me anything about travel..."
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