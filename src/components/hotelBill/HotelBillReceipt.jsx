import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import "jspdf-autotable";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './HotelBillReceipt.css';
import CustomNavbar from '../../pages/navbar/CustomNavbar';
import Footer from '../../pages/footer/Footer';
import { useNavigate } from 'react-router-dom';

const BookingBill = () => {
  const [bookingDetails, setBookingDetails] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); 

  useEffect(() => {
    const storedTicketData = localStorage.getItem('hotelTicket');
    if (storedTicketData) {
      try {
        const parsedData = JSON.parse(storedTicketData);
        setBookingDetails(parsedData);
      } catch (e) {
        console.error('Error parsing ticket data:', e);
        setError('Failed to parse ticket data');
      }
    } else {
      setError('No ticket data found');
    }
  }, []);

  if (error) {
    toast.error(error);
    return <div>Error: {error}</div>;
  }

  if (!bookingDetails) {
    return <div>Loading...</div>;
  }

  const handleDownloadPDF = () => {
    if (bookingDetails) {
      const doc = new jsPDF();

      const { hotelBook, hotelPassengerdetail } = bookingDetails;
      if (hotelBook && hotelBook.length > 0) {
        const hotelInfo = hotelBook[0];
        doc.setFontSize(18);
        doc.text('Booking Bill', 14, 22);
        doc.setFontSize(12);
        doc.text(`Hotel Name: ${hotelInfo.hotelname}`, 14, 40);
        doc.text(`Room Quantity: ${hotelInfo.noofrooms}`, 14, 50);
        doc.text(`Price: ${hotelInfo.roomprice}`, 14, 60);
        doc.text(`Room Type: ${hotelInfo.roomtype}`, 14, 70);
        doc.text(`Check-In Date: ${hotelInfo.check_in_date}`, 14, 80);
        doc.text(`Check-Out Date: ${hotelInfo.check_out_date}`, 14, 90);
      }

      doc.save('booking-bill.pdf');
    } else {
      toast.error('No booking details available to generate PDF');
    }
  };

  const bookingCancel = async (event) => {
    event.preventDefault();

    const requestData = {
      BookingId: 1554760, 
      RequestType: 4,
      BookingMode: 5,
      SrdvType: "SingleTB",
      SrdvIndex: "SrdvTB",
      Remarks: "Test",
      transaction_num: "SAJ4790",
      date: "2019-09-17T00:00:00",
      hotel_booking_id: "192",
      trace_id: "1",
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
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const res = await response.json();
      console.log('hotel-cancel API Response:', res);

      if (res.data) {
        localStorage.setItem('hotelTicket', JSON.stringify(res.data));
        setBookingDetails(res.data);
        toast.success('Booking cancelled successfully');
      } else {
        console.error('No data found in the API response:', res);
        setError('No data found in the API response');
        toast.error('No data found in the API response');
      }

    } catch (error) {
      console.error('Error:', error);
      setError('Error occurred during cancellation');
      toast.error('Error occurred during cancellation');
    }
  };

  return (
    <>
      <CustomNavbar />
      <div className="booking-bill-container">
        <div className="header">
          <h2>Hotel Booking Details</h2>
        </div>

        <div className="details-section">
          <h3>Hotel Information</h3>
          {bookingDetails.hotelBook && bookingDetails.hotelBook.length > 0 && (
            <div className="detail-card">
              {bookingDetails.hotelBook.map((item, index) => (
                <div key={index}>
                  <p><span>Hotel Name:</span> {item.hotelname}</p>
                  <p><span>Booking ID:</span> {item.hotelcode}</p>
                  <p><span>Transaction Number:</span> {item.transaction_num}</p>
                  <p><span>Number of Rooms:</span> {item.noofrooms}</p>
                  <p><span>Check-in Date:</span> {item.check_in_date || 'N/A'}</p>
                  <p><span>Room Price:</span> {item.roomprice}</p>
                  <p><span>Tax:</span> {item.tax}</p>
                  <p><span>Discount:</span> {item.discount}</p>
                  <p><span>Published Price:</span> {item.publishedprice}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="details-section">
          <h3>Guest Details</h3>
          {bookingDetails.hotelPassengerdetail && bookingDetails.hotelPassengerdetail.length > 0 && (
            <div className="detail-card">
              {bookingDetails.hotelPassengerdetail.map((item, index) => (
                <div key={index}>
                  <p><span>Title:</span> {item.title}</p>
                  <p><span>First Name:</span> {item.firstname}</p>
                  <p><span>Last Name:</span> {item.lastname}</p>
                  <p><span>Phone Number:</span> {item.phoneno}</p>
                  <p><span>Email:</span> {item.email}</p>
                  <p><span>Age:</span> {item.age}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="button-container">
          <button className="download-pdf-btn" onClick={handleDownloadPDF}>Download PDF</button>
          <button className="cancel-button" onClick={bookingCancel}>Cancel Booking</button>
        </div>
      </div>
      <Footer />
      <ToastContainer />
    </>
  );
};

export default BookingBill;
