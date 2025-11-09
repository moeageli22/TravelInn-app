import { useState, useRef, useEffect } from 'react'
import './Chatbot.css'

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState([
        {
            type: 'incoming',
            text: 'Hi there! 👋 I\'m your AI travel assistant. How can I help you plan your perfect trip today?',
            timestamp: new Date()
        }
    ])
    const [inputValue, setInputValue] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const chatboxRef = useRef(null)
    const inputRef = useRef(null)

    // Scroll to bottom when new messages arrive
    useEffect(() => {
        if (chatboxRef.current) {
            chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight
        }
    }, [messages])

    // Focus input when chatbot opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus()
        }
    }, [isOpen])

    const toggleChatbot = () => {
        setIsOpen(!isOpen)
    }

    const generateBotResponse = (userMessage) => {
        const lowerMessage = userMessage.toLowerCase()

        // Travel-related responses
        if (lowerMessage.includes('hotel') || lowerMessage.includes('accommodation')) {
            return 'I can help you find the perfect hotel! 🏨 We have a wide range of accommodations from budget-friendly to luxury resorts. What\'s your destination and travel dates?'
        }

        if (lowerMessage.includes('destination') || lowerMessage.includes('where')) {
            return 'Great question! 🌍 Popular destinations include:\n• Bali, Indonesia 🏝️\n• Paris, France 🗼\n• Tokyo, Japan 🗾\n• New York, USA 🗽\n• Dubai, UAE 🕌\n\nWhat kind of experience are you looking for? Beach, city, adventure, or cultural?'
        }

        if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('budget')) {
            return 'I understand budget is important! 💰 Our hotels range from $50-500+ per night. What\'s your budget range, and I\'ll find the best options for you?'
        }

        if (lowerMessage.includes('group') || lowerMessage.includes('friends') || lowerMessage.includes('family')) {
            return 'Traveling with others? Perfect! 👨‍👩‍👧‍👦 Check out our Groups section where you can:\n• Find travel buddies\n• Plan group trips\n• Share expenses\n• Create memories together!\n\nWould you like to explore group travel options?'
        }

        if (lowerMessage.includes('book') || lowerMessage.includes('reservation')) {
            return 'Ready to book? Excellent! 📅 I can help you:\n1. Search available hotels\n2. Compare prices\n3. Check reviews\n4. Make a reservation\n\nWhat dates are you planning to travel?'
        }

        if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
            return 'Hello! 😊 Welcome to Travelinn! I\'m here to make your travel planning effortless. Are you looking for hotels, travel tips, or group travel options?'
        }

        if (lowerMessage.includes('thank')) {
            return 'You\'re very welcome! 🙏 Is there anything else I can help you with for your trip?'
        }

        if (lowerMessage.includes('help')) {
            return 'I\'m here to help! 💁 I can assist you with:\n• Finding hotels & accommodations\n• Destination recommendations\n• Travel planning tips\n• Group travel options\n• Booking assistance\n• Local attractions\n\nWhat would you like to know?'
        }

        if (lowerMessage.includes('attraction') || lowerMessage.includes('things to do') || lowerMessage.includes('activities')) {
            return 'Looking for things to do? 🎭 I can recommend:\n• Tourist attractions\n• Local experiences\n• Adventure activities\n• Cultural sites\n• Restaurants & dining\n\nWhich destination are you visiting?'
        }

        if (lowerMessage.includes('cancel') || lowerMessage.includes('refund')) {
            return 'Need help with cancellations? 📋 Our flexible booking policy includes:\n• Free cancellation up to 24 hours before check-in\n• Full refund for eligible bookings\n• Easy modification process\n\nWould you like me to check your booking details?'
        }

        // Default response
        return 'I\'m here to help with your travel plans! 🧳 Could you please provide more details about:\n• Your destination\n• Travel dates\n• Budget range\n• Number of travelers\n\nThis will help me assist you better!'
    }

    const handleSendMessage = async (e) => {
        e.preventDefault()

        if (!inputValue.trim()) return

        // Add user message
        const userMessage = {
            type: 'outgoing',
            text: inputValue,
            timestamp: new Date()
        }

        setMessages(prev => [...prev, userMessage])
        setInputValue('')
        setIsTyping(true)

        // Simulate AI thinking delay
        setTimeout(() => {
            const botResponse = generateBotResponse(inputValue)
            const botMessage = {
                type: 'incoming',
                text: botResponse,
                timestamp: new Date()
            }

            setMessages(prev => [...prev, botMessage])
            setIsTyping(false)
        }, 1000 + Math.random() * 1000) // Random delay between 1-2 seconds
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage(e)
        }
    }

    const quickActions = [
        { icon: '🏨', text: 'Find Hotels', action: 'I want to find hotels' },
        { icon: '🌍', text: 'Destinations', action: 'Show me popular destinations' },
        { icon: '👥', text: 'Group Travel', action: 'Tell me about group travel' },
        { icon: '💰', text: 'Budget Options', action: 'What are budget-friendly options?' }
    ]

    const handleQuickAction = (action) => {
        setInputValue(action)
        // Auto-send after a brief delay
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
        <>
            {/* Chatbot Toggle Button */}
            <button
                className={`chatbot-toggler ${isOpen ? 'active' : ''}`}
                onClick={toggleChatbot}
                aria-label="Toggle chatbot"
            >
        <span className="material-symbols-rounded">
          {isOpen ? '✕' : '💬'}
        </span>
            </button>

            {/* Chatbot Container */}
            <div className={`chatbot ${isOpen ? 'show' : ''}`}>
                {/* Chatbot Header */}
                <header className="chatbot-header">
                    <div className="header-content">
                        <div className="bot-avatar">
                            <span className="avatar-icon">🤖</span>
                            <span className="status-indicator"></span>
                        </div>
                        <div className="header-text">
                            <h2>Travel Assistant</h2>
                            <p>Online • Always here to help</p>
                        </div>
                    </div>
                    <button
                        className="close-btn"
                        onClick={toggleChatbot}
                        aria-label="Close chatbot"
                    >
                        ✕
                    </button>
                </header>

                {/* Quick Actions */}
                {messages.length === 1 && (
                    <div className="quick-actions">
                        <p className="quick-actions-title">Quick Actions:</p>
                        <div className="quick-actions-grid">
                            {quickActions.map((action, index) => (
                                <button
                                    key={index}
                                    className="quick-action-btn"
                                    onClick={() => handleQuickAction(action.action)}
                                >
                                    <span className="action-icon">{action.icon}</span>
                                    <span className="action-text">{action.text}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Chat Messages */}
                <ul className="chatbox" ref={chatboxRef}>
                    {messages.map((message, index) => (
                        <li key={index} className={`chat ${message.type}`}>
                            {message.type === 'incoming' && (
                                <span className="material-symbols-outlined bot-icon">🤖</span>
                            )}
                            <div className="message-content">
                                <p className="message-text">{message.text}</p>
                                <span className="message-time">{formatTime(message.timestamp)}</span>
                            </div>
                        </li>
                    ))}

                    {isTyping && (
                        <li className="chat incoming typing">
                            <span className="material-symbols-outlined bot-icon">🤖</span>
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

                {/* Chat Input */}
                <div className="chat-input">
                    <form onSubmit={handleSendMessage}>
            <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message here..."
                required
                rows="1"
            />
                        <button
                            type="submit"
                            className="send-btn"
                            disabled={!inputValue.trim()}
                            aria-label="Send message"
                        >
                            <span className="material-symbols-rounded">➤</span>
                        </button>
                    </form>
                </div>

                {/* Powered By */}
                <div className="chatbot-footer">
                    <p>Powered by Travelinn AI</p>
                </div>
            </div>
        </>
    )
}

export default Chatbot