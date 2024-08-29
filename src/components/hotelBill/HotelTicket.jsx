import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './HotelBillReceipt.css';
import CustomNavbar from '../../pages/navbar/CustomNavbar';
import Footer from '../../pages/footer/Footer';
import { useNavigate } from 'react-router-dom';
import '../hotelBill/HotelTicket.css';
import hotelImg from '../../../src/assets/images/hotel-ticket-img.png';
import 'react-toastify/dist/ReactToastify.css';

const BookingBill = () => {
  const [bookingDetails, setBookingDetails] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const transaction_id = localStorage.getItem('transaction_id');
        if (!transaction_id) {
          throw new Error('Transaction ID not found in local storage');
        }

        const requestData = { transaction_id };

        const response = await fetch('https://sajyatra.sajpe.in/admin/api/payment-detail', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        });

        if (response.status === 404) {
          throw new Error('Hotel booking not found');
        }

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const res = await response.json();
        setBookingDetails(res.data);
      } catch (error) {
        setError(error.message);
        toast.error(`Error: ${error.message}`);
      }
    };

    fetchBookingDetails();
  }, []);

  const handleDownloadPDF = () => {
    if (!bookingDetails) {
      toast.error('No booking details available for download.');
      return;
    }

    const doc = new jsPDF();
    const { hotel_passengers, booking, user_details } = bookingDetails;

    if (hotel_passengers.length > 0) {
      const hotelInfo = hotel_passengers[0];
      doc.setFontSize(18);
      doc.text('Booking Bill', 14, 22);
      doc.setFontSize(12);
      doc.text(`Hotel Name: ${hotelInfo.hotelname}`, 14, 40);
      doc.text(`Room Quantity: ${hotelInfo.noofrooms}`, 14, 50);
      doc.text(`Price: ${hotelInfo.roomprice}`, 14, 60);
      doc.text(`Room Type: ${hotelInfo.room_type_name}`, 14, 70);
      doc.text(`Check-In Date: ${hotelInfo.check_in_date}`, 14, 80);
      doc.text(`Check-Out Date: ${hotelInfo.check_out_date || 'N/A'}`, 14, 90);
    }

    if (booking.length > 0) {
      const bookingInfo = booking[0];
      doc.text(`Booking ID: ${bookingInfo.booking_id}`, 14, 110);
      doc.text(`Hotel Name: ${bookingInfo.hotel_name}`, 14, 120);
      doc.text(`Transaction Number: ${bookingInfo.transaction_num}`, 14, 130);
      doc.text(`Amount: ${bookingInfo.amount}`, 14, 140);
    }

    if (user_details.length > 0) {
      const userInfo = user_details[0];
      doc.text(`User Name: ${userInfo.name}`, 14, 150);
      doc.text(`Email: ${userInfo.email}`, 14, 160);
      doc.text(`Mobile: ${userInfo.mobile}`, 14, 170);
    }

    doc.save('booking-bill.pdf');
  };

  const bookingCancel = async (event) => {
    event.preventDefault();

    // Retrieve the stored booking IDs from localStorage
    const hotelBookingId = localStorage.getItem('hotel_booking_id');
    const transactionNum = localStorage.getItem('transactionNum');
     
    if (!hotelBookingId) {
        console.error('No hotel booking ID available');
        setError('No hotel booking ID available');
        toast.error('No hotel booking ID available');
        return;
    }

    // Additional validation for transactionNum
    if (!transactionNum) {
        console.error('No transaction number available');
        setError('No transaction number available');
        toast.error('No transaction number available');
        return;
    }

    const requestData = {
      BookingId: '1554760', 
      RequestType: 4,
      BookingMode: 5,
      SrdvType: "SingleTB",
      SrdvIndex: "SrdvTB",
      Remarks: "Test",
      transaction_num: transactionNum,
      date: new Date().toISOString(),
      hotel_booking_id: hotelBookingId, 
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
        const errorDetails = await response.json();
        throw new Error(`HTTP error! Status: ${response.status}, Details: ${JSON.stringify(errorDetails)}`);
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
      <div className="booking-bill-hotel">
        <div className="col-lg-9 hotel_img">
          <div className='hotelticktbox'>
            <div className="header_hotel">
              <h2>Hotel Booking Details</h2>
              <img src={hotelImg} alt="Hotel" />
            </div>

            <div className="details-section-wrapper">
              <div className="details-section-hotel">
                <h3>Hotel Information</h3>
                {bookingDetails?.hotel_passengers?.length > 0 ? (
                  <div className="detail-guest">
                    {bookingDetails.hotel_passengers.map((item, index) => (
                      <div key={index}>
                        <p><span>Hotel Name:</span> {item.hotelname}</p>
                        <p><span>Hotel Code:</span> {item.hotelcode}</p>
                        <p><span>Transaction Number:</span> {item.transaction_num}</p>
                        <p><span>Number of Rooms:</span> {item.noofrooms}</p>
                        <p><span>Check-in Date:</span> {item.check_in_date}</p>
                        <p><span>Room Price:</span> {item.roomprice}</p>
                        <p><span>GST:</span> {item.tax}</p>
                        <p><span>Discount:</span> {item.discount}</p>
                        <p><span>Total Price:</span> {item.publishedprice}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No hotel information available.</p>
                )}
              </div>

              <div className="details-section-guest">
                <h3>Guest Details</h3>
                {bookingDetails?.hotel_passengers?.length > 0 ? (
                  <div className="detail-guest">
                    {bookingDetails.hotel_passengers.map((item, index) => (
                      <div key={index}>
                        <p><span>Name:</span> {item.firstname}</p>
                        <p><span>Phone Number:</span> {item.phoneno}</p>
                        <p><span>Email:</span> {item.email}</p>
                        <p><span>Age:</span> {item.age}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No guest details available.</p>
                )}
              </div>
            </div>

            <div className='button-container'>
              <button className='ticket_btn' onClick={handleDownloadPDF}>Download PDF</button>
              <button className='ticket_btn_cancel' onClick={bookingCancel}>Cancel Ticket</button>
            </div>
            
          </div>
        </div>
        <ToastContainer />
      </div>
      <Footer />
    </>
  );
};

export default BookingBill;
