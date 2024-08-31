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

const generatePasscode = () => {
  return Math.random().toString(36).substr(2, 8).toUpperCase();
};

const FlightNewTikit = () => {
  const passcode = generatePasscode();
  const [flightticketPassengerDetails, setFlightticketPassengerDetails] = useState(null);
  const [adultPassengerDetails, setAdultPassengerDetails] = useState([]);
  const [isDownloaded, setIsDownloaded] = useState(false); // State to track download

  const from = useSelector((state) => state.bus.from);
  const to = useSelector((state) => state.bus.to);

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

    const doc = new jsPDF();
    const userDetail = adultPassengerDetails[0]; 

    doc.autoTable({
      startY: 30,
      head: [['Detail', 'Information']],
      body: [
        ['First Name:', userDetail.firstName || 'N/A'],
        ['Last Name:', userDetail.lastName || 'N/A'],
        ['Email:', userDetail.email || 'N/A'],
        ['Gender:',userDetail.gender || 'N/A'],
        ['Mobile:', userDetail.contactNo || 'N/A'],
        ['Passport:', userDetail.passportNo || 'N/A']
        ['Registration Number:', userDetail.registration_number || 'N/A'],
        ['Status:', flightticketPassengerDetails?.status === 'success' ? 'Confirmed' : 'Pending'],
      ],
    });

    doc.save('flight_ticket.pdf');
    setIsDownloaded(true); // Update state to indicate download is complete
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

  if (!flightticketPassengerDetails || !adultPassengerDetails.length) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <CustomNavbar />

      <div className="flight-Tikit">
        <div className="lottie container">
          {flightticketPassengerDetails && flightticketPassengerDetails['user details'] && (
            flightticketPassengerDetails['user details'].map((userDetail, index) => (
              <div key={index} className="row">
                <div className="col-lg-3">
                  <Lottie animationData={LootiAnim} />
                </div>
                <div className="col-lg-9">
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
                            {adultPassengerDetails[0] ? (
                              <>
                                <p><strong>First Name -: </strong><span>{adultPassengerDetails[0].firstName}</span></p>
                                <p><strong>Last Name -: </strong><span>{adultPassengerDetails[0].lastName}</span></p>
                                <p><strong>Email -: </strong><span>{adultPassengerDetails[0].email}</span></p>
                                <p><strong>Gender -: </strong><span>{adultPassengerDetails[0].gender}</span></p>
                              </>
                            ) : (
                              <p>Loading passenger details...</p>
                            )}
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
                            <p><strong>Contact No -: </strong><span>{adultPassengerDetails[0].contactNo}</span></p>
                            <p><strong>Passport No -: </strong><span>{adultPassengerDetails[0].passportNo}</span></p>
                            <p className='psngerstatus'><strong>Status -: </strong><span>{flightticketPassengerDetails?.status === 'success' ? 'Confirmed' : 'Pending'}</span></p>
                          </div>
                          <div className="col-md-4 ticktbordr">
                            <div>
                              <p><strong>Registration No -: </strong><span>{userDetail.registration_number}</span></p>
                              <p><strong>Passcode: </strong></p>
                              <Barcode className="flightpasscode" value={passcode} format="CODE128" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="btm">
                      <button className='flightdonload' onClick={downloadTicket}>
                        Download
                        <CiSaveDown1 className='icon-down' style={{ marginLeft: '5px', fontSize: '20px', fontWeight: '800' }} />
                      </button>
                      <button className='flightcncl' style={{ backgroundColor: 'red' }} onClick={handleCancelTicket}>Cancel Ticket</button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <Footer />
      <ToastContainer />
    </>
  );
};

export default FlightNewTikit;
