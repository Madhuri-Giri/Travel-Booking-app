import React, { useEffect, useState, useRef } from 'react';
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
import html2canvas from 'html2canvas';

const BookingBill = () => {
  const [bookingDetails, setBookingDetails] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const ticketElementRef = useRef(null);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const transaction_id = localStorage.getItem('transaction_id');
        if (!transaction_id) {
          throw new Error('Transaction ID not found in local storage');
        }

        const response = await fetch('https://sajyatra.sajpe.in/admin/api/payment-detail', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ transaction_id }),
        });

        if (response.status === 404) {
          throw new Error('Hotel booking not found');
        }

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const res = await response.json();
        if (res.result && res.data) {
          setBookingDetails(res.data);
        } else {
          throw new Error('Invalid response structure');
        }
        
      } catch (error) {
        setError(error.message);
        toast.error(`Error: ${error.message}`);
      }
    };

    fetchBookingDetails();
  }, []);

  const handleDownloadPDF = () => {
    if (!ticketElementRef.current) {
      toast.error('No content available for download.');
      return;
    }

    const buttonContainer = document.querySelector('.button-container');
    if (buttonContainer) {
      buttonContainer.style.display = 'none';
    }

    html2canvas(ticketElementRef.current, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('hotel_booking_details.pdf');
    }).catch((error) => {
      console.error('Error generating PDF:', error);
      toast.error('Error generating PDF.');
    }).finally(() => {
      if (buttonContainer) {
        buttonContainer.style.display = '';
      }
    });
  };

  const bookingCancel = async (event) => {
    event.preventDefault();

    const hotelBookingId = localStorage.getItem('hotel_booking_id');
    const transactionNum = localStorage.getItem('transactionNum');

    if (!hotelBookingId) {
      setError('No hotel booking ID available');
      toast.error('No hotel booking ID available');
      return;
    }

    if (!transactionNum) {
      setError('No transaction number available');
      toast.error('No transaction number available');
      return;
    }

    const requestData = {
      BookingId: hotelBookingId,
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorDetails = await response.json();
        throw new Error(`HTTP error! Status: ${response.status}, Details: ${JSON.stringify(errorDetails)}`);
      }

      const res = await response.json();
      if (res.data) {
        localStorage.setItem('hotelTicket', JSON.stringify(res.data));
        setBookingDetails(res.data);
        toast.success('Booking cancelled successfully');
      } else {
        throw new Error('No data found in the API response');
      }

    } catch (error) {
      console.error('Error:', error);
      setError('Error occurred during cancellation');
      toast.error('Error occurred during cancellation');
    }
  };

  if (error) {
    return (
      <div className="error-message">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <>
      <CustomNavbar />
      <div className="booking-bill-hotel" ref={ticketElementRef}>
        <div className="col-lg-9 hotel_img">
          <div className='hotelticktbox'>
            <div className="header_hotel">
              <h2>Hotel Booking Details</h2>
              <img src={hotelImg} alt="Hotel" />
            </div>

            {bookingDetails ? (
              <div className="details-section-wrapper">
                <div className="details-section-hotel">
                  <h3>Hotel Booking Information</h3>
                  <div className="detail-guest">
                    <p><span>Hotel Name:</span> {bookingDetails.hotel_passengers[0].hotelname}</p>
                    <p><span>Hotel Code:</span> {bookingDetails.hotel_passengers[0].hotelcode}</p>
                    <p><span>Transaction Number:</span> {bookingDetails.hotel_passengers[0].transaction_num}</p>
                    <p><span>Number of Rooms:</span> {bookingDetails.hotel_passengers[0].noofrooms}</p>
                    <p><span>Check-in Date:</span> {bookingDetails.hotel_passengers[0].check_in_date}</p>
                    <p><span>Room Price:</span> ₹{bookingDetails.hotel_passengers[0].roomprice}</p>
                    <p><span>GST:</span> {bookingDetails.hotel_passengers[0].igst}</p>
                    <p><span>Discount:</span> {bookingDetails.hotel_passengers[0].discount}</p>
                    <p><span>Total Price:</span> ₹{bookingDetails.hotel_passengers[0].publishedprice}</p>
                  </div>
                </div>

                <div className="details-section-guest">
                  <h3>Guest Details</h3>
                  <div className="detail-guest">
                    <p><span>Guest Name:</span> {bookingDetails.user_details.name}</p>
                    <p><span>Email:</span> {bookingDetails.user_details.email}</p>
                    <p><span>Mobile:</span> {bookingDetails.user_details.mobile}</p>
                  </div>
                </div>

                
              </div>
            ) : (
              <p>Loading booking details...</p>
            )}
          </div>
          <div className='button-container'>
                  <button className='ticket_btn' onClick={handleDownloadPDF}>Download PDF</button>
                  <button className='ticket_btn_cancel' onClick={bookingCancel}>Cancel Ticket</button>
                </div>
        </div>
        <ToastContainer />
      </div>
      <Footer />
    </>
  );
};

export default BookingBill;
