import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth()
    const location = useLocation()

    // Show loading state while checking authentication
    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                fontSize: '1.2rem',
                color: '#666'
            }}>
                Loading...
            </div>
        )
    }

    // Redirect to sign-in if not authenticated
    // Save the attempted location for redirecting after login
    if (!user) {
        return <Navigate to="/signin" state={{ from: location }} replace />
    }

    // User is authenticated, render the protected content
    return children
}
