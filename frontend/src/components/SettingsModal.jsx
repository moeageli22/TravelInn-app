import { useState, useEffect } from 'react'
import './SettingsModal.css'

const THEMES = {
    'Purple Dream': {
        primary: '#8b5cf6',
        secondary: '#a855f7',
        accent: '#c084fc',
        background: '#0f172a'
    },
    'Ocean Blue': {
        primary: '#0ea5e9',
        secondary: '#06b6d4',
        accent: '#22d3ee',
        background: '#0c4a6e'
    },
    'Forest Green': {
        primary: '#10b981',
        secondary: '#059669',
        accent: '#34d399',
        background: '#064e3b'
    },
    'Sunset Red': {
        primary: '#ef4444',
        secondary: '#dc2626',
        accent: '#f87171',
        background: '#7f1d1d'
    },
    'Golden Orange': {
        primary: '#f97316',
        secondary: '#ea580c',
        accent: '#fb923c',
        background: '#7c2d12'
    }
}

export default function SettingsModal({ isOpen, onClose }) {
    const [selectedTheme, setSelectedTheme] = useState('Purple Dream')
    const [language, setLanguage] = useState('English')
    const [currency, setCurrency] = useState('USD')
    const [notifications, setNotifications] = useState(true)

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'Purple Dream'
        setSelectedTheme(savedTheme)
        applyTheme(THEMES[savedTheme])
    }, [])

    const applyTheme = (theme) => {
        const root = document.documentElement
        root.style.setProperty('--primary-color', theme.primary)
        root.style.setProperty('--secondary-color', theme.secondary)
        root.style.setProperty('--accent-color', theme.accent)
        root.style.setProperty('--background-color', theme.background)
    }

    const handleThemeChange = (themeName) => {
        setSelectedTheme(themeName)
        applyTheme(THEMES[themeName])
        localStorage.setItem('theme', themeName)
    }

    if (!isOpen) return null

    return (
        <div className="settings-overlay" onClick={onClose}>
            <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
                <div className="settings-header">
                    <h2>Settings</h2>
                    <button className="close-settings" onClick={onClose}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    </button>
                </div>

                <div className="settings-content">
                    {/* Theme Section */}
                    <div className="settings-section">
                        <h3>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="5"/>
                                <line x1="12" y1="1" x2="12" y2="3"/>
                                <line x1="12" y1="21" x2="12" y2="23"/>
                                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                                <line x1="1" y1="12" x2="3" y2="12"/>
                                <line x1="21" y1="12" x2="23" y2="12"/>
                                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                            </svg>
                            Theme
                        </h3>
                        <div className="theme-grid">
                            {Object.entries(THEMES).map(([name, colors]) => (
                                <div
                                    key={name}
                                    className={`theme-card ${selectedTheme === name ? 'active' : ''}`}
                                    onClick={() => handleThemeChange(name)}
                                >
                                    <div className="theme-preview">
                                        <div className="theme-color" style={{ background: colors.primary }}></div>
                                        <div className="theme-color" style={{ background: colors.secondary }}></div>
                                        <div className="theme-color" style={{ background: colors.accent }}></div>
                                    </div>
                                    <span className="theme-name">{name}</span>
                                    {selectedTheme === name && (
                                        <svg className="check-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                            <polyline points="20 6 9 17 4 12"/>
                                        </svg>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Language Section */}
                    <div className="settings-section">
                        <h3>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10"/>
                                <line x1="2" y1="12" x2="22" y2="12"/>
                                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                            </svg>
                            Language
                        </h3>
                        <select
                            className="settings-select"
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                        >
                            <option value="English">English</option>
                            <option value="Spanish">Español</option>
                            <option value="French">Français</option>
                            <option value="German">Deutsch</option>
                            <option value="Japanese">日本語</option>
                            <option value="Arabic">العربية</option>
                        </select>
                    </div>

                    {/* Currency Section */}
                    <div className="settings-section">
                        <h3>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="12" y1="1" x2="12" y2="23"/>
                                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                            </svg>
                            Currency
                        </h3>
                        <select
                            className="settings-select"
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                        >
                            <option value="USD">USD ($)</option>
                            <option value="EUR">EUR (€)</option>
                            <option value="GBP">GBP (£)</option>
                            <option value="JPY">JPY (¥)</option>
                            <option value="SAR">SAR (﷼)</option>
                            <option value="AED">AED (د.إ)</option>
                        </select>
                    </div>

                    {/* Notifications Section */}
                    <div className="settings-section">
                        <h3>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                            </svg>
                            Notifications
                        </h3>
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={notifications}
                                onChange={(e) => setNotifications(e.target.checked)}
                            />
                            <span className="toggle-slider"></span>
                        </label>
                    </div>
                </div>

                <div className="settings-footer">
                    <button className="settings-btn secondary" onClick={onClose}>
                        Cancel
                    </button>
                    <button className="settings-btn primary" onClick={onClose}>
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    )
}