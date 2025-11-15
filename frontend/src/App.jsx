import { useState } from 'react'
import Navigation from './components/Navigation'
import SearchSection from './components/SearchSection'
import HotelsGrid from './components/HotelsGrid'
import BookingModal from './components/BookingModal'
import './App.css'

function App() {
    const [bookingModalOpen, setBookingModalOpen] = useState(false)
    const [selectedHotel, setSelectedHotel] = useState({})

    const startBooking = (name, price, location) => {
        setSelectedHotel({ name, price, location })
        setBookingModalOpen(true)
    }

    const closeBookingModal = () => {
        setBookingModalOpen(false)
    }

    return (
        <div className="app">
            <Navigation />

            <div className="container">
                <div className="page-header">
                    <h1>Featured Hotels</h1>
                    <p>Discover luxurious stays handpicked by our AI</p>
                </div>

                <SearchSection />
                <HotelsGrid onBookClick={startBooking} />
            </div>

            <BookingModal
                isOpen={bookingModalOpen}
                onClose={closeBookingModal}
                selectedHotel={selectedHotel}
            />
        </div>
    )
}

export default App