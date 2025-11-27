import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import UserMenu from '../components/UserMenu.jsx'
import './MyBookingsPage.css'

export default function MyBookingsPage() {
    const navigate = useNavigate()
    const { user } = useAuth()
    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('all') // all, confirmed, completed, cancelled

    useEffect(() => {
        if (user) {
            fetchBookings()
        }
    }, [user])

    const fetchBookings = async () => {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from('bookings')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })

            if (error) {
                console.error('Error fetching bookings:', error)
                return
            }

            setBookings(data || [])
        } catch (error) {
            console.error('Error in fetchBookings:', error)
        } finally {
            setLoading(false)
        }
    }

    const getFilteredBookings = () => {
        if (filter === 'all') return bookings

        return bookings.filter(booking => {
            if (filter === 'confirmed') {
                return booking.status === 'confirmed'
            }
            if (filter === 'completed') {
                const checkOutDate = new Date(booking.check_out)
                const today = new Date()
                return checkOutDate < today
            }
            if (filter === 'cancelled') {
                return booking.status === 'cancelled'
            }
            return true
        })
    }

    const getBookingStats = () => {
        const confirmed = bookings.filter(b => b.status === 'confirmed').length
        const completed = bookings.filter(b => {
            const checkOutDate = new Date(b.check_out)
            const today = new Date()
            return checkOutDate < today
        }).length
        const cancelled = bookings.filter(b => b.status === 'cancelled').length

        return { confirmed, completed, cancelled, total: bookings.length }
    }

    const cancelBooking = async (bookingId) => {
        const confirmCancel = window.confirm('Are you sure you want to cancel this booking?')
        if (!confirmCancel) return

        try {
            const { error } = await supabase
                .from('bookings')
                .update({ status: 'cancelled' })
                .eq('id', bookingId)

            if (error) {
                console.error('Error cancelling booking:', error)
                alert('Failed to cancel booking. Please try again.')
                return
            }

            alert('Booking cancelled successfully')
            fetchBookings() // Refresh the list
        } catch (error) {
            console.error('Error in cancelBooking:', error)
            alert('An error occurred. Please try again.')
        }
    }

    const viewBookingDetails = (booking) => {
        const checkInDate = new Date(booking.check_in).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        })
        const checkOutDate = new Date(booking.check_out).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        })

        const details = `
🏨 BOOKING DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━

Confirmation ID: ${booking.confirmation_id}

📍 Hotel: ${booking.room_name}
📧 Guest Email: ${booking.guest_email}
👤 Guest Name: ${booking.guest_name || 'N/A'}

📅 Check-in: ${checkInDate}
📅 Check-out: ${checkOutDate}
🌙 Nights: ${booking.nights}
👥 Guests: ${booking.guests}

💰 Room Price: $${booking.room_price}/night
💵 Total Amount: $${booking.total_price}

💳 Payment Method: ${booking.payment_method}
✅ Payment Status: ${booking.payment_status}
📊 Booking Status: ${booking.status}

${booking.special_requests ? `📝 Special Requests:\n${booking.special_requests}` : ''}

Booked on: ${new Date(booking.created_at).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })}
        `.trim()

        alert(details)
    }

    const stats = getBookingStats()
    const filteredBookings = getFilteredBookings()

    if (!user) {
        return (
            <div className="my-bookings-page">
                <nav>
                    <div className="logo" onClick={() => navigate('/')}>Travelinn</div>
                </nav>
                <div className="bookings-container">
                    <div className="empty-state">
                        <h3>Please Sign In</h3>
                        <p>You need to be signed in to view your bookings</p>
                        <button className="action-btn primary" onClick={() => navigate('/signin')}>
                            Sign In
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="my-bookings-page">
            <nav>
                <div className="logo" onClick={() => navigate('/')}>Travelinn</div>
                <ul className="nav-links">
                    <li><a href="/" onClick={(e) => { e.preventDefault(); navigate('/') }}>Home</a></li>
                    <li><a href="/hotels" onClick={(e) => { e.preventDefault(); navigate('/hotels') }}>Hotels</a></li>
                    <li><a href="/wellbeing" onClick={(e) => { e.preventDefault(); navigate('/wellbeing') }}>Wellbeing</a></li>
                    <li><a href="/groups" onClick={(e) => { e.preventDefault(); navigate('/groups') }}>Groups</a></li>
                    <li><a href="/about" onClick={(e) => { e.preventDefault(); navigate('/about') }}>About</a></li>
                </ul>
                <UserMenu />
            </nav>

            <div className="bookings-container">
                {/* Header */}
                <div className="bookings-header">
                    <h1>My Bookings</h1>
                    <p>Manage your hotel reservations and travel plans</p>
                </div>

                {loading ? (
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Loading your bookings...</p>
                    </div>
                ) : (
                    <>
                        {/* Stats */}
                        <div className="bookings-stats">
                            <div className="stat-card">
                                <div className="stat-icon confirmed">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                    </svg>
                                </div>
                                <div className="stat-info">
                                    <h3>{stats.confirmed}</h3>
                                    <p>Confirmed Bookings</p>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon upcoming">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                        <line x1="16" y1="2" x2="16" y2="6"></line>
                                        <line x1="8" y1="2" x2="8" y2="6"></line>
                                        <line x1="3" y1="10" x2="21" y2="10"></line>
                                    </svg>
                                </div>
                                <div className="stat-info">
                                    <h3>{stats.total}</h3>
                                    <p>Total Bookings</p>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon completed">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                                    </svg>
                                </div>
                                <div className="stat-info">
                                    <h3>{stats.completed}</h3>
                                    <p>Completed Stays</p>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon cancelled">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <line x1="15" y1="9" x2="9" y2="15"></line>
                                        <line x1="9" y1="9" x2="15" y2="15"></line>
                                    </svg>
                                </div>
                                <div className="stat-info">
                                    <h3>{stats.cancelled}</h3>
                                    <p>Cancelled</p>
                                </div>
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="bookings-filters">
                            <button
                                className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                                onClick={() => setFilter('all')}
                            >
                                All Bookings
                            </button>
                            <button
                                className={`filter-btn ${filter === 'confirmed' ? 'active' : ''}`}
                                onClick={() => setFilter('confirmed')}
                            >
                                Confirmed
                            </button>
                            <button
                                className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
                                onClick={() => setFilter('completed')}
                            >
                                Completed
                            </button>
                            <button
                                className={`filter-btn ${filter === 'cancelled' ? 'active' : ''}`}
                                onClick={() => setFilter('cancelled')}
                            >
                                Cancelled
                            </button>
                        </div>

                        {/* Bookings List */}
                        {filteredBookings.length === 0 ? (
                            <div className="empty-state">
                                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                    <line x1="16" y1="2" x2="16" y2="6"></line>
                                    <line x1="8" y1="2" x2="8" y2="6"></line>
                                    <line x1="3" y1="10" x2="21" y2="10"></line>
                                </svg>
                                <h3>No bookings found</h3>
                                <p>
                                    {filter === 'all'
                                        ? "You haven't made any bookings yet. Start exploring our amazing hotels!"
                                        : `No ${filter} bookings found. Try a different filter.`
                                    }
                                </p>
                                <button className="action-btn primary" onClick={() => navigate('/hotels')}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                                    </svg>
                                    Browse Hotels
                                </button>
                            </div>
                        ) : (
                            <div className="bookings-list">
                                {filteredBookings.map((booking) => {
                                    const isCompleted = new Date(booking.check_out) < new Date()
                                    const isCancelled = booking.status === 'cancelled'
                                    const canCancel = !isCompleted && !isCancelled

                                    return (
                                        <div key={booking.id} className="booking-card">
                                            <div className="booking-card-header">
                                                <div className="booking-id">
                                                    <h3>{booking.room_name}</h3>
                                                    <p>Confirmation: {booking.confirmation_id}</p>
                                                </div>
                                                <span className={`booking-status ${isCancelled ? 'cancelled' : isCompleted ? 'completed' : 'confirmed'}`}>
                                                    {isCancelled ? 'Cancelled' : isCompleted ? 'Completed' : 'Confirmed'}
                                                </span>
                                            </div>

                                            <div className="booking-card-body">
                                                <img
                                                    src="https://images.unsplash.com/photo-1611892440504-42a792e24d32"
                                                    alt={booking.room_name}
                                                    className="booking-image"
                                                />
                                                <div className="booking-details">
                                                    <div className="detail-row">
                                                        <div className="detail-item">
                                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                                                <line x1="3" y1="10" x2="21" y2="10"></line>
                                                            </svg>
                                                            <span className="detail-label">Check-in:</span>
                                                            <span className="detail-value">
                                                                {new Date(booking.check_in).toLocaleDateString('en-US', {
                                                                    month: 'short',
                                                                    day: 'numeric',
                                                                    year: 'numeric'
                                                                })}
                                                            </span>
                                                        </div>
                                                        <div className="detail-item">
                                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                                                <line x1="3" y1="10" x2="21" y2="10"></line>
                                                            </svg>
                                                            <span className="detail-label">Check-out:</span>
                                                            <span className="detail-value">
                                                                {new Date(booking.check_out).toLocaleDateString('en-US', {
                                                                    month: 'short',
                                                                    day: 'numeric',
                                                                    year: 'numeric'
                                                                })}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="detail-row">
                                                        <div className="detail-item">
                                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                                                            </svg>
                                                            <span className="detail-label">Nights:</span>
                                                            <span className="detail-value">{booking.nights}</span>
                                                        </div>
                                                        <div className="detail-item">
                                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                                                <circle cx="9" cy="7" r="4"></circle>
                                                                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                                                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                                            </svg>
                                                            <span className="detail-label">Guests:</span>
                                                            <span className="detail-value">{booking.guests}</span>
                                                        </div>
                                                        <div className="detail-item">
                                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                                                                <line x1="1" y1="10" x2="23" y2="10"></line>
                                                            </svg>
                                                            <span className="detail-label">Payment:</span>
                                                            <span className="detail-value">{booking.payment_status}</span>
                                                        </div>
                                                    </div>
                                                    <div className="detail-row">
                                                        <div className="detail-item">
                                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                                                <polyline points="22,6 12,13 2,6"></polyline>
                                                            </svg>
                                                            <span className="detail-label">Email:</span>
                                                            <span className="detail-value">{booking.guest_email}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="booking-card-footer">
                                                <div className="booking-total">
                                                    <span>Total Amount</span>
                                                    <span>${booking.total_price}</span>
                                                </div>
                                                <div className="booking-actions">
                                                    <button
                                                        className="action-btn primary"
                                                        onClick={() => viewBookingDetails(booking)}
                                                    >
                                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                                            <circle cx="12" cy="12" r="3"></circle>
                                                        </svg>
                                                        View Details
                                                    </button>
                                                    {canCancel && (
                                                        <button
                                                            className="action-btn danger"
                                                            onClick={() => cancelBooking(booking.id)}
                                                        >
                                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                <circle cx="12" cy="12" r="10"></circle>
                                                                <line x1="15" y1="9" x2="9" y2="15"></line>
                                                                <line x1="9" y1="9" x2="15" y2="15"></line>
                                                            </svg>
                                                            Cancel Booking
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}