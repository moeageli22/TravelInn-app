import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import './GroupchatRoom.css'

// AI-generated community members
const COMMUNITY_MEMBERS = {
    'food-dining': [
        { id: 1, name: 'Sarah', location: 'Miami, USA', avatar: '👩', flag: '🇺🇸', interests: ['Beaches', 'Food', 'Yoga'], online: true },
        { id: 2, name: 'Luca', location: 'Rome, Italy', avatar: '👨', flag: '🇮🇹', interests: ['Surfing', 'Culture', 'Coffee'], online: true },
        { id: 3, name: 'Amira', location: 'Dubai, UAE', avatar: '👩', flag: '🇦🇪', interests: ['Luxury', 'Shopping', 'Adventure'], online: true },
        { id: 4, name: 'Leo', location: 'Rio, Brazil', avatar: '👨', flag: '🇧🇷', interests: ['Music', 'Nightlife', 'Dance'], online: false },
        { id: 5, name: 'Maya', location: 'Tokyo, Japan', avatar: '👩', flag: '🇯🇵', interests: ['Photography', 'Art', 'Tech'], online: true },
        { id: 6, name: 'Kai', location: 'Bangkok, Thailand', avatar: '👨', flag: '🇹🇭', interests: ['Street Food', 'Markets', 'Culture'], online: true },
    ],
    'fitness-sports': [
        { id: 1, name: 'Marcus', location: 'London, UK', avatar: '👨', flag: '🇬🇧', interests: ['Running', 'Gym', 'Wellness'], online: true },
        { id: 2, name: 'Sofia', location: 'Barcelona, Spain', avatar: '👩', flag: '🇪🇸', interests: ['Yoga', 'Hiking', 'Beach'], online: true },
        { id: 3, name: 'Jake', location: 'Sydney, Australia', avatar: '👨', flag: '🇦🇺', interests: ['Surfing', 'Fitness', 'Nature'], online: true },
        { id: 4, name: 'Emma', location: 'Vancouver, Canada', avatar: '👩', flag: '🇨🇦', interests: ['Skiing', 'Hiking', 'Sports'], online: false },
        { id: 5, name: 'Ahmed', location: 'Cairo, Egypt', avatar: '👨', flag: '🇪🇬', interests: ['Soccer', 'Gym', 'Travel'], online: true },
    ],
    'music-nightlife': [
        { id: 1, name: 'DJ Alex', location: 'Berlin, Germany', avatar: '👨', flag: '🇩🇪', interests: ['Music', 'Clubs', 'Art'], online: true },
        { id: 2, name: 'Nina', location: 'Ibiza, Spain', avatar: '👩', flag: '🇪🇸', interests: ['Dancing', 'Festivals', 'Beach'], online: true },
        { id: 3, name: 'Carlos', location: 'Miami, USA', avatar: '👨', flag: '🇺🇸', interests: ['DJing', 'Nightlife', 'Beach'], online: true },
        { id: 4, name: 'Yuki', location: 'Seoul, Korea', avatar: '👩', flag: '🇰🇷', interests: ['K-pop', 'Concerts', 'Fashion'], online: true },
        { id: 5, name: 'Pierre', location: 'Paris, France', avatar: '👨', flag: '🇫🇷', interests: ['Jazz', 'Wine', 'Culture'], online: false },
    ],
    'culture-arts': [
        { id: 1, name: 'Isabella', location: 'Florence, Italy', avatar: '👩', flag: '🇮🇹', interests: ['Art', 'History', 'Museums'], online: true },
        { id: 2, name: 'Hiroshi', location: 'Kyoto, Japan', avatar: '👨', flag: '🇯🇵', interests: ['Culture', 'Photography', 'Temples'], online: true },
        { id: 3, name: 'Zara', location: 'Marrakech, Morocco', avatar: '👩', flag: '🇲🇦', interests: ['Markets', 'Art', 'Design'], online: true },
        { id: 4, name: 'Oscar', location: 'Mexico City, Mexico', avatar: '👨', flag: '🇲🇽', interests: ['Street Art', 'Food', 'Museums'], online: true },
    ],
    'gaming-entertainment': [
        { id: 1, name: 'Tyler', location: 'Los Angeles, USA', avatar: '👨', flag: '🇺🇸', interests: ['Gaming', 'Esports', 'Tech'], online: true },
        { id: 2, name: 'Mei', location: 'Shanghai, China', avatar: '👩', flag: '🇨🇳', interests: ['Mobile Games', 'Streaming', 'Anime'], online: true },
        { id: 3, name: 'Lucas', location: 'São Paulo, Brazil', avatar: '👨', flag: '🇧🇷', interests: ['Console Gaming', 'Sports', 'Music'], online: true },
        { id: 4, name: 'Aria', location: 'Dubai, UAE', avatar: '👩', flag: '🇦🇪', interests: ['VR Gaming', 'Tech', 'Travel'], online: false },
    ],
    'social-meetups': [
        { id: 1, name: 'Oliver', location: 'Amsterdam, Netherlands', avatar: '👨', flag: '🇳🇱', interests: ['Coffee', 'Cycling', 'Photography'], online: true },
        { id: 2, name: 'Luna', location: 'Buenos Aires, Argentina', avatar: '👩', flag: '🇦🇷', interests: ['Dancing', 'Wine', 'Culture'], online: true },
        { id: 3, name: 'Noah', location: 'Copenhagen, Denmark', avatar: '👨', flag: '🇩🇰', interests: ['Design', 'Food', 'Nature'], online: true },
        { id: 4, name: 'Chloe', location: 'Singapore', avatar: '👩', flag: '🇸🇬', interests: ['Food', 'Shopping', 'Travel'], online: true },
        { id: 5, name: 'Max', location: 'Prague, Czech Republic', avatar: '👨', flag: '🇨🇿', interests: ['Beer', 'History', 'Hiking'], online: true },
    ]
}

