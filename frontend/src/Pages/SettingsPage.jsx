import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import UserMenu from '../components/UserMenu.jsx'
import './SettingsPage.css'

export default function SettingsPage() {
    const navigate = useNavigate()
    const { user } = useAuth()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [successMessage, setSuccessMessage] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    // Active section
    const [activeSection, setActiveSection] = useState('notifications') // notifications, privacy, display, security, account

    // Preferences state
    const [preferences, setPreferences] = useState({
        // Notifications
        email_notifications: true,
        push_notifications: false,
        sms_notifications: false,
        newsletter: true,
        marketing_emails: false,
        booking_reminders: true,
        price_alerts: true,

        // Privacy
        profile_visibility: 'public',
        show_email: false,
        show_phone: false,
        show_location: true,

        // Display
        theme: 'dark',
        language: 'en',
        timezone: 'UTC',
        currency: 'USD',

        // Communication
        preferred_contact_method: 'email',

        // App
        auto_save: true,
        show_tips: true,
        compact_view: false
    })

    // Activity log
    const [activities, setActivities] = useState([])
    const [sessions, setSessions] = useState([])
    const [loadingActivities, setLoadingActivities] = useState(false)
    const [loadingSessions, setLoadingSessions] = useState(false)

    // Password change
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    })

    // Account deletion
    const [deleteConfirmation, setDeleteConfirmation] = useState('')
    const [showDeleteModal, setShowDeleteModal] = useState(false)

    useEffect(() => {
        if (user) {
            loadPreferences()
        } else {
            navigate('/signin')
        }
    }, [user, navigate])

    // Auto-hide messages
    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => setSuccessMessage(''), 5000)
            return () => clearTimeout(timer)
        }
    }, [successMessage])

    useEffect(() => {
        if (errorMessage) {
            const timer = setTimeout(() => setErrorMessage(''), 7000)
            return () => clearTimeout(timer)
        }
    }, [errorMessage])

    // Load activities/sessions when section changes
    useEffect(() => {
        if (activeSection === 'security') {
            loadActivities()
            loadSessions()
        }
    }, [activeSection])

    const loadPreferences = async () => {
        try {
            setLoading(true)
            console.log('Loading preferences for user:', user.id)

            const { data, error } = await supabase
                .from('user_preferences')
                .select('*')
                .eq('user_id', user.id)
                .single()

            if (error && error.code !== 'PGRST116') {
                console.error('Error loading preferences:', error)
            }

            if (data) {
                console.log('Preferences loaded:', data)
                setPreferences({
                    email_notifications: data.email_notifications ?? true,
                    push_notifications: data.push_notifications ?? false,
                    sms_notifications: data.sms_notifications ?? false,
                    newsletter: data.newsletter ?? true,
                    marketing_emails: data.marketing_emails ?? false,
                    booking_reminders: data.booking_reminders ?? true,
                    price_alerts: data.price_alerts ?? true,
                    profile_visibility: data.profile_visibility ?? 'public',
                    show_email: data.show_email ?? false,
                    show_phone: data.show_phone ?? false,
                    show_location: data.show_location ?? true,
                    theme: data.theme ?? 'dark',
                    language: data.language ?? 'en',
                    timezone: data.timezone ?? 'UTC',
                    currency: data.currency ?? 'USD',
                    preferred_contact_method: data.preferred_contact_method ?? 'email',
                    auto_save: data.auto_save ?? true,
                    show_tips: data.show_tips ?? true,
                    compact_view: data.compact_view ?? false
                })
            }
        } catch (error) {
            console.error('Error in loadPreferences:', error)
            setErrorMessage('Failed to load preferences')
        } finally {
            setLoading(false)
        }
    }

    const loadActivities = async () => {
        try {
            setLoadingActivities(true)
            const { data, error } = await supabase
                .from('user_activity')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(20)

            if (error) throw error
            setActivities(data || [])
        } catch (error) {
            console.error('Error loading activities:', error)
        } finally {
            setLoadingActivities(false)
        }
    }

    const loadSessions = async () => {
        try {
            setLoadingSessions(true)
            const { data, error } = await supabase
                .from('user_sessions')
                .select('*')
                .eq('user_id', user.id)
                .order('last_active', { ascending: false })

            if (error) throw error
            setSessions(data || [])
        } catch (error) {
            console.error('Error loading sessions:', error)
        } finally {
            setLoadingSessions(false)
        }
    }

    const savePreferences = async () => {
        try {
            setSaving(true)
            console.log('Saving preferences:', preferences)

            const { data, error } = await supabase
                .from('user_preferences')
                .upsert({
                    user_id: user.id,
                    ...preferences,
                    updated_at: new Date().toISOString()
                }, { onConflict: 'user_id' })
                .select()

            if (error) {
                console.error('Error saving preferences:', error)
                setErrorMessage('Failed to save preferences: ' + error.message)
                return
            }

            console.log('Preferences saved:', data)
            await logActivity('preferences_updated', 'User updated their preferences')
            setSuccessMessage('✅ Settings saved successfully!')

        } catch (error) {
            console.error('Error in savePreferences:', error)
            setErrorMessage('Error saving preferences: ' + error.message)
        } finally {
            setSaving(false)
        }
    }

    const handlePasswordChange = async () => {
        try {
            setErrorMessage('')

            if (!passwordData.currentPassword) {
                setErrorMessage('❌ Please enter your current password')
                return
            }

            if (passwordData.newPassword !== passwordData.confirmPassword) {
                setErrorMessage('❌ New passwords do not match!')
                return
            }

            if (passwordData.newPassword.length < 6) {
                setErrorMessage('❌ Password must be at least 6 characters!')
                return
            }

            setSaving(true)
            console.log('Updating password...')

            const { data, error } = await supabase.auth.updateUser({
                password: passwordData.newPassword
            })

            if (error) {
                console.error('Password update error:', error)
                setErrorMessage('Failed to update password: ' + error.message)
                return
            }

            console.log('Password updated successfully')
            await logActivity('password_changed', 'User changed their password')
            setSuccessMessage('✅ Password updated successfully!')
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })

        } catch (error) {
            console.error('Error in handlePasswordChange:', error)
            setErrorMessage('Error updating password: ' + error.message)
        } finally {
            setSaving(false)
        }
    }

    const handleDeleteSession = async (sessionId) => {
        try {
            const { error } = await supabase
                .from('user_sessions')
                .delete()
                .eq('id', sessionId)

            if (error) throw error

            setSessions(sessions.filter(s => s.id !== sessionId))
            setSuccessMessage('✅ Session terminated successfully')
            await logActivity('session_terminated', 'User terminated an active session')
        } catch (error) {
            console.error('Error deleting session:', error)
            setErrorMessage('Failed to terminate session')
        }
    }

    const handleDeleteAccount = async () => {
        if (deleteConfirmation !== 'DELETE MY ACCOUNT') {
            setErrorMessage('❌ Please type "DELETE MY ACCOUNT" to confirm')
            return
        }

        try {
            setSaving(true)

            // Update account status to deleted
            const { error } = await supabase
                .from('profiles')
                .update({ account_status: 'deleted' })
                .eq('id', user.id)

            if (error) throw error

            await logActivity('account_deleted', 'User deleted their account')

            // Sign out
            await supabase.auth.signOut()
            navigate('/signin')

        } catch (error) {
            console.error('Error deleting account:', error)
            setErrorMessage('Failed to delete account')
        } finally {
            setSaving(false)
            setShowDeleteModal(false)
        }
    }

    const logActivity = async (activityType, description) => {
        try {
            await supabase.rpc('log_user_activity', {
                p_user_id: user.id,
                p_activity_type: activityType,
                p_description: description
            })
        } catch (error) {
            console.error('Error logging activity:', error)
        }
    }

    const updatePreference = (key, value) => {
        setPreferences(prev => ({ ...prev, [key]: value }))
    }

    const formatDate = (dateString) => {
        if (!dateString) return 'Never'
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const formatRelativeTime = (dateString) => {
        if (!dateString) return 'Never'
        const date = new Date(dateString)
        const now = new Date()
        const diffMs = now - date
        const diffMins = Math.floor(diffMs / 60000)
        const diffHours = Math.floor(diffMins / 60)
        const diffDays = Math.floor(diffHours / 24)

        if (diffMins < 1) return 'Just now'
        if (diffMins < 60) return `${diffMins}m ago`
        if (diffHours < 24) return `${diffHours}h ago`
        if (diffDays < 7) return `${diffDays}d ago`
        return formatDate(dateString)
    }

    const getActivityIcon = (activityType) => {
        const icons = {
            'profile_updated': '👤',
            'avatar_updated': '📸',
            'cover_updated': '🖼️',
            'password_changed': '🔒',
            'preferences_updated': '⚙️',
            'session_terminated': '🚪',
            'login': '🔓',
            'logout': '🔐',
            'account_deleted': '🗑️'
        }
        return icons[activityType] || '📝'
    }

    if (loading) {
        return (
            <div className="settings-page">
                <nav>
                    <div className="nav-left">
                        <button className="back-button" onClick={() => navigate(-1)}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="19" y1="12" x2="5" y2="12"/>
                                <polyline points="12 19 5 12 12 5"/>
                            </svg>
                        </button>
                        <div className="logo" onClick={() => navigate('/')}>Travelinn</div>
                    </div>
                    <ul className="nav-links">
                        <li><a href="/" onClick={(e) => { e.preventDefault(); navigate('/') }}>Home</a></li>
                        <li><a href="/hotels" onClick={(e) => { e.preventDefault(); navigate('/hotels') }}>Hotels</a></li>
                        <li><a href="/wellbeing" onClick={(e) => { e.preventDefault(); navigate('/wellbeing') }}>Wellbeing</a></li>
                        <li><a href="/groups" onClick={(e) => { e.preventDefault(); navigate('/groups') }}>Groups</a></li>
                        <li><a href="/about" onClick={(e) => { e.preventDefault(); navigate('/about') }}>About</a></li>
                    </ul>
                    <UserMenu />
                </nav>
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Loading settings...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="settings-page">
            <nav>
                <div className="nav-left">
                    <button className="back-button" onClick={() => navigate(-1)} aria-label="Go back">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="19" y1="12" x2="5" y2="12"/>
                            <polyline points="12 19 5 12 12 5"/>
                        </svg>
                    </button>
                    <div className="logo" onClick={() => navigate('/')}>Travelinn</div>
                </div>
                <ul className="nav-links">
                    <li><a href="/" onClick={(e) => { e.preventDefault(); navigate('/') }}>Home</a></li>
                    <li><a href="/hotels" onClick={(e) => { e.preventDefault(); navigate('/hotels') }}>Hotels</a></li>
                    <li><a href="/wellbeing" onClick={(e) => { e.preventDefault(); navigate('/wellbeing') }}>Wellbeing</a></li>
                    <li><a href="/groups" onClick={(e) => { e.preventDefault(); navigate('/groups') }}>Groups</a></li>
                    <li><a href="/about" onClick={(e) => { e.preventDefault(); navigate('/about') }}>About</a></li>
                </ul>
                <UserMenu />
            </nav>

            <div className="settings-container">
                <div className="settings-header">
                    <h1>⚙️ Settings</h1>
                    <p>Manage your account preferences and settings</p>
                </div>

                <div className="settings-content">
                    {/* Sidebar Navigation */}
                    <div className="settings-sidebar">
                        <button
                            className={`sidebar-item ${activeSection === 'notifications' ? 'active' : ''}`}
                            onClick={() => setActiveSection('notifications')}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                            </svg>
                            <span>Notifications</span>
                        </button>

                        <button
                            className={`sidebar-item ${activeSection === 'privacy' ? 'active' : ''}`}
                            onClick={() => setActiveSection('privacy')}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                            </svg>
                            <span>Privacy</span>
                        </button>

                        <button
                            className={`sidebar-item ${activeSection === 'display' ? 'active' : ''}`}
                            onClick={() => setActiveSection('display')}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                                <line x1="8" y1="21" x2="16" y2="21"></line>
                                <line x1="12" y1="17" x2="12" y2="21"></line>
                            </svg>
                            <span>Display</span>
                        </button>

                        <button
                            className={`sidebar-item ${activeSection === 'security' ? 'active' : ''}`}
                            onClick={() => setActiveSection('security')}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                            </svg>
                            <span>Security</span>
                        </button>

                        <button
                            className={`sidebar-item ${activeSection === 'account' ? 'active' : ''}`}
                            onClick={() => setActiveSection('account')}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                            <span>Account</span>
                        </button>
                    </div>

                    {/* Main Content */}
                    <div className="settings-main">
                        {/* Success/Error Messages */}
                        {successMessage && (
                            <div className="success-message">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                {successMessage}
                            </div>
                        )}

                        {errorMessage && (
                            <div className="error-message">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                {errorMessage}
                            </div>
                        )}

                        {/* NOTIFICATIONS SECTION */}
                        {activeSection === 'notifications' && (
                            <div className="settings-section">
                                <div className="section-header">
                                    <h2>🔔 Notification Preferences</h2>
                                    <p>Choose how you want to be notified</p>
                                </div>

                                <div className="settings-group">
                                    <h3>Communication Channels</h3>

                                    <div className="setting-item">
                                        <div className="setting-info">
                                            <h4>📧 Email Notifications</h4>
                                            <p>Receive notifications via email</p>
                                        </div>
                                        <label className="toggle-switch">
                                            <input
                                                type="checkbox"
                                                checked={preferences.email_notifications}
                                                onChange={(e) => updatePreference('email_notifications', e.target.checked)}
                                            />
                                            <span className="toggle-slider"></span>
                                        </label>
                                    </div>

                                    <div className="setting-item">
                                        <div className="setting-info">
                                            <h4>📱 Push Notifications</h4>
                                            <p>Get push notifications on your device</p>
                                        </div>
                                        <label className="toggle-switch">
                                            <input
                                                type="checkbox"
                                                checked={preferences.push_notifications}
                                                onChange={(e) => updatePreference('push_notifications', e.target.checked)}
                                            />
                                            <span className="toggle-slider"></span>
                                        </label>
                                    </div>

                                    <div className="setting-item">
                                        <div className="setting-info">
                                            <h4>💬 SMS Notifications</h4>
                                            <p>Receive text messages for important updates</p>
                                        </div>
                                        <label className="toggle-switch">
                                            <input
                                                type="checkbox"
                                                checked={preferences.sms_notifications}
                                                onChange={(e) => updatePreference('sms_notifications', e.target.checked)}
                                            />
                                            <span className="toggle-slider"></span>
                                        </label>
                                    </div>
                                </div>

                                <div className="settings-group">
                                    <h3>Content Preferences</h3>

                                    <div className="setting-item">
                                        <div className="setting-info">
                                            <h4>🛎️ Booking Reminders</h4>
                                            <p>Reminders about upcoming bookings and check-ins</p>
                                        </div>
                                        <label className="toggle-switch">
                                            <input
                                                type="checkbox"
                                                checked={preferences.booking_reminders}
                                                onChange={(e) => updatePreference('booking_reminders', e.target.checked)}
                                            />
                                            <span className="toggle-slider"></span>
                                        </label>
                                    </div>

                                    <div className="setting-item">
                                        <div className="setting-info">
                                            <h4>💰 Price Alerts</h4>
                                            <p>Get notified about price drops and special offers</p>
                                        </div>
                                        <label className="toggle-switch">
                                            <input
                                                type="checkbox"
                                                checked={preferences.price_alerts}
                                                onChange={(e) => updatePreference('price_alerts', e.target.checked)}
                                            />
                                            <span className="toggle-slider"></span>
                                        </label>
                                    </div>

                                    <div className="setting-item">
                                        <div className="setting-info">
                                            <h4>📰 Newsletter</h4>
                                            <p>Weekly travel tips and destination guides</p>
                                        </div>
                                        <label className="toggle-switch">
                                            <input
                                                type="checkbox"
                                                checked={preferences.newsletter}
                                                onChange={(e) => updatePreference('newsletter', e.target.checked)}
                                            />
                                            <span className="toggle-slider"></span>
                                        </label>
                                    </div>

                                    <div className="setting-item">
                                        <div className="setting-info">
                                            <h4>🎯 Marketing Emails</h4>
                                            <p>Promotional offers and partner deals</p>
                                        </div>
                                        <label className="toggle-switch">
                                            <input
                                                type="checkbox"
                                                checked={preferences.marketing_emails}
                                                onChange={(e) => updatePreference('marketing_emails', e.target.checked)}
                                            />
                                            <span className="toggle-slider"></span>
                                        </label>
                                    </div>
                                </div>

                                <div className="settings-group">
                                    <h3>Preferred Contact Method</h3>

                                    <div className="radio-group">
                                        <label className="radio-item">
                                            <input
                                                type="radio"
                                                name="contact_method"
                                                value="email"
                                                checked={preferences.preferred_contact_method === 'email'}
                                                onChange={(e) => updatePreference('preferred_contact_method', e.target.value)}
                                            />
                                            <div className="radio-content">
                                                <h4>📧 Email</h4>
                                                <p>Send important updates via email</p>
                                            </div>
                                        </label>

                                        <label className="radio-item">
                                            <input
                                                type="radio"
                                                name="contact_method"
                                                value="sms"
                                                checked={preferences.preferred_contact_method === 'sms'}
                                                onChange={(e) => updatePreference('preferred_contact_method', e.target.value)}
                                            />
                                            <div className="radio-content">
                                                <h4>💬 SMS</h4>
                                                <p>Receive text messages for urgent matters</p>
                                            </div>
                                        </label>

                                        <label className="radio-item">
                                            <input
                                                type="radio"
                                                name="contact_method"
                                                value="phone"
                                                checked={preferences.preferred_contact_method === 'phone'}
                                                onChange={(e) => updatePreference('preferred_contact_method', e.target.value)}
                                            />
                                            <div className="radio-content">
                                                <h4>📞 Phone</h4>
                                                <p>Call me for important updates</p>
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                <button
                                    className="save-button"
                                    onClick={savePreferences}
                                    disabled={saving}
                                >
                                    {saving ? (
                                        <>
                                            <div className="spinner"></div>
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <polyline points="20 6 9 17 4 12"></polyline>
                                            </svg>
                                            Save Changes
                                        </>
                                    )}
                                </button>
                            </div>
                        )}

                        {/* PRIVACY SECTION */}
                        {activeSection === 'privacy' && (
                            <div className="settings-section">
                                <div className="section-header">
                                    <h2>🔒 Privacy Settings</h2>
                                    <p>Control who can see your information</p>
                                </div>

                                <div className="settings-group">
                                    <h3>Profile Visibility</h3>

                                    <div className="radio-group">
                                        <label className="radio-item">
                                            <input
                                                type="radio"
                                                name="visibility"
                                                value="public"
                                                checked={preferences.profile_visibility === 'public'}
                                                onChange={(e) => updatePreference('profile_visibility', e.target.value)}
                                            />
                                            <div className="radio-content">
                                                <h4>🌍 Public</h4>
                                                <p>Anyone can view your profile</p>
                                            </div>
                                        </label>

                                        <label className="radio-item">
                                            <input
                                                type="radio"
                                                name="visibility"
                                                value="friends"
                                                checked={preferences.profile_visibility === 'friends'}
                                                onChange={(e) => updatePreference('profile_visibility', e.target.value)}
                                            />
                                            <div className="radio-content">
                                                <h4>👥 Friends Only</h4>
                                                <p>Only your connections can see your profile</p>
                                            </div>
                                        </label>

                                        <label className="radio-item">
                                            <input
                                                type="radio"
                                                name="visibility"
                                                value="private"
                                                checked={preferences.profile_visibility === 'private'}
                                                onChange={(e) => updatePreference('profile_visibility', e.target.value)}
                                            />
                                            <div className="radio-content">
                                                <h4>🔒 Private</h4>
                                                <p>Only you can see your profile</p>
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                <div className="settings-group">
                                    <h3>Information Visibility</h3>

                                    <div className="setting-item">
                                        <div className="setting-info">
                                            <h4>📧 Show Email Address</h4>
                                            <p>Display your email on your public profile</p>
                                        </div>
                                        <label className="toggle-switch">
                                            <input
                                                type="checkbox"
                                                checked={preferences.show_email}
                                                onChange={(e) => updatePreference('show_email', e.target.checked)}
                                            />
                                            <span className="toggle-slider"></span>
                                        </label>
                                    </div>

                                    <div className="setting-item">
                                        <div className="setting-info">
                                            <h4>📞 Show Phone Number</h4>
                                            <p>Display your phone number on your profile</p>
                                        </div>
                                        <label className="toggle-switch">
                                            <input
                                                type="checkbox"
                                                checked={preferences.show_phone}
                                                onChange={(e) => updatePreference('show_phone', e.target.checked)}
                                            />
                                            <span className="toggle-slider"></span>
                                        </label>
                                    </div>

                                    <div className="setting-item">
                                        <div className="setting-info">
                                            <h4>📍 Show Location</h4>
                                            <p>Display your city and country on your profile</p>
                                        </div>
                                        <label className="toggle-switch">
                                            <input
                                                type="checkbox"
                                                checked={preferences.show_location}
                                                onChange={(e) => updatePreference('show_location', e.target.checked)}
                                            />
                                            <span className="toggle-slider"></span>
                                        </label>
                                    </div>
                                </div>

                                <button
                                    className="save-button"
                                    onClick={savePreferences}
                                    disabled={saving}
                                >
                                    {saving ? (
                                        <>
                                            <div className="spinner"></div>
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <polyline points="20 6 9 17 4 12"></polyline>
                                            </svg>
                                            Save Changes
                                        </>
                                    )}
                                </button>
                            </div>
                        )}

                        {/* DISPLAY SECTION */}
                        {activeSection === 'display' && (
                            <div className="settings-section">
                                <div className="section-header">
                                    <h2>🎨 Display Settings</h2>
                                    <p>Customize how the app looks and feels</p>
                                </div>

                                <div className="settings-group">
                                    <h3>Appearance</h3>

                                    <div className="radio-group">
                                        <label className="radio-item">
                                            <input
                                                type="radio"
                                                name="theme"
                                                value="light"
                                                checked={preferences.theme === 'light'}
                                                onChange={(e) => updatePreference('theme', e.target.value)}
                                            />
                                            <div className="radio-content">
                                                <h4>☀️ Light Mode</h4>
                                                <p>Bright and clean interface</p>
                                            </div>
                                        </label>

                                        <label className="radio-item">
                                            <input
                                                type="radio"
                                                name="theme"
                                                value="dark"
                                                checked={preferences.theme === 'dark'}
                                                onChange={(e) => updatePreference('theme', e.target.value)}
                                            />
                                            <div className="radio-content">
                                                <h4>🌙 Dark Mode</h4>
                                                <p>Easy on the eyes, especially at night</p>
                                            </div>
                                        </label>

                                        <label className="radio-item">
                                            <input
                                                type="radio"
                                                name="theme"
                                                value="auto"
                                                checked={preferences.theme === 'auto'}
                                                onChange={(e) => updatePreference('theme', e.target.value)}
                                            />
                                            <div className="radio-content">
                                                <h4>🌗 Auto</h4>
                                                <p>Follow system preference</p>
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                <div className="settings-group">
                                    <h3>Localization</h3>

                                    <div className="select-group">
                                        <div className="select-item">
                                            <label>
                                                <h4>🌐 Language</h4>
                                                <p>Choose your preferred language</p>
                                            </label>
                                            <select
                                                value={preferences.language}
                                                onChange={(e) => updatePreference('language', e.target.value)}
                                            >
                                                <option value="en">English</option>
                                                <option value="es">Español</option>
                                                <option value="fr">Français</option>
                                                <option value="de">Deutsch</option>
                                                <option value="it">Italiano</option>
                                                <option value="pt">Português</option>
                                                <option value="ja">日本語</option>
                                                <option value="zh">中文</option>
                                                <option value="ar">العربية</option>
                                            </select>
                                        </div>

                                        <div className="select-item">
                                            <label>
                                                <h4>🕒 Timezone</h4>
                                                <p>Your local timezone</p>
                                            </label>
                                            <select
                                                value={preferences.timezone}
                                                onChange={(e) => updatePreference('timezone', e.target.value)}
                                            >
                                                <option value="UTC">UTC (GMT+0)</option>
                                                <option value="America/New_York">Eastern Time (GMT-5)</option>
                                                <option value="America/Chicago">Central Time (GMT-6)</option>
                                                <option value="America/Denver">Mountain Time (GMT-7)</option>
                                                <option value="America/Los_Angeles">Pacific Time (GMT-8)</option>
                                                <option value="Europe/London">London (GMT+0)</option>
                                                <option value="Europe/Paris">Paris (GMT+1)</option>
                                                <option value="Asia/Tokyo">Tokyo (GMT+9)</option>
                                                <option value="Asia/Dubai">Dubai (GMT+4)</option>
                                                <option value="Australia/Sydney">Sydney (GMT+10)</option>
                                            </select>
                                        </div>

                                        <div className="select-item">
                                            <label>
                                                <h4>💵 Currency</h4>
                                                <p>Display prices in your currency</p>
                                            </label>
                                            <select
                                                value={preferences.currency}
                                                onChange={(e) => updatePreference('currency', e.target.value)}
                                            >
                                                <option value="USD">USD ($)</option>
                                                <option value="EUR">EUR (€)</option>
                                                <option value="GBP">GBP (£)</option>
                                                <option value="JPY">JPY (¥)</option>
                                                <option value="AUD">AUD (A$)</option>
                                                <option value="CAD">CAD (C$)</option>
                                                <option value="CHF">CHF (Fr)</option>
                                                <option value="CNY">CNY (¥)</option>
                                                <option value="AED">AED (د.إ)</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="settings-group">
                                    <h3>App Behavior</h3>

                                    <div className="setting-item">
                                        <div className="setting-info">
                                            <h4>💾 Auto-Save</h4>
                                            <p>Automatically save your changes</p>
                                        </div>
                                        <label className="toggle-switch">
                                            <input
                                                type="checkbox"
                                                checked={preferences.auto_save}
                                                onChange={(e) => updatePreference('auto_save', e.target.checked)}
                                            />
                                            <span className="toggle-slider"></span>
                                        </label>
                                    </div>

                                    <div className="setting-item">
                                        <div className="setting-info">
                                            <h4>💡 Show Tips</h4>
                                            <p>Display helpful tips and hints</p>
                                        </div>
                                        <label className="toggle-switch">
                                            <input
                                                type="checkbox"
                                                checked={preferences.show_tips}
                                                onChange={(e) => updatePreference('show_tips', e.target.checked)}
                                            />
                                            <span className="toggle-slider"></span>
                                        </label>
                                    </div>

                                    <div className="setting-item">
                                        <div className="setting-info">
                                            <h4>📱 Compact View</h4>
                                            <p>Use a more compact interface</p>
                                        </div>
                                        <label className="toggle-switch">
                                            <input
                                                type="checkbox"
                                                checked={preferences.compact_view}
                                                onChange={(e) => updatePreference('compact_view', e.target.checked)}
                                            />
                                            <span className="toggle-slider"></span>
                                        </label>
                                    </div>
                                </div>

                                <button
                                    className="save-button"
                                    onClick={savePreferences}
                                    disabled={saving}
                                >
                                    {saving ? (
                                        <>
                                            <div className="spinner"></div>
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <polyline points="20 6 9 17 4 12"></polyline>
                                            </svg>
                                            Save Changes
                                        </>
                                    )}
                                </button>
                            </div>
                        )}

                        {/* SECURITY SECTION */}
                        {activeSection === 'security' && (
                            <div className="settings-section">
                                <div className="section-header">
                                    <h2>🔐 Security</h2>
                                    <p>Manage your password and security options</p>
                                </div>

                                <div className="settings-group">
                                    <h3>Change Password</h3>

                                    <div className="form-group">
                                        <label>Current Password</label>
                                        <input
                                            type="password"
                                            value={passwordData.currentPassword}
                                            onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                                            placeholder="Enter current password"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>New Password</label>
                                        <input
                                            type="password"
                                            value={passwordData.newPassword}
                                            onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                                            placeholder="Enter new password (min 6 characters)"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Confirm New Password</label>
                                        <input
                                            type="password"
                                            value={passwordData.confirmPassword}
                                            onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                                            placeholder="Confirm new password"
                                        />
                                    </div>

                                    <button
                                        className="save-button"
                                        onClick={handlePasswordChange}
                                        disabled={saving || !passwordData.newPassword}
                                    >
                                        {saving ? 'Updating...' : 'Update Password'}
                                    </button>
                                </div>

                                <div className="settings-group">
                                    <h3>Activity Log</h3>
                                    {loadingActivities ? (
                                        <div className="loading-state">
                                            <div className="spinner"></div>
                                            <p>Loading activities...</p>
                                        </div>
                                    ) : activities.length === 0 ? (
                                        <div className="empty-state">
                                            <p>No recent activity</p>
                                        </div>
                                    ) : (
                                        <div className="activity-list">
                                            {activities.map((activity) => (
                                                <div key={activity.id} className="activity-item">
                                                    <div className="activity-icon">
                                                        {getActivityIcon(activity.activity_type)}
                                                    </div>
                                                    <div className="activity-content">
                                                        <h4>{activity.description || activity.activity_type}</h4>
                                                        <p>{formatRelativeTime(activity.created_at)}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="settings-group">
                                    <h3>Active Sessions</h3>
                                    {loadingSessions ? (
                                        <div className="loading-state">
                                            <div className="spinner"></div>
                                            <p>Loading sessions...</p>
                                        </div>
                                    ) : sessions.length === 0 ? (
                                        <div className="empty-state">
                                            <p>No active sessions</p>
                                        </div>
                                    ) : (
                                        <div className="sessions-list">
                                            {sessions.map((session) => (
                                                <div key={session.id} className="session-item">
                                                    <div className="session-info">
                                                        <h4>
                                                            {session.device_name || session.browser || 'Unknown Device'}
                                                            {session.is_current && <span className="current-badge">Current</span>}
                                                        </h4>
                                                        <p>
                                                            {session.location || 'Unknown location'} •
                                                            Last active: {formatRelativeTime(session.last_active)}
                                                        </p>
                                                    </div>
                                                    {!session.is_current && (
                                                        <button
                                                            className="terminate-button"
                                                            onClick={() => handleDeleteSession(session.id)}
                                                        >
                                                            Terminate
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* ACCOUNT SECTION */}
                        {activeSection === 'account' && (
                            <div className="settings-section">
                                <div className="section-header">
                                    <h2>👤 Account Management</h2>
                                    <p>Manage your account settings and data</p>
                                </div>

                                <div className="settings-group">
                                    <h3>Account Information</h3>

                                    <div className="info-grid">
                                        <div className="info-item">
                                            <label>Email Address</label>
                                            <p>{user?.email}</p>
                                        </div>
                                        <div className="info-item">
                                            <label>User ID</label>
                                            <p>{user?.id?.substring(0, 8)}...</p>
                                        </div>
                                        <div className="info-item">
                                            <label>Account Created</label>
                                            <p>{formatDate(user?.created_at)}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="settings-group danger-zone">
                                    <h3>⚠️ Danger Zone</h3>

                                    <div className="danger-card">
                                        <div className="danger-content">
                                            <h4>Delete Account</h4>
                                            <p>Permanently delete your account and all your data. This action cannot be undone.</p>
                                        </div>
                                        <button
                                            className="danger-button"
                                            onClick={() => setShowDeleteModal(true)}
                                        >
                                            Delete Account
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Delete Account Modal */}
            {showDeleteModal && (
                <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>⚠️ Delete Account</h2>
                            <button className="close-button" onClick={() => setShowDeleteModal(false)}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>
                        <div className="modal-body">
                            <p>This will permanently delete your account and all associated data including:</p>
                            <ul>
                                <li>Your profile information</li>
                                <li>All your bookings</li>
                                <li>Saved preferences</li>
                                <li>Activity history</li>
                            </ul>
                            <p><strong>This action cannot be undone!</strong></p>
                            <div className="form-group">
                                <label>Type "DELETE MY ACCOUNT" to confirm:</label>
                                <input
                                    type="text"
                                    value={deleteConfirmation}
                                    onChange={(e) => setDeleteConfirmation(e.target.value)}
                                    placeholder="DELETE MY ACCOUNT"
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button
                                className="cancel-button"
                                onClick={() => {
                                    setShowDeleteModal(false)
                                    setDeleteConfirmation('')
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                className="danger-button"
                                onClick={handleDeleteAccount}
                                disabled={deleteConfirmation !== 'DELETE MY ACCOUNT' || saving}
                            >
                                {saving ? 'Deleting...' : 'Delete My Account'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}