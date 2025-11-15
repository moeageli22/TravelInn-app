import HotelCard from './HotelCard'
import './HotelsGrid.css'

const HotelsGrid = ({ onBookClick }) => {
    const hotels = [
        {
            id: 1,
            name: 'Dubai Luxe Tower',
            location: 'dubai',
            price: 680,
            rating: 5,
            image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop'
        },
        {
            id: 2,
            name: 'Azure Paradise Resort',
            location: 'maldives',
            price: 450,
            rating: 5,
            image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop'
        }
    ]

    return (
        <div className="hotels-grid">
            {hotels.map(hotel => (
                <HotelCard
                    key={hotel.id}
                    hotel={hotel}
                    onBookClick={onBookClick}
                />
            ))}
        </div>
    )cd
}

export default HotelsGridc