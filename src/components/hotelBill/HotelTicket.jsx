import React, { useEffect, useState, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CustomNavbar from '../../pages/navbar/CustomNavbar';
import Footer from '../../pages/footer/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import './HotelTicket.css';
import hotelImg from '../../../src/assets/images/hotel-ticket-img.png';
import Lottie from 'lottie-react';
import hotelAnim from "../../assets/images/hotelanimation.json";

const BookingBill = () => {
  const [bookingDetails, setBookingDetails] = useState(null);
  const [error, setError] = useState(null);
  const [guestDetails, setGuestDetails] = useState(null);
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

    // Fetch booking details
    fetchBookingDetails();

    // Retrieve guest details from local storage
    const storedGuestDetails = localStorage.getItem('guestDetails');
    if (storedGuestDetails) {
      try {
        // Parse the guest details
        const parsedGuestDetails = JSON.parse(storedGuestDetails);
        // Assuming guestDetails is an array and we need the first item
        if (Array.isArray(parsedGuestDetails) && parsedGuestDetails.length > 0) {
          setGuestDetails(parsedGuestDetails[0]);
        } else {
          setGuestDetails(null);
        }
      } catch (error) {
        setGuestDetails(null);
        console.error('Error parsing guest details from local storage:', error);
      }
    }
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
  
      if (res.data) {
        localStorage.setItem('hotelTicket', JSON.stringify(res.data));
        setBookingDetails(res.data);
        toast.success('Booking cancelled successfully');
        navigate('/hotel-search');
      } else {
        setError('No data found in the API response');
        toast.error('No data found in the API response');
      }
  
    } catch (error) {
        setError('Error occurred during cancellation');
        toast.error('Error occurred during cancellation');
    }
  };

  return (
    <>
      <CustomNavbar />
      <div className="main-container">
        <div className="content-container">
          <div className="animation-container">
            <Lottie animationData={hotelAnim} className="lottie-animation" />
          </div>
          <div className="receipt-container" ref={ticketElementRef}>
            <div className="receipt-header">
              <img src={hotelImg} alt="Hotel" className="hotel-logo" />
              <h1>Hotel Booking Receipt</h1>
            </div>
            <div className="receipt-body">
              <div className="section_r">
                <p><strong>Check-in Date:</strong> {bookingDetails?.hotel_passengers[0].check_in_date}</p>
                <p><strong>Invoice No:</strong> {bookingDetails?.booking[0].InvoiceNumber}</p>
                <p><strong>Ref No:</strong> {bookingDetails?.booking[0].BookingRefNo}</p>
              </div>
              <div className="section_c">
                <div className="column">
                  <h2>Hotel Information</h2>
                  <p><strong>Hotel Name:</strong> {bookingDetails?.hotel_passengers[0].hotelname}</p>
                  <p><strong>Hotel Code:</strong> {bookingDetails?.hotel_passengers[0].hotelcode}</p>
                  <p><strong>Number of Rooms:</strong> {bookingDetails?.hotel_passengers[0].noofrooms}</p>
                </div>
                <div className="column">
                  <h2>Guest Details</h2>
                  <p><strong>First Name:</strong> {guestDetails?.fname}</p>
                  <p><strong>Middle Name:</strong> {guestDetails?.mname}</p>
                  <p><strong>Last Name:</strong> {guestDetails?.lname}</p>
                  <p><strong>Email:</strong> {guestDetails?.email}</p>
                  <p><strong>Mobile:</strong> {guestDetails?.mobile}</p>
                  {/* <p><strong>PAN No:</strong> {guestDetails?.PANNo}</p> */}
                  {/* <p><strong>Passport No:</strong> {guestDetails?.passportNo}</p> */}
                  <p><strong>Age:</strong> {guestDetails?.age}</p>
                </div>
              </div>
              <div className="section_c price-summary">
                <h2>Price Summary</h2>
                <p><strong>Room Price:</strong> ₹{bookingDetails?.hotel_passengers[0].roomprice}</p>
                <p><strong>GST:</strong> {bookingDetails?.hotel_passengers[0].igst}</p>
                <p><strong>Discount:</strong> {bookingDetails?.hotel_passengers[0].discount}</p>
                <p><strong>Total Price:</strong> ₹{bookingDetails?.hotel_passengers[0].publishedprice}</p>
              </div>
            </div>
            <div className='button-container'>
              <button className='download-button' onClick={handleDownloadPDF}>Download PDF</button>
              <button className='cancel-button' onClick={bookingCancel}>Cancel</button>
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
