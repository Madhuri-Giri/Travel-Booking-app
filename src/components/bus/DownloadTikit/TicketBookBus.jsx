
import { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import "jspdf-autotable";
import "./TicketBookBus.css";
import CustomNavbar from '../../../pages/navbar/CustomNavbar';
import Footer from '../../../pages/footer/Footer';
import { useSelector } from 'react-redux';
import { CiSaveDown1 } from "react-icons/ci";
import Lottie from 'lottie-react';
import busAnim from "../../../assets/images/mainBus.json";
import Barcode from 'react-barcode';
import { FaArrowRightLong } from "react-icons/fa6";
import JsBarcode from 'jsbarcode';
import { toast, ToastContainer } from 'react-toastify';
import html2canvas from 'html2canvas'; // Import html2canvas
import { useNavigate } from 'react-router-dom';

const generatePasscode = () => {
  return Math.random().toString(36).substr(2, 8).toUpperCase();
};

const TicketBookBus = () => {
  const passcode = generatePasscode();
  const navigate = useNavigate()
  const [buspaymentStatusResState, setBuspaymentStatusResState] = useState(null);

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

        const data = await response.json(); // Parse the response data

        if (response.ok) {
          toast.success("Your ticket is canceled");
          // console.log("Your ticket is canceled");
          console.log("bus-new-cancel response:", data);
          navigate('/bus-search'); 
        } else {
          toast.error("Failed to cancel the ticket");
          console.log("Failed to cancel the ticket. Response Data:", data);
        }
      } catch (error) {
        console.error("Error canceling the ticket:", error);
        toast.error("An error occurred while canceling the ticket");
      }
    } else {
      console.log("Ticket cancellation aborted");
    }
  };

  const from = useSelector((state) => state.bus.from);
  const to = useSelector((state) => state.bus.to);

  useEffect(() => {
    const storedData = localStorage.getItem("buspaymentStatusRes");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setBuspaymentStatusResState(parsedData.data);
      console.log('Bus payment status response from localStorage:', parsedData.data);
    } else {
      console.error('No buspaymentStatusRes data found in localStorage');
    }
  }, []);

  const downloadTicket = () => {
    const ticketElement = document.querySelector('.busticktbox'); 
    if (!ticketElement) {
      console.error("Ticket box not found!");
      return;
    }

    const btmDiv = ticketElement.querySelector('.btm');
    if (btmDiv) {
      btmDiv.style.display = 'none';
    }

    html2canvas(ticketElement, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('bus_ticket.pdf');
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

  if (!buspaymentStatusResState) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <CustomNavbar />

      <div className="Bus-Tikit">
        <div className="lottie container">
          {buspaymentStatusResState.seatstatus.map((busDetail, busIndex) => (
            buspaymentStatusResState.status.map((dd, ddIndex) => (
              <div key={`busticketROW-${busIndex}-${ddIndex}`} className="row busticketROW">
                <div className="col-lg-3 buslottieCOL">
                  <Lottie className="buslott" animationData={busAnim} />
                </div>
                <div className="col-lg-9">
                  <div className="busticktbox">
                    <div className="bustickthed">
                      <h5>Bus Ticket</h5>
                    </div>
                    {/* ----------------------------------------------- */}
                    <div className="last-line">
                              <small><i className="ri-phone-fill"></i> Company No:-</small>
                              <small><i className="ri-phone-fill"></i> Help Line No:-</small>
                    </div>
{/* ----------------------------------------------- */}
                    <div className="top">
                    </div>
                    <div className="row buspssngerdetails">
                      <div className="col-12">
                        <div className="row">
                          <div className='fromtoMOB'>
                            <div>
                              <strong>{from}</strong>
                              <p>{formatTime(dd.departure_time)}</p>
                            </div>
                            <div>
                              <FaArrowRightLong style={{ marginRight: '16', marginLeft: '16' }} />
                            </div>
                            <div>
                              <strong>{to}</strong>
                              <p>{formatTime(dd.city_point_time)}</p>
                            </div>
                          </div>
                          <div className="col-md-4 col-6">
                            <p>
                              <strong>Name -: </strong>
                              <span>{dd.name}</span>
                            </p>
                            <p>
                              <strong>Age -: </strong>
                              <span>{dd.age}</span>
                            </p>
                            <p>
                              <strong>Gender -: </strong>
                              <span>{dd.gender}</span>
                            </p>
                            <p>
                              <strong>Address -: </strong>
                              <span>{dd.address}</span>
                            </p>
                            <p>
                              <strong>Number -: </strong>
                              <span>{dd.number}</span>
                            </p>
                            <p>
                              <strong>Date -: </strong>
                              <span>{formatDate(busDetail.created_at)}</span>
                            </p>
                            <div className='fromtoWEB'>
                              <div>
                                <strong>{from}</strong>
                                <p>{formatTime(dd.departure_time)}</p>
                              </div>
                              <div>
                                <FaArrowRightLong style={{ marginRight: '16', marginLeft: '16' }} />
                              </div>
                              <div>
                                <strong>{to}</strong>
                                <p>{formatTime(dd.city_point_time)}</p>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-4 col-6">
                          <p>
    <strong>Bus Id -: </strong>
    <span>{buspaymentStatusResState.passengers.bus_id}</span>
  </p>
  <p>
    <strong>Ticket No -: </strong>
    <span>{buspaymentStatusResState.passengers.ticket_no}</span>
  </p>
  <p>
    <strong>User ID -: </strong>
    <span>{buspaymentStatusResState.passengers.transaction_num}</span>
  </p>
  
                           
                          </div>
                          <div className="col-md-4 ticktbordr">
                          <p>
                              <strong>Travel Name -: </strong>
                              <span>{dd.travel_name}</span>
                            </p>
                            <p>
                              <strong>Seat No -: </strong>
                              <span>{busDetail.seat_name}</span>
                            </p>
                            <p className='busbookconfrm'>
                              <strong>Booking -: </strong>
                              <span>{buspaymentStatusResState.passengers.bus_status}</span>
                            </p>
                            <p className='psngeramount'>
                              <strong>Amount -: </strong>
                              <span>₹{busDetail.base_price}</span>
                            </p>
                            <Barcode className="buspasscode" value={passcode} format="CODE128" />
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
                </div>
              </div>
            ))
          ))}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default TicketBookBus;
