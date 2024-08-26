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

      // Set the title of the PDF
      doc.setFontSize(18);
      doc.text('Hotel Booking Bill', 14, 22);

      // Add hotel details to the PDF
      if (bookingDetails.hotelBook && bookingDetails.hotelBook.length > 0) {
        const hotelInfo = bookingDetails.hotelBook[0];

        const hotelData = [
          { label: 'Hotel Name', value: hotelInfo.hotelname },
          { label: 'Hotel Code', value: hotelInfo.hotelcode },
          { label: 'Rooms', value: hotelInfo.noofrooms },
          { label: 'Room Type', value: hotelInfo.room_type_name },
          { label: 'Check-in Date', value: new Date(hotelInfo.check_in_date).toLocaleDateString() },
          { label: 'Check-out Date', value: new Date(hotelInfo.check_out_date).toLocaleDateString() }
        ];

        // Create the hotel details table
        doc.autoTable({
          startY: 30,
          head: [['Hotel Detail', 'Information']],
          body: hotelData.map(item => [item.label, item.value])
        });
      }

      // Add booking status to the PDF
      if (bookingDetails.bookingStatus && bookingDetails.bookingStatus.length > 0) {
        const statusInfo = bookingDetails.bookingStatus[0];

        const bookingData = [
          { label: 'Status', value: statusInfo.booking_status },
          { label: 'Invoice No.', value: statusInfo.InvoiceNumber },
          { label: 'Confirmation No.', value: statusInfo.ConfirmationNo },
          { label: 'Booking Ref No.', value: statusInfo.BookingRefNo },
        ];

        // Create the booking status table
        doc.autoTable({
          startY: doc.previousAutoTable.finalY + 10, // Start after the previous table
          head: [['Booking Detail', 'Information']],
          body: bookingData.map(item => [item.label, item.value])
        });
      }

      // Save the PDF
      doc.save('hotel-booking-bill.pdf');
    } else {
      toast.error('No booking details available to generate PDF');
    }
  };
  const transactionNum = localStorage.getItem('transactionNum');
  const bookingCancel = async (event) => {
    event.preventDefault();

    const hotelBookingIdsString = localStorage.getItem('hotel_booking_ids');
    const hotelBookingIds = JSON.parse(hotelBookingIdsString);
    const hotelBookingId = hotelBookingIds ? hotelBookingIds[0] : null;

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
          <div className="header">
            <h4 className='bustikthed'>Hotel Booking Details</h4>
          </div>
          <div className="container">
            <div className="row">
              <div className="col-md-6">
                <h6 className='hoteldetailhed'>Hotel Details</h6>
                {bookingDetails.hotelBook && bookingDetails.hotelBook.length > 0 && (
                  <div className="detail-card">
                    {bookingDetails.hotelBook.map((item, index) => (
                      <div key={index}>
                        <p><strong>Hotel Name: </strong><span>{item.hotelname}</span></p>
                        <p><strong>Hotel Code: </strong><span>{item.hotelcode}</span></p>
                        <p><strong>Rooms: </strong><span>{item.noofrooms}</span></p>
                        <p><strong>Room Type: </strong><span>{item.room_type_name}</span></p>
                        <p><strong>Check-in Date: </strong><span>{new Date(item.check_in_date).toLocaleDateString()}</span></p>
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
                        <p className='hotlbooingstatus'><strong>Status: </strong><span>{item.booking_status}</span></p>
                        <p><strong>Invoice No.: </strong><span>{item.InvoiceNumber}</span></p>
                        <p><strong>Confirmation No.: </strong><span>{item.ConfirmationNo}</span></p>
                        <p><strong>Booking Ref No.: </strong><span>{item.BookingRefNo}</span></p>
                        <p><strong>Cancel Status: </strong><span>{item.cancel_status}</span></p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className=" busbtm">
                <button className='busdonload' onClick={handleDownloadPDF}>
                  Download Pdf
                  <CiSaveDown1 className='icon-down' style={{ marginLeft: '5px', fontSize: '20px', fontWeight: '800' }} />
                </button>
                <button className='buscncl' style={{ backgroundColor: 'red' }} onClick={bookingCancel}>Cancel Booking</button>
              </div>
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
