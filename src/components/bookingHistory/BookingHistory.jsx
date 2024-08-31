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

    console.log("flightBookings", flightBookings);
    console.log("busBookings", busBookings);
    console.log("hotelBookings", hotelBookings);


    const hoteltransaction_num = localStorage.getItem('transactionNumHotel')

    // ----------------------hotel history API-------------------------------
    useEffect(() => {
        const fetchHotelBookingHistory = async () => {
            try {
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

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                console.log('Hotel History API Response:', data);

                if (data) {
                    // Store the API response in local storage
                    localStorage.setItem('hotelHistoryData', JSON.stringify(data));

                    // Update state with fetched data
                    setHotelBookings(data);

                    // Extract and store hotel_booking_id
                    const hotelBookingId = data.bookinghistory?.hotel_booking_id;
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
    }, []);
    // ----------------------hotel history API-------------------------------

    // ----------------------hotel ticket API-------------------------------
    const handleBookingClick = async () => {
        // Get hotelBookingId from local storage
        const hotelBookingId = localStorage.getItem('hotel_booking_id');
        console.log('handleBookingClick called with:', hotelBookingId);

        try {
            // Check if hotelBookingId is valid
            if (typeof hotelBookingId !== 'string' && typeof hotelBookingId !== 'number') {
                console.error('Invalid hotel booking ID:', hotelBookingId);
                throw new Error('Invalid hotel booking ID.');
            }

            // Define request data with the hotel_booking_id
            const requestData = {
                hotel_booking_id: hotelBookingId
            };

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
            console.log('Hotel Ticket API Response:', res);

            // Define ticketData with default empty arrays
            const ticketData = {
                hotelBook: res.hotelBook || [],
                bookingStatus: res.booking_status || []
            };

            // Check if the required data is present
            if (!ticketData.hotelBook.length && !ticketData.bookingStatus.length) {
                console.error('No relevant ticket data found in the response:', ticketData);
                throw new Error('No relevant ticket data found in the response.');
            }

            // Save ticket data to local storage
            localStorage.setItem('hotelTicket', JSON.stringify(ticketData));

            // Navigate to the hotel-bill page
            navigate('/hotel-bill');

        } catch (error) {
            console.error('Error fetching hotel ticket:', error);
        }
    };
    // ----------------------hotel ticket API End-------------------------------


    // -----------------------navigate hotel ticket page--------------------------
    // const navigateHotelDetails = () => {
    // localStorage.setItem("hotel_booking_id", hotelBookingId);
    //     setLoading(true);
    //     setTimeout(() => {
    //         navigate('/hotel-bill');
    //     }, 10000);
    // };
    // -----------------------navigate hotel ticket page-------------------------


    // ----------------------Bus history API-------------------------------
    useEffect(() => {
        const fetchBusBookingHistory = async () => {

            const transactionNoBus = localStorage.getItem('transactionNum-bus')
            try {
                const response = await fetch("https://sajyatra.sajpe.in/admin/api/bus-booking-history", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        transaction_num: transactionNoBus
                    }),
                });

                const data = await response.json();
                console.log('Bus booking history:', data);
                // localStorage.setItem('BusBookingAmount', data.booking_Status[0].amount);


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
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchFlightBookingHistory = async () => {
            try {
                const transactionFlightNo = localStorage.getItem('transactionNum-Flight');


                if (!transactionFlightNo) {
                    setError('No transaction number found');
                    setLoading(false);
                    return;
                }

                const response = await fetch("https://sajyatra.sajpe.in/admin/api/flight-history", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ transaction_num: transactionFlightNo }),
                });

                const data = await response.json();
                console.log('flight Booking API Response:', data);

                // Update to use the correct data structure
                if (data && Array.isArray(data.flight_history) && data.flight_history.length > 0) {
                    setFlightBookings(data);
                } else {
                    setFlightBookings([]);
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
        localStorage.setItem("flight_transaction_num", transactionNum);
        localStorage.setItem("flight_booking_id", booking_id);
        console.log("Flight details clicked");
        setLoading(true);
        setTimeout(() => {
            navigate('/flight-ticket');
        }, 10000);
    };
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
                                            <p className=''><strong>Bus Trace ID : </strong> <span>{booking.id
                                            }</span></p>
                                        </div>
                                        <div className="col-md-6">
                                            <p className=''><strong>Transaction Number : </strong> <span>{booking.transaction_num}</span></p>
                                            <p className='busBookingsamount'><strong>Amount : </strong> <span>₹{booking.amount}</span></p>
                                        </div>
                                        <div className='viewbttn'>
                                            <button onClick={() => navigateBusDetails(booking.bus_booking_id, booking.bus_trace_id)}>View Ticket</button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>No bookings found please book ticket.</p>
                            )}

                        </div>
                    </div>
                );
            case 'flight':
                return (
                    <div className='flightTabContent'>
                        <div className="container">
                            <h6 className='flightTabContentHeading'>Flight Ticket Status</h6>
                            {flightBookings.flight_history.length > 0 ? (
                                flightBookings.flight_history.map((booking, index) => (
                                    <div key={index} className="row flightTabContentROW">
                                        <div className="col-md-6">
                                            <p><strong>Name : </strong> <span>{booking.username || '/NA/'}</span></p>
                                            <p><strong>PNR : </strong> <span>{booking.amount}</span></p>
                                            <p><strong>Booking ID : </strong> <span>{booking.booking_id}</span></p>
                                        </div>
                                        <div className="col-md-6">
                                            <p className=' '><strong>Transaction No : </strong> <span>{booking.transaction_num}</span></p>
                                            <p className='bookingStats'><strong>Payment Status : </strong> <span>{booking.payment_status}</span></p>
                                            <p className='hotlamount '><strong>Amount : </strong> <span>₹{Math.round(booking.amount)}</span></p>

                                        </div>
                                        <div className='viewbttn'>
                                            <button onClick={() => navigateFlightDetails(booking.transaction_num, booking.booking_id)}>View Ticket</button>
                                            {/* <button onClick={() => navigateFlightDetails(booking.transaction_num)}>View Details</button> */}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>No flight bookings found. Please book a flight ticket.</p>
                            )}
                        </div>
                    </div>
                );
            case 'hotel':
                return (
                    <div className='hotelTabContent'>
                    <div className="container">
                        <h6 className='hotelTabContenthedding'>Hotel Ticket Status</h6>
                        {hotelBookings && hotelBookings.data && Array.isArray(hotelBookings.data) ? (
                            hotelBookings.data.length > 0 ? (
                                hotelBookings.data.map((user, userIndex) => (
                                    hotelBookings.userdetails && Array.isArray(hotelBookings.userdetails) ? (
                                        hotelBookings.userdetails.map((userdetails, userDeatilsIndex) => (
                                            <div key={`hotelTabContentROW-${userIndex}-${userDeatilsIndex}`} className="row hotelTabContentROW">
                                                <div className="col-md-6">
                                                    <p><strong>Hotel Name : </strong> {hotelBookings.hotel_name || "N/A"}</p>
                                                    <p><strong>Transaction No : </strong> {user.transaction_num || "N/A"}</p>
                                                    <p><strong>Mobile No : </strong> {userdetails.mobile|| "N/A"}</p>
                                                </div>
                                                <div className="col-md-6">
                                                    <p><strong>Hotel Id : </strong> {user.booking_id}</p>
                                                    <p className='bookingStats'><strong>Status : </strong> <span>{user.status}</span></p>
                                                    <p className='hotlamount'><strong>Amount : </strong> <span>₹{Math.round(user.amount)}</span></p>
                                                </div>
                                                <div className='viewbttn'>
                                                    <button onClick={() => handleBookingClick(hotelBookings.hotel_booking_id)}>View Ticket</button>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p key={`user-details-${userIndex}`}>No user details found.</p>
                                    )
                                ))
                            ) : (
                                <p>No bookings found. Please book a ticket.</p>
                            )
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
                                {renderTabContent()} {/* Render content based on the active tab */}
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
