import React from 'react';
import { useLocation } from 'react-router-dom';


const BookingBill = () => {
  const location = useLocation();
  const { bookingDetails, guestDetails } = location.state || {};

  if (!bookingDetails || !guestDetails) {
    return <p>Loading...</p>;
  }

  return (
    <div className="booking-bill-container">
      <h2>Booking Receipt</h2>
      <h3>Guest Details</h3>
      <p><strong>First Name:</strong> {guestDetails.fname}</p>
      <p><strong>Middle Name:</strong> {guestDetails.mname}</p>
      <p><strong>Last Name:</strong> {guestDetails.lname}</p>
      <p><strong>Email:</strong> {guestDetails.email}</p>
      <p><strong>Mobile:</strong> {guestDetails.mobile}</p>

      <h3>Booking Details</h3>
      <p><strong>Hotel Name:</strong> {bookingDetails.HotelName}</p>
      <p><strong>Check-in Date:</strong> {bookingDetails.CheckInDate}</p>
      <p><strong>Check-out Date:</strong> {bookingDetails.CheckOutDate}</p>
      {/* Add more booking details as needed */}

      <h3>Price Summary</h3>
      <p><strong>Total Price:</strong> {bookingDetails.TotalPrice}</p>
      <p><strong>Total Price with GST:</strong> {bookingDetails.TotalPriceWithGST}</p>
    </div>
  );
};

export default BookingBill;
