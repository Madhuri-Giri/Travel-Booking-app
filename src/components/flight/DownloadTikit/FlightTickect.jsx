import { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import "jspdf-autotable";
import "./FlightTickect.css"; // Ensure your CSS file is set up correctly
import CustomNavbar from '../../../pages/navbar/CustomNavbar';
import Footer from '../../../pages/footer/Footer';
import { useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CiSaveDown1 } from "react-icons/ci";
import Lottie from 'lottie-react';
import LootiAnim from '../../../assets/images/Anim.json';
import { FaArrowRightLong } from "react-icons/fa6";
import Barcode from 'react-barcode';


const generatePasscode = () => {
  return Math.random().toString(36).substr(2, 8).toUpperCase();
};


const FlightTickect = () => {
  const passcode = generatePasscode();


  const [busticketPassengerDetails, setbusticketPassengerDetails] = useState(null);
  const [flightticketPassengerDetails, setflightticketPassengerDetails] = useState(null);

  const from = useSelector((state) => state.bus.from);
  const to = useSelector((state) => state.bus.to);

  const bus_booking_id = localStorage.getItem('bus_booking_id');
  const bus_trace_id = localStorage.getItem('bus_trace_id');
  const flight_booking_id = localStorage.getItem('flight_booking_id');
  // console.log("flight_booking_id",flight_booking_id);




  useEffect(() => {
    const fetchbusTicketApiData = async () => {
      try {
        const response = await fetch("https://sajyatra.sajpe.in/admin/api/flight-ticket-history", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(
            {
              flight_booking_id: flight_booking_id,
              // bus_trace_id: bus_trace_id
            }),
        });

        const data = await response.json();
        setflightticketPassengerDetails(data);
        console.log('flight ticket API Response:', data);

      } catch (error) {
        console.error("Error fetching API of bus ticket:", error);
      }
    };
    fetchbusTicketApiData();
  }, [bus_booking_id, bus_trace_id]);




  useEffect(() => {
    const fetchbusTicketApiData = async () => {
      try {
        const response = await fetch("https://sajyatra.sajpe.in/admin/api/bus-ticket", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(
            {
              bus_booking_id: bus_booking_id,
              bus_trace_id: bus_trace_id
            }),
        });

        const data = await response.json();
        setbusticketPassengerDetails(data);
        console.log('bus ticket API Response:', data);

      } catch (error) {
        console.error("Error fetching API of bus ticket:", error);
      }
    };
    fetchbusTicketApiData();
  }, [bus_booking_id, bus_trace_id]);

  const downloadTicket = () => {
    if (!busticketPassengerDetails || busticketPassengerDetails.bus_details.length === 0) {
      console.error("Missing ticket details or passenger data");
      return;
    }

    const doc = new jsPDF();

    // Assuming the first item in bus_details contains the general details
    const busDetail = busticketPassengerDetails.bus_details[0];
    const bookingStatus = busticketPassengerDetails.booking_Status?.[0] || {};

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
        ['Departure Time:', busDetail.departure_time || 'N/A'],
        ['Arrival Time:', busDetail.arrival_time || 'N/A'],
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
            transaction_num: "null" // Provide the transaction number here
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


  return (
    <>
      <CustomNavbar />

      <div className="Bus-Tikit">
        {/* <div className="b-hed">
          <h5>Download Ticket Status</h5>
        </div> */}

        <div className="lottie container">
          <div className="row">
            <div className=" col-lg-3">
              <Lottie animationData={LootiAnim} />
              {/* <Lottie animationData={LootiAnim} style={{ height: '70%', width: '60%' }} /> */}
            </div>
            <div className="col-lg-9">
              <div className='busticktbox'>
                <div className='bustickthed'>
                  <h5>Flight Ticket</h5>
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


        {/* <div className="lottie">
             <div className="anim">
                <Lottie animationData={LootiAnim} style={{ height: '70%', width: '60%' }} />
             </div>
       <div className="do-wn">
          <div className="top">
               <h6>Download Your Boardign Pass</h6>
            <h5>BHopal{from}-{to}Indore</h5>
          </div>
          <div className="row buspssngerdetails">
            {busticketPassengerDetails && (
              <div className="col-12">
                {busticketPassengerDetails.bus_details.map((busDetail, index) => (
                  <div key={index}>
                    <p><strong>Passenger Name -: </strong><span>{busDetail.name}</span></p>
                    <p><strong>Age -: </strong><span>{busDetail.age}</span></p>
                    <p><strong>Gender -: </strong><span>{busDetail.gender}</span></p>
                    <p><strong>Number -: </strong><span>{busDetail.number}</span></p>
                    <p><strong>Address -: </strong><span>{busDetail.address}</span></p>
                    <p><strong>Bus Type -: </strong><span>{busDetail.bus_type}</span></p>
                    <p><strong>Departure Time -: </strong><span>{busDetail.departure_time}</span></p>
                    <p><strong>Arrival Time -: </strong><span>{busDetail.arrival_time}</span></p>
                    <p><strong>Traveller Name -: </strong><span>{busDetail.travel_name}</span></p>
                    <p><strong>City Point Location -: </strong><span>{busDetail.city_point_location}</span></p>
                  </div>
                ))}
                <div className="col-12">
                  {busticketPassengerDetails.booking_Status && busticketPassengerDetails.booking_Status.length > 0 && (
                    <div>
                      <p><strong>Ticket Number -: </strong><span>{busticketPassengerDetails.booking_Status[0].ticket_no}</span></p>
                      <p><strong>Bus ID -: </strong><span>{busticketPassengerDetails.booking_Status[0].bus_id}</span></p>
                      <p><strong>Status -: </strong><span>{busticketPassengerDetails.booking_Status[0].bus_status}</span></p>
                      <p className="psngeramount"><strong>Amount -: </strong><span>{busticketPassengerDetails.booking_Status[0].amount}</span></p>
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>

          <div className="btm">
          <button style={{backgroundColor:'red'}} onClick={handleCancelTicket}>Cancel Ticket</button>
          <button  onClick={downloadTicket}>
        Download 
        <CiSaveDown1 className='icon-down' style={{ marginLeft: '5px', fontSize: '20px', fontWeight: '800' }}  />

      </button>          </div>
        </div>

       </div> */}

      </div>

      <Footer />
    </>
  );
};

export default FlightTickect;
