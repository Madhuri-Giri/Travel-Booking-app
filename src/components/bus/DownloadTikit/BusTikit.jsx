import { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import "jspdf-autotable";
import "./BusTikit.css";
import CustomNavbar from '../../../pages/navbar/CustomNavbar';
import Footer from '../../../pages/footer/Footer';
import { useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CiSaveDown1 } from "react-icons/ci";
import Lottie from 'lottie-react';
import busAnim from "../../../assets/images/mainBus.json";
import Barcode from 'react-barcode';
import { FaArrowRightLong } from "react-icons/fa6";

const generatePasscode = () => {
  return Math.random().toString(36).substr(2, 8).toUpperCase();
};

const BusTikit = () => {
  const passcode = generatePasscode();

 

 
  const [busticketPassengerDetails, setBusticketPassengerDetails] = useState(null);

  const from = useSelector((state) => state.bus.from);
  const to = useSelector((state) => state.bus.to);

  const bus_booking_id = localStorage.getItem('bus_booking_id');
  const bus_trace_id = localStorage.getItem('bus_trace_id');

  useEffect(() => {
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
  }, [bus_booking_id, bus_trace_id]);

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

          <div className="row">
            <div className=" col-lg-3">
              {/* <Lottie animationData={LootiAnim} /> */}
              <Lottie className='lotti-bus' animationData={busAnim} />

              {/* <Lottie animationData={LootiAnim} style={{ height: '70%', width: '60%' }} /> */}
            </div>
            <div className="col-lg-9">
              <div className='busticktbox'>
                <div className='bustickthed'>
                  <h5>Bus Ticket</h5>
                </div>
                <div className="top">
                  {/* <h6>Download Your Boardign Pass</h6> */}
                  {/* <h5>BHopal{from}-{to}Indore</h5> */}
                </div>
                <div className="row buspssngerdetails">
                  {busticketPassengerDetails && (
                    <div className="col-12">
                      {busticketPassengerDetails.bus_details.map((busDetail, index) => (
                        <div key={index}>
                          <div className="row">
                          <div className='fromtoMOB'>
                                <div>
                                  <strong>Bhopal{from}</strong>
                                  <p>{formatTime(busDetail.departure_time)}</p>
                                </div>
                                <div>
                                  <FaArrowRightLong style={{ marginRight: '16', marginLeft: '16' }} />
                                </div>
                                <div>
                                  <strong>{to}Indore</strong>
                                  <p>{formatTime(busDetail.arrival_time)}</p>
                                </div>
                              </div>
                            <div className="col-md-4 col-6">
                              <p><strong>Name -: </strong><span>{busDetail.name}</span></p>
                              <p><strong>Age -: </strong><span>{busDetail.age}</span></p>
                              <p><strong>Gender -: </strong><span>{busDetail.gender}</span></p>
                              <p><strong>Number -: </strong><span>{busDetail.number}</span></p>
                              <p><strong>Date -: </strong><span>{formatDate(busDetail.departure_time)}</span></p>
                              {/* <strong>ROUTE -:</strong> <br></br> */}
                              <div className='fromtoWEB'>
                                <div>
                                  <strong>Bhopal{from}</strong>
                                  <p>{formatTime(busDetail.departure_time)}</p>
                                </div>
                                <div>
                                  <FaArrowRightLong style={{ marginRight: '16', marginLeft: '16' }} />
                                </div>
                                <div>
                                  <strong>{to}Indore</strong>
                                  <p>{formatTime(busDetail.arrival_time)}</p>
                                </div>

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
                              <strong>Bhopal{from}</strong>
                              <p>{formatTime(busDetail.departure_time)}</p>
                            </div>
                            <div>
                              <FaArrowRightLong style={{ marginRight: '16', marginLeft: '16' }} />
                            </div>
                            <div>
                              <strong>{to}Indore</strong>
                              <p>{formatTime(busDetail.arrival_time)}</p>
                            </div>
                          </div>
                          <div className="col-md-4 col-6">
                            <p><strong>Name -: </strong><span>{busDetail.name}</span></p>
                            <p><strong>Age -: </strong><span>{busDetail.age}</span></p>
                            <p><strong>Gender -: </strong><span>{busDetail.gender}</span></p>
                            <p><strong>Date -: </strong><span>{formatDate(busDetail.departure_time)}</span></p>
                            <div className='fromtoWEB'>
                              <div>
                                <strong>Bhopal{from}</strong>
                                <p>{formatTime(busDetail.departure_time)}</p>
                              </div>
                              <div>
                                <FaArrowRightLong style={{ marginRight: '16', marginLeft: '16' }} />
                              </div>
                              <div>
                                <strong>{to}Indore</strong>
                                <p>{formatTime(busDetail.arrival_time)}</p>

                              </div>


                            </div>

                            <div className="col-md-4 col-6">
                            <p><strong>Address -: </strong><span>{busDetail.address}</span></p>

                              <p><strong>Bus Type -: </strong><span>{busDetail.bus_type}</span></p>
                              {/* <p><strong>Dep Time -: </strong><span>{formatTime(busDetail.departure_time)}</span></p> */}
                              {/* <p><strong>Arr Time -: </strong><span>{formatTime(busDetail.arrival_time)}</span></p> */}

                              <p><strong>Traveller -: </strong><span>{busDetail.travel_name}</span></p>
                              {/* <p><strong>City Point Name -: </strong><span>{busDetail.city_point_name}</span></p> */}
                              <p><strong>Seat No -: </strong><span>{busDetail.seat_no}</span></p>
                            </div>

                            <div className="col-md-4 ticktbordr">
                              {busticketPassengerDetails.booking_Status && busticketPassengerDetails.booking_Status.length > 0 && (
                                <div>
                                  <p><strong>Ticket Number -: </strong><span>{busticketPassengerDetails.booking_Status[0].ticket_no}</span></p>
                                  {/* <p><strong>Bus ID -: </strong><span>{busticketPassengerDetails.booking_Status[0].bus_id}</span></p> */}
                                  <p><strong>Status -: </strong><span>{busticketPassengerDetails.booking_Status[0].bus_status}</span></p>
                                  <p className="psngeramount"><strong>Amount -: </strong><span>{busticketPassengerDetails.booking_Status[0].amount}</span></p>
                                  <p><strong>Passcode: </strong></p>
                                  <Barcode className="buspasscode" value={passcode} format="CODE128" /> {/* Barcode Display */}
                                </div>
                              )}
                            </div>


                          </div>
                          <div className="col-md-4 col-6">
                            <p><strong>Number -: </strong><span>{busDetail.number}</span></p>
                            <p><strong>Address -: </strong><span>{busDetail.address}</span></p>
                            <p><strong>Bus Type -: </strong><span>{busDetail.bus_type}</span></p>
                            <p><strong>Traveller -: </strong><span>{busDetail.travel_name}</span></p>
                          </div>
                          <div className="col-md-4 ticktbordr">
                            <div>
                              <p><strong>Seat No -: </strong><span>{seatDetail ? seatDetail.seat_name : 'N/A'}</span></p>
                              <p><strong>Booking Id -: </strong><span>{seatDetail ? seatDetail.bus_book_id : 'N/A'}</span></p>
                              <p className="psngeramount"><strong>Amount -: </strong><span>{seatDetail ? seatDetail.offered_price : 'N/A'}</span></p>
                              <p><strong>Passcode: </strong></p>
                              <Barcode className="buspasscode" value={passcode} format="CODE128" />
                            </div>

                          </div>
                        </div>
                      ))}

                    </div>

                  )}

                </div>

                <div className="btm">
                  <button className='busdonload' onClick={downloadTicket}>
                    Download
                    <CiSaveDown1 className='icon-down' style={{ marginLeft: '5px', fontSize: '20px', fontWeight: '800' }} />
                  </button>
                  <button className='buscncl' style={{ backgroundColor: 'red' }} onClick={handleCancelTicket}>Cancel Ticket</button>
                </div>

              </div>
            </div>
          </div>
        </div>


                    <div className="btm">
                      <button className='busdonload' onClick={downloadTicket}>
                        Download
                        <CiSaveDown1 className='icon-down' style={{ marginLeft: '5px', fontSize: '20px', fontWeight: '800' }} />
                      </button>
                      <button className='buscncl' style={{ backgroundColor: 'red' }} onClick={handleCancelTicket}>Cancel Ticket</button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

        </div>

        <Footer />
      </div>
    </>
  );
};

export default BusTikit;
