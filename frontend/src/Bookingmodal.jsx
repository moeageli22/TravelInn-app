import { useState, useEffect } from 'react'
import './BookingModal.css'

const BookingModal = ({ isOpen, onClose, selectedHotel }) => {
    const [currentStep, setCurrentStep] = useState(1)
    const [checkin, setCheckin] = useState('')
    const [checkout, setCheckout] = useState('')
    const [guests, setGuests] = useState('2')
    const [specialRequests, setSpecialRequests] = useState('')
    const [paymentMethod, setPaymentMethod] = useState('card')
    const [cardName, setCardName] = useState('')
    const [cardNumber, setCardNumber] = useState('')
    const [cardExpiry, setCardExpiry] = useState('')
    const [cardCvv, setCardCvv] = useState('')

    useEffect(() => {
        if (isOpen) {
            setCurrentStep(1)
        }
    }, [isOpen])

    if (!isOpen) return null

    const formatLocation = (location) => {
        return location ? location.charAt(0).toUpperCase() + location.slice(1) : ''
    }

    const calculateNights = () => {
        if (!checkin || !checkout) return 0
        const cin = new Date(checkin)
        const cout = new Date(checkout)
        return Math.ceil((cout - cin) / (1000 * 60 * 60 * 24))
    }

    const calculateTotal = () => {
        return calculateNights() * (selectedHotel.price || 0)
    }

    const formatDate = (dateStr) => {
        if (!dateStr) return ''
        const date = new Date(dateStr)
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    const validateDates = () => {
        if (!checkin || !checkout) {
            alert('Please select check-in and check-out dates')
            return false
        }
        const cin = new Date(checkin)
        const cout = new Date(checkout)
        if (cout <= cin) {
            alert('Check-out date must be after check-in date')
            return false
        }
        return true
    }

    const validatePayment = () => {
        if (paymentMethod === 'card') {
            if (!cardName || !cardNumber || !cardExpiry || !cardCvv) {
                alert('Please fill in all card details')
                return false
            }
        }
        return true
    }

    const nextStep = (step) => {
        if (step === 3 && !validateDates()) return
        setCurrentStep(step)
    }

    const confirmBooking = () => {
        if (!validatePayment()) return
        alert('🎉 Booking Confirmed!\n\nThank you for booking with Travelinn!\nA confirmation email has been sent.')
        onClose()
    }

    const handlePaymentSelect = (method) => {
        setPaymentMethod(method)
    }

    return (
        <div className="booking-modal active">
            <div className="booking-container">
                <div className="progress-header">
                    <div>
                        <h2 style={{ color: 'white', marginBottom: '0.5rem' }}>Travelinn</h2>
                        <div className="progress-steps">
                            <div className={`step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
                                <div className="step-circle">1</div>
                                <span className="step-label">Room</span>
                            </div>
                            <div className="step-connector"></div>
                            <div className={`step ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
                                <div className="step-circle">2</div>
                                <span className="step-label">Details</span>
                            </div>
                            <div className="step-connector"></div>
                            <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
                                <div className="step-circle">3</div>
                                <span className="step-label">Payment</span>
                            </div>
                        </div>
                    </div>
                    <button className="close-booking" onClick={onClose}>×</button>
                </div>

                <div className="booking-content">
                    {/* Step 1: Room Selection */}
                    {currentStep === 1 && (
                        <div className="booking-step active">
                            <h2 className="step-title">Select Your Room</h2>
                            <p className="step-subtitle">Your selected hotel and room details</p>

                            <div style={{ background: '#1a202c', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem' }}>
                                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{selectedHotel.name}</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                                    <div>
                                        <p style={{ color: 'rgba(255, 255, 255, 0.6)', marginBottom: '0.5rem' }}>Location</p>
                                        <p>{formatLocation(selectedHotel.location)}</p>
                                    </div>
                                    <div>
                                        <p style={{ color: 'rgba(255, 255, 255, 0.6)', marginBottom: '0.5rem' }}>Room Type</p>
                                        <p>Deluxe Suite</p>
                                    </div>
                                    <div>
                                        <p style={{ color: 'rgba(255, 255, 255, 0.6)', marginBottom: '0.5rem' }}>Price per night</p>
                                        <p style={{ color: '#a855f7', fontSize: '1.3rem', fontWeight: '700' }}>${selectedHotel.price}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="button-group">
                                <button className="btn btn-back" onClick={onClose}>← Cancel</button>
                                <button className="btn btn-next" onClick={() => nextStep(2)}>Continue to Details →</button>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Guest Details */}
                    {currentStep === 2 && (
                        <div className="booking-step active">
                            <h2 className="step-title">Complete Your Booking</h2>
                            <p className="step-subtitle">Please provide your details for the reservation</p>

                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Check-in Date</label>
                                    <input
                                        type="date"
                                        value={checkin}
                                        onChange={(e) => setCheckin(e.target.value)}
                                        min={new Date().toISOString().split('T')[0]}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Check-out Date</label>
                                    <input
                                        type="date"
                                        value={checkout}
                                        onChange={(e) => setCheckout(e.target.value)}
                                        min={new Date().toISOString().split('T')[0]}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Number of Guests</label>
                                <select value={guests} onChange={(e) => setGuests(e.target.value)}>
                                    <option value="1">1 Guest</option>
                                    <option value="2">2 Guests</option>
                                    <option value="3">3 Guests</option>
                                    <option value="4">4+ Guests</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Special Requests (Optional)</label>
                                <textarea
                                    placeholder="Any special requests or preferences..."
                                    value={specialRequests}
                                    onChange={(e) => setSpecialRequests(e.target.value)}
                                />
                                <small style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                                    We'll make sure your stay is as comfortable as possible.
                                </small>
                            </div>

                            <div className="booking-summary">
                                <h3 className="summary-title">Booking Summary</h3>
                                <div className="summary-row">
                                    <span>{selectedHotel.name}</span>
                                    <span>{formatLocation(selectedHotel.location)}</span>
                                </div>
                                <div className="summary-row">
                                    <span>Room: Deluxe Suite</span>
                                    <span>${selectedHotel.price}/night</span>
                                </div>
                                <div className="summary-row">
                                    <span>Duration</span>
                                    <span>{calculateNights()} night{calculateNights() !== 1 ? 's' : ''}</span>
                                </div>
                                <div className="summary-row">
                                    <span>Guests</span>
                                    <span>{guests}</span>
                                </div>
                                <div className="summary-row total">
                                    <span>Total</span>
                                    <span>${calculateTotal()}</span>
                                </div>
                            </div>

                            <div className="button-group">
                                <button className="btn btn-back" onClick={() => setCurrentStep(1)}>← Back</button>
                                <button className="btn btn-next" onClick={() => nextStep(3)}>Proceed to Payment →</button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Payment */}
                    {currentStep === 3 && (
                        <div className="booking-step active">
                            <h2 className="step-title">Secure Payment</h2>
                            <p className="step-subtitle">Choose your preferred payment method and confirm your stay</p>

                            <div className="payment-options">
                                <div
                                    className={`payment-option ${paymentMethod === 'applepay' ? 'selected' : ''}`}
                                    onClick={() => handlePaymentSelect('applepay')}
                                >
                                    <input type="radio" name="payment" value="applepay" checked={paymentMethod === 'applepay'} readOnly />
                                    <div className="payment-logo-container">
                                        <img src="/mnt/user-data/uploads/1763140256942_image.png" className="payment-logo" alt="Apple Pay" />
                                    </div>
                                    <div className="payment-info">
                                        <div className="payment-title">Apple Pay</div>
                                        <div className="payment-desc">Pay securely with Apple Pay</div>
                                    </div>
                                </div>

                                <div
                                    className={`payment-option ${paymentMethod === 'googlepay' ? 'selected' : ''}`}
                                    onClick={() => handlePaymentSelect('googlepay')}
                                >
                                    <input type="radio" name="payment" value="googlepay" checked={paymentMethod === 'googlepay'} readOnly />
                                    <div className="payment-logo-container">
                                        <img src="/mnt/user-data/uploads/1763140424246_image.png" className="payment-logo" alt="Google Pay" />
                                    </div>
                                    <div className="payment-info">
                                        <div className="payment-title">Google Pay</div>
                                        <div className="payment-desc">Pay securely with Google Pay</div>
                                    </div>
                                </div>

                                <div
                                    className={`payment-option ${paymentMethod === 'card' ? 'selected' : ''}`}
                                    onClick={() => handlePaymentSelect('card')}
                                >
                                    <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} readOnly />
                                    <div className="payment-logo-container">
                                        <span style={{ fontSize: '2rem' }}>💳</span>
                                    </div>
                                    <div className="payment-info">
                                        <div className="payment-title">Credit / Debit Card</div>
                                        <div className="payment-desc">Pay with Visa, MasterCard or AmEx</div>
                                    </div>
                                </div>

                                <div
                                    className={`payment-option ${paymentMethod === 'paypal' ? 'selected' : ''}`}
                                    onClick={() => handlePaymentSelect('paypal')}
                                >
                                    <input type="radio" name="payment" value="paypal" checked={paymentMethod === 'paypal'} readOnly />
                                    <div className="payment-logo-container">
                                        <img src="/mnt/user-data/uploads/1763140436984_image.png" className="payment-logo" alt="PayPal" />
                                    </div>
                                    <div className="payment-info">
                                        <div className="payment-title">PayPal</div>
                                        <div className="payment-desc">Pay securely with PayPal</div>
                                    </div>
                                </div>
                            </div>

                            {paymentMethod === 'card' && (
                                <div className="card-form active">
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
                                            maxLength="19"
                                            value={cardNumber}
                                            onChange={(e) => setCardNumber(e.target.value)}
                                        />
                                    </div>
                                    <div className="form-grid">
                                        <div className="form-group">
                                            <label>Expiry Date</label>
                                            <input
                                                type="text"
                                                placeholder="MM/YY"
                                                maxLength="5"
                                                value={cardExpiry}
                                                onChange={(e) => setCardExpiry(e.target.value)}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>CVV</label>
                                            <input
                                                type="text"
                                                placeholder="123"
                                                maxLength="3"
                                                value={cardCvv}
                                                onChange={(e) => setCardCvv(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="security-notice">
                                        🔒 All payments are processed securely. Your card details are never stored on our servers.
                                    </div>
                                </div>
                            )}

                            <div className="booking-summary">
                                <h3 className="summary-title">Final Summary</h3>
                                <div className="summary-row">
                                    <span>{selectedHotel.name}</span>
                                    <span>{formatLocation(selectedHotel.location)}</span>
                                </div>
                                <div className="summary-row">
                                    <span>Deluxe Suite</span>
                                    <span>${selectedHotel.price}/night</span>
                                </div>
                                <div className="summary-row">
                                    <span>Check-in</span>
                                    <span>{formatDate(checkin)}</span>
                                </div>
                                <div className="summary-row">
                                    <span>Check-out</span>
                                    <span>{formatDate(checkout)}</span>
                                </div>
                                <div className="summary-row">
                                    <span>{calculateNights()} nights × ${selectedHotel.price}</span>
                                    <span>${calculateTotal()}</span>
                                </div>
                                <div className="summary-row total">
                                    <span>Total Amount</span>
                                    <span>${calculateTotal()}</span>
                                </div>
                            </div>

                            <div className="button-group">
                                <button className="btn btn-back" onClick={() => setCurrentStep(2)}>← Back</button>
                                <button className="btn btn-next" onClick={confirmBooking}>
                                    Confirm & Pay ${calculateTotal()}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default BookingModal