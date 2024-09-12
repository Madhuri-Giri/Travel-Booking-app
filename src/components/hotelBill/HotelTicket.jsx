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
import hotelImglogo from "../../assets/images/main logo.png"
import he from 'he';

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
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
  
      // Calculate scale to fit the width of the content to the PDF page width
      const widthRatio = pdfWidth / imgWidth;
      const heightRatio = pdfHeight / imgHeight;
      const scale = widthRatio; // We want to fit the width to the PDF page width
  
      const newImgWidth = imgWidth * scale;
      const newImgHeight = imgHeight * scale;
  
      // Adjust height to fit the single page if necessary
      const pageHeight = pdf.internal.pageSize.height;
      if (newImgHeight > pageHeight) {
        pdf.internal.pageSize.height = newImgHeight;
        pdf.internal.pageSize.width = newImgWidth;
      }
  
      pdf.addImage(imgData, 'PNG', 0, 0, newImgWidth, newImgHeight);
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

  const cleanUpDescription = (description) => {
  if (!description) return '';

  // Decode HTML entities
  let cleanedDescription = he.decode(description);

  // Define patterns to extract key points
  const patterns = [
    /Check-in hour[^.]+?\./i,
    /Valid From[^.]+?\./i,
    /Identification card at arrival[^.]+?\./i,
    /Minimum check-in age[^.]+?\./i,
    /Car park[^.]+?\./i,
    /Amendments cannot be made[^.]+?\./i,
  ];

  let formattedText = '';
  
  patterns.forEach((pattern) => {
    const matches = cleanedDescription.match(pattern);
    if (matches) {
      matches.forEach((match) => {
        formattedText += `<li>${match.trim()}</li>`;
      });
    }
  });

  // Replace multiple spaces with single space
  formattedText = formattedText.replace(/\s{2,}/g, ' ').trim();

  // Wrap the text in <ul> tags for list formatting
  return `<ul>${formattedText}</ul>`;
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
            <img src={hotelImglogo} alt="Hotel" className="hotel-logo-home" />
              {/* <img src={hotelImg} alt="Hotel" className="hotel-logo" /> */}
              <h1>Hotel Booking Receipt</h1>
            </div>
            <div className="receipt-body">
              <div className="section_r">
                <p><strong>Check-in Date:</strong> {bookingDetails?.booking[0].check_in_date}</p>
                <p><strong>Invoice No:</strong> {bookingDetails?.hotel_status.InvoiceNumber}</p>
                <p><strong>Ref No:</strong> {bookingDetails?.hotel_status.BookingRefNo}</p>
              </div>

              <div className="section_cp">
              <div><h2>Hotel Policy:</h2>
              <div dangerouslySetInnerHTML={{ __html: cleanUpDescription(bookingDetails?.booking[0].hotelpolicy) }} />
              </div>
              </div>

              <div className="section_c">
                <div className="column">
                  <h2>Hotel Information</h2>
                  <p><strong>Hotel Name:</strong> {bookingDetails?.hotel_status.hotel_name}</p>
                  <p><strong>Address:</strong>{bookingDetails?.booking[0].addressLine1}</p>
                  <p><strong>Hotel Code:</strong> {bookingDetails?.booking[0].hotelcode}</p>
                  <p><strong>Number of Rooms:</strong> {bookingDetails?.booking[0].noofrooms}</p>
                  <p><strong>Room Type:</strong>{bookingDetails?.booking[0].room_type_name}</p>
                </div>
                <div className="column">
                  <h2>Guest Details</h2>
                  <p><strong>First Name:</strong> {bookingDetails?.user_details.firstname}</p>
                  <p><strong>Last Name:</strong> {bookingDetails?.user_details.lastname}</p>
                  <p><strong>Email:</strong> {bookingDetails?.user_details.email}</p>
                  <p><strong>Mobile:</strong> {bookingDetails?.user_details.phoneno}</p>
                  <p><strong>Age:</strong> {bookingDetails?.user_details.age }</p>
                </div>
              </div>
              <div className="section_c price-summary">
                <h2>Price Summary</h2>
                <p><strong>Room Price:</strong> ₹{bookingDetails?.booking[0].roomprice}</p>
                <p><strong>GST:</strong> {bookingDetails?.booking[0].igst}</p>
                <p><strong>Discount:</strong> {bookingDetails?.booking[0].discount}</p>
                <p><strong>Total Price:</strong> ₹{bookingDetails?.booking[0].publishedprice}</p>
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
