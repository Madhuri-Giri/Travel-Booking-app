import { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import "jspdf-autotable";
import "./BusTikit.css";
import CustomNavbar from '../../../pages/navbar/CustomNavbar';
import Footer from '../../../pages/footer/Footer';
import { useSelector } from 'react-redux';
import { CiSaveDown1 } from "react-icons/ci";
import Lottie from 'lottie-react';
import busAnim from "../../../assets/images/mainBus.json";
import Barcode from 'react-barcode';
import { FaArrowRightLong } from "react-icons/fa";

const generatePasscode = () => {
  return Math.random().toString(36).substr(2, 8).toUpperCase();
};

const TicketBookBus = () => {
  const passcode = generatePasscode();
  const [buspaymentStatusResState, setBuspaymentStatusResState] = useState(null);

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
    if (!buspaymentStatusResState) {
      console.error("Missing ticket details");
      return;
    }

    const doc = new jsPDF();

    const busDetail = buspaymentStatusResState.seatstatus[0]; // Adjust based on your actual data structure
    const bookingStatus = {
      ticket_no: 'N/A', // Modify according to your actual data structure
      bus_status: 'N/A', // Modify according to your actual data structure
      amount: busDetail.base_price // Assuming amount is the same as base price for simplicity
    };

    // Debugging: Log data being used
    console.log('Generating PDF with data:', {
      from,
      to,
      ticketNo: bookingStatus.ticket_no,
      busId: busDetail.id,
      status: bookingStatus.bus_status,
      amount: bookingStatus.amount,
      busType: busDetail.seat_type,
      departureTime: formatTime(busDetail.created_at),
      arrivalTime: 'N/A', // No arrival time provided in the sample data
      travelerName: 'N/A', // No traveler name provided in the sample data
      cityPointLocation: 'N/A' // No city point location provided in the sample data
    });

    doc.text("Bus Ticket", 20, 20);

    doc.autoTable({
      startY: 30,
      head: [['Detail', 'Information']],
      body: [
        ['From:', from || 'N/A'],
        ['To:', to || 'N/A'],
        ['Ticket No:', bookingStatus.ticket_no || 'N/A'],
        ['Bus ID:', busDetail.id || 'N/A'],
        ['Status:', bookingStatus.bus_status || 'N/A'],
        ['Ticket Price:', `${bookingStatus.amount || 'N/A'} INR`],
        ['Bus Type:', busDetail.seat_type || 'N/A'],
        ['Departure Time:', formatTime(busDetail.created_at) || 'N/A'],
        ['Arrival Time:', 'N/A'],
        ['Traveler Name:', 'N/A'],
        ['City Point Location:', 'N/A'],
      ],
    });

    doc.save('bus_ticket.pdf');
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

  const handleCancelTicket = () => {
    console.log('Cancel ticket functionality not implemented yet.');
  };

  if (!buspaymentStatusResState) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <CustomNavbar />

      <div className="Bus-Tikit">
        <div className="lottie container">
          {buspaymentStatusResState.seatstatus.map((busDetail, index) => {
            console.log("busDetail", busDetail);
            
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
                              <strong>{from}</strong>
                              <p>{formatTime(busDetail.created_at)}</p>
                            </div>
                            <div>
                              <FaArrowRightLong style={{ marginRight: '16px', marginLeft: '16px' }} />
                            </div>
                            <div>
                              <strong>{to}</strong>
                              <p>{formatTime(busDetail.created_at)}</p>
                            </div>
                          </div>
                          <div className="col-md-4 col-6">
                            <p><strong>Name -: </strong><span>{busDetail.seat_name}</span></p>
                            <p><strong>Age -: </strong><span>N/A</span></p>
                            <p><strong>Gender -: </strong><span>N/A</span></p>
                            <p><strong>Date -: </strong><span>{formatDate(busDetail.created_at)}</span></p>
                            <div className='fromto'>
                              <div>
                                <strong>{from}</strong>
                                <p>{formatTime(busDetail.created_at)}</p>
                              </div>
                              <div>
                                <FaArrowRightLong style={{ marginRight: '16px', marginLeft: '16px' }} />
                              </div>
                              <div>
                                <strong>{to}</strong>
                                <p>{formatTime(busDetail.created_at)}</p>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-4 col-6">
                            <p><strong>PNR Number -: </strong><span>{busDetail.bus_book_id}</span></p>
                            <p><strong>Bus Type -: </strong><span>{busDetail.seat_type}</span></p>
                            <p><strong>Pass Code -: </strong><span>{passcode}</span></p>
                            <p><strong>Duration -: </strong><span>{busDetail.base_price}</span></p>
                          </div>
                          <div className="col-md-4 col-12 busbar">
                            <Barcode value={passcode} />
                          </div>
                          <div className='bustickstatus'>
                            <div className="top">
                              <h5>Boarding point</h5>
                              <p>{busDetail.seat_name}</p>
                            </div>
                            <div className="top">
                              <h5>Status</h5>
                              <p>{busDetail.seat_status === 1 ? 'Booked' : 'Available'}</p>
                            </div>
                            <div className="top">
                              <h5>Seat No</h5>
                              <p>{busDetail.seat_name}</p>
                            </div>
                            <div className="top">
                              <h5>Ticket No</h5>
                              <p>{busDetail.id}</p>
                            </div>
                          </div>
                          <div className='bustickstatusBTN'>
                            <button onClick={downloadTicket}>
                              <CiSaveDown1 /> Download ticket
                            </button>
                            <button onClick={handleCancelTicket}>Cancel ticket</button>
                          </div>
                        </div>
                      </div>
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

export default TicketBookBus;
