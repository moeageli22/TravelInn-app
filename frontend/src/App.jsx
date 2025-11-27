import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import HomePage from './Pages/HomePage'
import HotelsPage from './Pages/HotelsPage'
import WellbeingPage from './Pages/Wellbeingpage'
import GroupsPage from './Pages/GroupsPage.jsx'
import GroupchatRoom from './Pages/GroupchatRoom.jsx'
import AboutPage from './Pages/AboutPage'
import ProfilePage from './Pages/Profilepage'  // ← ADD THIS IMPORT
import SignInPage from './Pages/SignInPage'
import SignUpPage from './Pages/SignUpPage'
import ForgotPasswordPage from './Pages/Forgotpasswordpage'
import ResetPasswordPage from './Pages/ResetPasswordPage'
import './index.css'

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route
                        path="/hotels"
                        element={
                            <ProtectedRoute>
                                <HotelsPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/wellbeing"
                        element={
                            <ProtectedRoute>
                                <WellbeingPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/groups"
                        element={
                            <ProtectedRoute>
                                <GroupsPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/groups/:groupId"
                        element={
                            <ProtectedRoute>
                                <GroupchatRoom />
                            </ProtectedRoute>
                        }
                    />
                    {/* ← ADD THIS NEW ROUTE FOR PROFILE PAGE */}
                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute>
                                <ProfilePage />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/signin" element={<SignInPage />} />
                    <Route path="/signup" element={<SignUpPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="/reset-password" element={<ResetPasswordPage />} />
                </Routes>
            </Router>
        </AuthProvider>
    )
}

export default App