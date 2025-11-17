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
    const [step, setStep] = useState(1) // 1: Room Selection, 2: Details, 3: Payment
    const [selectedRoom, setSelectedRoom] = useState(null)
    const [checkIn, setCheckIn] = useState('')
    const [checkOut, setCheckOut] = useState('')
    const [guests, setGuests] = useState(2)
    const [specialRequests, setSpecialRequests] = useState('')
    const [nights, setNights] = useState(0)
    const [totalPrice, setTotalPrice] = useState(0)

    // Payment details
    const [paymentMethod, setPaymentMethod] = useState('card')
    const [cardName, setCardName] = useState('')
    const [cardNumber, setCardNumber] = useState('')
    const [expiryDate, setExpiryDate] = useState('')
    const [cvv, setCvv] = useState('')

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

    const handleConfirmBooking = () => {
        // Here you would integrate with your backend/Supabase
        alert(`Booking confirmed!\n\nHotel: ${hotel.name}\nRoom: ${selectedRoom.name}\nCheck-in: ${checkIn}\nCheck-out: ${checkOut}\nNights: ${nights}\nTotal: $${totalPrice}`)
        onClose()
        // Reset form
        setStep(1)
        setSelectedRoom(null)
        setCheckIn('')
        setCheckOut('')
        setGuests(2)
        setSpecialRequests('')
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

    return (
        <div className="booking-modal-overlay" onClick={onClose}>
            <div className="booking-modal" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="booking-modal-header">
                    <div>
                        <h2>{hotel.name}</h2>
                        <p className="hotel-location-modal">📍 {hotel.location}</p>
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
                        <div className="step-number">1</div>
                        <span>Room</span>
                    </div>
                    <div className={`step-line ${step > 1 ? 'active' : ''}`}></div>
                    <div className={`step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
                        <div className="step-number">2</div>
                        <span>Details</span>
                    </div>
                    <div className={`step-line ${step > 2 ? 'active' : ''}`}></div>
                    <div className={`step ${step >= 3 ? 'active' : ''}`}>
                        <div className="step-number">3</div>
                        <span>Payment</span>
                    </div>
                </div>

                {/* Modal Content */}
                <div className="booking-modal-content">
                    {/* Step 1: Room Selection */}
                    {step === 1 && (
                        <div className="step-content">
                            <h3>Choose Your Room</h3>
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
                            <h3>Complete Your Booking</h3>

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
                                        <label>Check-in Date</label>
                                        <input
                                            type="date"
                                            value={checkIn}
                                            onChange={(e) => setCheckIn(e.target.value)}
                                            min={getTodayDate()}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Check-out Date</label>
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
                                    <label>Number of Guests</label>
                                    <select value={guests} onChange={(e) => setGuests(Number(e.target.value))}>
                                        {[...Array(selectedRoom.guests)].map((_, i) => (
                                            <option key={i + 1} value={i + 1}>{i + 1} Guest{i > 0 ? 's' : ''}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Special Requests (Optional)</label>
                                    <textarea
                                        placeholder="e.g., Need wheelchair access, dietary requirements, early check-in..."
                                        value={specialRequests}
                                        onChange={(e) => setSpecialRequests(e.target.value)}
                                        rows="4"
                                    ></textarea>
                                </div>

                                {checkIn && checkOut && (
                                    <div className="booking-summary-box">
                                        <p><strong>Duration:</strong> {calculateNights(checkIn, checkOut)} night(s)</p>
                                        <p><strong>Room Rate:</strong> ${selectedRoom.price}/night</p>
                                        <p className="total"><strong>Estimated Total:</strong> ${selectedRoom.price * calculateNights(checkIn, checkOut)}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Step 3: Payment */}
                    {step === 3 && (
                        <div className="step-content">
                            <h3>Secure Payment</h3>
                            <p className="payment-subtitle">Choose your preferred payment method and confirm your stay.</p>

                            {/* Payment Methods */}
                            <div className="payment-methods">
                                <div
                                    className={`payment-method ${paymentMethod === 'card' ? 'selected' : ''}`}
                                    onClick={() => setPaymentMethod('card')}
                                >
                                    <div className="method-icon">💳</div>
                                    <div>
                                        <h4>Credit / Debit Card</h4>
                                        <p>Pay with Visa, MasterCard, or AmEx</p>
                                    </div>
                                </div>
                                <div
                                    className={`payment-method ${paymentMethod === 'applepay' ? 'selected' : ''}`}
                                    onClick={() => setPaymentMethod('applepay')}
                                >
                                    <div className="method-icon"></div>
                                    <div>
                                        <h4>Apple Pay</h4>
                                        <p>Pay securely with Apple Pay</p>
                                    </div>
                                </div>
                                <div
                                    className={`payment-method ${paymentMethod === 'googlepay' ? 'selected' : ''}`}
                                    onClick={() => setPaymentMethod('googlepay')}
                                >
                                    <div className="method-icon">G</div>
                                    <div>
                                        <h4>Google Pay</h4>
                                        <p>Pay securely with Google Pay</p>
                                    </div>
                                </div>
                                <div
                                    className={`payment-method ${paymentMethod === 'paypal' ? 'selected' : ''}`}
                                    onClick={() => setPaymentMethod('paypal')}
                                >
                                    <div className="method-icon">P</div>
                                    <div>
                                        <h4>PayPal</h4>
                                        <p>Pay securely with PayPal</p>
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
                                            onChange={(e) => setCardNumber(e.target.value)}
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
                                                onChange={(e) => setExpiryDate(e.target.value)}
                                                maxLength="5"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>CVV</label>
                                            <input
                                                type="text"
                                                placeholder="123"
                                                value={cvv}
                                                onChange={(e) => setCvv(e.target.value)}
                                                maxLength="3"
                                            />
                                        </div>
                                    </div>
                                    <p className="security-note">
                                        🔒 All payments are processed securely. Your card details are never stored on our servers.
                                    </p>
                                </div>
                            )}

                            {/* Final Summary */}
                            <div className="final-summary">
                                <h4>Final Summary</h4>
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
                        <button className="btn-secondary" onClick={handleBack}>
                            ← Back
                        </button>
                    )}
                    {step < 3 ? (
                        <button
                            className="btn-primary"
                            onClick={handleNext}
                            disabled={step === 1 ? !selectedRoom : !checkIn || !checkOut}
                        >
                            Continue →
                        </button>
                    ) : (
                        <button className="btn-primary" onClick={handleConfirmBooking}>
                            Confirm & Pay ${totalPrice}
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}