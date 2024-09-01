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

    const doc = new jsPDF();

    // Temporarily hide the .btm div
    const btmDiv = ticketElementRef.current.querySelector('.btm');
    if (btmDiv) {
      btmDiv.style.display = 'none';
    }

    html2canvas(ticketElementRef.current, { scale: 2 }).then((canvas) => {
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
        <div className="lottie container" ref={ticketElementRef}>
          {flightticketPassengerDetails && flightticketPassengerDetails.userdetails.map((userDetail, index) => (
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
