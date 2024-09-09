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
import html2canvas from 'html2canvas'; // Import html2canvas
import { useNavigate } from 'react-router-dom';
import { BsDatabaseAdd } from 'react-icons/bs';

const generatePasscode = () => {
  return Math.random().toString(36).substr(2, 8).toUpperCase();
};

const BusTikit = () => {
  const passcode = generatePasscode();
  const navigate = useNavigate()
  const [busticketPassengerDetails, setBusticketPassengerDetails] = useState(null);

  const from = useSelector((state) => state.bus.from);
  const to = useSelector((state) => state.bus.to);

  const bus_booking_id = localStorage.getItem('bus_booking_id');
  const bus_trace_id = localStorage.getItem('bus_trace_id');

  const storedAmount = localStorage.getItem('BusBookingAmount');
  console.log('Stored Booking Amount:', storedAmount);

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

  // Modified downloadTicket function to capture the busticktbox design excluding the .btm div
  const downloadTicket = () => {
    const ticketElement = document.querySelector('.busticktbox'); // Select the busticktbox element
    if (!ticketElement) {
      console.error("Ticket box not found!");
      return;
    }

    // Temporarily hide the .btm div
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

        const data = await response.json(); 


        if (response.ok) {
          toast.success("Your ticket is canceled");
          // console.log("Your ticket is canceled");
          console.log('bus-old cancel Response', data)
          navigate('/bus-search')
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
                     {/* ----------------------------------------------- */}
                     <div className="last-line">
                              <small><i className="ri-phone-fill"></i> Company No:-</small>
                              <small><i className="ri-phone-fill"></i> Help Line No:-</small>
                    </div>
{/* ----------------------------------------------- */}
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
                              <p className='busbookconfrm'><strong>Booking -: </strong><span>{busticketPassengerDetails.booking_status[0].bus_status || 'N/A'}</span></p>
                              {/* <p><strong>Booking Id -: </strong><span>{seatDetail ? seatDetail.bus_book_id : 'N/A'}</span></p> */}
                              {/* <p className="psngeramount"><strong>Amount -: </strong><span>₹{storedAmount}</span></p> */}
                              {/* <p><strong>Passcode: </strong></p> */}
                              <Barcode className="buspasscode" value={passcode} format="CODE128" />
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
      </div>
      <Footer />
    </>
  );
};

export default BusTikit;
