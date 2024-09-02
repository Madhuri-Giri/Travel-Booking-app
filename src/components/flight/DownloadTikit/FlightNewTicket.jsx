import { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import "jspdf-autotable";
import "./FlightNewTicket.css";
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
import { useRef } from 'react';
const generatePasscode = () => {
  return Math.random().toString(36).substr(2, 8).toUpperCase();
};

const FlightNewTikit = () => {
  const passcode = generatePasscode();
  const [flightticketPassengerDetails, setFlightticketPassengerDetails] = useState(null);
  const [adultPassengerDetails, setAdultPassengerDetails] = useState([]);
  const [isDownloaded, setIsDownloaded] = useState(false); // State to track download
  const ticketElementRef = useRef(null);
  const from = useSelector((state) => state.bus.from);
  const to = useSelector((state) => state.bus.to);
  console.log("flightticketPassengerDetails", flightticketPassengerDetails);
  const passengerDetailsFlight = flightticketPassengerDetails.userdetails
  console.log("pasenger", passengerDetailsFlight[0].name);

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
          body: JSON.stringify({ transaction_id: flightTransactionId }),
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

    const loadAdultPassengerDetails = () => {
      const details = localStorage.getItem('adultPassengerDetails');
      if (details) {
        setAdultPassengerDetails(JSON.parse(details));
        console.log('Loaded adult passenger details:', JSON.parse(details));
      } else {
        console.error("Adult passenger details not found in localStorage");
      }
    };

    fetchFlightTicketApiData();
    loadAdultPassengerDetails();
  }, []);
  const downloadTicket = () => {
    if (!adultPassengerDetails.length) {
      console.error("No adult passenger details available for download");
      return;
    }
  
    if (!ticketElementRef.current) {
      console.error("Ticket element reference is not set");
      return;
    }
  
    // Select only the flight ticket main content
    const flightTicketMain = ticketElementRef.current.querySelector('.flightTicketmain');
  
    if (!flightTicketMain) {
      console.error("Flight ticket main content not found");
      return;
    }
  
    const doc = new jsPDF();
  
    // Temporarily hide the .btm div if exists
    const btmDiv = ticketElementRef.current.querySelector('.btm');
    if (btmDiv) {
      btmDiv.style.display = 'none';
    }
  
    // Capture only the flight ticket main section
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
      // Restore the .btm div visibility
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

  const passengers = [
    { name: 'John Doe', type:'Adult', pnr: 'ABC123', eTicket: '1234567890', seat: '12A' },
  ];


  return (
    <>
      <CustomNavbar />
      <div className="flight-Tikit">
        <div className="lottie container" ref={ticketElementRef}>
          {flightticketPassengerDetails && flightticketPassengerDetails.userdetails.map((userDetail, index) => (
            <div key={index} className="row">
              <div className="col-lg-3">
                <Lottie animationData={LootiAnim} />
              </div>
              {/* <div className="col-lg-9">
                <div className='flightticktbox'>
                  <div className='flighttickthed'>
                    <h5>Flight Ticket</h5>
                  </div>
                  <div className="top"></div>
                  <div className="row flightpssngerdetails">
                    <div className="col-12">
                      <div className="row">
                        <div className='fromtoMOB'>
                          <div>
                            <strong>{from}</strong>
                            <p>{formatTime(userDetail.updated_at)}</p>
                          </div>
                          <div>
                            <FaArrowRightLong style={{ marginRight: '16', marginLeft: '16' }} />
                          </div>
                          <div>
                            <strong>{to}</strong>
                            <p>{formatTime(userDetail.created_at)}</p>
                          </div>
                        </div>
                        <div className="col-md-4 col-6">
                          <p><strong>First Name -: </strong><span>{userDetail.name}</span></p>
                        <p><strong>Email -: </strong><span>{userDetail.email}</span></p>
                          <div className='fromtoWEB'>
                            <div>
                              <strong>{from}</strong>
                              <p>{formatTime(userDetail.updated_at)}</p>
                            </div>
                            <div>
                              <FaArrowRightLong style={{ marginRight: '16', marginLeft: '16' }} />
                            </div>
                            <div>
                              <strong>{to}</strong>
                              <p>{formatTime(userDetail.created_at)}</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-4 col-6">
                          <p><strong>Contact No -: </strong><span>{userDetail.mobile}</span></p>
                          <p className=''><strong>Booking Id -: </strong><span>{flightticketPassengerDetails.payment.booking_id}</span></p>
                          <p><strong>Registration No -: </strong><span>{userDetail.registration_number}</span></p>

                        </div>
                        <div className="col-md-4 ticktbordr">
                          <div>
                            <p className='busbookconfrm'><strong>Booking -: </strong><span>{flightticketPassengerDetails.payment.payment_status}</span></p>

                            <p className='psngeramount'><strong>Amount -: </strong><span>₹{flightticketPassengerDetails.payment.amount}</span></p>
                            <Barcode className="flightpasscode" value={userDetail.token} format="CODE128" />
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
              </div> */}

              <div className="col-lg-9">
                <div className="fligthticketBtns">
                    <button className='busdonload' onClick={downloadTicket}>
                      Download
                      <CiSaveDown1 className='icon-down' style={{ marginLeft: '5px', fontSize: '20px', fontWeight: '800' }} />
                    </button>
                  </div>
                <div className='flightTicketmain'>
                  <div className='flightticketboxHED'>
                    <h6>Thu,25 May 23</h6>
                    <h6>KOLKATA TO DELHI</h6>
                    <p>2h 20m</p>
                  </div>
                  <div className="flightticketboxTravelDetails">
                    <div className="ffbox1">
                      <div className='flightIndigodet'>
                        <p>Indigo</p>
                        <p>6E-2345</p>
                      </div>
                      <div className='flightSaver'>
                        <h6>Regular Fare</h6>
                        <h6>SAVER</h6>
                      </div>
                    </div>
                    <div className="ffbox2">
                      <h4>CCU</h4>
                      <p className='ffbox2P1'>KOLKATA</p>
                      <p className='ffbox2Time'>10:10 hrs , 25 May</p>
                      <p>Netaji Sbhas Chandra Bose International Airport</p>
                    </div>
                    <div className="ffbox3">
                      <p>---</p>
                      <p className='ffbox3TImeborder'>2h 20m</p>
                      <p>Economy</p>
                    </div>
                    <div className="ffbox4">
                      <h4>DEL</h4>
                      <p className='ffbox4P1'>DELHI</p>
                      <p className='ffbox2Time'>10:10 hrs , 25 May</p>
                      <p>Indira Gandhi International AIrport. Terminal 2</p>
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
                        {passengers.map((passenger, index) => (
                          <tr key={index}>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}><strong>1. {passengerDetailsFlight[0].name}</strong> , <span style={{ color: 'grey' }}>{passenger.type}</span> </td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{passenger.pnr}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{passenger.eTicket}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{passenger.seat}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

            </div>
          ))}

        </div>
      </div>
      <Footer />
      <ToastContainer />
    </>
  );

};

export default FlightNewTikit;
