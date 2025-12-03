// frontend/src/Pages/GroupchatRoom.jsx
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

    const [inputValue, setInputValue] = useState('')
    const [sending, setSending] = useState(false)
    const [showSidebar, setShowSidebar] = useState(true)
    const [members, setMembers] = useState([])
    const [userProfile, setUserProfile] = useState(null)

    // Use the realtime messages hook
    const { messages, loading } = useRealtimeMessages(groupId)

    const group = GROUP_DATA[groupId]

    // Fetch user profile and join group
    useEffect(() => {
        const initializeChat = async () => {
            if (!user) return

            // Get user profile
            const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single()

            setUserProfile(profile)

            // Auto-join group
            await supabase
                .from('group_members')
                .upsert({
                    group_id: groupId,
                    user_id: user.id
                }, { onConflict: 'group_id,user_id' })

            // Fetch group members
            const { data: groupMembers } = await supabase
                .from('group_members')
                .select(`
                    user_id,
                    profiles!inner(full_name, avatar_url, username)
                `)
                .eq('group_id', groupId)

            setMembers(groupMembers || [])
        }

        initializeChat()
    }, [user, groupId])

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const sendMessage = async () => {
        if (!inputValue.trim() || sending || !user || !userProfile) return

        setSending(true)

        try {
            const { error } = await supabase
                .from('messages')
                .insert({
                    group_id: groupId,
                    sender_id: user.id,
                    sender_name: userProfile.full_name || userProfile.username || user.email,
                    avatar_url: userProfile.avatar_url,
                    message_text: inputValue.trim(),
                })

            if (!error) {
                setInputValue('')
            } else {
                console.error('Error sending message:', error)
                alert('Failed to send message')
            }
        } catch (error) {
            console.error('Error:', error)
        } finally {
            setSending(false)
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            sendMessage()
        }
    }

    if (!group) {
        return <div>Group not found</div>
    }

    if (!user) {
        return <div>Please sign in to access this chat</div>
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
                        <p>{members.length} members</p>
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
                    {loading ? (
                        <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.6)' }}>
                            Loading messages...
                        </div>
                    ) : messages.length === 0 ? (
                        <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.6)' }}>
                            No messages yet. Be the first to say hi! 👋
                        </div>
                    ) : (
                        messages.map((msg) => {
                            const isCurrentUser = msg.sender_id === user?.id
                            return (
                                <div key={msg.id} className={`message ${isCurrentUser ? 'user-message' : ''}`}>
                                    <div className="message-avatar">
                                        {msg.avatar_url ? (
                                            <img src={msg.avatar_url} alt={msg.sender_name} style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                                        ) : (
                                            '👤'
                                        )}
                                    </div>
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
                                        <p className="message-text">{msg.message_text}</p>
                                    </div>
                                </div>
                            )
                        })
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Sidebar */}
                {showSidebar && (
                    <div className="members-sidebar">
                        <h3>Members ({members.length})</h3>
                        <div className="members-list">
                            {members.map((member, idx) => (
                                <div key={idx} className="member-card">
                                    <div className="member-avatar">
                                        {member.profiles?.avatar_url ? (
                                            <img
                                                src={member.profiles.avatar_url}
                                                alt={member.profiles.full_name}
                                                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                                            />
                                        ) : (
                                            '👤'
                                        )}
                                        <span className="status-indicator online"></span>
                                    </div>
                                    <div className="member-info">
                                        <div className="member-name">
                                            {member.profiles?.full_name || member.profiles?.username || 'Anonymous'}
                                        </div>
                                        <div className="member-location">Active now</div>
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
                    onKeyPress={handleKeyPress}
                    disabled={sending}
                />
                <button
                    className="send-message-btn"
                    onClick={sendMessage}
                    disabled={!inputValue.trim() || sending}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="22" y1="2" x2="11" y2="13"/>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                    </svg>
                </button>
            </div>
        </div>
    )
}