// Group metadata
const GROUP_DATA = {
    'food-dining': { name: 'Food & Dining', icon: '☕', color: '#f97316' },
    'fitness-sports': { name: 'Fitness & Sports', icon: '🏃', color: '#ef4444' },
    'music-nightlife': { name: 'Music & Nightlife', icon: '🎵', color: '#8b5cf6' },
    'culture-arts': { name: 'Culture & Arts', icon: '🎨', color: '#3b82f6' },
    'gaming-entertainment': { name: 'Gaming & Entertainment', icon: '🎮', color: '#10b981' },
    'social-meetups': { name: 'Social Meetups', icon: '👥', color: '#ec4899' }
}

// AI-generated messages for each group
const AI_MESSAGES = {
    'food-dining': [
        { sender: 'Kai', text: "Hey everyone! Just tried the best Pad Thai in Bangkok 😍🍜", time: '2m ago' },
        { sender: 'Sarah', text: "Kai that looks amazing! What's the restaurant called?", time: '1m ago' },
        { sender: 'Kai', text: "It's called 'Thip Samai' - totally worth the visit!", time: '30s ago' },
        { sender: 'Luca', text: "Adding to my list! I'm in Bangkok next month 📝", time: 'Just now' },
    ],
    'fitness-sports': [
        { sender: 'Marcus', text: "Morning run along the Thames was incredible today! 🏃‍♂️", time: '15m ago' },
        { sender: 'Sofia', text: "That sounds amazing! I miss running by the water", time: '12m ago' },
        { sender: 'Jake', text: "You guys should try the Sydney Harbour run - stunning views! 🌊", time: '8m ago' },
    ],
    'music-nightlife': [
        { sender: 'DJ Alex', text: "Epic techno set at Berghain last night! 🎧🔥", time: '1h ago' },
        { sender: 'Nina', text: "Jealous! Berlin clubs are on another level", time: '45m ago' },
        { sender: 'Carlos', text: "Anyone going to Ultra Miami next month? 🎵", time: '30m ago' },
    ],
    'culture-arts': [
        { sender: 'Isabella', text: "Just visited the Uffizi Gallery - Renaissance art is breathtaking! 🎨", time: '3h ago' },
        { sender: 'Hiroshi', text: "Beautiful! I recommend visiting Kyoto's temples for traditional Japanese art", time: '2h ago' },
        { sender: 'Zara', text: "The souks in Marrakech have incredible handcrafted art too! ✨", time: '1h ago' },
    ],
    'gaming-entertainment': [
        { sender: 'Tyler', text: "Who's playing the new Zelda game? 🎮", time: '20m ago' },
        { sender: 'Mei', text: "Me! It's amazing so far. Love the open world", time: '15m ago' },
        { sender: 'Lucas', text: "Just got it! Anyone want to trade friend codes?", time: '10m ago' },
    ],
    'social-meetups': [
        { sender: 'Oliver', text: "Coffee meetup tomorrow at 3pm - who's in? ☕", time: '1h ago' },
        { sender: 'Luna', text: "Count me in! Where at?", time: '45m ago' },
        { sender: 'Oliver', text: "Let's meet at Café Central - amazing cappuccinos!", time: '30m ago' },
        { sender: 'Noah', text: "I'll be there! Can't wait to meet everyone 😊", time: '15m ago' },
    ]
}

