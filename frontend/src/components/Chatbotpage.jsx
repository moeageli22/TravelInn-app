import { useState, useRef, useEffect } from 'react'
import Navbar from '../components/Navbar'
import './ChatbotPage.css'

const Chatbotpage = () => {
    const [messages, setMessages] = useState([
        {
            type: 'incoming',
            text: 'Welcome to Travelinn AI Assistant! 🌟\n\nI\'m here to help you plan the perfect trip. I can assist with:\n\n🏨 Finding hotels and accommodations\n🌍 Destination recommendations\n✈️ Travel planning and tips\n👥 Group travel coordination\n📅 Booking assistance\n🎭 Local attractions and activities\n\nHow can I help you today?',
            timestamp: new Date()
        }
    ])
    const [inputValue, setInputValue] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const chatboxRef = useRef(null)
    const inputRef = useRef(null)

    useEffect(() => {
        if (chatboxRef.current) {
            chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight
        }
    }, [messages])

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus()
        }
    }, [])

    const generateBotResponse = (userMessage) => {
        const lowerMessage = userMessage.toLowerCase()

        if (lowerMessage.includes('hotel') || lowerMessage.includes('accommodation')) {
            return 'I can help you find the perfect hotel! 🏨\n\nWe have thousands of accommodations worldwide:\n• Budget-friendly options ($50-100/night)\n• Mid-range hotels ($100-200/night)\n• Luxury resorts ($200+/night)\n\nWhat\'s your destination and preferred dates?'
        }

        if (lowerMessage.includes('destination') || lowerMessage.includes('where')) {
            return 'Let me suggest some amazing destinations! 🌍\n\n**Beach Lovers:**\n🏝️ Bali, Indonesia - Tropical paradise\n🌊 Maldives - Crystal clear waters\n🏖️ Cancun, Mexico - Caribbean beauty\n\n**City Explorers:**\n🗼 Paris, France - City of lights\n🗾 Tokyo, Japan - Modern meets tradition\n🗽 New York, USA - The city that never sleeps\n\n**Adventure Seekers:**\n🏔️ Swiss Alps - Mountain paradise\n🦁 Kenya - Safari experience\n🌋 Iceland - Land of fire and ice\n\nWhat type of experience interests you?'
        }

        if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('budget')) {
            return 'Let\'s talk budget! 💰\n\nOur accommodations range from:\n\n**Budget** ($30-80/night)\n• Hostels and guesthouses\n• Budget hotels\n• Shared accommodations\n\n**Mid-Range** ($80-200/night)\n• 3-4 star hotels\n• Boutique stays\n• Apartments\n\n**Luxury** ($200+/night)\n• 5-star hotels\n• Resorts and villas\n• Premium experiences\n\nWhat\'s your budget range?'
        }

        if (lowerMessage.includes('group') || lowerMessage.includes('friends') || lowerMessage.includes('family')) {
            return 'Group travel is awesome! 👨‍👩‍👧‍👦\n\nOur Groups feature helps you:\n✓ Find travel companions\n✓ Split costs easily\n✓ Coordinate itineraries\n✓ Share accommodations\n✓ Create shared memories\n\nWould you like to:\n1. Join an existing group?\n2. Create your own group?\n3. Explore group packages?'
        }

        if (lowerMessage.includes('book') || lowerMessage.includes('reservation')) {
            return 'Ready to book? Great! 📅\n\nBooking process:\n1️⃣ Select your destination\n2️⃣ Choose dates\n3️⃣ Pick accommodation\n4️⃣ Review details\n5️⃣ Secure payment\n6️⃣ Instant confirmation!\n\nBenefits:\n✓ Best price guarantee\n✓ Free cancellation (24h)\n✓ Secure payment\n✓ 24/7 support\n\nWhat dates are you planning?'
        }

        if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
            return 'Hello! 👋 Welcome to Travelinn!\n\nI\'m your AI travel assistant, ready to help make your trip planning effortless and enjoyable.\n\nWhat can I help you with today?'
        }

        if (lowerMessage.includes('thank')) {
            return 'You\'re very welcome! 🙏\n\nI\'m always here to help with your travel needs. Is there anything else you\'d like to know about:\n• Hotels & accommodations\n• Destinations\n• Travel planning\n• Group travel\n• Booking process'
        }

        if (lowerMessage.includes('help')) {
            return 'I\'m here to help! 💁\n\n**My capabilities:**\n\n🏨 **Accommodations**\n• Search hotels worldwide\n• Compare prices\n• Read reviews\n• Book instantly\n\n🌍 **Destinations**\n• Recommend places\n• Provide travel tips\n• Suggest itineraries\n\n👥 **Group Travel**\n• Find travel buddies\n• Coordinate groups\n• Share expenses\n\n📅 **Planning**\n• Create itineraries\n• Budget planning\n• Travel tips\n\nWhat would you like help with?'
        }

        if (lowerMessage.includes('attraction') || lowerMessage.includes('things to do') || lowerMessage.includes('activities')) {
            return 'Looking for activities? 🎭\n\n**Popular categories:**\n\n🏛️ **Cultural**\n• Museums & galleries\n• Historical sites\n• Local markets\n\n🎢 **Adventure**\n• Theme parks\n• Water sports\n• Hiking trails\n\n🍽️ **Food & Dining**\n• Local cuisine\n• Fine dining\n• Food tours\n\n🎵 **Entertainment**\n• Live shows\n• Nightlife\n• Concerts\n\nWhich destination interests you?'
        }

        if (lowerMessage.includes('cancel') || lowerMessage.includes('refund')) {
            return 'Cancellation Policy 📋\n\n**Our flexible policy:**\n\n✓ **Free Cancellation**\n• Up to 24 hours before check-in\n• Full refund processed\n• No questions asked\n\n✓ **Modifications**\n• Change dates easily\n• Update guest details\n• Upgrade rooms\n\n✓ **Refund Process**\n• 3-5 business days\n• Original payment method\n• Email confirmation sent\n\nNeed help with a specific booking?'
        }

        if (lowerMessage.includes('contact') || lowerMessage.includes('support')) {
            return '24/7 Support Available! 📞\n\n**Contact us:**\n\n📧 **Email**\nsupport@travelinn.com\n\n💬 **Live Chat**\nRight here, anytime!\n\n📱 **Phone**\n+1 (800) TRAVEL-INN\n\n🕐 **Hours**\nWe\'re available 24/7!\n\nHow can I assist you right now?'
        }

        return 'I\'m here to help with your travel plans! 🧳\n\nCould you please provide more details? For example:\n• Where would you like to go?\n• When are you planning to travel?\n• What\'s your budget range?\n• How many people are traveling?\n\nThe more details you share, the better I can assist you!'
    }

    const handleSendMessage = async (e) => {
        e.preventDefault()

        if (!inputValue.trim()) return

        const userMessage = {
            type: 'outgoing',
            text: inputValue,
            timestamp: new Date()
        }

        setMessages(prev => [...prev, userMessage])
        setInputValue('')
        setIsTyping(true)

        setTimeout(() => {
            const botResponse = generateBotResponse(inputValue)
            const botMessage = {
                type: 'incoming',
                text: botResponse,
                timestamp: new Date()
            }

            setMessages(prev => [...prev, botMessage])
            setIsTyping(false)
        }, 1000 + Math.random() * 1000)
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage(e)
        }
    }

    const quickActions = [
        { icon: '🏨', text: 'Find Hotels', action: 'I want to find hotels' },
        { icon: '🌍', text: 'Popular Destinations', action: 'Show me popular destinations' },
        { icon: '👥', text: 'Group Travel', action: 'Tell me about group travel' },
        { icon: '💰', text: 'Budget Options', action: 'What are budget-friendly options?' },
        { icon: '🎭', text: 'Activities', action: 'What activities can I do?' },
        { icon: '📅', text: 'Book Now', action: 'I want to book a hotel' },
        { icon: '📞', text: 'Contact Support', action: 'How can I contact support?' },
        { icon: '❓', text: 'Help', action: 'I need help' }
    ]

    const handleQuickAction = (action) => {
        setInputValue(action)
        setTimeout(() => {
            const event = { preventDefault: () => {} }
            handleSendMessage(event)
        }, 100)
    }

    const formatTime = (date) => {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        })
    }

    return (
        <div className="chatbot-page">
            <Navbar />

            <div className="chatbot-page-container">
                <div className="chatbot-page-content">
                    {/* Header */}
                    <div className="chatbot-page-header">
                        <div className="header-content">
                            <div className="bot-avatar-large">
                                <span className="avatar-icon">🤖</span>
                            </div>
                            <div>
                                <h1>Travel AI Assistant</h1>
                                <p className="header-subtitle">Your intelligent companion for seamless travel planning</p>
                                <div className="status-badge">
                                    <span className="status-dot"></span>
                                    <span>Online • Always Ready to Help</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="quick-actions-section">
                        <h3>Quick Actions</h3>
                        <div className="quick-actions-grid-page">
                            {quickActions.map((action, index) => (
                                <button
                                    key={index}
                                    className="quick-action-card"
                                    onClick={() => handleQuickAction(action.action)}
                                >
                                    <span className="action-icon-large">{action.icon}</span>
                                    <span className="action-text">{action.text}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div className="chat-area">
                        <ul className="chatbox-page" ref={chatboxRef}>
                            {messages.map((message, index) => (
                                <li key={index} className={`chat ${message.type}`}>
                                    {message.type === 'incoming' && (
                                        <div className="bot-icon-wrapper">
                                            <span className="bot-icon">🤖</span>
                                        </div>
                                    )}
                                    <div className="message-content">
                                        <p className="message-text">{message.text}</p>
                                        <span className="message-time">{formatTime(message.timestamp)}</span>
                                    </div>
                                </li>
                            ))}

                            {isTyping && (
                                <li className="chat incoming typing">
                                    <div className="bot-icon-wrapper">
                                        <span className="bot-icon">🤖</span>
                                    </div>
                                    <div className="message-content">
                                        <div className="typing-indicator">
                                            <span></span>
                                            <span></span>
                                            <span></span>
                                        </div>
                                    </div>
                                </li>
                            )}
                        </ul>

                        {/* Input Area */}
                        <div className="chat-input-page">
                            <form onSubmit={handleSendMessage}>
                <textarea
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message here... (Press Enter to send)"
                    required
                    rows="1"
                />
                                <button
                                    type="submit"
                                    className="send-btn-page"
                                    disabled={!inputValue.trim()}
                                >
                                    <span>➤</span>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Chatbotpage