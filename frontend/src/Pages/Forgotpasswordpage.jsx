import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from "../lib/supabase"
import './AuthPages.css'

export default function ForgotPasswordPage() {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    const handleResetPassword = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            })

            if (error) throw error

            setSuccess(true)
        } catch (error) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-card">
                    {/* Logo */}
                    <div className="auth-logo">
                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                            <path d="M20 5L5 12.5V27.5L20 35L35 27.5V12.5L20 5Z" fill="url(#gradient)" />
                            <defs>
                                <linearGradient id="gradient" x1="5" y1="5" x2="35" y2="35">
                                    <stop offset="0%" stopColor="#8b5cf6" />
                                    <stop offset="100%" stopColor="#a855f7" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <span>Travelinn</span>
                    </div>

                    {/* Welcome Message */}
                    <div className="auth-header">
                        <h1>Reset Password</h1>
                        <p>{success ? 'Check your email' : 'Enter your email to receive reset instructions'}</p>
                    </div>

                    {/* Success Message */}
                    {success && (
                        <div className="success-message">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <div>
                                <strong>Email sent successfully!</strong>
                                <p>Check your inbox for password reset instructions. The link will expire in 1 hour.</p>
                            </div>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="error-message">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            {error}
                        </div>
                    )}

                    {!success && (
                        <>
                            {/* Reset Password Form */}
                            <form onSubmit={handleResetPassword} className="auth-form">
                                <div className="form-group">
                                    <label>Email Address</label>
                                    <div className="input-wrapper">
                                        <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                                            <polyline points="22,6 12,13 2,6"/>
                                        </svg>
                                        <input
                                            type="email"
                                            placeholder="you@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <button type="submit" className="submit-btn" disabled={loading}>
                                    {loading ? (
                                        <div className="spinner"></div>
                                    ) : (
                                        <>
                                            SEND RESET LINK
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <line x1="5" y1="12" x2="19" y2="12"/>
                                                <polyline points="12 5 19 12 12 19"/>
                                            </svg>
                                        </>
                                    )}
                                </button>
                            </form>

                            {/* Sign In Link */}
                            <div className="auth-footer">
                                Remember your password? <a href="/signin" onClick={(e) => { e.preventDefault(); navigate('/signin') }}>Sign in</a>
                            </div>
                        </>
                    )}

                    {success && (
                        <div className="auth-footer" style={{ marginTop: '2rem' }}>
                            <button
                                className="submit-btn"
                                onClick={() => navigate('/signin')}
                                style={{ width: '100%' }}
                            >
                                BACK TO SIGN IN
                            </button>
                        </div>
                    )}

                    {/* Back to Home */}
                    <button className="back-home" onClick={() => navigate('/')}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="19" y1="12" x2="5" y2="12"/>
                            <polyline points="12 19 5 12 12 5"/>
                        </svg>
                        Back to home
                    </button>
                </div>
            </div>
        </div>
    )
}