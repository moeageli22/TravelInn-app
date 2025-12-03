import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import UserMenu from '../components/UserMenu.jsx'
import './GroupsPage.css'

const COMMUNITY_GROUPS = [
    {
        id: 'food-dining',
        name: 'Food & Dining',
        icon: '☕',
        color: '#f97316',
        gradient: 'linear-gradient(135deg, #ff9a56 0%, #ff6b35 100%)',
        image: 'https://img.freepik.com/premium-vector/as-meal-service-comes-end-volunteers-distribute-leftovers-care-packages-ensure-that_216520-123395.jpg',
        description: 'Swap restaurant tips, share recipes, and discover the best street food spots around the globe.',
        features: ['Restaurant Reviews', 'Recipe Sharing', 'Food Tours']
    },
    {
        id: 'fitness-sports',
        name: 'Fitness & Sports',
        icon: '🏃',
        color: '#ef4444',
        gradient: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)',
        image: 'https://media.istockphoto.com/id/1318882517/vector/female-character-is-working-out-in-gym-with-fitness-trainer.jpg?s=612x612&w=0&k=20&c=L-nUwYciDAARIWs8jbS3HODTmPJQIMSpj7PrC16tbUA=',
        description: 'Find gym partners abroad, join running groups, or share wellness routines.',
        features: ['Workout Partners', 'Running Groups', 'Wellness Tips']
    },
    {
        id: 'music-nightlife',
        name: 'Music & Nightlife',
        icon: '🎵',
        color: '#8b5cf6',
        gradient: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)',
        image: 'https://thumbs.dreamstime.com/b/people-dancing-enjoying-music-group-young-cartoons-celebration-party-disco-club-people-dancing-enjoying-music-190221695.jpg',
        description: 'Talk about local events, concerts, and hidden bars with fellow night owls.',
        features: ['Concert Meetups', 'Club Recommendations', 'Festival Planning']
    },
    {
        id: 'culture-arts',
        name: 'Culture & Arts',
        icon: '🎨',
        color: '#3b82f6',
        gradient: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
        image: 'https://img.freepik.com/free-vector/hand-drawn-colombian-character-collection-illustration_23-2150638438.jpg',
        description: 'Discover museums, street art, and heritage tours together.',
        features: ['Museum Tours', 'Art Galleries', 'Cultural Events']
    },
    {
        id: 'gaming-entertainment',
        name: 'Gaming & Entertainment',
        icon: '🎮',
        color: '#10b981',
        gradient: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)',
        image: 'https://static.vecteezy.com/system/resources/previews/070/081/357/non_2x/flat-cartoon-illustration-of-black-girl-gamer-with-headphones-streaming-game-on-computer-desk-with-keyboard-and-mouse-young-woman-online-gaming-entertainment-e-sports-vector.jpg',
        description: 'Connect with gamers and entertainment lovers on the go.',
        features: ['Gaming Sessions', 'Esports Events', 'Game Reviews']
    },
    {
        id: 'social-meetups',
        name: 'Social Meetups',
        icon: '👥',
        color: '#ec4899',
        gradient: 'linear-gradient(135deg, #f472b6 0%, #ec4899 100%)',
        image: 'https://media.istockphoto.com/id/1062169958/vector/vector-illustration-flat-style-businessmen-discuss-social-network-group-of-people-news.jpg?s=612x612&w=0&k=20&c=eUWibMvbR3UsCQe2tnC6PF06O9SNJHx--wPy2yxd8Pg=',
        description: 'Plan group adventures, coffee hangouts, or weekend city explorations.',
        features: ['Coffee Meetups', 'City Tours', 'Social Events']
    }
]

