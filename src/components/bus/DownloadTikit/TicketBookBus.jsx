import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import jsPDF from 'jspdf';
import "jspdf-autotable";
import "./BusTikit.css";
import CustomNavbar from '../../../pages/navbar/CustomNavbar';
import Footer from '../../../pages/footer/Footer';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CiSaveDown1 } from "react-icons/ci";
import Lottie from 'lottie-react';
import busAnim from "../../../assets/images/mainBus.json";
import Barcode from 'react-barcode';
import { FaArrowRightLong } from "react-icons/fa6";

const generatePasscode = () => {
  return Math.random().toString(36).substr(2, 8).toUpperCase();
};

const TicketBookBus = () => {
  const passcode = generatePasscode();
  const [busticketPassengerDetails, setBusticketPassengerDetails] = useState(null);

  const from = useSelector((state) => state.bus.from);
  const to = useSelector((state) => state.bus.to);

  const bus_booking_id = localStorage.getItem('bus_booking_id');
  const bus_trace_id = localStorage.getItem('bus_trace_id');

  // Use useLocation to get the state passed via navigate
  const location = useLocation();
  const paymentStatus = location.state?.paymentStatus; // Retrieve payment status

  const paymentStatusbus = localStorage.getItem("buspaymentStatusRes")
  console.log("paymentStatusbus",paymentStatusbus);
  
  useEffect(() => {
    if (paymentStatus) {
      console.log('Received payment status:', paymentStatus);
      // Use paymentStatus as needed or fetch additional data based on it
    } else {
      console.error('No payment status received');
    }

    const fetchBusTicketApiData = async () => {
      try {
        const response = await fetch("https://sajyatra.sajpe.in/admin/api/bus-ticket", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ bus_booking_id, bus_trace_id }),
        });

        const data = await response.json();
        setBusticketPassengerDetails(data);
        console.log('Bus ticket API Response:', data);

      } catch (error) {
        console.error("Error fetching API of bus ticket:", error);
      }
    };
    fetchBusTicketApiData();
  }, [bus_booking_id, bus_trace_id, paymentStatus]);

  const downloadTicket = () => {
    if (!busticketPassengerDetails || !busticketPassengerDetails.bus_details || busticketPassengerDetails.bus_details.length === 0) {
      console.error("Missing ticket details or passenger data");
      return;
    }

    const doc = new jsPDF();

    const busDetail = busticketPassengerDetails.bus_details[0];
    const bookingStatus = busticketPassengerDetails.booking_Status?.[0] || {};

    // Debugging: Log data being used
    console.log('Generating PDF with data:', {
      from,
      to,
      ticketNo: bookingStatus.ticket_no,
      busId: bookingStatus.bus_id,
      status: bookingStatus.bus_status,
      amount: bookingStatus.amount,
      busType: busDetail.bus_type,
      departureTime: busDetail.departure_time,
      arrivalTime: busDetail.arrival_time,
      travelerName: busDetail.travel_name,
      cityPointLocation: busDetail.city_point_location
    });

    doc.text("Bus Ticket", 20, 20);

    doc.autoTable({
      startY: 30,
      head: [['Detail', 'Information']],
      body: [
        ['From:', from || 'N/A'],
        ['To:', to || 'N/A'],
        ['Ticket No:', bookingStatus.ticket_no || 'N/A'],
        ['Bus ID:', bookingStatus.bus_id || 'N/A'],
        ['Status:', bookingStatus.bus_status || 'N/A'],
        ['Ticket Price:', `${bookingStatus.amount || 'N/A'} INR`],
        ['Bus Type:', busDetail.bus_type || 'N/A'],
        ['Departure Time:', formatTime(busDetail.departure_time) || 'N/A'],
        ['Arrival Time:', formatTime(busDetail.arrival_time) || 'N/A'],
        ['Traveler Name:', busDetail.travel_name || 'N/A'],
        ['City Point Location:', busDetail.city_point_location || 'N/A'],
      ],
    });

    doc.save('bus_ticket.pdf');
  };

  const handleCancelTicket = async () => {
    const confirmation = window.confirm("Are you sure you want to cancel?");
    if (confirmation) {
      try {
        const response = await fetch("https://sajyatra.sajpe.in/admin/api/seat-cancel", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            BusId: "11836",
            SeatId: "25SYK4ET",
            Remarks: "test",
            transaction_num: "null"
          }),
        });

        if (response.ok) {
          toast.success("Your ticket is canceled");
          console.log("Your ticket is canceled");
        } else {
          toast.error("Failed to cancel the ticket");
        }
      } catch (error) {
        console.error("Error canceling the ticket:", error);
        toast.error("An error occurred while canceling the ticket");
      }
    } else {
      console.log("Ticket cancellation aborted");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!busticketPassengerDetails) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <CustomNavbar />

      <div className="Bus-Tikit">
        <div className="lottie container">
          {busticketPassengerDetails.bus_details.map((busDetail, index) => {
            const seatDetail = busticketPassengerDetails.seat_details.find(
              (seat) => seat.bus_book_id === busDetail.id.toString()
            );

            return (
              <div key={index} className="row busticketROW">
                <div className="col-lg-3 buslottieCOL">
                  <Lottie className='buslott' animationData={busAnim} />
                </div>
                <div className="col-lg-9">
                  <div className='busticktbox'>
                    <div className='bustickthed'>
                      <h5>Bus Ticket</h5>
                    </div>
                    <div className="top"></div>
                    <div className="row buspssngerdetails">
                      <div className="col-12">
                        <div className="row">
                          <div className='fromtoMOB'>
                            <div>
                              <strong>{from}</strong>
                              <p>{formatTime(busDetail.departure_time)}</p>
                            </div>
                            <div>
                              <FaArrowRightLong style={{ marginRight: '16', marginLeft: '16' }} />
                            </div>
                            <div>
                              <strong>{to}</strong>
                              <p>{formatTime(busDetail.arrival_time)}</p>
                            </div>
                          </div>
                          <div className="col-md-4 col-6">
                            <p><strong>Name -: </strong><span>{busDetail.name}</span></p>
                            <p><strong>Age -: </strong><span>{busDetail.age}</span></p>
                            <p><strong>Gender -: </strong><span>{busDetail.gender}</span></p>
                            <p><strong>Date -: </strong><span>{formatDate(busDetail.departure_time)}</span></p>
                            <div className='fromto'>
                              <div>
                                <strong>{from}</strong>
                                <p>{formatTime(busDetail.departure_time)}</p>
                              </div>
                              <div>
                                <FaArrowRightLong style={{ marginRight: '16', marginLeft: '16' }} />
                              </div>
                              <div>
                                <strong>{to}</strong>
                                <p>{formatTime(busDetail.arrival_time)}</p>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-4 col-6">
                            <p><strong>PNR Number -: </strong><span>{busDetail.PNR}</span></p>
                            <p><strong>Bus Type -: </strong><span>{busDetail.bus_type}</span></p>
                            <p><strong>Pass Code -: </strong><span>{passcode}</span></p>
                            <p><strong>Duration -: </strong><span>{busDetail.duration}</span></p>
                          </div>
                          <div className="col-md-4 col-12 busbar">
                            <Barcode value={passcode} />
                          </div>
                          <div className='bustickstatus'>
                            <div className="top">
                              <h5>Boarding point</h5>
                              <p>{busDetail.city_point_location}</p>
                            </div>
                            <div className="top">
                              <h5>Status</h5>
                              <p>Confirmed</p>
                            </div>
                            <div className="top">
                              <h5>Seat No</h5>
                              <p>{seatDetail ? seatDetail.seat_no : 'N/A'}</p>
                            </div>
                            <div className="top">
                              <h5>Ticket No</h5>
                              <p>{busDetail.PNR}</p>
                            </div>
                          </div>
                          <div className='bustickstatusBTN'>
                            <button onClick={downloadTicket}>
                              <CiSaveDown1 /> Download ticket
                            </button>
                            <button onClick={handleCancelTicket}>Cancel ticket</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default TicketBookBus;
