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
        description: 'Swap restaurant tips, share recipes, and discover the best street food spots around the globe.'
    },
    {
        id: 'fitness-sports',
        name: 'Fitness & Sports',
        icon: '🏃',
        color: '#ef4444',
        description: 'Find gym partners abroad, join running groups, or share wellness routines.'
    },
    {
        id: 'music-nightlife',
        name: 'Music & Nightlife',
        icon: '🎵',
        color: '#8b5cf6',
        description: 'Talk about local events, concerts, and hidden bars with fellow night owls.'
    },
    {
        id: 'culture-arts',
        name: 'Culture & Arts',
        icon: '🎨',
        color: '#3b82f6',
        description: 'Discover museums, street art, and heritage tours together.'
    },
    {
        id: 'gaming-entertainment',
        name: 'Gaming & Entertainment',
        icon: '🎮',
        color: '#10b981',
        description: 'Connect with gamers and entertainment lovers on the go.'
    },
    {
        id: 'social-meetups',
        name: 'Social Meetups',
        icon: '👥',
        color: '#ec4899',
        description: 'Plan group adventures, coffee hangouts, or weekend city explorations.'
    }
]

export default function GroupsPage() {
    const navigate = useNavigate()
    const { user } = useAuth()
    const [searchQuery, setSearchQuery] = useState('')
    const [groupStats, setGroupStats] = useState({})
    const [loading, setLoading] = useState(true)

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

    const handleJoinGroup = (groupId) => {
        navigate(`/groups/${groupId}`)
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
                    <h1>Connect with Like-Minded Travelers</h1>
                    <p>Find and connect with other travelers who share your interests. Make new friends and explore together.</p>
                </div>

                <div className="search-section">
                    <div className="search-bar">
                        <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
                            <div key={group.id} className="group-card" style={{ '--group-color': group.color }}>
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
                                <button
                                    className="join-btn"
                                    style={{ background: `linear-gradient(135deg, ${group.color} 0%, ${group.color}dd 100%)` }}
                                    onClick={() => handleJoinGroup(group.id)}
                                >
                                    Join Community
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <line x1="5" y1="12" x2="19" y2="12"/>
                                        <polyline points="12 5 19 12 12 19"/>
                                    </svg>
                                </button>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}