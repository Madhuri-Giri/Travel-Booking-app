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
    const [busBookings, setBusBookings] = useState([]);
    const [flightBookings, setFlightBookings] = useState([]);
    const [loading, setLoading] = useState(true); // Set loading to true initially

    
    // ----------------------hotel history API-------------------------------
    useEffect(() => {
        const fetchHotelBookingHistory = async () => {
            try {
                const response = await fetch("https://sajyatra.sajpe.in/admin/api/booking-history", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ transaction_num: "SAJ9370" }),
                });

                const data = await response.json();
                console.log('Hotel Booking API Response:', data);

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
        fetchHotelBookingHistory();
    }, []);
    // ----------------------hotel history API-------------------------------

    // ----------------------Bus history API-------------------------------
    useEffect(() => {
        const fetchBusBookingHistory = async () => {
            try {
                const response = await fetch("https://sajyatra.sajpe.in/admin/api/bus-booking-history", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ transaction_num: "SAJ9370" }),
                });

                const data = await response.json();
                console.log('Bus Booking API Response:', data);

                // Check for data in both keys
                if (data && Array.isArray(data.result) && data.result.length > 0) {
                    setBusBookings(data.result);
                } else if (data && Array.isArray(data.booking_Status) && data.booking_Status.length > 0) {
                    setBusBookings(data.booking_Status);
                } else {
                    setBusBookings([]); // Set empty if no data found
                }
            } catch (error) {
                console.error("Error fetching API of Bus bookings history:", error);
                setError("Failed to fetch booking history");
            } finally {
                setLoading(false);
            }
        };
        fetchBusBookingHistory();
    }, []);
    // ----------------------Bus history API-------------------------------


    // ----------------------Flight history API-------------------------------
    useEffect(() => {
        const fetchFlightBookingHistory = async () => {
            try {
                const response = await fetch("https://sajyatra.sajpe.in/admin/api/flight-payment-history", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ transaction_num: "SAJ9370" }),
                });

                const data = await response.json();
                console.log('flight Booking API Response:', data);

                // Check for data in both keys
                if (data && Array.isArray(data.result) && data.result.length > 0) {
                    setFlightBookings(data.result);
                } else if (data && Array.isArray(data.booking_Status) && data.booking_Status.length > 0) {
                    setFlightBookings(data.booking_Status);
                } else {
                    setFlightBookings([]); // Set empty if no data found
                }
            } catch (error) {
                console.error("Error fetching API of flight bookings history:", error);
                setError("Failed to fetch booking history");
            } finally {
                setLoading(false);
            }
        };
        fetchFlightBookingHistory();
    }, []);
    // ----------------------Flight history API-------------------------------

    // -----------------------navigate hotel ticket page--------------------------
    const navigateHotelDetails = () => {
        setLoading(true);
        setTimeout(() => {
            navigate('/hotel-bill');
        }, 10000);
    };
    // -----------------------navigate hotel ticket page--------------------------

    // -----------------------navigate bus ticket page--------------------------
    const navigateBusDetails = (busBookingId, busTraceId) => {
        localStorage.setItem("bus_booking_id", busBookingId);
        localStorage.setItem("bus_trace_id", busTraceId);
        setLoading(true);
        setTimeout(() => {
            navigate('/bus-tikit-download');
        }, 10000);
    };
    // -----------------------navigate bus ticket page--------------------------

    // -----------bus---hotel-----flight----tabs content---------------------------------
    const renderTabContent = () => {
        switch (activeTab) {
            case 'bus':
                return (
                    <div className='busTabContent'>
                        <div className="container">
                            <h6 className='busTabContenthedding'>Bus Ticket Status</h6>
                            {busBookings.length > 0 ? (
                                busBookings.map((booking, index) => (
                                    <div key={index} className="row busTabContentROW">
                                        <div className="col-md-6">
                                            <p><strong>Bus Booking ID : </strong> {booking.bus_booking_id}</p>
                                            <p className=''><strong>Bus Trace ID : </strong> <span>{booking.bus_trace_id}</span></p>
                                        </div>
                                        <div className="col-md-6">
                                            <p className=''><strong>Transaction Number : </strong> <span>{booking.transaction_num}</span></p>
                                            <p className='busBookingsamount'><strong>Amount : </strong> <span>₹{booking.amount}</span></p>
                                        </div>
                                        <div className='viewbttn'>
                                            <button onClick={navigateBusDetails(booking.bus_booking_id, booking.bus_trace_id)}>View Details</button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>No bookings found.</p>
                            )}

                        </div>
                    </div>
                );
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
