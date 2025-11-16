import { useState, useEffect, useRef } from 'react'
import './EnhancedChatbot.css'

export default function EnhancedChatbot({ isOpen, onClose }) {
    const [messages, setMessages] = useState([
        {
            text: "Hello! 👋 I'm your AI travel assistant. I can help you find perfect hotels, plan trips, and answer any travel questions. How can I assist you today?",
            sender: 'ai',
            time: 'Just now',
            likes: 0,
            dislikes: 0,
            userReaction: null
        }
    ])
    const [inputValue, setInputValue] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const [streamingMessage, setStreamingMessage] = useState('')
    const [isStreaming, setIsStreaming] = useState(false)
    const messagesEndRef = useRef(null)
    const chatMessagesRef = useRef(null)

    // Auto-scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages, streamingMessage])

    // Contextual prompts after inactivity
    useEffect(() => {
        let inactivityTimer

        if (isOpen && messages.length > 0 && !isStreaming) {
            const lastMessage = messages[messages.length - 1]

            if (lastMessage.sender === 'ai') {
                inactivityTimer = setTimeout(() => {
                    const contextualPrompts = [
                        "Need help finding a hotel? Just tell me where you'd like to go! 🏨",
                        "Planning a trip? I can help you with recommendations! ✈️",
                        "Looking to book accommodation? I'm here to help! 🌍",
                        "Want to explore destinations? Let me know what you're interested in! 🗺️",
                        "Curious about travel tips? Feel free to ask me anything! 💡"
                    ]

                    const randomPrompt = contextualPrompts[Math.floor(Math.random() * contextualPrompts.length)]

                    streamResponse(randomPrompt)
                }, 20000) // 20 seconds
            }
        }

        return () => clearTimeout(inactivityTimer)
    }, [isOpen, messages, isStreaming])

    // Word-by-word streaming animation
    const streamResponse = async (fullResponse) => {
        setIsStreaming(true)
        setIsTyping(true)
        setStreamingMessage('')

        // Split response into words
        const words = fullResponse.split(' ')
        let currentText = ''

        // Stream each word with delay
        for (let i = 0; i < words.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 100)) // 100ms delay between words
            currentText += (i > 0 ? ' ' : '') + words[i]
            setStreamingMessage(currentText)
        }

        // After streaming complete, add to messages
        setIsTyping(false)
        setIsStreaming(false)

        const newMessage = {
            text: fullResponse,
            sender: 'ai',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            likes: 0,
            dislikes: 0,
            userReaction: null
        }

        setMessages(prev => [...prev, newMessage])
        setStreamingMessage('')
    }

    const getAIResponse = (message) => {
        const lower = message.toLowerCase()

        if (lower.includes('book') || lower.includes('reserve') || lower.includes('reservation')) {
            return "I'd love to help you with a booking! 📅 To get started:\n\n1️⃣ Which destination are you interested in?\n2️⃣ What are your check-in and check-out dates?\n3️⃣ How many guests will be staying?\n\nYou can also browse our hotels page and I'll guide you through the booking process!"
        }

        if (lower.includes('hotel') || lower.includes('accommodation')) {
            return "I'd be happy to help you find hotels! 🏨 We have amazing accommodations worldwide. Which destination are you interested in? I can show you options with great amenities, reviews, and competitive prices.\n\n💡 Popular destinations: Dubai, Paris, Tokyo, Maldives, New York"
        }

        if (lower.includes('paris')) {
            return "Paris is magnificent! 🗼 We have wonderful hotels near the Eiffel Tower, Louvre, and Champs-Élysées. Would you like to see luxury options or budget-friendly stays? I can also recommend the best neighborhoods for your trip!\n\nTypical prices range from €150-€500 per night."
        }

        if (lower.includes('destination') || lower.includes('where')) {
            return "Great question! ✈️ Popular destinations right now include:\n\n🏙️ Dubai - Luxury & innovation\n🗼 Paris - Romance & culture\n🗾 Tokyo - Modern meets traditional\n🏝️ Maldives - Tropical paradise\n🗽 New York - The city that never sleeps\n\nWhat type of experience are you looking for?"
        }

        if (lower.includes('price') || lower.includes('cost') || lower.includes('budget')) {
            return "Let me help you find something within your budget! 💰\n\nOur hotels range from $80/night (budget-friendly) to $2000+/night (ultra-luxury). What's your budget range? I'll find the perfect match for you!"
        }

        if (lower.includes('tip') || lower.includes('advice')) {
            return "Here are my top travel tips: 💡\n\n1️⃣ Book accommodations 2-3 months in advance for better rates\n2️⃣ Join our travel groups to connect with fellow travelers\n3️⃣ Use our concierge service for personalized recommendations\n4️⃣ Check visa requirements early\n5️⃣ Pack light and smart!\n\nNeed more specific advice?"
        }

        if (lower.includes('thank')) {
            return "You're very welcome! 😊 I'm here anytime you need help planning your perfect trip. Feel free to ask me anything about hotels, destinations, or travel tips!"
        }

        if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
            return "Hello there! 👋 Welcome to Travelinn! I'm your AI travel assistant. I can help you:\n\n🏨 Find and book hotels\n✈️ Discover destinations\n💡 Get travel tips\n🌟 Plan your perfect trip\n\nWhat would you like to explore today?"
        }

        return "I'm here to help with all your travel needs! 🌍 I can assist you with:\n\n• Finding and booking hotels\n• Suggesting destinations\n• Providing travel tips\n• Answering questions about accommodations\n• Connecting you with our community\n\nWhat would you like to know?"
    }

    const sendMessage = () => {
        if (!inputValue.trim() || isStreaming) return

        const newMessage = {
            text: inputValue,
            sender: 'user',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            likes: 0,
            dislikes: 0,
            userReaction: null
        }

        setMessages(prev => [...prev, newMessage])
        setInputValue('')

        // Get AI response and stream it
        const response = getAIResponse(inputValue)
        setTimeout(() => {
            streamResponse(response)
        }, 500)
    }

    const sendQuickMessage = (text) => {
        if (isStreaming) return

        const newMessage = {
            text,
            sender: 'user',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            likes: 0,
            dislikes: 0,
            userReaction: null
        }

        setMessages(prev => [...prev, newMessage])

        const response = getAIResponse(text)
        setTimeout(() => {
            streamResponse(response)
        }, 500)
    }

    const handleReaction = (messageIndex, reaction) => {
        setMessages(prev => prev.map((msg, idx) => {
            if (idx === messageIndex && msg.sender === 'ai') {
                const currentReaction = msg.userReaction

                // Toggle reaction
                if (currentReaction === reaction) {
                    // Remove reaction
                    return {
                        ...msg,
                        [reaction]: msg[reaction] - 1,
                        userReaction: null
                    }
                } else {
                    // Add new reaction, remove old if exists
                    const updates = { ...msg }
                    if (currentReaction) {
                        updates[currentReaction] -= 1
                    }
                    updates[reaction] += 1
                    updates.userReaction = reaction
                    return updates
                }
            }
            return msg
        }))
    }

    const formatMessageText = (text) => {
        // Convert newlines to <br/>
        return text.split('\n').map((line, i) => (
            <span key={i}>
                {line}
                {i < text.split('\n').length - 1 && <br />}
            </span>
        ))
    }

    if (!isOpen) return null

    return (
        <div className="enhanced-chatbot">
            <div className="chat-header">
                <div className="header-info">
                    <div className="bot-avatar">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9c.83 0 1.5-.67 1.5-1.5S7.83 8 7 8s-1.5.67-1.5 1.5S6.17 11 7 11zm10 0c.83 0 1.5-.67 1.5-1.5S17.83 8 17 8s-1.5.67-1.5 1.5.67 1.5 1.5 1.5zm-5 4c2.33 0 4.32 1.45 5.12 3.5H6.88c.8-2.05 2.79-3.5 5.12-3.5z"/>
                        </svg>
                    </div>
                    <div>
                        <h3>Travelinn AI Assistant</h3>
                        <p className="status">
                            <span className="status-dot"></span>
                            Online • Instant replies
                        </p>
                    </div>
                </div>
                <button className="close-chat" onClick={onClose}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                </button>
            </div>

            <div className="chat-messages" ref={chatMessagesRef}>
                {messages.map((msg, idx) => (
                    <div key={idx} className={`chat-message ${msg.sender}`}>
                        <div className="message-avatar">
                            {msg.sender === 'user' ? (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                                </svg>
                            ) : (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9c.83 0 1.5-.67 1.5-1.5S7.83 8 7 8s-1.5.67-1.5 1.5S6.17 11 7 11zm10 0c.83 0 1.5-.67 1.5-1.5S17.83 8 17 8s-1.5.67-1.5 1.5.67 1.5 1.5 1.5z"/>
                                </svg>
                            )}
                        </div>
                        <div className="message-wrapper">
                            <div className="message-content">
                                {formatMessageText(msg.text)}
                            </div>
                            <div className="message-footer">
                                <span className="message-time">{msg.time}</span>
                                {msg.sender === 'ai' && (
                                    <div className="message-reactions">
                                        <button
                                            className={`reaction-btn ${msg.userReaction === 'likes' ? 'active' : ''}`}
                                            onClick={() => handleReaction(idx, 'likes')}
                                            title="Helpful"
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
                                            </svg>
                                            {msg.likes > 0 && <span>{msg.likes}</span>}
                                        </button>
                                        <button
                                            className={`reaction-btn ${msg.userReaction === 'dislikes' ? 'active' : ''}`}
                                            onClick={() => handleReaction(idx, 'dislikes')}
                                            title="Not helpful"
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"/>
                                            </svg>
                                            {msg.dislikes > 0 && <span>{msg.dislikes}</span>}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {/* Streaming message */}
                {isStreaming && (
                    <div className="chat-message ai">
                        <div className="message-avatar">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9c.83 0 1.5-.67 1.5-1.5S7.83 8 7 8s-1.5.67-1.5 1.5S6.17 11 7 11zm10 0c.83 0 1.5-.67 1.5-1.5S17.83 8 17 8s-1.5.67-1.5 1.5.67 1.5 1.5 1.5z"/>
                            </svg>
                        </div>
                        <div className="message-wrapper">
                            <div className="message-content streaming">
                                {formatMessageText(streamingMessage)}
                                <span className="cursor">|</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Typing indicator */}
                {isTyping && !isStreaming && (
                    <div className="typing-indicator">
                        <div className="typing-dot"></div>
                        <div className="typing-dot"></div>
                        <div className="typing-dot"></div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            <div className="quick-actions">
                <button
                    className="quick-action-btn"
                    onClick={() => sendQuickMessage('Find hotels in Paris')}
                    disabled={isStreaming}
                >
                    🏨 Find Hotels
                </button>
                <button
                    className="quick-action-btn"
                    onClick={() => sendQuickMessage('Best travel destinations')}
                    disabled={isStreaming}
                >
                    ✈️ Destinations
                </button>
                <button
                    className="quick-action-btn"
                    onClick={() => sendQuickMessage('I want to book a hotel')}
                    disabled={isStreaming}
                >
                    📅 Book Now
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
                    disabled={isStreaming}
                />
                <button
                    className="send-btn"
                    onClick={sendMessage}
                    disabled={isStreaming || !inputValue.trim()}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                    </svg>
                </button>
            </div>
        </div>
    )
}