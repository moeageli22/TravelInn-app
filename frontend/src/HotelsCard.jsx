import './HotelCard.css'

const HotelCard = ({ hotel, onBookClick }) => {
    const { name, location, price, rating, image } = hotel

    const renderStars = () => {
        return '⭐'.repeat(rating)
    }

    const formatLocation = (loc) => {
        return loc.charAt(0).toUpperCase() + loc.slice(1)
    }

    return (
        <div className="hotel-card">
            <img src={image} alt={name} className="hotel-image" />
            <div className="hotel-content">
                <h3 className="hotel-name">{name}</h3>
                <div className="hotel-rating">{renderStars()}</div>
                <div className="hotel-location">📍 {formatLocation(location)}</div>
                <div className="hotel-footer">
                    <div>
                        <span className="price-amount">${price}</span> /night
                    </div>
                    <button
                        className="book-btn"
                        onClick={() => onBookClick(name, price, location)}
                    >
                        BOOK
                    </button>
                </div>
            </div>
        </div>
    )
}

export default HotelCard