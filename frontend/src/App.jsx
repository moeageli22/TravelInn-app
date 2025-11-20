import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './Pages/HomePage'
import HotelsPage from './Pages/HotelsPage'
import WellbeingPage from './Pages/Wellbeingpage'
import GroupsPage from './Pages/Groupspage'
import AboutPage from './Pages/AboutPage'
import SignInPage from './Pages/SignInPage'
import SignUpPage from './Pages/SignUpPage'
import ForgotPasswordPage from './Pages/ForgotPasswordPage'
import ResetPasswordPage from './Pages/ResetPasswordPage'
import './index.css'

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/hotels" element={<HotelsPage />} />
                <Route path="/wellbeing" element={<WellbeingPage />} />
                <Route path="/groups" element={<GroupsPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/signin" element={<SignInPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
            </Routes>
        </Router>
    )
}

export default App