export default function GroupsPage() {
    const navigate = useNavigate()
    const { user } = useAuth()
    const [searchQuery, setSearchQuery] = useState('')
    const [groupStats, setGroupStats] = useState({})
    const [loading, setLoading] = useState(true)
    const [showWelcomeModal, setShowWelcomeModal] = useState(false)
    const [selectedGroup, setSelectedGroup] = useState(null)

    // Fetch real member counts from database
    useEffect(() => {
        const fetchGroupStats = async () => {
            try {
                const { data, error } = await supabase
                    .from('group_members')
                    .select('group_id')

                if (!error && data) {
                    const stats = {}
                    data.forEach(member => {
                        stats[member.group_id] = (stats[member.group_id] || 0) + 1
                    })
                    setGroupStats(stats)
                }
            } catch (error) {
                console.error('Error fetching group stats:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchGroupStats()

        // Subscribe to real-time changes
        const channel = supabase
            .channel('group-members-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'group_members'
                },
                () => {
                    fetchGroupStats()
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    const filteredGroups = COMMUNITY_GROUPS.filter(group =>
        group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        group.description.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleJoinGroup = (group) => {
        if (!user) {
            navigate('/signin')
            return
        }

        setSelectedGroup(group)
        setShowWelcomeModal(true)

        // Auto-close and navigate after 3 seconds
        setTimeout(() => {
            setShowWelcomeModal(false)
            setTimeout(() => {
                navigate(`/groups/${group.id}`)
            }, 300)
        }, 3000)
    }

    return (
        <div className="groups-page">
            <nav>
                <div className="logo" onClick={() => navigate('/')}>Travelinn</div>
                <ul className="nav-links">
                    <li><a href="/" onClick={(e) => { e.preventDefault(); navigate('/') }}>Home</a></li>
                    <li><a href="/hotels" onClick={(e) => { e.preventDefault(); navigate('/hotels') }}>Hotels</a></li>
                    <li><a href="/wellbeing" onClick={(e) => { e.preventDefault(); navigate('/wellbeing') }}>Wellbeing</a></li>
                    <li><a href="/groups" className="active">Groups</a></li>
                    <li><a href="#about" onClick={(e) => { e.preventDefault(); navigate('/about') }}>About</a></li>
                </ul>
                {user ? (
                    <UserMenu />
                ) : (
                    <button className="sign-in-btn" onClick={() => navigate('/signin')}>Sign In</button>
                )}
            </nav>

            <div className="container">
                <div className="page-header">
                    <div className="header-badge">✨ Community Hub</div>
                    <h1>Connect with Like-Minded Travelers</h1>
                    <p>Join vibrant communities, share experiences, and make lifelong friends around the world</p>
                </div>

                <div className="search-section">
                    <div className="search-bar">
                        <svg className="search-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8"/>
                            <path d="m21 21-4.35-4.35"/>
                        </svg>
                        <input
                            type="text"
                            placeholder="Search communities..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="groups-grid">
                    {filteredGroups.map(group => {
                        const memberCount = groupStats[group.id] || 0
                        return (
                            <div key={group.id} className="group-card" style={{ '--group-gradient': group.gradient }}>
                                <div className="card-glow"></div>

                                <div className="group-image-container">
                                    <img src={group.image} alt={group.name} className="group-image" />
                                    <div className="image-overlay"></div>
                                </div>

                                <div className="group-content">
                                    <div className="group-header">
                                        <div className="group-icon" style={{ background: `${group.color}20`, color: group.color }}>
                                            <span>{group.icon}</span>
                                        </div>
                                        <div className="group-info">
                                            <h3>{group.name}</h3>
                                            <p className="traveler-count">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                                                    <circle cx="9" cy="7" r="4"/>
                                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                                                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                                                </svg>
                                                {memberCount} {memberCount === 1 ? 'traveler' : 'travelers'}
                                            </p>
                                        </div>
                                    </div>

                                    <p className="group-description">{group.description}</p>

                                    <div className="group-features">
                                        {group.features.map((feature, idx) => (
                                            <span key={idx} className="feature-tag">
                                                {feature}
                                            </span>
                                        ))}
                                    </div>

                                    <button
                                        className="join-btn"
                                        style={{ background: group.gradient }}
                                        onClick={() => handleJoinGroup(group)}
                                    >
                                        <span>Join Community</span>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <line x1="5" y1="12" x2="19" y2="12"/>
                                            <polyline points="12 5 19 12 12 19"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Welcome Modal */}
            {showWelcomeModal && selectedGroup && (
                <div className="modal-overlay">
                    <div className="welcome-modal">
                        <div className="modal-glow"></div>
                        <div className="modal-image-container">
                            <img src={selectedGroup.image} alt={selectedGroup.name} className="modal-image" />
                        </div>
                        <div className="modal-content">
                            <div className="modal-icon" style={{ background: selectedGroup.gradient }}>
                                {selectedGroup.icon}
                            </div>
                            <h2>Welcome to {selectedGroup.name}! 🎉</h2>
                            <p>You've successfully joined the community. Start connecting with fellow travelers!</p>
                            <div className="modal-features">
                                <div className="modal-feature">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                                    </svg>
                                    <span>Chat with members</span>
                                </div>
                                <div className="modal-feature">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                                        <line x1="16" y1="2" x2="16" y2="6"/>
                                        <line x1="8" y1="2" x2="8" y2="6"/>
                                        <line x1="3" y1="10" x2="21" y2="10"/>
                                    </svg>
                                    <span>Join events</span>
                                </div>
                                <div className="modal-feature">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
                                        <line x1="7" y1="7" x2="7.01" y2="7"/>
                                    </svg>
                                    <span>Share experiences</span>
                                </div>
                            </div>
                            <div className="loading-bar">
                                <div className="loading-progress"></div>
                            </div>
                            <p className="redirecting-text">Taking you to the community...</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}