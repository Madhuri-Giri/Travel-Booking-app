
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
import sajLogo from "../../../assets/images/main logo.png"
import { useLocation } from 'react-router-dom';

const generatePasscode = () => {
  return Math.random().toString(36).substr(2, 8).toUpperCase();
};

const TicketBookBus = () => {
  const passcode = generatePasscode();
  const navigate = useNavigate()
  const location = useLocation();

  const { buspaymentStatus } = location.state || {};
  console.log('Bus payment status:', buspaymentStatus);

  // ------------------------------------------------------------------------------------------------------------------------------------

  const handleCancelTicket = async () => {
    const confirmation = window.confirm("Are you sure you want to cancel?");

    if (confirmation) {
      const storedData = JSON.parse(localStorage.getItem('buspaymentStatusRes'));

      if (!storedData || !storedData.data || !storedData.data.passengers) {
        toast.error("No passenger data found");
        return;
      }

      const { bus_id, ticket_no, transaction_num } = storedData.data.passengers;

      try {
        const response = await fetch("https://sajyatra.sajpe.in/admin/api/seat-cancel", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            BusId: bus_id,
            SeatId: ticket_no,
            Remarks: "User initiated cancellation",
            transaction_num: transaction_num
          }),
        });

        const data = await response.json(); // Parse the response data

        if (response.ok) {
          toast.success("Your ticket is canceled");
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

  // ------------------------------------------------------------------------------------------------------------------------------------


 
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



  return (
    <>
      <CustomNavbar />
      {buspaymentStatus ? (
        <div className="Bus-Tikit">
          <div className="lottie container">
            {buspaymentStatus.data.seatstatus.map((busDetail, busIndex) => (
              <div key={busIndex} className="row busticketROW">
                <div className="col-lg-3 buslottieCOL">
                  <Lottie className="buslott" animationData={busAnim} />
                </div>
                <div className="col-lg-9">
                  <div className="busticktbox">
                    <div className='bustickthed'>
                      <h5>Your Bus Ticket</h5>
                      <img style={{ position: "absolute", right: '0%', paddingTop: "0.4vmax", paddingBottom: "0.6vmax", paddingRight: "1vmax" }} width={90} src={sajLogo} alt="" />
                    </div>

                    <div className="row buspssngerdetails">
                      <div className="col-12">
                        <div className="row">
                          {buspaymentStatus.data.passengers.map((passenger, index) => (
                            <div key={index} className="col-md-4 col-6">
                              <p><strong>Name -: </strong><span>{passenger.name}</span></p>
                              <p><strong>Age -: </strong><span>{passenger.age}</span></p>
                              <p><strong>Gender -: </strong><span>{passenger.gender === "1" ? "Female" : "Male"}</span></p>
                              <p><strong>Address -: </strong><span>{passenger.address}</span></p>
                              <p><strong>Number -: </strong><span>{passenger.number}</span></p>
                              <p><strong>Date -: </strong><span>{formatDate(busDetail.created_at)}</span></p>
                            </div>
                          ))}
                          <div className="col-md-4 col-6">
  <p><strong>Bus Id -: </strong><span>{buspaymentStatus.data.status.bus_id}</span></p>
  <p><strong>Ticket No -: </strong><span>{buspaymentStatus.data.status.ticket_no}</span></p>
  <p><strong>User ID -: </strong><span>{buspaymentStatus.data.status.transaction_num}</span></p>
  <p><strong>Boarding Point -: </strong><span>{buspaymentStatus.data.passengers[0].city_point_name}</span></p>
  <p><strong>Dropping Point -: </strong><span>{buspaymentStatus.data.passengers[0].drop_city_point_name}</span></p>
</div>

                          <div className="col-md-4 ticktbordr">
                            <p><strong>Travel Name -: </strong><span>{buspaymentStatus.data.passengers[0].travel_name}</span></p>
                            <p><strong>Seat No -: </strong><span>{busDetail.seat_name}</span></p>
                            <p className='busbookconfrm'><strong>Booking -: </strong><span>{buspaymentStatus.data.status.bus_status}</span></p>
                            <p className='psngeramount'><strong>Amount -: </strong><span>₹{busDetail.base_price}</span></p>
                            <Barcode className="buspasscode" value={passcode} format="CODE128" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bus-cancel">
                      <h6>CANCELLATION POLICY</h6>
                      <div className="cancel">
                        {buspaymentStatus.data.cancelpolicy.length > 0 ? (
                          buspaymentStatus.data.cancelpolicy.map((policy, index) => (
                            <div key={index} className="policy-item">
                              <span><small>From:</small> {formatTime(policy.from_date)}</span>
                              <span><small>To:</small> {formatTime(policy.to_date)}</span>
                              <span><small>Policy:</small> {policy.policy_string}</span>
                              <span><small>Cancellation_charge:</small> {policy.cancellation_charge} {policy.cancellation_charge_type === '1' ? '%' : 'INR'}</span>
                            </div>
                          ))
                        ) : (
                          <p>No cancellation policy available.</p>
                        )}
                      </div>
                    </div>

                    <div className="btm-bus">
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
      ) : (
        <p>No booking information available.</p>
      )}
      <Footer />
    </>
  );
};

export default TicketBookBus;