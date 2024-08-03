// BookingBill.js
import React from 'react';
import { GeneratePdf } from './GeneratePdf';

const HotelBillReceipt = ({ hotelName, roomQuantity, price, roomType, checkInDate, checkOutDate }) => {
  return (
    <div>
      <h1>Booking Bill</h1>
      <p>Hotel Name: {hotelName}</p>
      <p>Room Quantity: {roomQuantity}</p>
      <p>Price: {price}</p>
      <p>Room Type: {roomType}</p>
      <p>Check-In Date: {checkInDate}</p>
      <p>Check-Out Date: {checkOutDate}</p>
      
      <button onClick={() => GeneratePdf(hotelName, roomQuantity, price, roomType, checkInDate, checkOutDate)}>
        Download as PDF
      </button>
    </div>
  );
};

export default HotelBillReceipt;
