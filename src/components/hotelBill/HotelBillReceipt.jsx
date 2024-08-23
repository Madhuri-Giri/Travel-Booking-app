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

const BookingBill = () => {
  const [bookingDetails, setBookingDetails] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedTicketData = localStorage.getItem('hotelTicket');

    if (storedTicketData) {
      try {
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

  const handleDownloadPDF = () => {
    if (bookingDetails) {
      const doc = new jsPDF();

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

      doc.save('booking-bill.pdf');
    } else {
      toast.error('No booking details available to generate PDF');
    }
  };

  const transactionNum = localStorage.getItem('transactionNum');

  const bookingCancel = async (event) => {
    event.preventDefault();

    // Retrieve the stored booking IDs from localStorage
    const hotelBookingIdsString = localStorage.getItem('hotel_booking_ids');
    const hotelBookingIds = JSON.parse(hotelBookingIdsString);


    const hotelBookingId = hotelBookingIds ? hotelBookingIds[0] : null;
    console.log('hotelBookingId',hotelBookingId)

    if (!hotelBookingId) {
      console.error('No hotel booking ID available');
      setError('No hotel booking ID available');
      toast.error('No hotel booking ID available');
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
    navigate('/hotel-search');
  };



  return (
    <>
      <CustomNavbar />
      <section className='hotelBillsec'>
        <div className="booking-bill-container">
          <div className="header bustikthed">
            <h4>Hotel Booking Details</h4>
          </div>
          <div className="container">
            <div className="row">
              <div className="col-md-6">
                <h6 className='hoteldetailhed'>Hotel Details</h6>
                {bookingDetails.hotelBook && bookingDetails.hotelBook.length > 0 && (
                  <div className="detail-card">
                    {bookingDetails.hotelBook.map((item, index) => (
                      <div key={index}>
                        <p> <strong>Hotel Name : </strong><span>{item.hotelname}</span> </p>
                        <p> <strong>Hotel Code : </strong><span>{item.hotelcode}</span> </p>
                        <p> <strong>Rooms :</strong><span>{item.noofrooms}</span> </p>
                        <p> <strong>Room Type :</strong><span>{item.room_type_name}</span> </p>
                        <p> <strong>Check-in Date :</strong><span>{new Date(item.check_in_date).toLocaleDateString()}</span>
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="col-md-6">
                <h6 className='hotelbookingdetailhed'>Booking Status</h6>
                {bookingDetails.bookingStatus && bookingDetails.bookingStatus.length > 0 && (
                  <div className="detail-card">
                    {bookingDetails.bookingStatus.map((item, index) => (
                      <div key={index}>
                        <p className='hotlbooingstatus'> <strong>Status : </strong><span>{item.booking_status}</span> </p>
                        <p> <strong>Invoice No. : </strong><span>{item.InvoiceNumber}</span> </p>
                        <p> <strong>Confirmation No. : </strong><span>{item.ConfirmationNo}</span> </p>
                        <p> <strong>Booking Ref No. : </strong><span>{item.BookingRefNo}</span> </p>
                        <p> <strong>Cancel Status : </strong><span>{item.cancel_status}</span> </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="btm">
              <button className='busdonload' onClick={handleDownloadPDF}>
                Download Pdf
                <CiSaveDown1 className='icon-down' style={{ marginLeft: '5px', fontSize: '20px', fontWeight: '800' }} />
              </button>
              <button className='buscncl' style={{ backgroundColor: 'red' }} onClick={bookingCancel}>Cancel Booking</button>
            </div>
          </div>
        </div>
      </section>
      <Footer />
      <ToastContainer />
    </>
  );
};

export default BookingBill;
