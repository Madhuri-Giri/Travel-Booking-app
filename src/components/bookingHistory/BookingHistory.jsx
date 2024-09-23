/* eslint-disable no-extra-semi */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomNavbar from '../../pages/navbar/CustomNavbar';
import Footer from '../../pages/footer/Footer';
import './BookingHistory.css';
import Loading from '../../pages/loading/Loading'; // Import the Loading component
import { useDispatch, useSelector } from 'react-redux';
function BookingHistory() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('hotel'); 
    const [hotelBookings, setHotelBookings] = useState([]);
    const [busBookings, setBusBookings] = useState([]);
    const [flightBookings, setFlightBookings] = useState([]);
    const [loading, setLoading] = useState(true); // Set loading to true initially

    // get user details api data from Redux----
    const { transactionDetails } = useSelector((state) => state.loginReducer);
    console.log('transactionDetails', transactionDetails);
    const transaction_num = transactionDetails?.transaction_num
    console.log('transaction_num', transaction_num);

    console.log("flightBookings", flightBookings);
    console.log("busBookings", busBookings);
    console.log("hotelBookings", hotelBookings);

    const dispatch = useDispatch();
    const { bookings, status } = useSelector((state) => state.bookingHistory);

    // ----------------------hotel history API-------------------------------
    useEffect(() => {
        const fetchHotelBookingHistory = async () => {
            try {
                // const transactionNum = localStorage.getItem('transactionNum');
                if (!transaction_num) {
                    throw new Error("Transaction number not found in local storage.");
                }

                const response = await fetch("https://sajyatra.sajpe.in/admin/api/booking-history", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ transaction_num: transaction_num }),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                console.log('Hotel History API Response:', data);

                if (data && data.status === "success" && Array.isArray(data.data)) {
                    // Store the API response in local storage
                    localStorage.setItem('hotelHistoryData', JSON.stringify(data));
                    // Update state with fetched data
                    setHotelBookings(data.data);

                    // Extract and store hotel_booking_id from the booking history
                    const hotelBookingId = data.data[0]?.hotel_booking_id; // Assuming you want the first one
                    if (hotelBookingId) {
                        localStorage.setItem('hotel_booking_id', hotelBookingId);
                    } else {
                        console.error("hotel_booking_id not found in the response.");
                    }
                } else {
                    console.error("Unexpected data format or empty hotel history.");
                    setError("No hotel history data found.");
                }
            } catch (error) {
                console.error("Error fetching API of hotel bookings history:", error);
                setError("Failed to fetch booking history");
            } finally {
                setLoading(false);
            }
        };

        fetchHotelBookingHistory();
    }, [transaction_num]);
    // ----------------------hotel history API-------------------------------

    // ----------------------hotel ticket API-------------------------------
   
    const handleBookingClick = async () => {
        const hotelBookingId = localStorage.getItem('hotel_booking_id');
        console.log('handleBookingClick called with:', hotelBookingId);
    
        try {
            if (typeof  hotelBookingId!== 'string') {
                console.error('Invalid hotel booking ID:',  hotelBookingId);
                throw new Error('Invalid hotel booking ID.');
            }
    
            const requestData = { hotel_booking_id: hotelBookingId };
    
            const response = await fetch('https://sajyatra.sajpe.in/admin/api/hotel-ticket', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const res = await response.json();
            console.log('Hotel Ticket API Response:', res);

            // Extract and log the passenger data
            const passengers = res.passenger || [];
            console.log('Passenger Data:', passengers);

            const ticketData = {
                hotelBook: res.hotelBook || [],
                bookingStatus: res.booking_status || [],
                passenger: passengers,
                policy: res.policy || []
            };

            if (
                (!Array.isArray(ticketData.hotelBook) || !ticketData.hotelBook.length) &&
                (!Array.isArray(ticketData.bookingStatus) || !ticketData.bookingStatus.length) &&
                (!Array.isArray(ticketData.passenger) || !ticketData.passenger.length) &&
                (!Array.isArray(ticketData.policy) || !ticketData.policy.length)
            ) {
                console.error('No relevant ticket data found in the response:', ticketData);
                throw new Error('No relevant ticket data found in the response.');
            }

            localStorage.setItem('hotelTicket', JSON.stringify(ticketData));
            navigate('/hotel-bill');

        } catch (error) {
            console.error('Error fetching hotel ticket:', error);
        }
    };
    // ----------------------hotel ticket API End-------------------------------

    
    // ----------------------Bus history API-------------------------------
    useEffect(() => {
        const fetchBusBookingHistory = async () => {
            // const transactionNoBus = localStorage.getItem('transactionNum')
            try {
                const response = await fetch("https://sajyatra.sajpe.in/admin/api/bus-booking-history", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        transaction_num: transaction_num
                    }),
                });

                const data = await response.json();
                console.log('Bus booking history:', data);
                setBusBookings(data);

            } catch (error) {
                console.error("Error fetching API of Bus bookings history:", error);
                setError("Failed to fetch booking history");
            } finally {
                setLoading(false);
            }
        };
        fetchBusBookingHistory();
    }, [transaction_num]);

    // ----------------------Bus history API-------------------------------


    // ----------------------Flight history API-------------------------------
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchFlightBookingHistory = async () => {
            try {
                if (!transaction_num) {
                    setError('No transaction number found');
                    setLoading(false);
                    return;
                }
                const response = await fetch("https://sajyatra.sajpe.in/admin/api/flight-history", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ transaction_num: transaction_num }),
                });

                const data = await response.json();
                console.log('flight Booking API Response:', data);
                setFlightBookings(data);
            } catch (error) {
                console.error("Error fetching API of flight bookings history:", error);
                setError("Failed to fetch booking history");
            } finally {
                setLoading(false);
            }
        };
        fetchFlightBookingHistory();
    }, [transaction_num]);
    // ----------------------Flight history API-------------------------------

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

    // -----------------------navigate flight ticket page--------------------------
    const navigateFlightDetails = (transactionNum, booking_id) => {
        console.log("Flight details clicked");
        setLoading(true);
        setTimeout(() => {
            navigate('/flight-ticket', {
                state: {
                    transactionNum,
                    booking_id,
                },
            });
        }, 10000); // 10 seconds delay
    };
    // -----------bus---hotel-----flight----tabs content---------------------------------
    const renderTabContent = () => {
        switch (activeTab) {
            case 'bus':
                return (
                    <div className='busTabContent'>
                        <div className="container">
                            <h6 className='busTabContenthedding'>Bus Ticket Status</h6>
                            {busBookings && busBookings.booking_Status && Array.isArray(busBookings.booking_Status) ? (
                                busBookings.booking_Status.map((booking, index) => (
                                    <div key={index} className="row busTabContentROW">
                                        <div className="col-md-6">
                                            <p><strong>Bus Booking ID : </strong> {booking.bus_booking_id || "N/A"}</p>
                                            <p><strong>User Id : </strong> <span>{booking.transaction_num || "N/A"}</span></p>
                                        </div>
                                        <div className="col-md-6">
                                            <p><strong>Bus Trace ID : </strong> <span>{booking.id || "N/A"}</span></p>
                                            <p className="busBookingsamount"><strong>Amount : </strong> <span>₹{booking.amount || "0"}</span></p>
                                        </div>
                                        <div className="viewbttn">
                                            <button onClick={() => navigateBusDetails(booking.bus_booking_id, booking.bus_trace_id)}>
                                                View Ticket
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>No bookings found, please book a ticket.</p>
                            )}
                        </div>
                    </div>
                );
            case 'flight':
                return (
                    <div className='flightTabContent'>
                        <div className="container">
                            <h6 className='flightTabContentHeading'>Flight Ticket Status</h6>
                            {
                                flightBookings.status === "success" ? (
                                    flightBookings.flight_history.map((booking, index) => (
                                        <div key={index} className="row flightTabContentROW">
                                            <div className="col-md-6">
                                                <p><strong>Booking ID : </strong> <span>{booking.booking_id}</span></p>
                                                <p><strong>User Id : </strong> <span>{booking.transaction_num}</span></p>
                                            </div>
                                            <div className="col-md-6">
                                                <p className='bookingStats'><strong>Payment Status : </strong> <span>{booking.payment_status}</span></p>
                                                <p className='hotlamount'><strong>Amount : </strong> <span>₹{Math.round(booking.amount)}</span></p>
                                            </div>
                                            <div className='viewbttn'>
                                                <button onClick={() => navigateFlightDetails(booking.transaction_num, booking.id)}>View Ticket</button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p>No flight bookings found. Please book a flight ticket.</p>
                                )
                            }

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
                                    <div key={`hotelTabContentROW-${index}`} className="row hotelTabContentROW">
                                        <div className="col-md-6">
                                            {/* <p><strong>Hotel Name : </strong> {booking.hotel_name || "N/A"}</p> */}
                                            <p><strong>Booking Id : </strong> {booking.booking_id}</p>
                                            <p><strong>User Id : </strong> {booking.transaction_num || "N/A"}</p>
                                            {/* <p><strong>Mobile No : </strong> {booking.userdetails?.mobile || "N/A"}</p> */}
                                        </div>
                                        <div className="col-md-6">
                                            <p className='bookingStats'><strong>Status : </strong> <span>{booking.status}</span></p>
                                            <p className='hotlamount'><strong>Amount : </strong> <span>₹{Math.round(booking.amount)}</span></p>
                                        </div>
                                        <div className='viewbttn'>
                                            <button onClick={handleBookingClick}>View Ticket</button>
                                        </div>

                                    </div>
                                ))

                            ) : (
                                <p>No bookings found. Please book a ticket.</p>
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
                            <h4>Booking  <span style={{ color: "#00b7eb" }}>History</span> </h4>
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
                                {renderTabContent()}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
};

export default BookingHistory;
