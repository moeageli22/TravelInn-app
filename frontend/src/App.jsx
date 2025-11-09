import { Routes, Route } from 'react-router-dom'
import HomePage from './Pages/HomePage'
import SignInPage from './Pages/SignInPage'
import ChatbotPage from './Pages/Chatbotpage'  // lowercase 'p'np
import './App.css'

function App() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/chatbot" element={<ChatbotPage />} />
        </Routes>
    )
}

export default App