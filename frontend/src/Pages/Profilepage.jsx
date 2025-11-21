import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import UserMenu from '../components/UserMenu'
import './ProfilePage.css'

export default function ProfilePage() {
    const navigate = useNavigate()
    const { user } = useAuth()
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)
    const [saving, setSaving] = useState(false)

    // Profile data
    const [profile, setProfile] = useState({
        full_name: '',
        username: '',
        bio: '',
        phone: '',
        country: '',
        city: '',
        date_of_birth: '',
        avatar_url: '',
        cover_photo_url: ''
    })

    // Edit mode
    const [isEditing, setIsEditing] = useState(false)
    const [editedProfile, setEditedProfile] = useState({...profile})

    // Tab state
    const [activeTab, setActiveTab] = useState('profile') // profile, security, preferences

    // Password change
    const [passwordData, setPasswordData] = useState({
        newPassword: '',
        confirmPassword: ''
    })

    // Preferences
    const [preferences, setPreferences] = useState({
        emailNotifications: true,
        pushNotifications: false,
        newsletter: true,
        marketingEmails: false
    })

    useEffect(() => {
        if (user) {
            loadProfile()
        } else {
            navigate('/signin')
        }
    }, [user, navigate])

    const loadProfile = async () => {
        try {
            setLoading(true)

            // Get profile from Supabase
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single()

            if (error && error.code !== 'PGRST116') {
                throw error
            }

            if (data) {
                setProfile(data)
                setEditedProfile(data)
            } else {
                // Create profile if it doesn't exist
                const newProfile = {
                    id: user.id,
                    email: user.email,
                    full_name: user.user_metadata?.full_name || '',
                    avatar_url: '',
                    updated_at: new Date().toISOString()
                }

                const { error: insertError } = await supabase
                    .from('profiles')
                    .insert([newProfile])

                if (!insertError) {
                    setProfile(newProfile)
                    setEditedProfile(newProfile)
                }
            }
        } catch (error) {
            console.error('Error loading profile:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleAvatarUpload = async (event) => {
        try {
            setUploading(true)

            if (!event.target.files || event.target.files.length === 0) {
                return
            }

            const file = event.target.files[0]
            const fileExt = file.name.split('.').pop()
            const fileName = `${user.id}-${Math.random()}.${fileExt}`
            const filePath = `avatars/${fileName}`

            // Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from('profiles')
                .upload(filePath, file)

            if (uploadError) {
                throw uploadError
            }

            // Get public URL
            const { data } = supabase.storage
                .from('profiles')
                .getPublicUrl(filePath)

            const avatarUrl = data.publicUrl

            // Update profile with new avatar URL
            const { error: updateError } = await supabase
                .from('profiles')
                .update({ avatar_url: avatarUrl })
                .eq('id', user.id)

            if (updateError) {
                throw updateError
            }

            setProfile({ ...profile, avatar_url: avatarUrl })
            setEditedProfile({ ...editedProfile, avatar_url: avatarUrl })
        } catch (error) {
            console.error('Error uploading avatar:', error)
            alert('Error uploading image. Please try again.')
        } finally {
            setUploading(false)
        }
    }

    const handleCoverPhotoUpload = async (event) => {
        try {
            setUploading(true)

            if (!event.target.files || event.target.files.length === 0) {
                return
            }

            const file = event.target.files[0]
            const fileExt = file.name.split('.').pop()
            const fileName = `${user.id}-cover-${Math.random()}.${fileExt}`
            const filePath = `covers/${fileName}`

            const { error: uploadError } = await supabase.storage
                .from('profiles')
                .upload(filePath, file)

            if (uploadError) {
                throw uploadError
            }

            const { data } = supabase.storage
                .from('profiles')
                .getPublicUrl(filePath)

            const coverUrl = data.publicUrl

            const { error: updateError } = await supabase
                .from('profiles')
                .update({ cover_photo_url: coverUrl })
                .eq('id', user.id)

            if (updateError) {
                throw updateError
            }

            setProfile({ ...profile, cover_photo_url: coverUrl })
            setEditedProfile({ ...editedProfile, cover_photo_url: coverUrl })
        } catch (error) {
            console.error('Error uploading cover photo:', error)
            alert('Error uploading image. Please try again.')
        } finally {
            setUploading(false)
        }
    }

    const handleSaveProfile = async () => {
        try {
            setSaving(true)

            const { error } = await supabase
                .from('profiles')
                .update({
                    full_name: editedProfile.full_name,
                    username: editedProfile.username,
                    bio: editedProfile.bio,
                    phone: editedProfile.phone,
                    country: editedProfile.country,
                    city: editedProfile.city,
                    date_of_birth: editedProfile.date_of_birth,
                    updated_at: new Date().toISOString()
                })
                .eq('id', user.id)

            if (error) throw error

            setProfile(editedProfile)
            setIsEditing(false)
            alert('Profile updated successfully!')
        } catch (error) {
            console.error('Error updating profile:', error)
            alert('Error updating profile. Please try again.')
        } finally {
            setSaving(false)
        }
    }

    const handlePasswordChange = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert('Passwords do not match!')
            return
        }

        if (passwordData.newPassword.length < 6) {
            alert('Password must be at least 6 characters!')
            return
        }

        try {
            setSaving(true)

            const { error } = await supabase.auth.updateUser({
                password: passwordData.newPassword
            })

            if (error) throw error

            alert('Password updated successfully!')
            setPasswordData({ newPassword: '', confirmPassword: '' })
        } catch (error) {
            console.error('Error updating password:', error)
            alert('Error updating password. Please try again.')
        } finally {
            setSaving(false)
        }
    }

    const getInitials = (name) => {
        if (!name) return user?.email?.charAt(0).toUpperCase() || 'U'
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    }

    if (loading) {
        return (
            <div className="profile-page">
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
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Loading your profile...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="profile-page">
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

            <div className="profile-container">
                {/* Cover Photo */}
                <div className="cover-photo-section">
                    {profile.cover_photo_url ? (
                        <img src={profile.cover_photo_url} alt="Cover" className="cover-photo" />
                    ) : (
                        <div className="cover-photo-placeholder">
                            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                <polyline points="21 15 16 10 5 21"></polyline>
                            </svg>
                        </div>
                    )}
                    <label className="change-cover-btn">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                            <circle cx="12" cy="13" r="4"></circle>
                        </svg>
                        Change Cover
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleCoverPhotoUpload}
                            disabled={uploading}
                            style={{ display: 'none' }}
                        />
                    </label>
                </div>

                {/* Profile Header */}
                <div className="profile-header">
                    <div className="avatar-section">
                        <div className="avatar-wrapper">
                            {profile.avatar_url ? (
                                <img src={profile.avatar_url} alt="Avatar" className="profile-avatar" />
                            ) : (
                                <div className="profile-avatar-placeholder">
                                    {getInitials(profile.full_name)}
                                </div>
                            )}
                            <label className="change-avatar-btn">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                                    <circle cx="12" cy="13" r="4"></circle>
                                </svg>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarUpload}
                                    disabled={uploading}
                                    style={{ display: 'none' }}
                                />
                            </label>
                        </div>
                        <div className="profile-info">
                            <h1>{profile.full_name || 'Your Name'}</h1>
                            <p className="profile-email">{user?.email}</p>
                            {profile.bio && <p className="profile-bio">{profile.bio}</p>}
                        </div>
                    </div>
                    {!isEditing && activeTab === 'profile' && (
                        <button className="edit-profile-btn" onClick={() => setIsEditing(true)}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                            Edit Profile
                        </button>
                    )}
                </div>

                {/* Tabs */}
                <div className="profile-tabs">
                    <button
                        className={`tab ${activeTab === 'profile' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('profile'); setIsEditing(false); }}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        Profile
                    </button>
                    <button
                        className={`tab ${activeTab === 'security' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('security'); setIsEditing(false); }}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                        Security
                    </button>
                    <button
                        className={`tab ${activeTab === 'preferences' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('preferences'); setIsEditing(false); }}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="3"></circle>
                            <path d="M12 1v6m0 6v6"></path>
                            <path d="M21 12h-6m-6 0H3"></path>
                        </svg>
                        Preferences
                    </button>
                </div>

                {/* Tab Content */}
                <div className="tab-content">
                    {activeTab === 'profile' && (
                        <div className="profile-details">
                            {isEditing ? (
                                <div className="edit-form">
                                    <h2>Edit Profile</h2>
                                    <div className="form-grid">
                                        <div className="form-group">
                                            <label>Full Name</label>
                                            <input
                                                type="text"
                                                value={editedProfile.full_name || ''}
                                                onChange={(e) => setEditedProfile({...editedProfile, full_name: e.target.value})}
                                                placeholder="Enter your full name"
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>Username</label>
                                            <input
                                                type="text"
                                                value={editedProfile.username || ''}
                                                onChange={(e) => setEditedProfile({...editedProfile, username: e.target.value})}
                                                placeholder="@username"
                                            />
                                        </div>

                                        <div className="form-group full-width">
                                            <label>Bio</label>
                                            <textarea
                                                value={editedProfile.bio || ''}
                                                onChange={(e) => setEditedProfile({...editedProfile, bio: e.target.value})}
                                                placeholder="Tell us about yourself..."
                                                rows="4"
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>Phone</label>
                                            <input
                                                type="tel"
                                                value={editedProfile.phone || ''}
                                                onChange={(e) => setEditedProfile({...editedProfile, phone: e.target.value})}
                                                placeholder="+1 (555) 123-4567"
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>Date of Birth</label>
                                            <input
                                                type="date"
                                                value={editedProfile.date_of_birth || ''}
                                                onChange={(e) => setEditedProfile({...editedProfile, date_of_birth: e.target.value})}
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>Country</label>
                                            <input
                                                type="text"
                                                value={editedProfile.country || ''}
                                                onChange={(e) => setEditedProfile({...editedProfile, country: e.target.value})}
                                                placeholder="United Kingdom"
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>City</label>
                                            <input
                                                type="text"
                                                value={editedProfile.city || ''}
                                                onChange={(e) => setEditedProfile({...editedProfile, city: e.target.value})}
                                                placeholder="London"
                                            />
                                        </div>
                                    </div>

                                    <div className="form-actions">
                                        <button className="cancel-btn" onClick={() => {
                                            setEditedProfile(profile)
                                            setIsEditing(false)
                                        }}>
                                            Cancel
                                        </button>
                                        <button
                                            className="save-btn"
                                            onClick={handleSaveProfile}
                                            disabled={saving}
                                        >
                                            {saving ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="profile-view">
                                    <h2>Profile Information</h2>
                                    <div className="info-grid">
                                        <div className="info-item">
                                            <label>Full Name</label>
                                            <p>{profile.full_name || 'Not provided'}</p>
                                        </div>
                                        <div className="info-item">
                                            <label>Username</label>
                                            <p>{profile.username || 'Not set'}</p>
                                        </div>
                                        <div className="info-item">
                                            <label>Email</label>
                                            <p>{user?.email}</p>
                                        </div>
                                        <div className="info-item">
                                            <label>Phone</label>
                                            <p>{profile.phone || 'Not provided'}</p>
                                        </div>
                                        <div className="info-item">
                                            <label>Date of Birth</label>
                                            <p>{profile.date_of_birth || 'Not provided'}</p>
                                        </div>
                                        <div className="info-item">
                                            <label>Location</label>
                                            <p>
                                                {profile.city && profile.country
                                                    ? `${profile.city}, ${profile.country}`
                                                    : profile.city || profile.country || 'Not provided'}
                                            </p>
                                        </div>
                                    </div>
                                    {profile.bio && (
                                        <div className="info-item full-width">
                                            <label>Bio</label>
                                            <p>{profile.bio}</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="security-section">
                            <h2>Security Settings</h2>
                            <div className="security-card">
                                <h3>Change Password</h3>
                                <p className="security-description">
                                    Update your password to keep your account secure.
                                </p>
                                <div className="form-group">
                                    <label>New Password</label>
                                    <input
                                        type="password"
                                        value={passwordData.newPassword}
                                        onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                                        placeholder="Enter new password"
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
                                    className="update-password-btn"
                                    onClick={handlePasswordChange}
                                    disabled={saving || !passwordData.newPassword}
                                >
                                    {saving ? 'Updating...' : 'Update Password'}
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'preferences' && (
                        <div className="preferences-section">
                            <h2>Notification Preferences</h2>
                            <div className="preferences-list">
                                <div className="preference-item">
                                    <div className="preference-info">
                                        <h3>Email Notifications</h3>
                                        <p>Receive email notifications about your bookings and updates</p>
                                    </div>
                                    <label className="toggle-switch">
                                        <input
                                            type="checkbox"
                                            checked={preferences.emailNotifications}
                                            onChange={(e) => setPreferences({...preferences, emailNotifications: e.target.checked})}
                                        />
                                        <span className="toggle-slider"></span>
                                    </label>
                                </div>

                                <div className="preference-item">
                                    <div className="preference-info">
                                        <h3>Push Notifications</h3>
                                        <p>Get push notifications on your device</p>
                                    </div>
                                    <label className="toggle-switch">
                                        <input
                                            type="checkbox"
                                            checked={preferences.pushNotifications}
                                            onChange={(e) => setPreferences({...preferences, pushNotifications: e.target.checked})}
                                        />
                                        <span className="toggle-slider"></span>
                                    </label>
                                </div>

                                <div className="preference-item">
                                    <div className="preference-info">
                                        <h3>Newsletter</h3>
                                        <p>Receive our weekly newsletter with travel tips</p>
                                    </div>
                                    <label className="toggle-switch">
                                        <input
                                            type="checkbox"
                                            checked={preferences.newsletter}
                                            onChange={(e) => setPreferences({...preferences, newsletter: e.target.checked})}
                                        />
                                        <span className="toggle-slider"></span>
                                    </label>
                                </div>

                                <div className="preference-item">
                                    <div className="preference-info">
                                        <h3>Marketing Emails</h3>
                                        <p>Receive promotional offers and deals</p>
                                    </div>
                                    <label className="toggle-switch">
                                        <input
                                            type="checkbox"
                                            checked={preferences.marketingEmails}
                                            onChange={(e) => setPreferences({...preferences, marketingEmails: e.target.checked})}
                                        />
                                        <span className="toggle-slider"></span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}