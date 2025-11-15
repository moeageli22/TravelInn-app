import { useState } from 'react'
import './SearchSection.css'

const SearchSection = () => {
    const [destination, setDestination] = useState('')
    const [checkin, setCheckin] = useState('')
    const [checkout, setCheckout] = useState('')
    const [guests, setGuests] = useState('1 Guest')

    const handleSearch = () => {
        if (destination) {
            alert(`Searching for hotels in: ${destination}`)
        } else {
            alert('Please enter a destination')
        }
    }

    return (
        <div className="search-section">
            <div className="search-bar">
                <div className="search-field">
                    <label>Destination</label>
                    <input
                        type="text"
                        placeholder="Try: Dubai, Paris, Maldives..."
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                    />
                </div>
                <div className="search-field">
                    <label>Check-in</label>
                    <input
                        type="date"
                        value={checkin}
                        onChange={(e) => setCheckin(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                    />
                </div>
                <div className="search-field">
                    <label>Check-out</label>
                    <input
                        type="date"
                        value={checkout}
                        onChange={(e) => setCheckout(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                    />
                </div>
                <div className="search-field">
                    <label>Guests</label>
                    <select value={guests} onChange={(e) => setGuests(e.target.value)}>
                        <option>1 Guest</option>
                        <option>2 Guests</option>
                        <option>3 Guests</option>
                        <option>4+ Guests</option>
                    </select>
                </div>
                <button className="search-btn" onClick={handleSearch}>
                    Search
                </button>
            </div>
        </div>
    )
}

export default SearchSection