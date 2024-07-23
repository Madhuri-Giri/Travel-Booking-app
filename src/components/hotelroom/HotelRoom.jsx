import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import './HotelRoom.css';

const HotelRoom = () => {
  const location = useLocation();
  const [hotelRooms, setHotelRooms] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (location.state && Array.isArray(location.state.hotelRooms)) {
      setHotelRooms(location.state.hotelRooms);
      setLoading(false);
    } else {
      setError('No hotel room data available.');
      setLoading(false);
    }
  }, [location.state]);

  return (
    <Container>
      <div className="hotel_room_container">
        <h3>Select Room</h3>
        {loading && <p>Loading hotel rooms...</p>}
        {error && <p>Error: {error}</p>}
        {!loading && !error && hotelRooms.length === 0 && <p>No hotel room data available.</p>}
        {hotelRooms.length > 0 && !error && (
          <div>
            {hotelRooms.map((room, index) => (
              <div key={index} className="hotel_room_box">
                <h3>{room.RoomTypeName}</h3>
                <p>Price: INR {room.Price?.RoomPrice?.toFixed(2)}</p>
                <p>Day Rate: {room.DayRates?.map(dayRate => (
                  <span key={dayRate.Date}>
                    {new Date(dayRate.Date).toLocaleDateString()} - INR {dayRate.Amount}
                  </span>
                ))}</p>
                <p>Smoking Preference: {room.SmokingPreference}</p>
                <h5>Cancellation Policies:</h5>
                <ul>
                  {room.CancellationPolicies?.map((policy, index) => (
                    <li key={index}>
                      {policy.ChargeType === 1 ? 'Fixed Charge' : 'Percentage Charge'}: 
                      {policy.Currency} {policy.Charge} from {new Date(policy.FromDate).toLocaleDateString()} to {new Date(policy.ToDate).toLocaleDateString()}
                    </li>
                  ))}
                </ul>
                <button className="reserve_button">Reserve</button>
                <button className="continue_button">Continue</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Container>
  );
};

export default HotelRoom;
