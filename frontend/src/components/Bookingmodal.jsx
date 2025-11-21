import { useState } from 'react'
import './BookingModal.css'

const ROOM_TYPES = {
    'Dubai Luxe Tower': [
        { id: 1, name: 'Deluxe Room', price: 680, image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32', beds: '1 King Bed', guests: 2, size: '35 sqm' },
        { id: 2, name: 'Executive Suite', price: 950, image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b', beds: '1 King Bed + Sofa', guests: 3, size: '55 sqm' },
        { id: 3, name: 'Presidential Suite', price: 1500, image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a', beds: '2 King Beds', guests: 4, size: '85 sqm' }
    ],
    'Golden Sails Dubai': [
        { id: 1, name: 'Deluxe Ocean View', price: 1200, image: 'https://images.unsplash.com/photo-1591088398332-8a7791972843', beds: '1 King Bed', guests: 2, size: '45 sqm' },
        { id: 2, name: 'Panoramic Suite', price: 1800, image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd', beds: '1 King Bed + Living', guests: 3, size: '70 sqm' },
        { id: 3, name: 'Royal Suite', price: 2500, image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461', beds: '2 King Beds + Butler', guests: 4, size: '120 sqm' }
    ],
    'default': [
        { id: 1, name: 'Standard Room', price: 450, image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32', beds: '1 Queen Bed', guests: 2, size: '30 sqm' },
        { id: 2, name: 'Deluxe Room', price: 650, image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b', beds: '1 King Bed', guests: 2, size: '40 sqm' },
        { id: 3, name: 'Suite', price: 900, image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a', beds: '1 King Bed + Living', guests: 3, size: '60 sqm' }
    ]
}

export default function BookingModal({ isOpen, onClose, hotel }) {
    const [step, setStep] = useState(1)
    const [selectedRoom, setSelectedRoom] = useState(null)
    const [checkIn, setCheckIn] = useState('')
    const [checkOut, setCheckOut] = useState('')
    const [guests, setGuests] = useState(2)
    const [specialRequests, setSpecialRequests] = useState('')
    const [nights, setNights] = useState(0)
    const [totalPrice, setTotalPrice] = useState(0)

    // Payment details
    const [paymentMethod, setPaymentMethod] = useState('card')
    const [email, setEmail] = useState('')
    const [cardName, setCardName] = useState('')
    const [cardNumber, setCardNumber] = useState('')
    const [expiryDate, setExpiryDate] = useState('')
    const [cvv, setCvv] = useState('')
    const [isProcessing, setIsProcessing] = useState(false)

    if (!isOpen || !hotel) return null

    const roomTypes = ROOM_TYPES[hotel.name] || ROOM_TYPES['default']

    const calculateNights = (checkInDate, checkOutDate) => {
        if (!checkInDate || !checkOutDate) return 0
        const start = new Date(checkInDate)
        const end = new Date(checkOutDate)
        const diffTime = Math.abs(end - start)
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        return diffDays
    }

    const handleRoomSelect = (room) => {
        setSelectedRoom(room)
    }

    const handleNext = () => {
        if (step === 1 && selectedRoom) {
            setStep(2)
        } else if (step === 2 && checkIn && checkOut) {
            const nightCount = calculateNights(checkIn, checkOut)
            setNights(nightCount)
            setTotalPrice(selectedRoom.price * nightCount)
            setStep(3)
        }
    }

    const handleBack = () => {
        if (step > 1) setStep(step - 1)
    }

    const sendConfirmationEmail = async (bookingDetails) => {
        try {
            // Use Supabase Edge Function
            const supabaseUrl = 'https://zeeimyqduvannrxhevws.supabase.co'
            const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InplZWlteXFkdXZhbm5yeGhldndzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1MTI1ODQsImV4cCI6MjA3ODA4ODU4NH0.xRnMy2jaEpOKTJCCIf1BuZERatHor0ToheWZM0zP-Ho'

            const response = await fetch(`${supabaseUrl}/functions/v1/send-booking-confirmation`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${supabaseAnonKey}`
                },
                body: JSON.stringify(bookingDetails)
            })

            const data = await response.json()

            if (data.success) {
                console.log('Confirmation email sent successfully:', data.confirmationId)

                // Optional: Display the email preview in development
                if (data.emailPreview) {
                    console.log('Email Preview Available - Check console for HTML')
                }

                return data.confirmationId
            } else {
                console.error('Failed to send confirmation email:', data.message)
                return null
            }
        } catch (error) {
            console.error('Error sending confirmation email:', error)
            return null
        }
    }

    const handleConfirmBooking = async () => {
        // Validate email
        if (!email || !email.includes('@')) {
            alert('Please enter a valid email address to receive your confirmation.')
            return
        }

        // Validate payment details for card payment
        if (paymentMethod === 'card') {
            if (!cardName || !cardNumber || !expiryDate || !cvv) {
                alert('Please fill in all card details.')
                return
            }
        }

        setIsProcessing(true)

        try {
            // Prepare booking details
            const bookingDetails = {
                email: email,
                hotelName: hotel.name,
                hotelLocation: hotel.location,
                roomName: selectedRoom.name,
                roomPrice: selectedRoom.price,
                checkIn: checkIn,
                checkOut: checkOut,
                nights: nights,
                guests: guests,
                totalPrice: totalPrice,
                specialRequests: specialRequests,
                paymentMethod: paymentMethod
            }

            // Send confirmation email
            const confirmationId = await sendConfirmationEmail(bookingDetails)

            // Show success message
            if (confirmationId) {
                alert(`🎉 Booking Confirmed!\n\nConfirmation ID: ${confirmationId}\n\nHotel: ${hotel.name}\nRoom: ${selectedRoom.name}\nCheck-in: ${checkIn}\nCheck-out: ${checkOut}\nNights: ${nights}\nTotal: $${totalPrice}\n\n📧 A confirmation email has been sent to ${email}\n\nThank you for choosing Travelinn!`)
            } else {
                alert(`🎉 Booking Confirmed!\n\nHotel: ${hotel.name}\nRoom: ${selectedRoom.name}\nCheck-in: ${checkIn}\nCheck-out: ${checkOut}\nNights: ${nights}\nTotal: $${totalPrice}\n\n⚠️ Note: Confirmation email could not be sent at this time, but your booking is confirmed.\n\nThank you for choosing Travelinn!`)
            }

            onClose()
            // Reset form
            setStep(1)
            setSelectedRoom(null)
            setCheckIn('')
            setCheckOut('')
            setGuests(2)
            setSpecialRequests('')
            setEmail('')
            setCardName('')
            setCardNumber('')
            setExpiryDate('')
            setCvv('')
        } catch (error) {
            console.error('Error processing booking:', error)
            alert('There was an error processing your booking. Please try again.')
        } finally {
            setIsProcessing(false)
        }
    }

    const getTodayDate = () => {
        const today = new Date()
        return today.toISOString().split('T')[0]
    }

    const getTomorrowDate = () => {
        const tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1)
        return tomorrow.toISOString().split('T')[0]
    }

    const formatCardNumber = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
        const matches = v.match(/\d{4,16}/g)
        const match = (matches && matches[0]) || ''
        const parts = []

        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4))
        }

        if (parts.length) {
            return parts.join(' ')
        } else {
            return value
        }
    }

    const formatExpiry = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
        if (v.length >= 2) {
            return v.substring(0, 2) + (v.length > 2 ? '/' + v.substring(2, 4) : '')
        }
        return v
    }

    return (
        <div className="booking-modal-overlay" onClick={onClose}>
            <div className="booking-modal" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="booking-modal-header">
                    <div className="header-content">
                        <h2>{hotel.name}</h2>
                        <p className="hotel-location-modal">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                                <circle cx="12" cy="10" r="3"/>
                            </svg>
                            {hotel.location}
                        </p>
                    </div>
                    <button className="close-modal" onClick={onClose}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    </button>
                </div>

                {/* Progress Steps */}
                <div className="booking-steps">
                    <div className={`step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
                        <div className="step-number">
                            {step > 1 ? (
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                    <polyline points="20 6 9 17 4 12"/>
                                </svg>
                            ) : '1'}
                        </div>
                        <span className="step-label">Room</span>
                    </div>
                    <div className={`step-line ${step > 1 ? 'active' : ''}`}></div>
                    <div className={`step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
                        <div className="step-number">
                            {step > 2 ? (
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                    <polyline points="20 6 9 17 4 12"/>
                                </svg>
                            ) : '2'}
                        </div>
                        <span className="step-label">Details</span>
                    </div>
                    <div className={`step-line ${step > 2 ? 'active' : ''}`}></div>
                    <div className={`step ${step >= 3 ? 'active' : ''}`}>
                        <div className="step-number">3</div>
                        <span className="step-label">Payment</span>
                    </div>
                </div>

                {/* Modal Content */}
                <div className="booking-modal-content">
                    {/* Step 1: Room Selection */}
                    {step === 1 && (
                        <div className="step-content">
                            <h3>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                                    <polyline points="9 22 9 12 15 12 15 22"/>
                                </svg>
                                Choose Your Room
                            </h3>
                            <div className="rooms-grid">
                                {roomTypes.map(room => (
                                    <div
                                        key={room.id}
                                        className={`room-card ${selectedRoom?.id === room.id ? 'selected' : ''}`}
                                        onClick={() => handleRoomSelect(room)}
                                    >
                                        <div className="room-image-container">
                                            <img src={room.image} alt={room.name} className="room-image" />
                                            {selectedRoom?.id === room.id && (
                                                <div className="selected-badge">
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                                                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                        <div className="room-info">
                                            <h4>{room.name}</h4>
                                            <div className="room-details">
                                                <span>🛏️ {room.beds}</span>
                                                <span>👥 {room.guests} Guests</span>
                                                <span>📐 {room.size}</span>
                                            </div>
                                            <div className="room-price">
                                                <span className="price">${room.price}</span>
                                                <span className="per-night">/night</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 2: Booking Details */}
                    {step === 2 && (
                        <div className="step-content">
                            <h3>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                                    <line x1="16" y1="2" x2="16" y2="6"/>
                                    <line x1="8" y1="2" x2="8" y2="6"/>
                                    <line x1="3" y1="10" x2="21" y2="10"/>
                                </svg>
                                Booking Details
                            </h3>

                            {/* Selected Room Summary */}
                            <div className="selected-room-summary">
                                <img src={selectedRoom.image} alt={selectedRoom.name} />
                                <div>
                                    <h4>{selectedRoom.name}</h4>
                                    <p>{selectedRoom.beds} • {selectedRoom.guests} Guests • {selectedRoom.size}</p>
                                    <p className="price-highlight">${selectedRoom.price}/night</p>
                                </div>
                            </div>

                            <div className="booking-form">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                                                <line x1="16" y1="2" x2="16" y2="6"/>
                                                <line x1="8" y1="2" x2="8" y2="6"/>
                                                <line x1="3" y1="10" x2="21" y2="10"/>
                                            </svg>
                                            Check-in Date
                                        </label>
                                        <input
                                            type="date"
                                            value={checkIn}
                                            onChange={(e) => setCheckIn(e.target.value)}
                                            min={getTodayDate()}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                                                <line x1="16" y1="2" x2="16" y2="6"/>
                                                <line x1="8" y1="2" x2="8" y2="6"/>
                                                <line x1="3" y1="10" x2="21" y2="10"/>
                                            </svg>
                                            Check-out Date
                                        </label>
                                        <input
                                            type="date"
                                            value={checkOut}
                                            onChange={(e) => setCheckOut(e.target.value)}
                                            min={checkIn || getTomorrowDate()}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                                            <circle cx="9" cy="7" r="4"/>
                                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                                            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                                        </svg>
                                        Number of Guests
                                    </label>
                                    <select value={guests} onChange={(e) => setGuests(Number(e.target.value))}>
                                        {[...Array(selectedRoom.guests)].map((_, i) => (
                                            <option key={i + 1} value={i + 1}>
                                                {i + 1} Guest{i > 0 ? 's' : ''}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                                        </svg>
                                        Special Requests (Optional)
                                    </label>
                                    <textarea
                                        placeholder="e.g., Need wheelchair access, dietary requirements, early check-in..."
                                        value={specialRequests}
                                        onChange={(e) => setSpecialRequests(e.target.value)}
                                        rows="4"
                                    ></textarea>
                                </div>

                                {checkIn && checkOut && (
                                    <div className="booking-summary-box">
                                        <p>
                                            <span><strong>Duration:</strong></span>
                                            <span>{calculateNights(checkIn, checkOut)} night(s)</span>
                                        </p>
                                        <p>
                                            <span><strong>Room Rate:</strong></span>
                                            <span>${selectedRoom.price}/night</span>
                                        </p>
                                        <p className="total">
                                            <span><strong>Estimated Total:</strong></span>
                                            <span>${selectedRoom.price * calculateNights(checkIn, checkOut)}</span>
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Step 3: Payment */}
                    {step === 3 && (
                        <div className="step-content">
                            <h3>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                                    <line x1="1" y1="10" x2="23" y2="10"/>
                                </svg>
                                Secure Payment
                            </h3>
                            <p className="payment-subtitle">Choose your preferred payment method and confirm your stay.</p>

                            {/* Email Input for Receipt */}
                            <div className="payment-form" style={{ marginBottom: '2rem' }}>
                                <div className="form-group">
                                    <label>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                                            <polyline points="22,6 12,13 2,6"/>
                                        </svg>
                                        Email Address for Receipt & Confirmation *
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="your.email@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        style={{
                                            padding: '1rem 1.25rem',
                                            background: 'rgba(15, 23, 42, 0.6)',
                                            border: '2px solid rgba(139, 92, 246, 0.3)',
                                            borderRadius: '14px',
                                            color: 'white',
                                            fontSize: '0.95rem',
                                            outline: 'none',
                                            transition: 'all 0.3s'
                                        }}
                                    />
                                    <p style={{
                                        margin: '0.5rem 0 0',
                                        color: 'rgba(255, 255, 255, 0.6)',
                                        fontSize: '0.85rem'
                                    }}>
                                        📧 Your booking confirmation and receipt will be sent to this email
                                    </p>
                                </div>
                            </div>

                            {/* Payment Methods */}
                            <div className="payment-methods">
                                <div
                                    className={`payment-method ${paymentMethod === 'card' ? 'selected' : ''}`}
                                    onClick={() => setPaymentMethod('card')}
                                >
                                    <div className="method-icon">
                                        <img
                                            src="https://t4.ftcdn.net/jpg/04/06/75/39/360_F_406753914_SFSBhjhp6kbHblNiUFZ1MXHcuEKe7e7P.jpg"
                                            alt="Credit Card"
                                            style={{ width: '50px', height: '50px', objectFit: 'contain' }}
                                        />
                                    </div>
                                    <div>
                                        <h4>Credit / Debit Card</h4>
                                        <p>Pay with Visa, MasterCard, or AmEx</p>
                                    </div>
                                </div>
                                <div
                                    className={`payment-method ${paymentMethod === 'applepay' ? 'selected' : ''}`}
                                    onClick={() => setPaymentMethod('applepay')}
                                >
                                    <div className="method-icon">
                                        <img
                                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWxYUQvdwKXZ9meVu4Jx6fr7nNNo99TLl-bA&s"
                                            alt="Apple Pay"
                                            style={{ width: '50px', height: '50px', objectFit: 'contain' }}
                                        />
                                    </div>
                                    <div>
                                        <h4>Apple Pay</h4>
                                        <p>Pay securely with Apple Pay</p>
                                    </div>
                                </div>
                                <div
                                    className={`payment-method ${paymentMethod === 'googlepay' ? 'selected' : ''}`}
                                    onClick={() => setPaymentMethod('googlepay')}
                                >
                                    <div className="method-icon">
                                        <img
                                            src="https://developers.google.com/static/pay/api/images/brand-guidelines/google-pay-mark.png"
                                            alt="Google Pay"
                                            style={{ width: '50px', height: '50px', objectFit: 'contain' }}
                                        />
                                    </div>
                                    <div>
                                        <h4>Google Pay</h4>
                                        <p>Fast & secure checkout</p>
                                    </div>
                                </div>
                                <div
                                    className={`payment-method ${paymentMethod === 'paypal' ? 'selected' : ''}`}
                                    onClick={() => setPaymentMethod('paypal')}
                                >
                                    <div className="method-icon">
                                        <img
                                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/2560px-PayPal.svg.png"
                                            alt="PayPal"
                                            style={{ width: '50px', height: 'auto', objectFit: 'contain' }}
                                        />
                                    </div>
                                    <div>
                                        <h4>PayPal</h4>
                                        <p>Pay with your PayPal account</p>
                                    </div>
                                </div>
                            </div>
                            {/* Card Details Form */}
                            {paymentMethod === 'card' && (
                                <div className="payment-form">
                                    <div className="form-group">
                                        <label>Cardholder Name</label>
                                        <input
                                            type="text"
                                            placeholder="John Doe"
                                            value={cardName}
                                            onChange={(e) => setCardName(e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Card Number</label>
                                        <input
                                            type="text"
                                            placeholder="1234 5678 9012 3456"
                                            value={cardNumber}
                                            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                                            maxLength="19"
                                        />
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Expiry Date</label>
                                            <input
                                                type="text"
                                                placeholder="MM/YY"
                                                value={expiryDate}
                                                onChange={(e) => setExpiryDate(formatExpiry(e.target.value))}
                                                maxLength="5"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>CVV</label>
                                            <input
                                                type="text"
                                                placeholder="123"
                                                value={cvv}
                                                onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                                                maxLength="3"
                                            />
                                        </div>
                                    </div>
                                    <p className="security-note">
                                        🔒 All payments are processed securely. Your card details are never stored on our servers.
                                    </p>
                                </div>
                            )}

                            {paymentMethod !== 'card' && (
                                <div className="payment-form">
                                    <div style={{
                                        padding: '2rem',
                                        background: 'rgba(139, 92, 246, 0.08)',
                                        borderRadius: '16px',
                                        textAlign: 'center',
                                        color: 'rgba(255, 255, 255, 0.7)'
                                    }}>
                                        <p>You'll be redirected to {paymentMethod === 'applepay' ? 'Apple Pay' : paymentMethod === 'googlepay' ? 'Google Pay' : 'PayPal'} to complete your payment securely.</p>
                                    </div>
                                </div>
                            )}

                            {/* Final Summary */}
                            <div className="final-summary">
                                <h4>Booking Summary</h4>
                                <div className="summary-item">
                                    <span>Hotel</span>
                                    <span>{hotel.name}</span>
                                </div>
                                <div className="summary-item">
                                    <span>Room Type</span>
                                    <span>{selectedRoom.name}</span>
                                </div>
                                <div className="summary-item">
                                    <span>Check-in</span>
                                    <span>{new Date(checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                </div>
                                <div className="summary-item">
                                    <span>Check-out</span>
                                    <span>{new Date(checkOut).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                </div>
                                <div className="summary-item">
                                    <span>{nights} night(s) × ${selectedRoom.price}</span>
                                    <span>${totalPrice}</span>
                                </div>
                                <div className="summary-total">
                                    <span>Total Amount</span>
                                    <span>${totalPrice}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="booking-modal-footer">
                    {step > 1 && (
                        <button className="btn-secondary" onClick={handleBack} disabled={isProcessing}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="19" y1="12" x2="5" y2="12"/>
                                <polyline points="12 19 5 12 12 5"/>
                            </svg>
                            Back
                        </button>
                    )}
                    {step < 3 ? (
                        <button
                            className="btn-primary"
                            onClick={handleNext}
                            disabled={step === 1 ? !selectedRoom : !checkIn || !checkOut}
                        >
                            Continue
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="5" y1="12" x2="19" y2="12"/>
                                <polyline points="12 5 19 12 12 19"/>
                            </svg>
                        </button>
                    ) : (
                        <button
                            className="btn-primary"
                            onClick={handleConfirmBooking}
                            disabled={isProcessing || !email}
                        >
                            {isProcessing ? (
                                <>
                                    <div className="spinner" style={{
                                        width: '20px',
                                        height: '20px',
                                        border: '3px solid rgba(255, 255, 255, 0.3)',
                                        borderTop: '3px solid white',
                                        borderRadius: '50%',
                                        animation: 'spin 1s linear infinite'
                                    }}></div>
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polyline points="20 6 9 17 4 12"/>
                                    </svg>
                                    Confirm & Pay ${totalPrice}
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}