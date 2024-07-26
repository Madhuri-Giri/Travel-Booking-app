import React, { useEffect, useState } from 'react';
import './GuestDetails.css';  

const GuestDetails = () => {
  const [roomsData, setRoomsData] = useState([]);

  useEffect(() => {
    const roomsJSON = localStorage.getItem('roomsData');
    if (roomsJSON) {
      setRoomsData(JSON.parse(roomsJSON));
    }
  }, []);

  return (
    <div className="guest-details-container">
      <h2 className="section-title">Guest Details</h2>
      {roomsData.length > 0 ? (
        roomsData.map((room, index) => (
          <div key={index} className="guest-details-card">
            <h3 className="card-title">Room Type: {room.RoomTypeName}</h3>
            <h2>{room.HotelName}</h2>
            <p className="info-section">Price: {room.Price?.CurrencyCode} {room.Price?.RoomPrice?.toFixed(2)}</p>
            <p className="info-section">
              Day Rate: {room.DayRates?.map(dayRate => (
                <span key={dayRate.Date}>
                  {new Date(dayRate.Date).toLocaleDateString()} - {dayRate.Amount}
                </span>
              ))}
            </p>
            <p className="info-section">Smoking Preference: {room.SmokingPreference}</p>
            <h5 className="info-section">Cancellation Policies:</h5>
            <ul>
              {room.CancellationPolicies?.map((policy, index) => (
                <li key={index}>
                  {policy.ChargeType === 1 ? 'Fixed Charge' : 'Percentage Charge'}: 
                  {policy.Currency} {policy.Charge} from {new Date(policy.FromDate).toLocaleDateString()} to {new Date(policy.ToDate).toLocaleDateString()}
                </li>
              ))}
            </ul>
            <p className="info-section"><strong>Cancellation Policies:</strong> {room.CancellationPolicy}</p>
          </div>
        ))
      ) : (
        <p className="no-room-details">No room details available.</p>
      )}
      <button className="submit-btn">Continue</button>
    </div>
  );
};

export default GuestDetails;
