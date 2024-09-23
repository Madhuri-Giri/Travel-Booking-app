import React, { useEffect, useState, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CustomNavbar from '../../pages/navbar/CustomNavbar';
import Footer from '../../pages/footer/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import './HotelTicket.css';
import hotelImglogo from "../../assets/images/main logo.png";
import Lottie from 'lottie-react';
import hotelAnim from "../../assets/images/hotelanimation.json";
import he from 'he';

const BookingBill = () => {
  const [bookingDetails, setBookingDetails] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const ticketElementRef = useRef(null);
  const { blockRoomResult, bookingStatus } = location.state || {};
 

  useEffect(() => {
    const fetchBookingDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        const transaction_id = localStorage.getItem('transaction_id');
        if (!transaction_id) throw new Error('Transaction ID not found in local storage');

        const response = await fetch('https://sajyatra.sajpe.in/admin/api/payment-detail', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ transaction_id }),
        });

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const res = await response.json();
        if (res.result && res.data) {
          setBookingDetails(res.data);
        } else {
          throw new Error('Invalid response structure');
        }
      } catch (error) {
        setError(error.message);
        toast.error(`Error: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, []);

  const handleDownloadPDF = () => {
    if (!ticketElementRef.current) {
      toast.error('No content available for download.');
      return;
    }
  
    const buttonContainer = document.querySelector('.button-container-h');
    if (buttonContainer) {
      buttonContainer.style.display = 'none';
    }
  
    const originalWidth = ticketElementRef.current.style.width; // Store original width
    const fixedWidth = 1440; // Fixed width of 1280px for PDF
  
    // Temporarily set the element width to 1280px for PDF rendering
    ticketElementRef.current.style.width = `${fixedWidth}px`;
  
    const a4HeightInPx = 297 / 25.4 * 72; // A4 height (297mm) in pixels, considering 72 DPI
  
    html2canvas(ticketElementRef.current, {
      width: fixedWidth, // Ensure canvas is rendered at 1280px width
      scale: 4, // Increase scale for better quality
    }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
  
      const imgWidth = fixedWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
  
      const scale = pdfWidth / imgWidth; // Keep width within A4 size
  
      const newImgWidth = imgWidth * scale;
      const newImgHeight = imgHeight * scale;
  
      // Limit height to fit A4 page dimensions
      const finalHeight = newImgHeight > pdfHeight ? a4HeightInPx : newImgHeight;
  
      pdf.addImage(imgData, 'PNG', 0, 0, newImgWidth, finalHeight);
      pdf.save('hotel_booking_details.pdf');
    }).catch((error) => {
      console.error('Error generating PDF:', error);
      toast.error('Error generating PDF.');
    }).finally(() => {
      // Revert the element back to its original width
      ticketElementRef.current.style.width = originalWidth;
  
      if (buttonContainer) {
        buttonContainer.style.display = '';
      }
    });
  };
  

  const bookingCancel = async (event) => {
    event.preventDefault();

    const hotelBookingId = localStorage.getItem('hotel_booking_id');
    const transactionNum = localStorage.getItem('transactionNum');

    if (!hotelBookingId || !transactionNum) {
      setError('Missing hotel booking ID or transaction number');
      toast.error('Missing hotel booking ID or transaction number');
      return;
    }

    const requestData = {
      BookingId: hotelBookingId, // Use the correct value here
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
        // Navigate to another page if needed
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

    let cleanedDescription = he.decode(description);

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

    formattedText = formattedText.replace(/\s{2,}/g, ' ').trim();

    return `<ul>${formattedText}</ul>`;
  };

  const cleanCancellationPolicy = (text) => {
    if (!text) return '';
  
    // Basic replacements and cleanup
    let cleanedText = text
      .replace(/#\^#|#!#|\s+/g, ' ') // Remove special sequences and extra spaces
      .replace(/\|/g, '\n') // Replace pipe characters with new lines
      .replace(/(\d{2}-\w{3}-\d{4}), (\d{2}:\d{2}:\d{2})/, '$1, $2') // Ensure proper date-time formatting
      .replace(/INR (\d+\.\d{2})/, 'INR $1') // Ensure proper amount formatting
      .replace(/(\d+)% of total amount/, '$1% of the total amount') // Clarify percentage text
      .replace(/(\d{2}-\w{3}-\d{4})/, '$1'); // Ensure proper date formatting
  
    // Clean up any redundant spaces or formatting issues
    cleanedText = cleanedText
      .replace(/\s{2,}/g, ' ') // Remove extra spaces
      .trim(); // Remove leading and trailing spaces
  
    return cleanedText;
  };
  

  const formatCancellationPolicy = (policies) => {
    if (!policies || policies.length === 0) return [];

    return policies.map((policy, idx) => (
      <li key={idx} className="policy-item">{policy}</li>
    ));
  };
  
  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!bookingDetails) {
    return <p>No booking details available.</p>;
  }

  const { hotel_booking, hotel_status, booking, user_details, policy } = bookingDetails;
  
  const cancellationPolicies = policy.map(p => cleanCancellationPolicy(p.cancellation_policy)).flat();
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
              <h1>Hotel Booking Receipt</h1>
            </div>
            <div className="receipt-body">
              <div className="section_r">
                <p><strong>Check-in Date:</strong> {booking[0].check_in_date}</p>
                <p><strong>Invoice No:</strong> {hotel_status.InvoiceNumber}</p>
                <p><strong>Ref No:</strong> {hotel_status.BookingRefNo}</p>
              </div>

              <div className="section_c">
                <div className="column">
                  <h2>Hotel Information</h2>
                  <p><strong>Hotel Name:</strong> {hotel_status.hotel_name}</p>
                  <p><strong>Address:</strong> {booking[0].addressLine1}</p>
                  <p><strong>Hotel Code:</strong> {booking[0].hotelcode}</p>
                  <p><strong>Number of Rooms:</strong> {booking[0].noofrooms}</p>
                  <p><strong>Room Type:</strong> {booking[0].room_type_name}</p>
                </div>
                <div className="column">
                  <h2>Guest Details</h2>
                  <p><strong>First Name:</strong> {user_details.firstname}</p>
                  <p><strong>Last Name:</strong> {user_details.lastname}</p>
                  <p><strong>Email:</strong> {user_details.email}</p>
                  <p><strong>Phone No:</strong> {user_details.phoneno}</p>
                  <p><strong>Age:</strong> {user_details.age}</p>
                </div>
              </div>

              <div className="section_c price-summary">
                <h2>Price Summary</h2>
                <p><strong>Room Price:</strong> ₹{booking[0].roomprice}</p>
                <p><strong>Other Charges:</strong> ₹{booking[0].othercharges}</p>
                <p><strong>Total Amount:</strong> ₹{booking[0].publishedprice}</p>
              </div>

              <div className="section_cp">
              <div><h2>Hotel Policy</h2>
                <div className="section_hp" dangerouslySetInnerHTML={{ __html: cleanUpDescription(booking[0].hotelpolicy) }} />
              </div>
            </div>

            <div className="section_cp">
                <div>
                  <h2>Cancellation Policy</h2>
                  <ul className="section_hp">
                    {formatCancellationPolicy(cancellationPolicies)}
                  </ul>
                </div>
              </div>
      </div>
            <div className="button-container-h">
              <button className='download-button-h' onClick={handleDownloadPDF}>Download PDF</button>
              <button className='cancel-button-h' onClick={bookingCancel}>Cancel Booking</button>
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
