import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import './UserMenu.css'

export default function UserMenu() {
    const navigate = useNavigate()
    const { user, signOut } = useAuth()
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const dropdownRef = useRef(null)

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleSignOut = async () => {
        try {
            await signOut()
            setDropdownOpen(false)
            navigate('/')
        } catch (error) {
            console.error('Error signing out:', error)
        }
    }

    if (!user) return null

    // Get user's email or name
    const displayName = user.user_metadata?.full_name || user.email

    // Get initials for avatar
    const getInitials = (name) => {
        if (user.user_metadata?.full_name) {
            return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        }
        return name.charAt(0).toUpperCase()
    }

    return (
        <div className="user-menu" ref={dropdownRef}>
            <button
                className="user-menu-trigger"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-label="User menu"
            >
                <div className="user-avatar">
                    {getInitials(displayName)}
                </div>
                <span className="user-email">{user.email}</span>
                <svg
                    className={`dropdown-arrow ${dropdownOpen ? 'open' : ''}`}
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
            </button>

            {dropdownOpen && (
                <div className="user-dropdown">
                    <div className="dropdown-header">
                        <div className="dropdown-avatar">
                            {getInitials(displayName)}
                        </div>
                        <div className="dropdown-user-info">
                            <p className="dropdown-name">{displayName}</p>
                            <p className="dropdown-email">{user.email}</p>
                        </div>
                    </div>

                    <div className="dropdown-divider"></div>

                    <div className="dropdown-menu">
                        <button
                            className="dropdown-item"
                            onClick={() => {
                                navigate('/profile')
                                setDropdownOpen(false)
                            }}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                            <span>My Profile</span>
                        </button>

                        <button
                            className="dropdown-item"
                            onClick={() => {
                                navigate('/bookings')
                                setDropdownOpen(false)
                            }}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                <line x1="3" y1="10" x2="21" y2="10"></line>
                            </svg>
                            <span>My Bookings</span>
                        </button>

                        <button
                            className="dropdown-item"
                            onClick={() => {
                                navigate('/settings')
                                setDropdownOpen(false)
                            }}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="3"></circle>
                                <path d="M12 1v6m0 6v6"></path>
                                <path d="M21 12h-6m-6 0H3"></path>
                            </svg>
                            <span>Settings</span>
                        </button>
                    </div>

                    <div className="dropdown-divider"></div>

                    <div className="dropdown-menu">
                        <button
                            className="dropdown-item sign-out-item"
                            onClick={handleSignOut}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                <polyline points="16 17 21 12 16 7"></polyline>
                                <line x1="21" y1="12" x2="9" y2="12"></line>
                            </svg>
                            <span>Sign Out</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}