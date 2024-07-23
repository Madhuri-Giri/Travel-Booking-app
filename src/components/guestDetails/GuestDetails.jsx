import { useEffect, useState } from 'react';
import './GuestDetails.css';
import { Container } from 'react-bootstrap';

const GuestDetails = () => {
  const [roomsData, setRoomsData] = useState([]);

  useEffect(() => {
    const rooms = JSON.parse(localStorage.getItem('roomsData')) || [];
    setRoomsData(rooms);
  }, []);

  return (
    <Container>
      <h1>Guest Details</h1>
      {roomsData.length > 0 ? (
        <div>
          {roomsData.map((room, index) => (
            <div key={index}>
              <h2>Room {index + 1}</h2>
              <p><strong>Room Type:</strong> {room.RoomTypeName}</p>
              <p><strong>Price:</strong> {room.Price.RoomPrice}</p>
              <p><strong>Amenities:</strong> {room.Amenities.join(', ')}</p>
              <p><strong>Cancellation Policies:</strong> {room.CancellationPolicy}</p>
              {/* Display other relevant room details */}
            </div>
          ))}
        </div>
      ) : (
        <p>No room data available.</p>
      )}
    </Container>
  );
};

export default GuestDetails;
