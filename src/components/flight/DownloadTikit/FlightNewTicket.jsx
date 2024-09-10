import { useEffect, useState, useRef } from 'react';
import jsPDF from 'jspdf';
import "jspdf-autotable";
import "./FlightNewTicket.css";
import CustomNavbar from '../../../pages/navbar/CustomNavbar';
import Footer from '../../../pages/footer/Footer';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CiSaveDown1 } from "react-icons/ci";
import Lottie from 'lottie-react';
import LootiAnim from '../../../assets/images/Anim.json';
import html2canvas from 'html2canvas';
import FooterLogo from "../../../assets/images/main logo.png"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import { faFire, faBiohazard, faFlask, faSprayCan, faGasPump, faSmoking, faVirus, faRadiation, faBomb } from '@fortawesome/free-solid-svg-icons';

// Helper function to generate a passcode
const generatePasscode = () => {
  return Math.random().toString(36).substr(2, 8).toUpperCase();
};

const FlightNewTikit = () => {
  const passcode = generatePasscode();
  const ticketElementRef = useRef(null);
  const [flightticketPassengerDetails, setFlightticketPassengerDetails] = useState(null);
  const navigate = useNavigate();
  const [buttonsVisible, setButtonsVisible] = useState(true); // State to manage button visibility

  // Convert the stored value to a boolean
  const islcc = localStorage.getItem('F-IsLcc');
  console.log("islcc", islcc);

  useEffect(() => {
    const fetchFlightTicketApiData = async () => {
      try {
        const flightTransactionId = localStorage.getItem('flight_transaction_id');
        console.log('flightTransactionId', flightTransactionId)
        if (!flightTransactionId) {
          throw new Error('Flight Transaction ID is missing');
        }

        const response = await fetch("https://sajyatra.sajpe.in/admin/api/flight-payment-history", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            // transaction_id: 377
            transaction_id: flightTransactionId
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          console.error('API Error:', data);
          if (data.errors) {
            Object.keys(data.errors).forEach(key => {
              console.error(`Error with ${key}:`, data.errors[key]);
            });
          }
          throw new Error(data.message || 'Unknown error');
        }

        setFlightticketPassengerDetails(data);
        console.log('Flight ticket API Response:', data);

      } catch (error) {
        console.error("Error fetching flight ticket:", error);
        toast.error("Failed to load flight ticket details");
      }
    };

    fetchFlightTicketApiData();
  }, []);

  console.log("flightticketPassengerDetails", flightticketPassengerDetails);
  // Accessing the 'message' property of the response
  // Safely access the 'message' property using optional chaining
  console.log("message", flightticketPassengerDetails?.message);

  const downloadTicket = () => {
    const flightTicketMain = ticketElementRef.current.querySelector('.flightTicketmain');
    if (!flightTicketMain) {
      console.error("Flight ticket main content not found");
      return;
    }

    // Ensure the .ticketpart div is visible before capturing it
    const ticketPartDiv = ticketElementRef.current.querySelector('.ticketpart');
    if (ticketPartDiv) {
      ticketPartDiv.style.display = 'block'; // Make sure it's visible
    }

    const btmDiv = ticketElementRef.current.querySelector('.btm');
    if (btmDiv) {
      btmDiv.style.display = 'none';
    }

    html2canvas(flightTicketMain, { scale: 3 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      // Define margins (in mm)
      const margin = 10;
      const imgWidth = pdfWidth - 2 * margin;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Adding image to PDF
      pdf.addImage(imgData, 'PNG', margin, margin, imgWidth, imgHeight);

      // Adjust page height to fit content if needed
      if (pdfHeight > pdf.internal.pageSize.height) {
        const pages = Math.ceil(pdfHeight / pdf.internal.pageSize.height);
        for (let i = 1; i < pages; i++) {
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', margin, -pdf.internal.pageSize.height * i + margin, imgWidth, imgHeight);
        }
      }

      pdf.save('flight_ticket.pdf');
    }).catch((error) => {
      console.error('Error generating PDF:', error);
    }).finally(() => {
      // Restore the visibility of the .ticketpart div and .btm div
      if (ticketPartDiv) {
        ticketPartDiv.style.display = 'none'; // Hide it again
      }
      if (btmDiv) {
        btmDiv.style.display = '';
      }
    });
  };

  const handleCancelTicket = async () => {
    const confirmation = window.confirm("Are you sure you want to cancel?");
    if (confirmation) {
      try {
        const response = await fetch("https://sajyatra.sajpe.in/admin/api/flight-cancel", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            RequestType: "2",
            TraceId: "123456"
          }),
        });

        if (response.ok) {
          toast.success("Your ticket is canceled");
          setFlightticketPassengerDetails(null); // Clear the state
          setButtonsVisible(false); // Hide the buttons
          setTimeout(() => {
            // Navigate to the flight-search page
            navigate('/flight-search');
          }, 2000); // 2-second delay for the toast message to be visible
        } else {
          toast.error("Failed to cancel the ticket");
        }
      } catch (error) {
        console.error("Error canceling the ticket:", error);
        toast.error("An error occurred while canceling the ticket");
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const items = [
    // { id: 1, name: 'Lighters, Matchsticks', icon: faLighter },
    { id: 2, name: 'Flammable Liquids', icon: faFire },
    { id: 3, name: 'Toxic Substances', icon: faBiohazard },
    { id: 4, name: 'Corrosive Substances', icon: faFlask },
    { id: 5, name: 'Pepper Spray', icon: faSprayCan },
    { id: 6, name: 'Flammable Gas', icon: faGasPump },
    { id: 7, name: 'E-cigarettes', icon: faSmoking },
    { id: 8, name: 'Infectious Substances', icon: faVirus },
    { id: 9, name: 'Radioactive Materials', icon: faRadiation },
    { id: 10, name: 'Explosives, Ammunition', icon: faBomb },
  ];


  const calculateDuration = (depTime, arrTime) => {
    // Convert departure and arrival times to Date objects
    const departure = new Date(depTime);
    const arrival = new Date(arrTime);

    // Calculate the difference in milliseconds
    const durationInMilliseconds = arrival - departure;

    // Convert the difference to hours and minutes
    const durationInMinutes = Math.floor(durationInMilliseconds / 60000); // 1 minute = 60000 milliseconds
    const hours = Math.floor(durationInMinutes / 60);
    const minutes = durationInMinutes % 60;

    // Return the formatted duration
    return `${hours}h ${minutes}m`;
  };



  // Destructure the data with fallback to prevent errors
  const { payment, userdetails, booking_hold, booking_status, booking_gds, book_passengers } = flightticketPassengerDetails || {};

  return (
    <>
      <CustomNavbar />
      <div className="flight-Tikit">
        <div className="lottie container" ref={ticketElementRef}>
          <div className="row">
            <div className="col-lg-3">
              <Lottie animationData={LootiAnim} />
            </div>

            <div className="col-lg-9">

              <div className="fligthticketBtns">
                {buttonsVisible && (
                  <>
                    <button className='busdonload' onClick={downloadTicket}>
                      Download
                      <CiSaveDown1 className='icon-down' style={{ marginLeft: '5px', fontSize: '20px', fontWeight: '800' }} />
                    </button>
                    <button className='buscncl' onClick={handleCancelTicket} style={{ backgroundColor: 'red' }}>
                      Cancel Ticket
                    </button>
                  </>
                )}
              </div>

              {flightticketPassengerDetails ? (
                <div className='flightTicketmain'>
                  {/* {islcc ? ( */}
                  {flightticketPassengerDetails?.message == 'LCC booking details found' ? (
                    // LCC Booking Details when islcc is true
                    <>
                      <div>
                        <div className='ftickethed'>
                          <p>
                            <strong>TICKET </strong> - <span>Confirmed</span>
                          </p>
                          <p>Booking ID : {payment.booking_id}</p>
                        </div>
                        <div className='flightticketboxHED'>
                          <p>{` ${formatDate(booking_status.dep_time)}`}</p>
                          <h6>{`${booking_status.city_name} To ${booking_status.destination_city_name}`}</h6>
                          <p>{calculateDuration(booking_status.dep_time, booking_status.arr_time)}</p>
                        </div>
                        <div className="flightticketboxTravelDetails">
                          <div className="ffbox1">
                            <div className='flightIndigodet'>
                              <p>{booking_status.airline || 'Airline null'}</p>
                              <p>{booking_status.airline_code || 'Airline code null'}</p>
                            </div>
                            <div className='flightSaver'>
                              <h6>{booking_status.fare_basis_code || 'Fare Basis null'}</h6>
                            </div>
                          </div>
                          <div className="ffbox2">
                            <h4>{booking_status.origin}</h4>
                            <p className='ffbox2P1'>{booking_status.city_name || 'null'}</p>
                            <p className='ffbox2Time'>{new Date(booking_status.dep_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}, {new Date(booking_status.dep_time).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</p>
                            <p>{booking_status.origin_airport || 'Origin Airport null'}</p>
                          </div>
                          <div className="ffbox3">
                            <p>---</p>
                            <p className='ffbox3TImeborder'>{calculateDuration(booking_status.dep_time, booking_status.arr_time)}</p>
                            <p>{booking_status.fare_type || 'Economy'}</p>
                          </div>
                          <div className="ffbox4">
                            <h4>{booking_status.destination}</h4>
                            <p className='ffbox4P1'>{booking_status.destination_city_name || 'null'}</p>
                            <p className='ffbox2Time'>{new Date(booking_status.arr_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}, {new Date(booking_status.arr_time).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</p>
                            <p>{booking_status.destination_airport || 'Destination Airport null'}</p>
                          </div>
                        </div>

                        <div>
                          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead className='passengerDetailTable'>
                              <tr>
                                <th style={{ border: '1px solid #ddd', padding: '8px' }}>PASSENGER NAME</th>
                                <th style={{ border: '1px solid #ddd', padding: '8px' }}>ADDRESS</th>
                                <th style={{ border: '1px solid #ddd', padding: '8px' }}>MOBILE</th>
                                <th style={{ border: '1px solid #ddd', padding: '8px' }}>CITY</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}><strong> {book_passengers[0].first_name} {book_passengers[0].last_name}</strong></td>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}><strong> {book_passengers[0].address}</strong></td>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}><strong> {book_passengers[0].contact_no}</strong></td>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}><strong> {book_passengers[0].city}</strong></td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <div className='mt-4'>
                          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead className='passengerDetailTable'>
                              <tr>
                                <th style={{ border: '1px solid #ddd', padding: '8px' }}>PNR</th>
                                <th style={{ border: '1px solid #ddd', padding: '8px' }}>E-TICKET NO.</th>
                                <th style={{ border: '1px solid #ddd', padding: '8px' }}>SEAT</th>
                                <th style={{ border: '1px solid #ddd', padding: '8px' }} className='ticketamountHed'>AMOUNT</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}><strong>{booking_status.pnr}</strong></td>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{booking_status.ticket_no || 'E-Ticket Number'}</td>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{booking_status.seat_no || 'Seat No null'}</td>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }} className='ticketamount'>{payment.amount || 'Seat No null'} Rs.</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                      <div className='ticketpart'>

                        <div className='mt-5 sajyatraticketmain'>
                          <div className='sajyatratickethed'>
                            <h6 className=''>Sajyatra</h6>
                            <img src={FooterLogo} className='img-fluid' alt="logo"></img>
                          </div>
                          <div className='sajyatraticketmainDiv'>
                            <strong>Avoid Long Queues at the Airport with Sajyatra</strong>
                            <p>Use Sajyatra - Lorem ipsum dolor, sit amet consectetur adipisicing elit. Architecto repudiandae suscipit adipisci tempore nesciunt rem unde voluptas, nulla ut sint ab odit a sit optio debitis, expedita impedit eos dolor?</p>
                            <p><strong>Step-1</strong>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi, obcaecati odio! Dignissimos ea sed rerum porro. </p>
                            <p><strong>Step-2</strong>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi, obcaecati odio! Dignissimos ea sed rerum porro. </p>
                          </div>
                        </div>

                        <div className="items-not-allowed-container">
                          <div className="header">
                            <h2>Items not allowed in the aircraft</h2>
                          </div>
                          <div className="items-grid">
                            {items.map((item) => (
                              <div className="item" key={item.id}>
                                <div className="icon-container">
                                  <FontAwesomeIcon icon={item.icon} className="main-icon" />
                                  <div className="cross-line"></div>
                                </div>
                                <span className="item-name">{item.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className='impotantNotmain'>
                          <h6 className='impotantNothed'>IMPORTANT INFORMATION</h6>
                          <ul>
                            <li>
                              <strong>Chheck-in Time : </strong>
                              Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat, aperiam veniam quisquam vel doloribus iure pariatur, sunt est temporibus rem
                            </li>
                            <li>
                              <strong>DGCA passenger charter : </strong>
                              Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat, aperiam veniam quisquam vel doloribus iure pariatur, sunt est temporibus rem
                            </li>
                            <li>
                              <strong>Valid Id proof needed : </strong>
                              Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat, aperiam veniam quisquam vel doloribus iure pariatur, sunt est temporibus rem
                            </li>
                            <li>
                              <strong>You have Paid : INR 9,7366</strong>
                            </li>

                          </ul>
                        </div>
                        <div className='fticketBaggageInformation mt-5'>
                          <h6 className='impotantNothed'>BAGGAGE INFORMATION</h6>
                          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead className='passengerDetailTable'>
                              <tr>
                                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Type</th>
                                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Sector</th>
                                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Cabin</th>
                                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Check-in</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>Adult</td>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>CCU-DEL</td>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{`${booking_status.baggage}`}</td>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>15- Kgs (1 pieace only)</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <div className='flightitcketCancelationDetails mt-4'>
                          <h6 className='impotantNothed'>CANCELLATION AND DATE CHANGE CHARGES</h6>
                          <div className="row">
                            <div className="col-6">
                              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead className='passengerDetailTable'>
                                  <tr>
                                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>Type</th>
                                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>Condition</th>
                                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>Airline</th>
                                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>Sajyatra</th>
                                  </tr>
                                </thead>

                                <tbody>
                                  <tr>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>Adult</td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>3 days - 365 days</td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>3000</td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>0</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                            <div className="col-6">
                              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead className='passengerDetailTable'>
                                  <tr>
                                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>Type</th>
                                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>Condition</th>
                                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>Airline</th>
                                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>Sajyatra</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>Adult</td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>3 days - 365 days</td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>3000</td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>0</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                          <p className='convenFee'>*Convenience Fee is non-refundable and will not be refund back even in the case of 100% Fee Cancellation</p>
                        </div>
                        <div className='mt-4'>
                          <h6 className='impotantNothed'>24x7 CUSTOMER SUPPORT</h6>
                        </div>
                        <div className='supportDiv row'>
                          <div className="col-6 ">
                            <div className='supportDivCOl'>
                              <h6 className='impotantNothed'>Sajyatra SUPPORT</h6>
                              <div className='supportDivCOlText'>
                                <strong>Tel </strong> <span> 1-800-103-9695 (toll free) for all major operators</span>
                              </div>
                            </div>
                          </div>
                          <div className="col-6 ">
                            <div className='supportDivCOl'>
                              <h6 className='impotantNothed'>Airlline SUPPORT</h6>
                              <div className='supportDivCOlText'>
                                <strong>Indigo </strong> <span> 1-800-103-9695 (toll free) for all major operators</span>
                              </div>
                            </div>
                          </div>

                        </div>
                      </div>
                    </>

                  ) : (
                    // Non-LCC (hold) Booking Details when islcc is false
                    <>
                      <div>
                        <div className='flightticketboxHED'>
                          <h6>{new Date(booking_hold.dep_time).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</h6>
                          <h6>{`${booking_hold.origin} TO ${booking_hold.destination}`}</h6>
                          <p>2h 15m</p>
                        </div>
                        <div className="flightticketboxTravelDetails">
                          <div className="ffbox1">
                            <div className='flightIndigodet'>
                              <p>{booking_hold.airline || 'null'}</p>
                              <p>{booking_hold.airline_code || 'Flight Number Not Available'}</p>
                            </div>
                            <div className='flightSaver'>
                              {/* <h6>Fare Basis Code</h6> */}
                              {/* <h6>{booking_hold.fare_basis_code || 'Not Available'}</h6> */}
                              <h6>{`${booking_hold.fare_basis_code}`}</h6>
                            </div>
                          </div>
                          <div className="ffbox2">
                            <h4>{booking_hold.origin}</h4>
                            <p className='ffbox2P1'>{booking_hold.city_name || 'null'}</p>
                            <p className='ffbox2Time'>{new Date(booking_hold.dep_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}, {new Date(booking_hold.dep_time).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</p>
                            <p>{booking_hold.origin_airport || 'Origin Airport null'}</p>
                          </div>
                          <div className="ffbox3">
                            <p>---</p>
                            <p className='ffbox3TImeborder'>2h 15m</p>
                            <p>{booking_hold.fare_type || 'Economy'}</p>
                          </div>
                          <div className="ffbox4">
                            <h4>{booking_hold.destination}</h4>
                            <p className='ffbox4P1'>{booking_hold.destination_city_name || 'null'}</p>
                            <p className='ffbox2Time'>{new Date(booking_hold.arr_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}, {new Date(booking_hold.arr_time).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</p>
                            <p>{booking_hold.destination_airport || 'Destination Airport null'}</p>
                          </div>
                        </div>
                        <div className="">
                          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead className='passengerDetailTable'>
                              <tr>
                                <th style={{ border: '1px solid #ddd', padding: '8px' }}>PASSENGER NAME</th>
                                <th style={{ border: '1px solid #ddd', padding: '8px' }}>PNR</th>
                                <th style={{ border: '1px solid #ddd', padding: '8px' }}>E-TICKET NO.</th>
                                <th style={{ border: '1px solid #ddd', padding: '8px' }}>SEAT</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}><strong>1. {userdetails.name}</strong></td>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{booking_hold.pnr}</td>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{booking_hold.ticket_number || 'null'}</td>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{booking_hold.seat_no || 'Seat No null'}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div className='ticketpart'>
                        <div className='mt-5 sajyatraticketmain'>
                          <div className='sajyatratickethed'>
                            <h6 className=''>Sajyatra</h6>
                            <img src={FooterLogo} className='img-fluid' alt="logo"></img>
                          </div>
                          <div className='sajyatraticketmainDiv'>
                            <strong>Avoid Long Queues at the Airport with Sajyatra</strong>
                            <p>Use Sajyatra - Lorem ipsum dolor, sit amet consectetur adipisicing elit. Architecto repudiandae suscipit adipisci tempore nesciunt rem unde voluptas, nulla ut sint ab odit a sit optio debitis, expedita impedit eos dolor?</p>
                            <p><strong>Step-1</strong>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi, obcaecati odio! Dignissimos ea sed rerum porro. </p>
                            <p><strong>Step-2</strong>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi, obcaecati odio! Dignissimos ea sed rerum porro. </p>
                          </div>
                        </div>

                        <div className="items-not-allowed-container">
                          <div className="header">
                            <h2>Items not allowed in the aircraft</h2>
                          </div>
                          <div className="items-grid">
                            {items.map((item) => (
                              <div className="item" key={item.id}>
                                <div className="icon-container">
                                  <FontAwesomeIcon icon={item.icon} className="main-icon" />
                                  <div className="cross-line"></div>
                                </div>
                                <span className="item-name">{item.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className='impotantNotmain'>
                          <h6 className='impotantNothed'>IMPORTANT INFORMATION</h6>
                          <ul>
                            <li>
                              <strong>Chheck-in Time : </strong>
                              Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat, aperiam veniam quisquam vel doloribus iure pariatur, sunt est temporibus rem
                            </li>
                            <li>
                              <strong>DGCA passenger charter : </strong>
                              Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat, aperiam veniam quisquam vel doloribus iure pariatur, sunt est temporibus rem
                            </li>
                            <li>
                              <strong>Valid Id proof needed : </strong>
                              Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat, aperiam veniam quisquam vel doloribus iure pariatur, sunt est temporibus rem
                            </li>
                            <li>
                              {/* <strong>You have Paid : INR 9,7366</strong> */}
                              <strong>You have Paid :  {payment.amount} Rs</strong>
                            </li>

                          </ul>
                        </div>
                        <div className='fticketBaggageInformation mt-5'>
                          <h6 className='impotantNothed'>BAGGAGE INFORMATION</h6>
                          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead className='passengerDetailTable'>
                              <tr>
                                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Type</th>
                                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Sector</th>
                                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Cabin</th>
                                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Check-in</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>Adult</td>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>CCU-DEL</td>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{`${booking_hold.baggage}`}</td>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>15- Kgs (1 pieace only)</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <div className='flightitcketCancelationDetails mt-4'>
                          <h6 className='impotantNothed'>CANCELLATION AND DATE CHANGE CHARGES</h6>
                          <div className="row">
                            <div className="col-6">
                              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead className='passengerDetailTable'>
                                  <tr>
                                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>Type</th>
                                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>Condition</th>
                                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>Airline</th>
                                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>Sajyatra</th>
                                  </tr>
                                </thead>

                                <tbody>
                                  <tr>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>Adult</td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>3 days - 365 days</td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>3000</td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>0</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                            <div className="col-6">
                              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead className='passengerDetailTable'>
                                  <tr>
                                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>Type</th>
                                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>Condition</th>
                                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>Airline</th>
                                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>Sajyatra</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>Adult</td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>3 days - 365 days</td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>3000</td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>0</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                          <p className='convenFee'>*Convenience Fee is non-refundable and will not be refund back even in the case of 100% Fee Cancellation</p>
                        </div>
                        <div className='mt-4'>
                          <h6 className='impotantNothed'>24x7 CUSTOMER SUPPORT</h6>
                        </div>
                        <div className='supportDiv row'>
                          <div className="col-6 ">
                            <div className='supportDivCOl'>
                              <h6 className='impotantNothed'>Sajyatra SUPPORT</h6>
                              <div className='supportDivCOlText'>
                                <strong>Tel </strong> <span> 1-800-103-9695 (toll free) for all major operators</span>
                              </div>
                            </div>
                          </div>
                          <div className="col-6 ">
                            <div className='supportDivCOl'>
                              <h6 className='impotantNothed'>Airlline SUPPORT</h6>
                              <div className='supportDivCOlText'>
                                <strong>Indigo </strong> <span> 1-800-103-9695 (toll free) for all major operators</span>
                              </div>
                            </div>
                          </div>

                        </div>
                      </div>

                    </>
                  )}
                </div>
              ) : (
                <div>No Booikng ticket details..</div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <ToastContainer />
    </>
  );
};

export default FlightNewTikit;
