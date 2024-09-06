import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import "jspdf-autotable";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './HotelBillReceipt.css';
import CustomNavbar from '../../pages/navbar/CustomNavbar';
import Footer from '../../pages/footer/Footer';
import { useNavigate } from 'react-router-dom';
import { CiSaveDown1 } from "react-icons/ci";
import hotelImg from '../../../src/assets/images/hotel-ticket-img.png';

const BookingBill = () => {
  const [bookingDetails, setBookingDetails] = useState(null);
  const [error, setError] = useState(null);
  const [storedGuestDetails, setStoredGuestDetails] = useState([]);
  const [storedHotelRoom, setstoredHotelRoom] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const hotelTicketData = async () => {
      try {
        const storedTicketData = localStorage.getItem('hotelTicket');
        // console.log('Stored Ticket Data:', storedTicketData); 
        if (storedTicketData) {
          const parsedData = JSON.parse(storedTicketData);
          setBookingDetails(parsedData);
        } else {
          throw new Error('No ticket data found');
        }
        
        const storedGuestDetailsData = localStorage.getItem('guestDetails');
        if (storedGuestDetailsData) {
          const parsedGuestDetails = JSON.parse(storedGuestDetailsData);
          setStoredGuestDetails(parsedGuestDetails);
        }
        
        const storedSelectedRoomData = localStorage.getItem('selectedRoomsData');
        if (storedSelectedRoomData) {
          const parsedSelectedRoom = JSON.parse(storedSelectedRoomData);
          setstoredHotelRoom(parsedSelectedRoom);
        }
  
      } catch (e) {
        setError(e.message);
      }
    };
  
    hotelTicketData();
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
      ;
  
      const doc = new jsPDF();
      const { hotel_passengers, booking } = bookingDetails;
  
      if (hotel_passengers?.length > 0) {
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
  
       
      if (booking?.length > 0) {
        const bookingInfo = booking[0];
        doc.text(`Booking ID: ${bookingInfo.booking_id}`, 14, 140);
        doc.text(`Hotel Name: ${bookingInfo.hotel_name}`, 14, 150);
        doc.text(`Transaction Number: ${bookingInfo.transaction_num}`, 14, 160);
        doc.text(`Amount: ${bookingInfo.amount}`, 14, 170);
      }
  
        doc.autoTable({
          startY: doc.previousAutoTable.finalY + 10,
          head: [['Booking Detail', 'Information']],
          body: bookingData.map(item => [item.label, item.value])
        });
      }
  
      doc.save('hotel-booking-bill.pdf');
    } else {
      toast.error('No booking details available to generate PDF');
    }
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
                      </div>
                    ))}
                    {storedHotelRoom?.map((item, index) => (
                      <div key={index}>
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
                {storedGuestDetails?.length > 0 ? (
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
                        {/* <p><span>Govt. Id:</span> {item.govtId}</p> */}
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
