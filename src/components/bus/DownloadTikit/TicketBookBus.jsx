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

const generatePasscode = () => {
  return Math.random().toString(36).substr(2, 8).toUpperCase();
};

const TicketBookBus = () => {
  const passcode = generatePasscode();
  const [buspaymentStatusResState, setBuspaymentStatusResState] = useState(null);
  // console.log("status", buspaymentStatusResState.status);
  // console.log("seatstatus", buspaymentStatusResState.seatstatus);
  // console.log("passengers", buspaymentStatusResState.passengers);
  // console.log("payment", buspaymentStatusResState.payment);
  // console.log("userdetails", buspaymentStatusResState.userdetails);


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
    const busDetail = buspaymentStatusResState.seatstatus[0];
    const userDetails = buspaymentStatusResState.status[0];

    const bookingStatus = {
      ticket_no: 'N/A',
      bus_status: 'N/A',
      amount: busDetail.base_price
    };

    console.log('Generating PDF with data:', {
      from,
      to,
      ticketNo: bookingStatus.ticket_no,
      busId: busDetail.id,
      status: bookingStatus.bus_status,
      amount: bookingStatus.amount,
      busType: busDetail.seat_type,
      departureTime: formatTime(busDetail.created_at),
      arrivalTime: 'N/A',
      travelerName: 'N/A',
      cityPointLocation: 'N/A'
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
                    <div className="top"></div>
                    <div className="row buspssngerdetails">
                      <div className="col-12">
                        <div className="row">
                        <div className='fromtoMOB'>
                            <div>
                              <strong>Bhopal{from}</strong>
                              <p>{formatTime(dd.departure_time)}</p>
                              </div>
                            <div>
                              <FaArrowRightLong style={{ marginRight: '16', marginLeft: '16' }} />
                            </div>
                            <div>
                              <strong>{to}Indore</strong>
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
                              <strong>Date -: </strong>
                              <span>{formatDate(busDetail.created_at)}</span>
                            </p>
                            <div className='fromtoWEB'>
                              <div>
                                <strong>Bhopal{from}</strong>
                                <p>{formatTime(dd.departure_time)}</p>
                              </div>
                              <div>
                                <FaArrowRightLong style={{ marginRight: '16', marginLeft: '16' }} />
                              </div>
                              <div>
                                <strong>{to}Indore</strong>
                                <p>{formatTime(dd.city_point_time)}</p>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-4 col-6">
                            <p>
                              <strong>PNR No -: </strong>
                              <span>{busDetail.bus_book_id}</span>
                            </p>
                            <p>
                              <strong>Address -: </strong>
                              <span>{dd.address}</span>
                            </p>
                            <p>
                              <strong>Number -: </strong>
                              <span>{dd.number}</span>

                            </p>
                          </div>
                          <div className="col-md-4 ticktbordr">
                            <p>
                              <strong>Seat No -: </strong>
                              <span>{busDetail.seat_name}</span>
                            </p>
                            <p className='psngeramount'>
                              <strong>Amount -: </strong>
                              <span>₹{busDetail.base_price}</span>
                            </p>
                            <Barcode className="buspasscode" value={passcode} format="CODE128" />

                          </div>
                          {/* <div className="bustickstatus">
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
                          </div> */}
                          {/* <div className="bustickstatusBTN">
                            <button onClick={downloadTicket}>
                              <CiSaveDown1 /> Download ticket
                            </button>
                            <button onClick={handleCancelTicket}>Cancel ticket</button>
                          </div> */}
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
