import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './Pages/HomePage'
import HotelsPage from './Pages/HotelsPage'
import WellbeingPage from './Pages/WellbeingPage'
import GroupsPage from './Pages/Groupspage'
import GroupChatRoom from './Pages/Groupchatroom'
import AboutPage from './Pages/AboutPage'
import SignInPage from './Pages/SignInPage'
import SignUpPage from './Pages/SignUpPage'
import './App.css'

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/hotels" element={<HotelsPage />} />
                <Route path="/wellbeing" element={<WellbeingPage />} />
                <Route path="/groups" element={<GroupsPage />} />
                <Route path="/groups/:groupId" element={<GroupChatRoom />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/signin" element={<SignInPage />} />
                <Route path="/signup" element={<SignUpPage />} />
            </Routes>
        </Router>
    )
}

export default App