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
  const [guestDetails, setGuestDetails] = useState(null);
  const ticketElementRef = useRef(null);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const transaction_id = localStorage.getItem('transaction_id');
        if (!transaction_id) throw new Error('Transaction ID not found in local storage');

        const response = await fetch('https://sajyatra.sajpe.in/admin/api/payment-detail', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ transaction_id }),
        });

        if (response.status === 404) throw new Error('Hotel booking not found');
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
      }
    };

    fetchBookingDetails();

    const storedGuestDetails = localStorage.getItem('guestDetails');
    if (storedGuestDetails) {
      try {
        const parsedGuestDetails = JSON.parse(storedGuestDetails);
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

    const policySections = document.querySelectorAll('.section_cp');
    const buttonContainer = document.querySelector('.button-container-h');
    const ticketElement = ticketElementRef.current;

    // Temporarily show policy sections for PDF generation
    policySections.forEach(section => {
      section.style.display = 'block'; 
    });

    if (buttonContainer) {
      buttonContainer.style.display = 'none'; // Hide buttons
    }

    const originalWidth = ticketElement.style.width; // Store original width
    const fixedWidth = 1440; // Fixed width for the PDF rendering

    // Temporarily set the element width to fixedWidth for PDF rendering
    ticketElement.style.width = `${fixedWidth}px`;

    const a4HeightInPx = 297 / 25.4 * 72; // A4 height (297mm) in pixels, considering 72 DPI

    html2canvas(ticketElement, {
      width: fixedWidth, // Ensure canvas is rendered at fixedWidth
      scale: 4, // Increase scale for better quality
    }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');

      const imgWidth = fixedWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const scale = pdfWidth / imgWidth; // Scale image to fit A4 width

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
      // Restore original styles
      ticketElement.style.width = originalWidth;

      if (buttonContainer) {
        buttonContainer.style.display = ''; // Show buttons again
      }

      // Hide policy sections again
      policySections.forEach(section => {
        section.style.display = 'none';
      });
    });
  };

  const bookingCancel = async (event) => {
    event.preventDefault();

    const hotelBookingId = localStorage.getItem('hotel_booking_id');
    const transactionNum = localStorage.getItem('transactionNum');

    if (!hotelBookingId || !transactionNum) {
      const message = !hotelBookingId ? 'No hotel booking ID available' : 'No transaction number available';
      setError(message);
      toast.error(message);
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
        window.location.href = '/hotel-search'; // Use window.location.href for redirection
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

  const formatCancellationPolicy = (policies) => {
    if (!policies || policies.length === 0) return [];

    return policies.map((policy, idx) => {
      const cleanPolicy = he.decode(policy.cancellation_policy)
        .replace(/#\^#|#!#|\s+/g, ' ')
        .replace(/\|/g, '<br/>')
        .replace(/(\d{2}-\w{3}-\d{4})/, '$1') // Proper date formatting
        .trim();

      return (
        <li key={idx} className="policy-item">
          <div dangerouslySetInnerHTML={{ __html: cleanPolicy }} />
        </li>
      );
    });
  };

  if (!bookingDetails) {
    return (
      <div>
        <CustomNavbar />
        <div className="main-container">
          <div className="content-container">
            <p>Loading booking details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Access cancellation policies from bookingDetails
  const cancellationPolicies = bookingDetails.policy || [];

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
              <p><strong>Check-in Date:</strong> {bookingDetails?.booking?.[0]?.check_in_date ? new Date(bookingDetails.booking[0].check_in_date).toLocaleDateString('en-GB') : 'N/A'}</p>

                <p><strong>Invoice No:</strong> {bookingDetails?.hotel_status?.InvoiceNumber || 'N/A'}</p>
                <p><strong>Ref No:</strong> {bookingDetails?.hotel_status?.BookingRefNo || 'N/A'}</p>
              </div>

              <div className="section_c">
                <div className="column">
                  <h2>Hotel Information</h2>
                  <p><strong>Hotel Name:</strong> {bookingDetails?.hotel_status?.hotel_name || 'N/A'}</p>
                  <p><strong>Address:</strong> {bookingDetails?.booking?.[0]?.addressLine1 || 'N/A'}</p>
                  <p><strong>Hotel Code:</strong> {bookingDetails?.booking?.[0]?.hotelcode || 'N/A'}</p>
                  <p><strong>Number of Rooms:</strong> {bookingDetails?.booking?.[0]?.noofrooms || 'N/A'}</p>
                  <p><strong>Room Type:</strong> {bookingDetails?.booking?.[0]?.room_type_name || 'N/A'}</p>
                </div>
                <div className="column">
                  <h2>Guest Details</h2>
                  <p><strong>First Name:</strong> {bookingDetails?.user_details?.firstname || 'N/A'}</p>
                  <p><strong>Last Name:</strong> {bookingDetails?.user_details?.lastname || 'N/A'}</p>
                  <p><strong>Email:</strong> {bookingDetails?.user_details?.email || 'N/A'}</p>
                  <p><strong>Mobile:</strong> {bookingDetails?.user_details?.phoneno || 'N/A'}</p>
                  <p><strong>Age:</strong> {bookingDetails?.user_details?.age || 'N/A'}</p>
                </div>
              </div>
              <div className="section_c price-summary">
                <h2>Price Summary</h2>
                <p><strong>Room Price:</strong> ₹{bookingDetails?.booking?.[0]?.roomprice || 'N/A'}</p>
                <p><strong>GST:</strong> {bookingDetails?.booking?.[0]?.igst || 'N/A'}</p>
                <p><strong>Discount:</strong> {bookingDetails?.booking?.[0]?.discount || 'N/A'}</p>
                <p><strong>Total Price:</strong> ₹{bookingDetails?.booking?.[0]?.publishedprice || 'N/A'}</p>
              </div>

              <div className="section_cp hidden-policy" >
                <div>
                  <h2>Hotel Policy:</h2>
                  <div className="section_hp" dangerouslySetInnerHTML={{ __html: cleanUpDescription(bookingDetails?.booking?.[0]?.hotelpolicy) }} />
                </div>
              </div>

              <div className="section_cp hidden-policy">
                <div>
                  <h2>Cancellation Policy</h2>
                  <ul className="section_hp">
                    {formatCancellationPolicy(cancellationPolicies)}
                  </ul>
                </div>
              </div>

              <div className='button-container-h'>
                <button className='download-button-h' onClick={handleDownloadPDF}>Download PDF</button>
                <button className='cancel-button-h' onClick={bookingCancel}>Cancel</button>
              </div>
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
