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

// Helper function to generate a passcode
const generatePasscode = () => {
  return Math.random().toString(36).substr(2, 8).toUpperCase();
};

const FlightNewTikit = () => {
  const passcode = generatePasscode();
  const ticketElementRef = useRef(null);
  const [flightticketPassengerDetails, setFlightticketPassengerDetails] = useState(null);

  // Convert the stored value to a boolean
  const islcc = localStorage.getItem('F-IsLcc') === 'false';
  console.log("islcc", islcc);

  useEffect(() => {
    const fetchFlightTicketApiData = async () => {
      try {
        const flightTransactionId = localStorage.getItem('flight_transaction_id');
        if (!flightTransactionId) {
          throw new Error('Flight Transaction ID is missing');
        }

        const response = await fetch("https://sajyatra.sajpe.in/admin/api/flight-payment-history", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ transaction_id: 215 }), // Use the correct transaction ID here
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

  const downloadTicket = () => {
    const flightTicketMain = ticketElementRef.current.querySelector('.flightTicketmain');
    if (!flightTicketMain) {
      console.error("Flight ticket main content not found");
      return;
    }

    const btmDiv = ticketElementRef.current.querySelector('.btm');
    if (btmDiv) {
      btmDiv.style.display = 'none';
    }

    html2canvas(flightTicketMain, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('flight_ticket.pdf');
    }).catch((error) => {
      console.error('Error generating PDF:', error);
    }).finally(() => {
      if (btmDiv) {
        btmDiv.style.display = '';
      }
    });
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

  // Destructure the data with fallback to prevent errors
  const { payment, userdetails, booking_hold, bookingstatus } = flightticketPassengerDetails || {};

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
                <button className='busdonload' onClick={downloadTicket}>
                  Download
                  <CiSaveDown1 className='icon-down' style={{ marginLeft: '5px', fontSize: '20px', fontWeight: '800' }} />
                </button>
              </div>
              {flightticketPassengerDetails ? (
                <div className='flightTicketmain'>
                  {islcc ? (
                    // LCC Booking Details when islcc is true
                    <>
                      <div>
                        <div className='flightticketboxHED'>
                          <p>{` ${bookingstatus.dep_time}`}</p>
                          <h6>{`${bookingstatus.origin} TO ${bookingstatus.destination}`}</h6>
                          <p>2h 15m</p>
                        </div>
                        <div className="flightticketboxTravelDetails">
                          <div className="ffbox1">
                            <div className='flightIndigodet'>
                              <p>{bookingstatus.airline || 'null'}</p>
                              <p>{bookingstatus.airline_code || 'Flight Number Not Available'}</p>
                            </div>
                            <div className='flightSaver'>
                              <h6>Fare Basis Code</h6>
                              <h6>{bookingstatus.fare_basis_code || 'Not Available'}</h6>
                            </div>
                          </div>
                          <div className="ffbox2">
                            <h4>{bookingstatus.origin}</h4>
                            <p className='ffbox2P1'>{bookingstatus.city_name || 'null'}</p>
                            <p className='ffbox2Time'>{new Date(bookingstatus.dep_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}, {new Date(bookingstatus.dep_time).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</p>
                            <p>{bookingstatus.origin_airport || 'Origin Airport null'}</p>
                          </div>
                          <div className="ffbox3">
                            <p>---</p>
                            <p className='ffbox3TImeborder'>2h 15m</p>
                            <p>{bookingstatus.fare_type || 'Economy'}</p>
                          </div>
                          <div className="ffbox4">
                            <h4>{bookingstatus.destination}</h4>
                            <p className='ffbox4P1'>{bookingstatus.destination_city_name || 'null'}</p>
                            <p className='ffbox2Time'>{new Date(bookingstatus.arr_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}, {new Date(bookingstatus.arr_time).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</p>
                            <p>{bookingstatus.destination_airport || 'Destination Airport null'}</p>
                          </div>
                        </div>

                        <div>
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
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{bookingstatus.pnr}</td>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{bookingstatus.ticket_no || 'E-Ticket Number'}</td>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{bookingstatus.seat_no || 'Seat No null'}</td>
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
                        <div className='fticketBaggageInformation'>
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
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>7- Kgs (1 pieace only)</td>
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
                                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>MakeMyTrip</th>
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
                                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>MakeMyTrip</th>
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
                        </div>
                      </div>
                    </>

                  ) : (
                    // Non-LCC Booking Details when islcc is false
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
                              <h6>Fare Basis Code</h6>
                              <h6>{booking_hold.fare_basis_code || 'Not Available'}</h6>
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
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>E-Ticket Number</td>
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
                        <div className='fticketBaggageInformation'>
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
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>7- Kgs (1 pieace only)</td>
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
                                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>MakeMyTrip</th>
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
                                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>MakeMyTrip</th>
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


                        </div>
                      </div>

                    </>
                  )}
                </div>
              ) : (
                <div>Loading ticket details...</div>
              )}
              {/* {flightticketPassengerDetails ? (
                <div className='flightTicketmain'>
                  {islcc ? (
                    // LCC Booking Details when islcc is true
                    <div>
                      <div className='flightticketboxHED'>
                      <p>{` ${bookingstatus.dep_time}`}</p>
                      <h6>{`${bookingstatus.origin} TO ${bookingstatus.destination}`}</h6>
                        <p>2h 15m</p>
                      </div>
                      <div className="flightticketboxTravelDetails">
                        <div className="ffbox1">
                          <div className='flightIndigodet'>
                            <p>{bookingstatus.airline || 'null'}</p>
                            <p>{bookingstatus.airline_code || 'Flight Number Not Available'}</p>
                          </div>
                          <div className='flightSaver'>
                            <h6>Fare Basis Code</h6>
                            <h6>{bookingstatus.fare_basis_code || 'Not Available'}</h6>
                          </div>
                        </div>
                        <div className="ffbox2">
                          <h4>{bookingstatus.origin}</h4>
                          <p className='ffbox2P1'>{bookingstatus.city_name || 'null'}</p>
                          <p className='ffbox2Time'>{new Date(bookingstatus.dep_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}, {new Date(bookingstatus.dep_time).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</p>
                          <p>{bookingstatus.origin_airport || 'Origin Airport null'}</p>
                        </div>
                        <div className="ffbox3">
                          <p>---</p>
                          <p className='ffbox3TImeborder'>2h 15m</p>
                          <p>{bookingstatus.fare_type || 'Economy'}</p>
                        </div>
                        <div className="ffbox4">
                          <h4>{bookingstatus.destination}</h4>
                          <p className='ffbox4P1'>{bookingstatus.destination_city_name || 'null'}</p>
                          <p className='ffbox2Time'>{new Date(bookingstatus.arr_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}, {new Date(bookingstatus.arr_time).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</p>
                          <p>{bookingstatus.destination_airport || 'Destination Airport null'}</p>
                        </div>
                      </div>

                      <div>
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
                              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{bookingstatus.pnr}</td>
                              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{bookingstatus.ticket_no || 'E-Ticket Number'}</td>
                              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{bookingstatus.seat_no || 'Seat No null'}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    // Non-LCC Booking Details when islcc is false
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
                            <h6>Fare Basis Code</h6>
                            <h6>{booking_hold.fare_basis_code || 'Not Available'}</h6>
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
                              <td style={{ border: '1px solid #ddd', padding: '8px' }}>E-Ticket Number</td>
                              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{booking_hold.seat_no || 'Seat No null'}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div>Loading ticket details...</div>
              )} */}
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
