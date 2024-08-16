import React, { useEffect, useState } from 'react';
import { GeneratePdf } from './GeneratePdf'; // Import the GeneratePdf function
import './HotelBillReceipt.css';
import CustomNavbar from '../../pages/navbar/CustomNavbar';
import Footer from '../../pages/footer/Footer';

const BookingBill = () => {
  const [bookingDetails, setBookingDetails] = useState(null);
  const [guestDetails, setGuestDetails] = useState(null);
  const [totalPrice, setTotalPrice] = useState(null);

  useEffect(() => {
    // Retrieve data from local storage
    const storedBookingDetails = JSON.parse(localStorage.getItem('selectedRoomsData'));
    const storedGuestDetails = JSON.parse(localStorage.getItem('guestDetails'));
    const storedTotalPrice = localStorage.getItem('totalPriceWithGST');

    if (storedBookingDetails && storedGuestDetails && storedTotalPrice) {
      setBookingDetails(storedBookingDetails);
      setGuestDetails(storedGuestDetails);
      setTotalPrice(storedTotalPrice);
    }
  }, []);

  if (!bookingDetails || !guestDetails || !totalPrice) {
    return <p>Loading your booking details...</p>;
  }

  const handleDownloadPDF = () => {
    const hotelName = bookingDetails.hotelName || 'Unknown Hotel'; // Provide a default value if hotelName is not available
    const roomQuantity = bookingDetails.roomQuantity || 0;
    const price = totalPrice || 0;
    const roomType = bookingDetails.roomType || 'Unknown Room Type';
    const checkInDate = bookingDetails.checkInDate || 'Unknown Date';
    const checkOutDate = bookingDetails.checkOutDate || 'Unknown Date';

    GeneratePdf(hotelName, roomQuantity, price, roomType, checkInDate, checkOutDate);
  };

//-------Start Booking Cancel API Integration ----------


const BookingCancel = async (event) => {
  event.preventDefault();

  const requestData = {
    BookingId: 1554760,
    RequestType: 4,
    BookingMode: 5,
    SrdvType: "SingleTB",
    SrdvIndex: "SrdvTB",
    Remarks: "Test",
    transaction_num: 88965,
    date: "2019-09-17T00:00:00",
    hotelbooking_id: "143",
  };

  try {
    const response = await fetch('https://sajyatra.sajpe.in/admin/api/hotel-cancel', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const res = await response.json();
    console.log('hotel-cancel API Response:', res);

    const rooms = res.BlockRoomResult; 
    const roomsJSON = JSON.stringify(rooms);
    localStorage.setItem('hotelBlock', roomsJSON);

    
    if (selectedRoomsData) {
      localStorage.setItem('selectedRoomsData', JSON.stringify(selectedRoomsData));
    }

    navigate('/hotel-guest');
  } catch (error) {
    console.error('Error:', error);
  }
};
  return (
    <>
    <CustomNavbar/>
    <section className='hotelTicketSec'>
    <div className="booking-bill-container">
      <div className="header">
        <h2>Booking Receipt</h2>
      </div>

      <div className="details-section">
        <h3>Guest Details</h3>
        <div className="detail-card">
          <p><span>First Name:</span> {guestDetails.fname}</p>
          <p><span>Middle Name:</span> {guestDetails.mname}</p>
          <p><span>Last Name:</span> {guestDetails.lname}</p>
          <p><span>Email:</span> {guestDetails.email}</p>
          <p><span>Mobile:</span> {guestDetails.mobile}</p>
        </div>
      </div>

      <div className="details-section">
        <h3>Booking Details</h3>
        <div className="detail-card">
          <p><span>Hotel Name:</span> {bookingDetails.hotelName || 'Not Provided'}</p>
          <p><span>Check-in Date:</span> {bookingDetails.checkInDate || 'Not Provided'}</p>
          <p><span>Check-out Date:</span> {bookingDetails.checkOutDate || 'Not Provided'}</p>
          <p><span>Room Type:</span> {bookingDetails.roomType || 'Not Provided'}</p>
        </div>
      </div>

      <div className="details-section">
        <h3>Price Summary</h3>
        <div className="detail-card">
          <p><span>Total Price (Double Deluxe):</span> {bookingDetails.totalPriceDoubleDeluxe || 'Not Provided'}</p>
          <p><span>Total Price (Single Deluxe):</span> {bookingDetails.totalPriceSingleDeluxe || 'Not Provided'}</p>
          <p><span>Total Price with GST:</span> {totalPrice || 'Not Provided'}</p>
        </div>
      </div>

      {/* Button to download the PDF */}
      <button className="download-pdf-button" onClick={handleDownloadPDF}>Download PDF</button>
    </div>
    </section>
    <Footer/>
    </>
  );
};

export default BookingBill;
