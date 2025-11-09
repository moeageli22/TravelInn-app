import Navbar from '../components/Navbar'
import HeroSection from '../components/HeroSection'
import Chatbot from '../components/Chatbot'

const HomePage = () => {
    return (
        <div className="home-page">
            <Navbar />
            <HeroSection />
            <Chatbot />
        </div>
    )
}

export default HomePage