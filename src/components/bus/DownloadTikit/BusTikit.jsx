import { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import "jspdf-autotable";
import "./BusTikit.css"; // Ensure your CSS file is set up correctly
import CustomNavbar from '../../../pages/navbar/CustomNavbar';
import Footer from '../../../pages/footer/Footer';
import { useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BusTikit = () => {
  const [busticketPassengerDetails, setbusticketPassengerDetails] = useState(null);

  const from = useSelector((state) => state.bus.from);
  const to = useSelector((state) => state.bus.to);

  const bus_booking_id = localStorage.getItem('bus_booking_id');
  const bus_trace_id = localStorage.getItem('bus_trace_id');

  useEffect(() => {
    const fetchbusTicketApiData = async () => {
      try {
        const response = await fetch("https://sajyatra.sajpe.in/admin/api/bus-ticket", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(
            {
              bus_booking_id: bus_booking_id,
              bus_trace_id: bus_trace_id
            }),
        });

        const data = await response.json();
        setbusticketPassengerDetails(data);
        console.log('bus ticket API Response:', data);

      } catch (error) {
        console.error("Error fetching API of bus ticket:", error);
      }
    };
    fetchbusTicketApiData();
  }, [bus_booking_id, bus_trace_id]);

  const downloadTicket = () => {
    if (!busticketPassengerDetails || busticketPassengerDetails.bus_details.length === 0) {
      console.error("Missing ticket details or passenger data");
      return;
    }

    const doc = new jsPDF();

    // Assuming the first item in bus_details contains the general details
    const busDetail = busticketPassengerDetails.bus_details[0];
    const bookingStatus = busticketPassengerDetails.booking_Status?.[0] || {};

    doc.text("Bus Ticket", 20, 20);

    doc.autoTable({
      startY: 30,
      head: [['Detail', 'Information']],
      body: [
        ['From:', from || 'N/A'],
        ['To:', to || 'N/A'],
        ['Ticket No:', bookingStatus.ticket_no || 'N/A'],
        ['Bus ID:', bookingStatus.bus_id || 'N/A'],
        ['Status:', bookingStatus.bus_status || 'N/A'],
        ['Ticket Price:', `${bookingStatus.amount || 'N/A'} INR`],
        ['Bus Type:', busDetail.bus_type || 'N/A'],
        ['Departure Time:', busDetail.departure_time || 'N/A'],
        ['Arrival Time:', busDetail.arrival_time || 'N/A'],
        ['Traveler Name:', busDetail.travel_name || 'N/A'],
        ['City Point Location:', busDetail.city_point_location || 'N/A'],
      ],
    });

    doc.save('bus_ticket.pdf');
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
            transaction_num: "null" // Provide the transaction number here
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
  
  return (
    <>
      <CustomNavbar />

      <div className="Bus-Tikit">
        <div className="b-hed">
          <h5>Download Ticket Status</h5>
        </div>
        <div className="do-wn">
          <div className="top">
            <h5>{from}-{to}</h5>
          </div>
          <div className="row buspssngerdetails">
            {busticketPassengerDetails && (
              <div className="col-12">
                {busticketPassengerDetails.bus_details.map((busDetail, index) => (
                  <div key={index}>
                    <p><strong>Passenger Name -: </strong><span>{busDetail.name}</span></p>
                    <p><strong>Age -: </strong><span>{busDetail.age}</span></p>
                    <p><strong>Gender -: </strong><span>{busDetail.gender}</span></p>
                    <p><strong>Number -: </strong><span>{busDetail.number}</span></p>
                    <p><strong>Address -: </strong><span>{busDetail.address}</span></p>
                    <p><strong>Bus Type -: </strong><span>{busDetail.bus_type}</span></p>
                    <p><strong>Departure Time -: </strong><span>{busDetail.departure_time}</span></p>
                    <p><strong>Arrival Time -: </strong><span>{busDetail.arrival_time}</span></p>
                    <p><strong>Traveller Name -: </strong><span>{busDetail.travel_name}</span></p>
                    <p><strong>City Point Location -: </strong><span>{busDetail.city_point_location}</span></p>
                  </div>
                ))}
                <div className="col-12">
                  {busticketPassengerDetails.booking_Status && busticketPassengerDetails.booking_Status.length > 0 && (
                    <div>
                      <p><strong>Ticket Number -: </strong><span>{busticketPassengerDetails.booking_Status[0].ticket_no}</span></p>
                      <p><strong>Bus ID -: </strong><span>{busticketPassengerDetails.booking_Status[0].bus_id}</span></p>
                      <p><strong>Status -: </strong><span>{busticketPassengerDetails.booking_Status[0].bus_status}</span></p>
                      <p className="psngeramount"><strong>Amount -: </strong><span>{busticketPassengerDetails.booking_Status[0].amount}</span></p>
                    </div>
                  )}
                </div>
                <div className="cancelbusticket">
                <button onClick={handleCancelTicket}>Cancel Ticket</button>
                </div>
              </div>
            )}

          </div>

          <div className="btm">
            <button onClick={downloadTicket}>DOWNLOAD <i className="ri-download-line"></i></button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default BusTikit;
