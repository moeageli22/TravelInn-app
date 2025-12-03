import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { useRealtimeMessages } from '../hooks/useRealtimeMessages'
import './GroupchatRoom.css'

// Group metadata
const GROUP_DATA = {
    'food-dining': { name: 'Food & Dining', icon: '☕', color: '#f97316' },
    'fitness-sports': { name: 'Fitness & Sports', icon: '🏃', color: '#ef4444' },
    'music-nightlife': { name: 'Music & Nightlife', icon: '🎵', color: '#8b5cf6' },
    'culture-arts': { name: 'Culture & Arts', icon: '🎨', color: '#3b82f6' },
    'gaming-entertainment': { name: 'Gaming & Entertainment', icon: '🎮', color: '#10b981' },
    'social-meetups': { name: 'Social Meetups', icon: '👥', color: '#ec4899' }
}

export default function GroupchatRoom() {
    const { groupId } = useParams()
    const navigate = useNavigate()
    const { user } = useAuth()
    const messagesEndRef = useRef(null)
    const fileInputRef = useRef(null)

    const [inputValue, setInputValue] = useState('')
    const [sending, setSending] = useState(false)
    const [showSidebar, setShowSidebar] = useState(true)
    const [members, setMembers] = useState([])
    const [userProfile, setUserProfile] = useState(null)
    const [uploading, setUploading] = useState(false)
    const [imagePreview, setImagePreview] = useState(null)
    const [selectedFile, setSelectedFile] = useState(null)
    const [hoveredMessage, setHoveredMessage] = useState(null)

    // Use the realtime messages hook
    const { messages, loading } = useRealtimeMessages(groupId)

    const group = GROUP_DATA[groupId]

    // Fetch members function with EXTENSIVE DEBUGGING
    const fetchMembers = async () => {
        console.log('========================================')
        console.log('🔍 FETCHING MEMBERS')
        console.log('Group ID:', groupId)
        console.log('========================================')

        try {
            // First, let's check if group_members table has ANY data
            const { data: allMembers, error: allError } = await supabase
                .from('group_members')
                .select('*')

            console.log('📊 ALL group_members in database:', allMembers)
            console.log('❌ Error fetching all members:', allError)

            // Now fetch members for THIS specific group
            const { data: groupMembers, error } = await supabase
                .from('group_members')
                .select(`
                    user_id,
                    joined_at,
                    profiles (
                        full_name,
                        avatar_url,
                        username,
                        email
                    )
                `)
                .eq('group_id', groupId)
                .order('joined_at', { ascending: false })

            console.log('✅ Members for this group:', groupMembers)
            console.log('❌ Error:', error)
            console.log('📈 Member count:', groupMembers?.length || 0)

            if (error) {
                console.error('🚨 ERROR fetching members:', error)
                alert(`Error fetching members: ${error.message}`)
            } else {
                console.log('✅ Successfully fetched members')
                setMembers(groupMembers || [])
            }
        } catch (error) {
            console.error('🚨 EXCEPTION in fetchMembers:', error)
        }

        console.log('========================================')
    }

    // Fetch user profile and join group
    useEffect(() => {
        const initializeChat = async () => {
            console.log('🚀 INITIALIZING CHAT')
            console.log('User:', user)
            console.log('Group ID:', groupId)

            if (!user) {
                console.log('❌ No user found')
                return
            }

            // Get user profile
            console.log('📝 Fetching user profile...')
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single()

            if (profileError) {
                console.error('❌ Profile error:', profileError)

                // Try to create profile if it doesn't exist
                console.log('🔧 Attempting to create profile...')
                const { data: newProfile, error: createError } = await supabase
                    .from('profiles')
                    .insert({
                        id: user.id,
                        email: user.email,
                        full_name: user.user_metadata?.full_name || user.email?.split('@')[0]
                    })
                    .select()
                    .single()

                if (createError) {
                    console.error('❌ Failed to create profile:', createError)
                } else {
                    console.log('✅ Created new profile:', newProfile)
                    setUserProfile(newProfile)
                }
            } else {
                console.log('✅ User profile found:', profile)
                setUserProfile(profile)
            }

            // Auto-join group
            console.log('🎯 Joining group...')
            const { data: joinData, error: joinError } = await supabase
                .from('group_members')
                .upsert({
                    group_id: groupId,
                    user_id: user.id
                }, {
                    onConflict: 'group_id,user_id',
                    returning: 'representation'
                })
                .select()

            if (joinError) {
                console.error('❌ Join error:', joinError)
                alert(`Failed to join group: ${joinError.message}`)
            } else {
                console.log('✅ Successfully joined group:', joinData)
            }

            // Small delay to ensure data is written
            await new Promise(resolve => setTimeout(resolve, 500))

            // Fetch group members
            console.log('👥 Fetching all members...')
            await fetchMembers()
        }

        initializeChat()
    }, [user, groupId])

    // Subscribe to member changes
    useEffect(() => {
        console.log('👂 Setting up real-time subscription for members')

        const channel = supabase
            .channel(`members-${groupId}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'group_members',
                    filter: `group_id=eq.${groupId}`
                },
                (payload) => {
                    console.log('🔔 Member change detected:', payload)
                    fetchMembers()
                }
            )
            .subscribe((status) => {
                console.log('📡 Subscription status:', status)
            })

        return () => {
            console.log('🔌 Unsubscribing from member changes')
            supabase.removeChannel(channel)
        }
    }, [groupId])

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    // Handle file selection
    const handleFileSelect = (e) => {
        const file = e.target.files[0]
        if (!file) return

        if (!file.type.startsWith('image/')) {
            alert('Please select an image file')
            return
        }

        if (file.size > 5 * 1024 * 1024) {
            alert('Image size must be less than 5MB')
            return
        }

        setSelectedFile(file)

        const reader = new FileReader()
        reader.onloadend = () => {
            setImagePreview(reader.result)
        }
        reader.readAsDataURL(file)
    }

    // Upload image to Supabase Storage
    const uploadImage = async (file) => {
        const fileExt = file.name.split('.').pop()
        const fileName = `${user.id}/${Date.now()}.${fileExt}`

        const { data, error } = await supabase.storage
            .from('chat-images')
            .upload(fileName, file)

        if (error) throw error

        const { data: { publicUrl } } = supabase.storage
            .from('chat-images')
            .getPublicUrl(fileName)

        return publicUrl
    }

    // Send message
    const sendMessage = async () => {
        if ((!inputValue.trim() && !selectedFile) || sending || !user || !userProfile) return

        setSending(true)
        setUploading(true)

        try {
            let imageUrl = null

            if (selectedFile) {
                imageUrl = await uploadImage(selectedFile)
            }

            const { error } = await supabase
                .from('messages')
                .insert({
                    group_id: groupId,
                    sender_id: user.id,
                    sender_name: userProfile.full_name || userProfile.username || user.email,
                    avatar_url: userProfile.avatar_url,
                    message_text: inputValue.trim() || '📷 Image',
                    message_type: imageUrl ? 'image' : 'text',
                    image_url: imageUrl
                })

            if (!error) {
                setInputValue('')
                setSelectedFile(null)
                setImagePreview(null)
            } else {
                console.error('Error sending message:', error)
                alert('Failed to send message')
            }
        } catch (error) {
            console.error('Error:', error)
            alert('Failed to upload image')
        } finally {
            setSending(false)
            setUploading(false)
        }
    }

    // Delete message
    const deleteMessage = async (messageId) => {
        if (!window.confirm('Delete this message?')) return

        const { error } = await supabase
            .from('messages')
            .delete()
            .eq('id', messageId)

        if (error) {
            console.error('Error deleting message:', error)
            alert('Failed to delete message')
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            sendMessage()
        }
    }

    const removeImagePreview = () => {
        setSelectedFile(null)
        setImagePreview(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    if (!group) {
        return <div className="error-page">Group not found</div>
    }

    if (!user) {
        return <div className="error-page">Please sign in to access this chat</div>
    }

    // Debug: Show current state in UI
    console.log('🎨 RENDERING - Members count:', members.length)

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
                        <p>{members.length} {members.length === 1 ? 'member' : 'members'} online</p>
                    </div>
                </div>
                <button className="toggle-sidebar-btn" onClick={() => setShowSidebar(!showSidebar)}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        {showSidebar ? (
                            <>
                                <line x1="18" y1="6" x2="6" y2="18"/>
                                <line x1="6" y1="6" x2="18" y2="18"/>
                            </>
                        ) : (
                            <>
                                <line x1="3" y1="12" x2="21" y2="12"/>
                                <line x1="3" y1="6" x2="21" y2="6"/>
                                <line x1="3" y1="18" x2="21" y2="18"/>
                            </>
                        )}
                    </svg>
                </button>
            </div>

            <div className="chat-room-body">
                {/* Messages */}
                <div className="messages-container">
                    {loading ? (
                        <div className="loading-state">
                            <div className="spinner-large"></div>
                            <p>Loading messages...</p>
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">{group.icon}</div>
                            <h3>Welcome to {group.name}!</h3>
                            <p>No messages yet. Be the first to start the conversation! 👋</p>
                        </div>
                    ) : (
                        messages.map((msg) => {
                            const isCurrentUser = msg.sender_id === user?.id
                            return (
                                <div
                                    key={msg.id}
                                    className={`message ${isCurrentUser ? 'user-message' : ''}`}
                                    onMouseEnter={() => setHoveredMessage(msg.id)}
                                    onMouseLeave={() => setHoveredMessage(null)}
                                >
                                    {!isCurrentUser && (
                                        <div className="message-avatar">
                                            {msg.avatar_url ? (
                                                <img src={msg.avatar_url} alt={msg.sender_name} />
                                            ) : (
                                                <div className="avatar-placeholder">
                                                    {msg.sender_name.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <div className="message-content">
                                        <div className="message-header">
                                            <span className="message-sender">
                                                {isCurrentUser ? 'You' : msg.sender_name}
                                            </span>
                                            <span className="message-time">
                                                {new Date(msg.created_at).toLocaleTimeString([], {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </span>
                                        </div>

                                        {msg.message_type === 'image' && msg.image_url && (
                                            <div className="message-image-container">
                                                <img
                                                    src={msg.image_url}
                                                    alt="Shared image"
                                                    className="message-image"
                                                    onClick={() => window.open(msg.image_url, '_blank')}
                                                />
                                            </div>
                                        )}

                                        {msg.message_text && msg.message_text !== '📷 Image' && (
                                            <p className="message-text">{msg.message_text}</p>
                                        )}

                                        {isCurrentUser && hoveredMessage === msg.id && (
                                            <button
                                                className="delete-message-btn"
                                                onClick={() => deleteMessage(msg.id)}
                                                title="Delete message"
                                            >
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <polyline points="3 6 5 6 21 6"/>
                                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                                                    <line x1="10" y1="11" x2="10" y2="17"/>
                                                    <line x1="14" y1="11" x2="14" y2="17"/>
                                                </svg>
                                            </button>
                                        )}
                                    </div>

                                    {isCurrentUser && (
                                        <div className="message-avatar">
                                            {msg.avatar_url ? (
                                                <img src={msg.avatar_url} alt="You" />
                                            ) : (
                                                <div className="avatar-placeholder">
                                                    {msg.sender_name.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )
                        })
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Sidebar */}
                {showSidebar && (
                    <div className="members-sidebar">
                        <div className="sidebar-header">
                            <h3>Members ({members.length})</h3>
                            <button
                                onClick={fetchMembers}
                                style={{
                                    background: 'rgba(139, 92, 246, 0.2)',
                                    border: '1px solid #8b5cf6',
                                    color: 'white',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontSize: '0.8rem',
                                    marginTop: '0.5rem'
                                }}
                            >
                                🔄 Refresh Members
                            </button>
                        </div>
                        <div className="members-list">
                            {members.length === 0 ? (
                                <div className="no-members">
                                    <p>No members yet</p>
                                    <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>
                                        Check browser console (F12) for debug info
                                    </p>
                                </div>
                            ) : (
                                members.map((member, idx) => {
                                    const profile = member.profiles
                                    console.log('Rendering member:', member)
                                    return (
                                        <div key={idx} className="member-card">
                                            <div className="member-avatar">
                                                {profile?.avatar_url ? (
                                                    <img
                                                        src={profile.avatar_url}
                                                        alt={profile.full_name || 'User'}
                                                    />
                                                ) : (
                                                    <div className="avatar-placeholder">
                                                        {(profile?.full_name || profile?.username || 'T').charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                                <span className="status-indicator online"></span>
                                            </div>
                                            <div className="member-info">
                                                <div className="member-name">
                                                    {profile?.full_name || profile?.username || profile?.email?.split('@')[0] || 'Traveler'}
                                                    {member.user_id === user?.id && (
                                                        <span className="you-badge">You</span>
                                                    )}
                                                </div>
                                                <div className="member-status">
                                                    <span className="status-dot"></span>
                                                    Active now
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="message-input-area">
                {imagePreview && (
                    <div className="image-preview-container">
                        <div className="image-preview-wrapper">
                            <img src={imagePreview} alt="Preview" className="image-preview" />
                            <button className="remove-image-btn" onClick={removeImagePreview}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="18" y1="6" x2="6" y2="18"/>
                                    <line x1="6" y1="6" x2="18" y2="18"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                )}

                <div className="input-container">
                    <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleFileSelect}
                        style={{ display: 'none' }}
                    />

                    <button
                        className="attach-btn"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={sending}
                        title="Attach image"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                            <circle cx="8.5" cy="8.5" r="1.5"/>
                            <polyline points="21 15 16 10 5 21"/>
                        </svg>
                    </button>

                    <textarea
                        className="message-input"
                        placeholder={uploading ? "Uploading image..." : "Type your message..."}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={sending || uploading}
                        rows="1"
                    />

                    <button
                        className="send-message-btn"
                        onClick={sendMessage}
                        disabled={(!inputValue.trim() && !selectedFile) || sending}
                    >
                        {uploading ? (
                            <div className="spinner"></div>
                        ) : (
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="22" y1="2" x2="11" y2="13"/>
                                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                            </svg>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}