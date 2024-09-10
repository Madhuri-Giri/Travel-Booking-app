import { useEffect, useState, useRef } from 'react';
import jsPDF from 'jspdf';
import "jspdf-autotable";
import "./FlightNewTicket.css";
import "./FlightTickect.css";
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
import html2canvas from 'html2canvas';
import FooterLogo from "../../../assets/images/main logo.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFire, faBiohazard, faFlask, faSprayCan, faGasPump, faSmoking, faVirus, faRadiation, faBomb } from '@fortawesome/free-solid-svg-icons';
import { useLocation } from 'react-router-dom';


const generatePasscode = () => {
  return Math.random().toString(36).substr(2, 8).toUpperCase();
};

const FlightTickect = () => {
  const passcode = generatePasscode();
  const ticketElementRef = useRef(null);
  const [flightticketPassengerDetails, setflightticketPassengerDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [buttonsVisible, setButtonsVisible] = useState(true); // State to manage button visibility

  const location = useLocation();
  const { transactionNum, booking_id } = location.state || {};
  console.log("transactionNum",transactionNum);
  console.log("booking_id",booking_id);
  

  useEffect(() => {
    const fetchFlightTicketApiData = async () => {
      try {
    
        const response = await fetch("https://sajyatra.sajpe.in/admin/api/flight-ticket-history", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            transaction_num: transactionNum,
            flight_booking_id: booking_id,
          }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setflightticketPassengerDetails(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching API of flight ticket:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchFlightTicketApiData();
  }, []);

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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

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

  const { user_details, booking_details } = flightticketPassengerDetails || {};

  return (
    <>
      <CustomNavbar />
      <div className="Bus-Tikit">
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
              <div className='flightTicketmain'>
                <div className='flightticketboxHED'>
                  <h6>{formatDate(booking_details?.dep_time)}</h6>
                  <h6>{`${booking_details?.destination_city_name} TO ${booking_details?.destination_city_name}`}</h6>
                  <p>{booking_details?.baggage}</p>
                </div>
                <div className="flightticketboxTravelDetails">
                  <div className="ffbox1">
                    <div className='flightIndigodet'>
                      <p>{booking_details?.airline_code}</p>
                      <p>{booking_details?.transaction_num}</p>
                    </div>
                    <div className='flightSaver'>
                      <h6>Regular Fare</h6>
                      <h6>SAVER</h6>
                    </div>
                  </div>
                  <div className="ffbox2">
                    <h4>{booking_details?.destination}</h4>
                    <p className='ffbox2P1'>{booking_details?.destination_city_name}</p>
                    <p className='ffbox2Time'>{formatTime(booking_details?.dep_time)} hrs</p>
                    <p>{booking_details?.destination_airport}</p>
                  </div>
                  <div className="ffbox3">
                    <p>---</p>
                    <p className='ffbox3TImeborder'>{booking_details?.baggage}</p>
                    <p>Economy</p>
                  </div>
                  <div className="ffbox4">
                    <h4>{booking_details?.destination}</h4>
                    <p className='ffbox4P1'>{booking_details?.destination_city_name}</p>
                    <p className='ffbox2Time'>{formatTime(booking_details?.arr_time)} hrs</p>
                    <p>{booking_details?.destination_airport}</p>
                  </div>
                </div>
                <div className="passengerTable">
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
                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                          <strong>{user_details?.name}</strong>
                        </td>
                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>{booking_details?.pnr}</td>
                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>{booking_details?.transaction_num}</td>
                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>N/A</td>
                      </tr>
                    </tbody>
                  </table>
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
                          {/* <td style={{ border: '1px solid #ddd', padding: '8px' }}>{`${booking_details.baggage}`}</td> */}
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
              </div>

            </div>
          </div>
        </div>
      </div>
      <Footer />
      <ToastContainer />
    </>
  );
};

export default FlightTickect;
