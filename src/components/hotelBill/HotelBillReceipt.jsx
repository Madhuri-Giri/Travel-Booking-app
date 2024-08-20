import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import "jspdf-autotable";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './HotelBillReceipt.css';
import CustomNavbar from '../../pages/navbar/CustomNavbar';
import Footer from '../../pages/footer/Footer';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook

const BookingBill = () => {
  const [bookingDetails, setBookingDetails] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize navigate function

  useEffect(() => {
    // Retrieve ticket data from local storage
    const storedTicketData = localStorage.getItem('hotelTicket');
    if (storedTicketData) {
      try {
        // Parse and set the booking details
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

  // Handle PDF download
  const handleDownloadPDF = () => {
    if (bookingDetails) {
      const doc = new jsPDF();

      // Example data extraction
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

      // Add more details if necessary
      
      doc.save('booking-bill.pdf');
    } else {
      toast.error('No booking details available to generate PDF');
    }
  };



  
  // Handle booking cancellation
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
  
      // Check if response contains the data
      if (res.data) {
        // Save the response data to local storage and update state
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
      <div>
        <div>
          <h3>Hotel Information</h3>
          {bookingDetails.hotelBook && bookingDetails.hotelBook.length > 0 && (
            <div>
              {bookingDetails.hotelBook.map((item, index) => (
                <div key={index}>
                  <h4>Hotel Name: {item.hotelname}</h4>
                  <p><strong>Booking ID:</strong> {item.hotelcode}</p>
                  <p><strong>Transaction Number:</strong> {item.transaction_num}</p>
                  <p><strong>Number of Rooms:</strong> {item.noofrooms}</p>
                  <p><strong>Check-in Date:</strong> {item.check_in_date || 'N/A'}</p>
                  <p><strong>Room Price:</strong> {item.roomprice}</p>
                  <p><strong>Tax:</strong> {item.tax}</p>
                  <p><strong>Discount:</strong> {item.discount}</p>
                  <p><strong>Published Price:</strong> {item.publishedprice}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h3>Passenger Details</h3>
          {bookingDetails.hotelPassengerdetail && bookingDetails.hotelPassengerdetail.length > 0 && (
            <div>
              {bookingDetails.hotelPassengerdetail.map((item, index) => (
                <div key={index}>
                  <p><strong>Title:</strong> {item.title}</p>
                  <p><strong>First Name:</strong> {item.firstname}</p>
                  <p><strong>Last Name:</strong> {item.lastname}</p>
                  <p><strong>Phone Number:</strong> {item.phoneno}</p>
                  <p><strong>Email:</strong> {item.email}</p>
                  <p><strong>Age:</strong> {item.age}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Buttons should be inside the return statement */}
        <button className="cancel-button" onClick={bookingCancel}>Cancel Booking</button>
        <button className="download-pdf-button" onClick={handleDownloadPDF}>Download PDF</button>
      </div>
      <Footer />
      <ToastContainer />
    </>
  );
};

export default BookingBill;
