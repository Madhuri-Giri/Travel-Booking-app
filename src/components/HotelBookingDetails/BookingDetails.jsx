import React, { useEffect, useState } from 'react';

const BookingDetails = () => {
  const [bookingDetails, setBookingDetails] = useState(null);

  useEffect(() => {
    const bookingData = localStorage.getItem('HotelBookingDetails');
    if (bookingData) {
      setBookingDetails(JSON.parse(bookingData));
    } else {
      // Handle case where no data is found
      console.error('No booking data available.');
    }
  }, []);

  if (!bookingDetails) {
    return <p>No booking data available.</p>;
  }

  return (
    <div className="booking-details-container">
      <h2>Booking Details</h2>
      <p><strong>Hotel Name:</strong> {bookingDetails.hotelName}</p>
      <p><strong>Room Type:</strong> {bookingDetails.roomType}</p>
      <p><strong>Check-in Date:</strong> {bookingDetails.checkInDate}</p>
      <p><strong>Check-out Date:</strong> {bookingDetails.checkOutDate}</p>
      <p><strong>Total Price:</strong> {bookingDetails.totalPrice}</p>
      {/* Display other booking details as needed */}
    </div>
  );
};

export default BookingDetails;
