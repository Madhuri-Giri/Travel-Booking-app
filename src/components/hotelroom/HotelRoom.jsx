import  { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { format } from 'date-fns';
import './HotelRoom.css';
import { Container } from 'react-bootstrap';

const HotelRoom = () => {
  const [hotelRooms, setHotelRooms] = useState([]);
  const [error, setError] = useState(null);

  
  useEffect(() => {
    const storedHotelRooms = localStorage.getItem('hotelRooms');
    if (storedHotelRooms) {
      setHotelRooms(JSON.parse(storedHotelRooms));
    } else {
      setError('No hotel rooms data available.');
    }
  }, []);

  const navigate = useNavigate();
  const reserveHandler = () => {
    navigate('/hotel-guest')
  }

  return (
    <>
      
      <Container>
        <div className="hotel_room_container">
          <h3>Select Room</h3>
          {error && <p>Error: {error}</p>}
          {hotelRooms.length === 0 && !error && <p>Loading hotel rooms...</p>}
          {hotelRooms.length > 0 && (
            <div>
              {hotelRooms.map((room, index) => (
                <div key={index} className="hotel_room_box">
                  <h3>{room.RoomTypeName}</h3>
                  <p>Price: INR {room.Price.RoomPrice}</p>
                  <p>{format(new Date(room.DayRates[0].Date), 'dd/MM/yyyy')}</p>
                  <h5>Smoking Preference: {room.SmokingPreference}</h5>
                  <h5>Cancellation Policies</h5>
                  <div className="cancellation_policies">
                    {room.CancellationPolicies.map((policy, policyIndex) => (
                      <p key={policyIndex}>{policy.FromDate} - {policy.ToDate}: INR {policy.Charge}</p>
                    ))}
                  </div>
                  <button onClick={reserveHandler} className="reserve_button">Reserve</button>
                 

                </div>
              ))}
            </div>
          )}
        </div>
      </Container>
    </>
  );
}
export default HotelRoom;



