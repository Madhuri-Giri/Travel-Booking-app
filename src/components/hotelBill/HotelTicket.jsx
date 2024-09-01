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
  const [storedGuestDetails, setStoredGuestDetails] = useState([]);
  const [storedHotelRoom, setStoredHotelRoom] = useState([]);
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
        setBookingDetails(res.data);

        const storedGuestDetailsData = localStorage.getItem('guestDetails');
        if (storedGuestDetailsData) {
          setStoredGuestDetails(JSON.parse(storedGuestDetailsData));
        }

        const storedSelectedRoomData = localStorage.getItem('selectedRoomsData');
        if (storedSelectedRoomData) {
          setStoredHotelRoom(JSON.parse(storedSelectedRoomData));
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
                      </div>
                    ))}

                    {storedHotelRoom.length > 0 && (
                      <div>
                        {storedHotelRoom.map((item, index) => (
                          <div key={index}>
                            <p><span>Room Price:</span> ₹{item.roomprice}</p>
                            <p><span>GST:</span> {item.tax}</p>
                            <p><span>Discount:</span> {item.discount}</p>
                            <p><span>Total Price:</span> ₹{item.publishedprice}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <p>No hotel information available.</p>
                )}
              </div>

              <div className="details-section-guest">
                <h3>Guest Details</h3>
                {storedGuestDetails.length > 0 ? (
                  <div className="detail-guest">
                    {storedGuestDetails.map((item, index) => (
                      <div key={index}>
                        <p><span>First Name:</span> {item.fname}</p>
                        <p><span>Last Name:</span> {item.lname}</p>
                        <p><span>Phone Number:</span> {item.mobile}</p>
                        <p><span>Email:</span> {item.email}</p>
                        <p><span>Age:</span> {item.age}</p>
                        <p><span>Passport Number:</span> {item.passportNo}</p>
                        <p><span>PaxType:</span> {item.paxType}</p>
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
