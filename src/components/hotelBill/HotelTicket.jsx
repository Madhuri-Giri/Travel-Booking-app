import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './HotelBillReceipt.css';
import CustomNavbar from '../../pages/navbar/CustomNavbar';
import Footer from '../../pages/footer/Footer';
import { useNavigate } from 'react-router-dom';
import { CiSaveDown1 } from "react-icons/ci";
import Lottie from 'lottie-react';
import LootiAnim from '../../assets/images/Anim.json'
import Barcode from 'react-barcode';
import '../hotelBill/HotelTicket.css'


// Function to generate a passcode
const generatePasscode = () => {
  return Math.random().toString(36).substr(2, 8).toUpperCase();
};

const BookingBill = () => {
  const [bookingDetails, setBookingDetails] = useState(null);
  const [error, setError] = useState(null);
  const [passcode] = useState(generatePasscode()); // Generate passcode once
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
        setBookingDetails({
          hotelBook: res.hotelBook,
          hotelPassengerdetail: res.hotelPassengerdetail
        });
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
    const { hotelBook } = bookingDetails;

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
      doc.save('booking-bill.pdf');
    }
  };

  const handleCancelTicket = () => {
    // Implement ticket cancellation logic
    toast.info('Ticket canceled.');
    navigate('/'); // Navigate to another page or update state accordingly
  };

  return (
    <>
      <CustomNavbar />

      <div className="booking-bill-container">
        

            <div className="col-lg-9">
              <div className='busticktbox'>
                <div className="header">
                  <h2>Hotel Booking Details</h2>
                </div>

                <div className="details-section">
                  <h3>Hotel Information</h3>
                  {bookingDetails?.hotelBook?.length > 0 ? (
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
                  ) : (
                    <p>No hotel information available.</p>
                  )}
                </div>

                <div className="details-section">
                  <h3>Guest Details</h3>
                  {bookingDetails?.hotelPassengerdetail?.length > 0 ? (
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
                  ) : (
                    <p>No guest details available.</p>
                  )}
                  <p><strong>Passcode: </strong></p>
                  <Barcode className="buspasscode" value={passcode} format="CODE128" />
                </div>

                <div className="btm">
                  <button className='hoteldonload' onClick={handleDownloadPDF}>
                    Download
                    <CiSaveDown1 className='icon-down' style={{ marginLeft: '5px', fontSize: '20px', fontWeight: '800' }} />
                  </button>
                  <button className='hotelcncl' style={{ backgroundColor: 'red' }} onClick={handleCancelTicket}>Cancel Ticket</button>
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
