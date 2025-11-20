import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [session, setSession] = useState(null)

    useEffect(() => {
        // Check for existing session on mount
        const initializeAuth = async () => {
            try {
                const { data: { session: existingSession }, error } = await supabase.auth.getSession()

                if (error) {
                    console.error('Error getting session:', error)
                    return
                }

                if (existingSession) {
                    setSession(existingSession)
                    setUser(existingSession.user)
                }
            } catch (error) {
                console.error('Error initializing auth:', error)
            } finally {
                setLoading(false)
            }
        }

        initializeAuth()

        // Listen for auth changes (sign in, sign out, token refresh)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, currentSession) => {
                console.log('Auth state changed:', event)

                setSession(currentSession)
                setUser(currentSession?.user ?? null)
                setLoading(false)

                // Handle specific events
                if (event === 'SIGNED_IN') {
                    console.log('User signed in:', currentSession?.user?.email)
                }

                if (event === 'SIGNED_OUT') {
                    console.log('User signed out')
                    setUser(null)
                    setSession(null)
                }

                if (event === 'TOKEN_REFRESHED') {
                    console.log('Token refreshed')
                }
            }
        )

        // Cleanup subscription on unmount
        return () => {
            subscription?.unsubscribe()
        }
    }, [])

    // Sign in with email and password
    const signIn = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) throw error
        return data
    }

    // Sign in with OAuth provider
    const signInWithOAuth = async (provider) => {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: `${window.location.origin}/`
            }
        })

        if (error) throw error
        return data
    }

    // Sign up with email and password
    const signUp = async (email, password, metadata = {}) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: metadata
            }
        })

        if (error) throw error
        return data
    }

    // Sign out
    const signOut = async () => {
        const { error } = await supabase.auth.signOut()
        if (error) throw error
        setUser(null)
        setSession(null)
    }

    // Reset password
    const resetPassword = async (email) => {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
        })

        if (error) throw error
    }

    // Update password
    const updatePassword = async (newPassword) => {
        const { error } = await supabase.auth.updateUser({
            password: newPassword
        })

        if (error) throw error
    }

    const value = {
        user,
        session,
        loading,
        signIn,
        signInWithOAuth,
        signUp,
        signOut,
        resetPassword,
        updatePassword,
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}
