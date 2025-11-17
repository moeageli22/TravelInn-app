import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BookingModal from '../components/BookingModal'
import './HotelsPage.css'

const hotelData = [
    // Dubai Hotels
    { name: 'Dubai Luxe Tower', location: 'Downtown Dubai, UAE', price: 680, image: 'https://ralphdeal.s3.amazonaws.com/wp-content/uploads/2024/05/UAE_Blog-321.jpg', rating: 4.9, amenities: 'Pool, Restaurant, Spa, Parking' },
    { name: 'Golden Sails Dubai', location: 'Jumeirah, Dubai', price: 1200, image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2c/18/e7/95/aerial-shot.jpg?w=900&h=-1&s=1', rating: 5.0, amenities: 'Private Beach, Helipad, Butler Service' },
    { name: 'Azure Palm Resort', location: 'Palm Jumeirah, Dubai', price: 520, image: 'https://media.istockphoto.com/id/1097789900/photo/aerial-view-of-dubai-palm-jumeirah-island-united-arab-emirates.jpg?s=612x612&w=0&k=20&c=a54NL3aG_WcbHLSyw6UvSyRDzZC3s-mT6slVN-ONJ0I=', rating: 4.8, amenities: 'Water Park, Aquarium, Kids Club' },

    // Paris Hotels
    { name: 'Le Royale Paris', location: 'Champs-Élysées, Paris', price: 920, image: 'https://images.unsplash.com/photo-1549294413-26f195200c16', rating: 4.9, amenities: 'Eiffel View, Michelin Star, Butler Service' },
    { name: 'Maison Élégance', location: 'Le Marais, Paris', price: 850, image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa', rating: 4.8, amenities: 'Luxury Spa, Fine Dining' },
    { name: 'Château Lumière', location: 'Saint-Germain, Paris', price: 980, image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791', rating: 5.0, amenities: 'Art Collection, Rooftop Pool' },

    // Tokyo Hotels
    { name: 'Skyline Imperial Tokyo', location: 'Shinjuku, Tokyo', price: 890, image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5', rating: 4.9, amenities: 'Skyline View, Onsen, Japanese Cuisine' },
    { name: 'Harmony Gardens Tokyo', location: 'Ginza, Tokyo', price: 720, image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4', rating: 4.7, amenities: 'Imperial Palace View, Spa' },
    { name: 'Zen Luxury Suites', location: 'Roppongi, Tokyo', price: 680, image: 'https://images.unsplash.com/photo-1496417263034-38ec4f0b665a', rating: 4.8, amenities: 'City View, Michelin Dining' },

    // London Hotels
    { name: 'Thames Royale', location: 'Westminster, London', price: 780, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945', rating: 4.8, amenities: 'Thames View, American Bar, Concierge' },
    { name: 'Mayfair Heritage', location: 'Mayfair, London', price: 820, image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa', rating: 4.9, amenities: 'Art Deco, Afternoon Tea' },
    { name: 'Crown Palace London', location: 'Piccadilly, London', price: 890, image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb', rating: 5.0, amenities: 'Royal Suite, Palm Court' },

    // Maldives Hotels
    { name: 'Azure Paradise Resort', location: 'North Malé Atoll, Maldives', price: 450, image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19', rating: 4.7, amenities: 'Beach, Diving, Bar, Seaplane' },
    { name: 'Coral Dreams Resort', location: 'Baa Atoll, Maldives', price: 1450, image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b', rating: 5.0, amenities: 'Private Island, Water Slide, Snorkeling' },
    { name: 'Ocean Breeze Villas', location: 'Ari Atoll, Maldives', price: 950, image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32', rating: 4.9, amenities: 'Underwater Restaurant, Spa' },

    // New York Hotels
    { name: 'Manhattan Luxe Hotel', location: 'Fifth Avenue, New York', price: 890, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945', rating: 4.9, amenities: 'Fifth Avenue, Butler Service' },
    { name: 'Central Park Plaza', location: 'Midtown, New York', price: 950, image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb', rating: 5.0, amenities: 'Central Park, Palm Court' },
    { name: 'Empire Suites NYC', location: 'Times Square, New York', price: 820, image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa', rating: 4.8, amenities: 'Rooftop Dining, City Views' },

    // Santorini Hotels
    { name: 'Sunset Cliffs Resort', location: 'Oia, Santorini', price: 680, image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e', rating: 4.9, amenities: 'Caldera View, Infinity Pool, Wine Tasting' },
    { name: 'Aegean Dream Suites', location: 'Fira, Santorini', price: 620, image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd', rating: 4.8, amenities: 'Sunset View, Cave Suites' },
    { name: 'Whitewashed Paradise', location: 'Imerovigli, Santorini', price: 590, image: 'https://images.unsplash.com/photo-1562791069-e6c21d88b665', rating: 4.7, amenities: 'Cliffside, Champagne Lounge' },

    // Riyadh Hotels
    { name: 'Kingdom Heights Hotel', location: 'King Fahd Road, Riyadh', price: 420, image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb', rating: 4.7, amenities: 'Kingdom Tower View, Spa' },
    { name: 'Royal Oasis Riyadh', location: 'Al Malqa, Riyadh', price: 480, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945', rating: 4.8, amenities: 'Palace Design, Fine Dining' },
    { name: 'Desert Pearl Hotel', location: 'Olaya District, Riyadh', price: 350, image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d', rating: 4.6, amenities: 'City Center, Modern Luxury' },

    // Makkah Hotels
    { name: 'Grand Haram Tower', location: 'Central Area, Makkah', price: 380, image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791', rating: 4.8, amenities: 'Haram View, Prayer Rooms' },
    { name: 'Sacred Valley Hotel', location: 'Abraj Al Bait, Makkah', price: 420, image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa', rating: 4.9, amenities: 'Holy Mosque Access, Dining' },
    { name: 'Pilgrim Suites Makkah', location: 'Ajyad Street, Makkah', price: 350, image: 'https://images.unsplash.com/photo-1549294413-26f195200c16', rating: 4.7, amenities: 'Kaaba View, Spa' },

    // Switzerland Hotels
    { name: 'Alpine Crown Resort', location: 'Andermatt, Switzerland', price: 780, image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4', rating: 4.9, amenities: 'Alpine Spa, Ski Access' },
    { name: 'Mountain Majesty Lodge', location: 'St. Moritz, Switzerland', price: 950, image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800', rating: 5.0, amenities: 'Mountain View, Ice Rink' },
    { name: 'Lake View Grand Hotel', location: 'Zurich, Switzerland', price: 680, image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1', rating: 4.8, amenities: 'City & Lake View, Art Collection' }
]

const chatHotelDatabase = {
    dubai: [
        { name: 'Dubai Luxe Tower', location: 'Downtown Dubai, UAE', price: 680, amenities: 'Pool, Restaurant, Spa, Parking' },
        { name: 'Golden Sails Dubai', location: 'Jumeirah, Dubai', price: 1200, amenities: 'Private Beach, Helipad, Butler Service' },
        { name: 'Azure Palm Resort', location: 'Palm Jumeirah, Dubai', price: 520, amenities: 'Water Park, Aquarium, Kids Club' }
    ],
    paris: [
        { name: 'Le Royale Paris', location: 'Champs-Élysées, Paris', price: 920, amenities: 'Eiffel View, Michelin Star, Butler Service' },
        { name: 'Maison Élégance', location: 'Le Marais, Paris', price: 850, amenities: 'Luxury Spa, Fine Dining' },
        { name: 'Château Lumière', location: 'Saint-Germain, Paris', price: 980, amenities: 'Art Collection, Rooftop Pool' }
    ],
    tokyo: [
        { name: 'Skyline Imperial Tokyo', location: 'Shinjuku, Tokyo', price: 890, amenities: 'Skyline View, Onsen, Japanese Cuisine' },
        { name: 'Harmony Gardens Tokyo', location: 'Ginza, Tokyo', price: 720, amenities: 'Imperial Palace View, Spa' },
        { name: 'Zen Luxury Suites', location: 'Roppongi, Tokyo', price: 680, amenities: 'City View, Michelin Dining' }
    ],
    london: [
        { name: 'Thames Royale', location: 'Westminster, London', price: 780, amenities: 'Thames View, American Bar, Concierge' },
        { name: 'Mayfair Heritage', location: 'Mayfair, London', price: 820, amenities: 'Art Deco, Afternoon Tea' },
        { name: 'Crown Palace London', location: 'Piccadilly, London', price: 890, amenities: 'Royal Suite, Palm Court' }
    ],
    maldives: [
        { name: 'Azure Paradise Resort', location: 'North Malé Atoll, Maldives', price: 450, amenities: 'Beach, Diving, Bar, Seaplane' },
        { name: 'Coral Dreams Resort', location: 'Baa Atoll, Maldives', price: 1450, amenities: 'Private Island, Water Slide, Snorkeling' },
        { name: 'Ocean Breeze Villas', location: 'Ari Atoll, Maldives', price: 950, amenities: 'Underwater Restaurant, Spa' }
    ],
    'new york': [
        { name: 'Manhattan Luxe Hotel', location: 'Fifth Avenue, New York', price: 890, amenities: 'Fifth Avenue, Butler Service' },
        { name: 'Central Park Plaza', location: 'Midtown, New York', price: 950, amenities: 'Central Park, Palm Court' },
        { name: 'Empire Suites NYC', location: 'Times Square, New York', price: 820, amenities: 'Rooftop Dining, City Views' }
    ],
    santorini: [
        { name: 'Sunset Cliffs Resort', location: 'Oia, Santorini', price: 680, amenities: 'Caldera View, Infinity Pool, Wine Tasting' },
        { name: 'Aegean Dream Suites', location: 'Fira, Santorini', price: 620, amenities: 'Sunset View, Cave Suites' },
        { name: 'Whitewashed Paradise', location: 'Imerovigli, Santorini', price: 590, amenities: 'Cliffside, Champagne Lounge' }
    ],
    riyadh: [
        { name: 'Kingdom Heights Hotel', location: 'King Fahd Road, Riyadh', price: 420, amenities: 'Kingdom Tower View, Spa' },
        { name: 'Royal Oasis Riyadh', location: 'Al Malqa, Riyadh', price: 480, amenities: 'Palace Design, Fine Dining' },
        { name: 'Desert Pearl Hotel', location: 'Olaya District, Riyadh', price: 350, amenities: 'City Center, Modern Luxury' }
    ],
    makkah: [
        { name: 'Grand Haram Tower', location: 'Central Area, Makkah', price: 380, amenities: 'Haram View, Prayer Rooms' },
        { name: 'Sacred Valley Hotel', location: 'Abraj Al Bait, Makkah', price: 420, amenities: 'Holy Mosque Access, Dining' },
        { name: 'Pilgrim Suites Makkah', location: 'Ajyad Street, Makkah', price: 350, amenities: 'Kaaba View, Spa' }
    ],
    switzerland: [
        { name: 'Alpine Crown Resort', location: 'Andermatt, Switzerland', price: 780, amenities: 'Alpine Spa, Ski Access' },
        { name: 'Mountain Majesty Lodge', location: 'St. Moritz, Switzerland', price: 950, amenities: 'Mountain View, Ice Rink' },
        { name: 'Lake View Grand Hotel', location: 'Zurich, Switzerland', price: 680, amenities: 'City & Lake View, Art Collection' }
    ]
}

export default function HotelsPage() {
    const navigate = useNavigate()
    const [searchQuery, setSearchQuery] = useState('')
    const [chatOpen, setChatOpen] = useState(false)
    const [messages, setMessages] = useState([
        { text: "Hello! 👋 I'm your hotel finder assistant. I can help you discover amazing hotels. Where would you like to stay?", sender: 'ai', time: 'Just now' }
    ])
    const [inputValue, setInputValue] = useState('')
    const [showTyping, setShowTyping] = useState(false)

    // Booking Modal State
    const [bookingModalOpen, setBookingModalOpen] = useState(false)
    const [selectedHotel, setSelectedHotel] = useState(null)

    const filteredHotels = hotelData.filter(hotel =>
        hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hotel.location.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const getAIResponse = (message) => {
        const lower = message.toLowerCase()
        const destinations = Object.keys(chatHotelDatabase)
        let foundDestination = null

        for (const dest of destinations) {
            if (lower.includes(dest)) {
                foundDestination = dest
                break
            }
        }

        if (foundDestination) {
            return generateHotelResponse(foundDestination)
        }

        if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
            return "Hello! 👋 I'm your hotel finder assistant. I can help you discover amazing hotels in cities like Dubai, Paris, London, Tokyo, Maldives, New York, Santorini, Riyadh, Makkah, and Switzerland. Where would you like to stay?"
        }

        if (lower.includes('help') || lower.includes('choose')) {
            return "I can help you find the perfect hotel! 🏨 Just tell me which city you're interested in:<br/><br/>🏙️ Dubai - Luxury resorts & iconic hotels<br/>🗼 Paris - Elegant & historic properties<br/>🗾 Tokyo - Modern luxury with Japanese hospitality<br/>🏝️ Maldives - Overwater villas & beach resorts<br/>🗽 New York - Iconic city hotels<br/>🌅 Santorini - Cliffside boutique hotels<br/>🕌 Riyadh & Makkah - Premium Islamic hospitality<br/>🏔️ Switzerland - Alpine luxury & mountain retreats<br/><br/>Which destination interests you?"
        }

        if (lower.includes('price') || lower.includes('cost') || lower.includes('budget')) {
            return "Great question about pricing! 💰 Our hotels range from $350/night to $1,450/night depending on the destination and luxury level. Tell me where you'd like to go, and I'll show you options within your budget!"
        }

        if (lower.includes('thank')) {
            return "You're very welcome! 😊 Feel free to ask if you need help finding the perfect hotel. Happy to assist you anytime!"
        }

        return "I'd love to help you find hotels! 🏨 Which city are you planning to visit? We have amazing options in Dubai, Paris, London, Tokyo, Maldives, New York, Santorini, Riyadh, Makkah, and Switzerland."
    }

    const generateHotelResponse = (destination) => {
        const hotels = chatHotelDatabase[destination]
        const cityName = destination.charAt(0).toUpperCase() + destination.slice(1)
        let response = `Excellent choice! 🌟 I found ${hotels.length} amazing hotels in ${cityName}:<br/><br/>`

        hotels.forEach((hotel, index) => {
            response += `<div style="margin-bottom: 1rem; padding: 0.75rem; background: rgba(139, 92, 246, 0.1); border-radius: 8px; cursor: pointer;">
        <div style="font-weight: 600;">${index + 1}. ${hotel.name}</div>
        <div style="font-size: 0.85rem; color: rgba(255,255,255,0.7); margin-top: 0.25rem;">📍 ${hotel.location}</div>
        <div style="font-size: 0.85rem; color: rgba(255,255,255,0.7);">💰 From $${hotel.price}/night</div>
        <div style="font-size: 0.8rem; color: rgba(255,255,255,0.6); margin-top: 0.3rem;">${hotel.amenities}</div>
      </div>`
        })

        return response
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

    // Handle Book Now button click
    const handleBookNow = (hotel) => {
        setSelectedHotel(hotel)
        setBookingModalOpen(true)
    }

    // Close booking modal
    const closeBookingModal = () => {
        setBookingModalOpen(false)
        setSelectedHotel(null)
    }

    return (
        <div className="hotels-page">
            <nav>
                <div className="logo" onClick={() => navigate('/')}>Travelinn</div>
                <ul className="nav-links">
                    <li><a href="/" onClick={(e) => { e.preventDefault(); navigate('/') }}>Home</a></li>
                    <li><a href="/hotels" className="active">Hotels</a></li>
                    <li><a href="#destinations">Wellbeing</a></li>
                    <li><a href="#groups">Groups</a></li>
                    <li><a href="#about">About</a></li>
                </ul>
                <button className="sign-in-btn" onClick={() => navigate('/signin')}>Sign In</button>
            </nav>

            <div className="container">
                <div className="page-header">
                    <h1>Premium Hotels Worldwide</h1>
                    <p>Discover luxury accommodations in the world's most stunning destinations</p>
                </div>

                <div className="search-section">
                    <div className="search-bar">
                        <div className="search-field">
                            <label>Search Hotels</label>
                            <input
                                type="text"
                                placeholder="Enter destination or hotel name..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button className="search-btn" onClick={() => {}}>Search</button>
                    </div>
                </div>

                <div className="hotels-grid">
                    {filteredHotels.length > 0 ? (
                        filteredHotels.map((hotel, idx) => (
                            <div key={idx} className="hotel-card">
                                <div className="hotel-image-container">
                                    <img src={hotel.image} alt={hotel.name} className="hotel-image" />
                                    <div className="hotel-badge">⭐ {hotel.rating}</div>
                                </div>
                                <div className="hotel-info">
                                    <h3 className="hotel-name">{hotel.name}</h3>
                                    <p className="hotel-location">📍 {hotel.location}</p>
                                    <p className="hotel-amenities">{hotel.amenities}</p>
                                    <div className="hotel-footer">
                                        <div className="hotel-price">
                                            <span className="price-label">From</span>
                                            <span className="price-amount">${hotel.price}</span>
                                            <span className="price-period">/night</span>
                                        </div>
                                        <button
                                            className="book-btn"
                                            onClick={() => handleBookNow(hotel)}
                                        >
                                            Book Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-results">
                            <h3>No hotels found</h3>
                            <p>Try adjusting your search criteria</p>
                        </div>
                    )}
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
                        <h3>Hotel Finder Assistant</h3>
                        <p>Ask me about hotels in any destination</p>
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
                    <button className="quick-action-btn" onClick={() => sendQuickMessage('Hotels in Dubai')}>
                        🏨 Dubai
                    </button>
                    <button className="quick-action-btn" onClick={() => sendQuickMessage('Hotels in Paris')}>
                        🗼 Paris
                    </button>
                    <button className="quick-action-btn" onClick={() => sendQuickMessage('Hotels in Tokyo')}>
                        🗾 Tokyo
                    </button>
                </div>

                <div className="chat-input-container">
                    <input
                        type="text"
                        className="chat-input"
                        placeholder="Ask about any destination..."
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

            {/* Booking Modal */}
            <BookingModal
                isOpen={bookingModalOpen}
                onClose={closeBookingModal}
                hotel={selectedHotel}
            />
        </div>
    )
}