export default function GroupchatRoom() {
    const { groupId } = useParams()
    const navigate = useNavigate()
    const messagesEndRef = useRef(null)
    const [messages, setMessages] = useState([])
    const [inputValue, setInputValue] = useState('')
    const [showSidebar, setShowSidebar] = useState(true)

    const group = GROUP_DATA[groupId]
    const members = COMMUNITY_MEMBERS[groupId] || []

    useEffect(() => {
        // Initialize with welcome message and AI messages
        const welcomeMessage = {
            sender: 'TravelInn Bot',
            text: `Welcome to the ${group?.name} community! 🎉 Feel free to introduce yourself and connect with fellow travelers!`,
            time: 'Just now',
            isBot: true
        }

        const aiMessages = AI_MESSAGES[groupId]?.map(msg => ({ ...msg, isBot: false })) || []
        setMessages([welcomeMessage, ...aiMessages])
    }, [groupId, group])

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    useEffect(() => {
        // Simulate new messages from AI members
        const interval = setInterval(() => {
            if (Math.random() > 0.7) { // 30% chance every interval
                addRandomAIMessage()
            }
        }, 15000) // Every 15 seconds

        return () => clearInterval(interval)
    }, [groupId, members])

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    const addRandomAIMessage = () => {
        const randomMessages = {
            'food-dining': [
                "Anyone know good vegan spots in their city? 🌱",
                "Just discovered the most amazing hidden café!",
                "What's everyone's favorite cuisine to try while traveling?",
                "Pro tip: Always ask locals for restaurant recommendations! 👨‍🍳"
            ],
            'fitness-sports': [
                "Looking for a gym buddy in my area!",
                "Best time for a morning run is always sunrise 🌅",
                "Anyone into yoga? Found an amazing class!",
                "Tips for staying fit while traveling?"
            ],
            'music-nightlife': [
                "This weekend's lineup looks incredible! 🎵",
                "Best club I've been to hands down!",
                "Anyone else love underground techno?",
                "Festival season is coming - who's excited? 🎉"
            ],
            'culture-arts': [
                "Just visited an amazing local art gallery!",
                "Historical sites here are mind-blowing 🏛️",
                "Anyone into photography? The light here is perfect!",
                "Museums are free on Sundays - don't miss it!"
            ],
            'gaming-entertainment': [
                "Just hit level 100! Who else is grinding? 🎮",
                "This game's storyline is incredible!",
                "Looking for squad mates - who's online?",
                "New DLC just dropped - it's amazing!"
            ],
            'social-meetups': [
                "Planning a weekend hike - who wants to join? 🥾",
                "Coffee meetup was so much fun yesterday!",
                "Anyone up for exploring the old town?",
                "Let's organize a group dinner this weekend! 🍽️"
            ]
        }

        const possibleMessages = randomMessages[groupId] || ["Hey everyone! 👋"]
        const randomMessage = possibleMessages[Math.floor(Math.random() * possibleMessages.length)]
        const onlineMembers = members.filter(m => m.online)
        const randomMember = onlineMembers[Math.floor(Math.random() * onlineMembers.length)]

        if (randomMember) {
            const newMessage = {
                sender: randomMember.name,
                text: randomMessage,
                time: 'Just now',
                isBot: false
            }
            setMessages(prev => [...prev, newMessage])
        }
    }

    const sendMessage = () => {
        if (!inputValue.trim()) return

        const newMessage = {
            sender: 'You',
            text: inputValue,
            time: 'Just now',
            isBot: false,
            isUser: true
        }

        setMessages(prev => [...prev, newMessage])
        setInputValue('')

        // AI responds sometimes
        if (Math.random() > 0.5) {
            setTimeout(() => {
                addRandomAIMessage()
            }, 2000)
        }
    }

    if (!group) {
        return <div>Group not found</div>
    }

    return (
        <div className="group-chat-room">
            {/* Header */}
            <div className="chat-room-header">
                <div className="header-left">
                    <button className="back-btn" onClick={() => navigate('/groups')}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="19" y1="12" x2="5" y2="12"/>
                            <polyline points="12 19 5 12 12 5"/>
                        </svg>
                    </button>
                    <div className="group-icon-header" style={{ background: `${group.color}20`, color: group.color }}>
                        <span>{group.icon}</span>
                    </div>
                    <div>
                        <h2>{group.name}</h2>
                        <p>{members.filter(m => m.online).length} online • {members.length} members</p>
                    </div>
                </div>
                <button className="toggle-sidebar-btn" onClick={() => setShowSidebar(!showSidebar)}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="3" y1="12" x2="21" y2="12"/>
                        <line x1="3" y1="6" x2="21" y2="6"/>
                        <line x1="3" y1="18" x2="21" y2="18"/>
                    </svg>
                </button>
            </div>

            <div className="chat-room-body">
                {/* Messages */}
                <div className="messages-container">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`message ${msg.isBot ? 'bot-message' : ''} ${msg.isUser ? 'user-message' : ''}`}>
                            <div className="message-avatar">
                                {msg.isBot ? '🤖' : msg.isUser ? '👤' : members.find(m => m.name === msg.sender)?.avatar || '👤'}
                            </div>
                            <div className="message-content">
                                <div className="message-header">
                                    <span className="message-sender">{msg.sender}</span>
                                    <span className="message-time">{msg.time}</span>
                                </div>
                                <p className="message-text">{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Sidebar */}
                {showSidebar && (
                    <div className="members-sidebar">
                        <h3>Community Members</h3>
                        <div className="members-list">
                            {members.map(member => (
                                <div key={member.id} className="member-card">
                                    <div className="member-avatar">
                                        <span>{member.avatar}</span>
                                        <span className={`status-indicator ${member.online ? 'online' : 'offline'}`}></span>
                                    </div>
                                    <div className="member-info">
                                        <div className="member-name">
                                            {member.name}
                                            <span className="member-flag">{member.flag}</span>
                                        </div>
                                        <div className="member-location">{member.location}</div>
                                        <div className="member-interests">
                                            {member.interests.map((interest, idx) => (
                                                <span key={idx} className="interest-tag">{interest}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Input */}
            <div className="message-input-container">
                <input
                    type="text"
                    className="message-input"
                    placeholder="Type your message..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button className="send-message-btn" onClick={sendMessage} disabled={!inputValue.trim()}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="22" y1="2" x2="11" y2="13"/>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                    </svg>
                </button>
            </div>
        </div>
    )
}