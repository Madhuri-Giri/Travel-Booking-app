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
        const storedTicketData = localStorage.getItem('hotelTicket');
        console.log('Stored Ticket Data:', storedTicketData); // Check data in local storage
        if (storedTicketData) {
            try {
                const parsedData = JSON.parse(storedTicketData);
                console.log('Parsed Data:', parsedData); // Check parsed data structure
                setBookingDetails(parsedData);
            } catch (e) {
                console.error('Failed to parse ticket data:', e);
                setError('Failed to parse ticket data.');
            }
        } else {
            setError('No ticket data found');
        }
    }, []);

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!bookingDetails) {
        return <div>Loading...</div>;
    }

    // Extract the relevant data
    const passenger = bookingDetails.passenger && bookingDetails.passenger[0] ? bookingDetails.passenger[0] : null;
    const hotelBook = bookingDetails.hotelBook && bookingDetails.hotelBook[0] ? bookingDetails.hotelBook[0] : null;
    const bookingStatus = bookingDetails.booking_status && bookingDetails.booking_status[0] ? bookingDetails.booking_status[0] : null;

    console.log('Passenger:', passenger); 
    console.log('Hotel Book:', hotelBook); 
    console.log('Booking Status:', bookingStatus); 

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
                            <h1>Hotel Booking Receipt</h1>
                        </div>
                        <div className="receipt-body">
                            <div className="section_r">
                                <p><strong>Check-in Date:</strong> {hotelBook?.check_in_date || 'N/A'}</p>
                                <p><strong>Invoice No:</strong> {bookingStatus?.InvoiceNumber || 'N/A'}</p>
                                <p><strong>Ref No:</strong> {bookingStatus?.BookingRefNo || 'N/A'}</p>
                            </div>

                           
                            <div className="section_c">
                                <div className="column">
                                    <h2>Hotel Information</h2>
                                    <p><strong>Hotel Name:</strong> {hotelBook?.hotelname || 'N/A'}</p>
                                    <p><strong>Hotel Code:</strong> {hotelBook?.hotelcode || 'N/A'}</p>
                                    <p><strong>Number of Rooms:</strong> {hotelBook?.noofrooms || 'N/A'}</p>
                                    <p><strong>Room Type:</strong> {hotelBook?.room_type_name || 'N/A'}</p>
                                </div>
                                
                                <div className="column">
                                    <h2>Guest Details</h2>
                                    {passenger ? (
                                        <div>
                                            <p><strong>First Name:</strong> {passenger.firstname || 'N/A'}</p>
                                            <p><strong>Last Name:</strong> {passenger.lastname || 'N/A'}</p>
                                            <p><strong>Email:</strong> {passenger.email || 'N/A'}</p>
                                            <p><strong>Mobile:</strong> {passenger.mobile || 'N/A'}</p>
                                            <p><strong>Age:</strong> {passenger.age || 'N/A'}</p>
                                        </div>
                                    ) : (
                                        <p>No guest details available</p>
                                    )}
                                </div>
                            </div>
                            <div className="section_c price-summary">
                                <h2>Price Summary</h2>
                                <p><strong>Room Price:</strong> ₹{hotelBook?.roomprice || 'N/A'}</p>
                                <p><strong>GST:</strong> {hotelBook?.igst || 'N/A'}</p>
                                <p><strong>Discount:</strong> {hotelBook?.discount || 'N/A'}</p>
                                <p><strong>Total Price:</strong> ₹{hotelBook?.publishedprice || 'N/A'}</p>
                            </div>
                        </div>
                        <div className="section_cp">
                            <div><h2>Hotel Policy:</h2>
                            <div  className="section_hp" dangerouslySetInnerHTML={{ __html: cleanUpDescription(hotelBook?.hotelpolicy || '') }} /></div> 
                            </div>
                        <div className='button-container-h'>
                            <button className='download-button-h' onClick={handleDownloadPDF}>Download PDF</button>
                            <button className='cancel-button-h' onClick={bookingCancel}>Cancel</button>
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
