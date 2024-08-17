import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomNavbar from '../../pages/navbar/CustomNavbar';
import Footer from '../../pages/footer/Footer';
import './BookingHistory.css';
import Loading from '../../pages/loading/Loading'; // Import the Loading component

function BookingHistory() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('hotel'); // Initialize with 'hotel' tab
    const [hotelBookings, setHotelBookings] = useState([]);
    const [loading, setLoading] = useState(true); // Set loading to true initially

    // ----------------------hotel history API-------------------------------
    useEffect(() => {
        const fetchBookingHistory = async () => {
            try {

                 // Retrieve transactionNum from localStorage
     const transactionNum = localStorage.getItem('transactionNum');

     if (!transactionNum) {
        throw new Error("Transaction number not found in local storage.");
    }
                const response = await fetch("https://sajyatra.sajpe.in/admin/api/booking-history", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ transaction_num: transactionNum }),
                });

                const data = await response.json();
                console.log('Hotel History API Response:', data);

                // Store the API response in local storage
                const dataToStore = {
             hotelHistory: data.hotel_history,
                        };
                localStorage.setItem('hotelHistoryData', JSON.stringify(dataToStore));

                if (data && Array.isArray(data.hotel_history)) {
                    setHotelBookings(data.hotel_history);
                }
            } catch (error) {
                console.error("Error fetching API of hotel bookings history:", error);
                setError("Failed to fetch booking history");
            } finally {
                setLoading(false);
            }
        };
        fetchBookingHistory();
    }, []);
    // ----------------------hotel history API-------------------------------

    // const navigateHotelDetails = () => {
    //     setLoading(true);
    //     setTimeout(() => {
    //         navigate('/hotel-bill');
    //     }, 10000); 
    // };
    
    
    const navigateHotelDetails = async (event) => {
        event.preventDefault();
    
        // Retrieve hotelHistoryData from local storage
        const storedHotelHistoryData = localStorage.getItem('hotelHistoryData');
        if (!storedHotelHistoryData) {
            console.error('No hotel history data found in local storage');
            return;
        }
    
        try {
            // Define requestData with the static hotel_booking_id
            const requestData = {
                
                
                    "BookingId": "1554760",
                     "RequestType": "4",
                     "BookingMode": "5",
                     "SrdvType": "SingleTB",
                     "SrdvIndex":"SrdvTB",
                     "Remarks" : "Test",
                     "transaction_num":"SAJ4790",
                     "date": "2019-09-17T00:00:00",
                     "hotel_booking_id":"192",
                     "trace_id":"1"
             
            };
    
            // Fetch hotel ticket data
            const response = await fetch('https://sajyatra.sajpe.in/admin/api/hotel-ticket', {
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
            console.log('hotel-ticket API Response:', res);
    
            const ticketData = {
                hotelBook: res.hotelBook,
                hotelPassengerdetail: res.hotelPassengerdetail
            };
    
            if (!ticketData.hotelBook.length || !ticketData.hotelPassengerdetail.length) {
                throw new Error('No ticket data found in the response');
            }
    
            // Save ticket data to local storage
            const ticketDataJSON = JSON.stringify(ticketData);
            localStorage.setItem('hotelTicket', ticketDataJSON);
    
            // Navigate to the hotel-bill page
            navigate('/hotel-bill');
    
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // -----------bus---hotel-----flight----tabs content---------------------------------
    const renderTabContent = () => {
        switch (activeTab) {
            case 'bus':
                return <div>Bus Ticket History Content</div>;
            case 'flight':
                return (
                    <div>
                         <div className="container">
                            <h6 className='hotelTabContenthedding'>Flight Ticket Status</h6>
                            
                        </div>
                    </div>
                );
            case 'hotel':
                return (
                    <div className='hotelTabContent'>
                        <div className="container">
                            <h6 className='hotelTabContenthedding'>Hotel Ticket Status</h6>
                            {hotelBookings.length > 0 ? (
                                hotelBookings.map((booking, index) => (
                                    <div className="row hotelTabContentROW" key={index}>
                                        <div className="col-md-6">
                                            <p><strong>Hotel Name : </strong> {booking.hotel_name || "N/A"}</p>
                                            <p><strong>Hotel Id : </strong> {booking.hotel_booking_id}</p>
                                            <p><strong>Booking Reference No : </strong> {booking.BookingRefNo}</p>
                                        </div>
                                        <div className="col-md-6">
                                            <p><strong>Amount : </strong> ₹{booking.amount}</p>
                                            <p className='hotelcancelstatus'><strong>Cancel Status : </strong> <span>{booking.cancel_status}</span></p>
                                            <p className='hotelBookingstatus'><strong>Booking Status : </strong> <span>{booking.booking_status}</span></p>
                                        </div>
                                        <div className='viewbttn'>
                                            <button onClick={navigateHotelDetails}>View Details</button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>No booking history available.</p>
                            )}
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };
    // -----------bus---hotel-----flight----tabs content---------------------------------

    if (loading) {
        return <Loading />;
    }

    return (
        <>
            <CustomNavbar />
            <section className='bookingHistorymaisec'>
                <div className="container">
                    <div className="row bookingHistoryROW">
                        <div className="col-md-10 bookingHistoryCOL1">
                            <h4>Booking History</h4>
                            <div className="booking-tabs">
                                <button
                                    className={`tab-button ${activeTab === 'bus' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('bus')}
                                >
                                    BUS TICKET
                                </button>
                                <button
                                    className={`tab-button ${activeTab === 'flight' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('flight')}
                                >
                                    FLIGHT TICKET
                                </button>
                                <button
                                    className={`tab-button ${activeTab === 'hotel' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('hotel')}
                                >
                                    HOTEL TICKET
                                </button>
                            </div>
                            <div className="tab-content">
                                {renderTabContent()} {/* Render content based on the active tab */}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
}

export default BookingHistory;
