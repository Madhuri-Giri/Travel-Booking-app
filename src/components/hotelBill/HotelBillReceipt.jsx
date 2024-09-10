import React, { useEffect, useState, useRef } from 'react';
import jsPDF from 'jspdf';
import "jspdf-autotable";
import html2canvas from 'html2canvas';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './HotelBillReceipt.css';
import CustomNavbar from '../../pages/navbar/CustomNavbar';
import Footer from '../../pages/footer/Footer';
import { useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import hotelAnim from "../../assets/images/hotelanimation.json";
import hotelImglogo from "../../assets/images/main logo.png";
import he from 'he';

const BookingBill = () => {
    const [bookingDetails, setBookingDetails] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const ticketElementRef = useRef(null);

    useEffect(() => {
        const hotelTicketData = async () => {
            try {
                const storedTicketData = localStorage.getItem('hotelTicket');
                if (storedTicketData) {
                    const parsedData = JSON.parse(storedTicketData);
                    setBookingDetails(parsedData);
                } else {
                    throw new Error('No ticket data found');
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

    const passenger = bookingDetails.passenger[0];

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
    
            const widthRatio = pdfWidth / imgWidth;
            const heightRatio = pdfHeight / imgHeight;
            const scale = widthRatio;
    
            const newImgWidth = imgWidth * scale;
            const newImgHeight = imgHeight * scale;
    
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
        let cleanedDescription = he.decode(description);
        cleanedDescription = cleanedDescription.replace(/<\/?(ul|li|b|i|strong|em|span)\b[^>]*>/gi, '');
        cleanedDescription = cleanedDescription.replace(/<br\s*\/?>|<p\s*\/?>|<\/p>/gi, '\n');
        cleanedDescription = cleanedDescription.replace(/\\|\|/g, '');
        cleanedDescription = cleanedDescription.replace(/\s{2,}/g, ' ');
        cleanedDescription = cleanedDescription.replace(/\n{2,}/g, '\n');
        cleanedDescription = cleanedDescription.replace(/\/\/+|\\|\|/g, '');
        cleanedDescription = cleanedDescription.trim();
        cleanedDescription = cleanedDescription.replace(/"/g, '');
        cleanedDescription = cleanedDescription.replace(/<\/li>/gi, '\n');
        cleanedDescription = cleanedDescription.replace(/<\/?ul>/gi, '\n');
        cleanedDescription = cleanedDescription.replace(/<br\s*\/?>|<\/p>|<p\s*\/?>/gi, '\n');
        cleanedDescription = cleanedDescription.replace(/<\/?(b|i|strong|em|span)\b[^>]*>/gi, '');
        cleanedDescription = cleanedDescription.replace(/\\|\|/g, '');
        cleanedDescription = cleanedDescription.replace(/\s{2,}/g, ' ');
        cleanedDescription = cleanedDescription.replace(/\n{2,}/g, '\n');
        cleanedDescription = cleanedDescription.trim();
        cleanedDescription = cleanedDescription.replace(/(?:Valid From|Check-in hour|Identification card at arrival)/gi, '\n$&');
        cleanedDescription = cleanedDescription.replace(/<li>/gi, (match, offset, string) => {
          const listItems = string.split('</li>');
          const index = listItems.indexOf(match);
          return `${index + 1}. `;
        });
        return cleanedDescription;
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
                            <h1>Hotel Booking Receipt</h1>
                        </div>
                        <div className="receipt-body">
                            <div className="section_r">
                                <p><strong>Check-in Date:</strong> {bookingDetails?.hotelBook[0].check_in_date}</p>
                                <p><strong>Invoice No:</strong> {bookingDetails?.bookingStatus[0].InvoiceNumber}</p>
                                <p><strong>Ref No:</strong> {bookingDetails?.bookingStatus[0].BookingRefNo}</p>
                            </div>

                            <div className="section_c">
    <p><strong>Hotel Policy:</strong> {cleanUpDescription(bookingDetails?.hotelBook[0].hotelpolicy)}</p>
</div>

                            <div className="section_c">
                                <div className="column">
                                    <h2>Hotel Information</h2>
                                    <p><strong>Hotel Name:</strong> {bookingDetails?.hotelBook[0].hotelname}</p>
                                    <p><strong>Hotel Code:</strong> {bookingDetails?.hotelBook[0].hotelcode}</p>
                                    <p><strong>Number of Rooms:</strong> {bookingDetails?.hotelBook[0].noofrooms}</p>
                                    <p><strong>Room Type:</strong> {bookingDetails?.hotelBook[0].room_type_name}</p>
                                </div>
                                
                                <div className="column">
                                    <h2>Guest Details</h2>
                                    {passenger ? (
                                        <div>
                                            <p><strong>First Name:</strong> {passenger.firstname}</p>
                                            <p><strong>Last Name:</strong> {passenger.lastname}</p>
                                            <p><strong>Email:</strong> {passenger.email}</p>
                                            <p><strong>Mobile:</strong> {passenger.phoneno}</p>
                                            <p><strong>Age:</strong> {passenger.age }</p>
                                        </div>
                                    ) : (
                                        <p>No guest details available</p>
                                    )}
                                </div>
                            </div>
                            <div className="section_c price-summary">
                                <h2>Price Summary</h2>
                                <p><strong>Room Price:</strong> ₹{bookingDetails?.roomprice}</p>
                <p><strong>GST:</strong> {bookingDetails?.igst}</p>
                <p><strong>Discount:</strong> {bookingDetails?.discount}</p>
                <p><strong>Total Price:</strong> ₹{bookingDetails?.publishedprice}</p>
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
