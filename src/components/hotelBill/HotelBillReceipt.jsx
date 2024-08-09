import React, { useEffect, useState } from 'react';
import { GeneratePdf } from './GeneratePdf'; // Import the GeneratePdf function
import './HotelBillReceipt.css'
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
    return <p>Loading...</p>;
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

  return (
    <div className="hotelTikit">
      <div className="hed">
        <h5>Booking Receipt</h5>
      </div>
      <div className="down">
        <div className="tikit-status">
          <div className="download-tikit">
            <h4>Guest Details</h4>
            <table className="details-table">
              <tbody>
                <tr>
                  <th>First Name</th>
                  <td>{guestDetails.fname}</td>
                </tr>
                <tr>
                  <th>Middle Name</th>
                  <td>{guestDetails.mname}</td>
                </tr>
                <tr>
                  <th>Last Name</th>
                  <td>{guestDetails.lname}</td>
                </tr>
                <tr>
                  <th>Email</th>
                  <td>{guestDetails.email}</td>
                </tr>
                <tr>
                  <th>Mobile</th>
                  <td>{guestDetails.mobile}</td>
                </tr>
              </tbody>
            </table>

            <h4>Booking Details</h4>
            <table className="details-table">
              <tbody>
                <tr>
                  <th>Hotel Name</th>
                  <td>{bookingDetails.hotelName || 'Not Provided'}</td>
                </tr>
                <tr>
                  <th>Check-in Date</th>
                  <td>{bookingDetails.checkInDate || 'Not Provided'}</td>
                </tr>
                <tr>
                  <th>Check-out Date</th>
                  <td>{bookingDetails.checkOutDate || 'Not Provided'}</td>
                </tr>
                <tr>
                  <th>Room Type</th>
                  <td>{bookingDetails.roomType || 'Not Provided'}</td>
                </tr>
              </tbody>
            </table>

            <h4>Price Summary</h4>
            <table className="details-table">
              <tbody>
                <tr>
                  <th>Total Price (Double Deluxe)</th>
                  <td>{bookingDetails.totalPriceDoubleDeluxe || 'Not Provided'}</td>
                </tr>
                <tr>
                  <th>Total Price (Single Deluxe)</th>
                  <td>{bookingDetails.totalPriceSingleDeluxe || 'Not Provided'}</td>
                </tr>
                <tr>
                  <th>Total Price with GST</th>
                  <td>{totalPrice || 'Not Provided'}</td>
                </tr>
              </tbody>
            </table>

            {/* Button to download the PDF */}
            <button onClick={handleDownloadPDF}>Download PDF</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingBill;
