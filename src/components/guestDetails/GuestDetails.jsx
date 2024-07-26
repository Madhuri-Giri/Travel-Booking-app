import React, { useEffect, useState } from 'react';
import './GuestDetails.css'; // Make sure to import the CSS file
import axios from 'axios';


const GuestDetails = () => {
  const [roomsData, setRoomsData] = useState([]);

  useEffect(() => {
    const roomsJSON = localStorage.getItem('roomsData');
    if (roomsJSON) {
      setRoomsData(JSON.parse(roomsJSON));
    }
  }, []);

// ---------------------------Payment-----------------------------------------------------------


// const [paymentDetails, setPaymentDetails] = useState(null);
// // const [passengerData, setPassengerData] = useState([]);


// const fetchPaymentDetails = async () => {
//   try {
//     const response = await axios.post('https://sajyatra.sajpe.in/admin/api/create-payment', {
//       amount: 100,
//       user_id: '1',
//     });

//     if (response.data.status === 'success') {
//       setPaymentDetails(response.data.payment_details);
//       console.log('hotel createPayment', response.data);
//       return response.data;
//     } else {
//       throw new Error(response.data.message);
//     }
//   } catch (error) {
//     console.error('Error fetching payment details:', error);
//     alert('Failed to initiate payment. Please try again.');
//     return null;
//   }
// };







// --------------------------------------------------------------------------------------


  return (
    <div className="guest-details-container">
      <h2 className="section-title">Guest Details</h2>
      {roomsData.length > 0 ? (
        roomsData.map((room, index) => (
          <div key={index} className="guest-details-card">
            <h3 className="card-title">Room Type: {room.RoomTypeName}</h3>
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
      <button onClick={hotelpayHandler} className="submit-btn">Continue</button>
    </div>
  );
};

export default GuestDetails;
