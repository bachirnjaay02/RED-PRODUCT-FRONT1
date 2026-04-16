import React from 'react';

// ✅ Images Unsplash pour chaque hôtel par nom
const getHotelImage = (hotelName) => {
  const images = {
    'Hôtel Terrou-Bi':        'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
    'King Fahd Palace':       'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80',
    'Radisson Blu Hotel':     'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80',
    'Pullman Dakar Teranga':  'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80',
    'Hôtel Lac Rose':         'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80',
    'Hôtel Saly':             'https://images.unsplash.com/photo-1551882547-ff40c4fe799e?w=800&q=80',
    'Palm Beach Resort & Spa':'https://images.unsplash.com/photo-1615880484746-a134be9a6ecf?w=800&q=80',
  };
  return images[hotelName] || 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80';
};

function HotelCard({ hotel }) {
  return (
    <div className="col-12 col-md-6 col-lg-4 col-xl-3 mb-4">
      <div className="card border-0 shadow-sm rounded-4 h-100 overflow-hidden">
        <img
          src={getHotelImage(hotel.name)}
          className="card-img-top"
          alt={hotel.name}
          style={{ height: '180px', objectFit: 'cover' }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80';
          }}
        />
        <div className="card-body p-3">
          <p className="text-danger mb-1" style={{ fontSize: '11px' }}>{hotel.location}</p>
          <h6 className="card-title fw-bold mb-2">{hotel.name}</h6>
          <p className="card-text text-dark small">{hotel.price} par nuit</p>
        </div>
      </div>
    </div>
  );
}

export default HotelCard;