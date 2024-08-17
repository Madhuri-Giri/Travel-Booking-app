import { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import "jspdf-autotable";
import "./BusTikit.css"; // Ensure your CSS file is set up correctly
import CustomNavbar from '../../../pages/navbar/CustomNavbar';
import Footer from '../../../pages/footer/Footer';
import { useSelector } from 'react-redux';


const BusTikit = () => {
  const [bookingDetails, setBookingDetails] = useState(null);
  const [passengerData, setPassengerData] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedBusDetails, setSelectedBusDetails] = useState(null);

  const from = useSelector((state) => state.bus.from);
  const to = useSelector((state) => state.bus.to);

  useEffect(() => {
    const storedBookingDetails = localStorage.getItem('busTikitDetails');
    const storedPassengerData = localStorage.getItem('passengerData');
    const storedBusDetails = localStorage.getItem('selectedBusDetails');

    if (storedBookingDetails) {
      setBookingDetails(JSON.parse(storedBookingDetails));
    }
    if (storedPassengerData) {
      setPassengerData(JSON.parse(storedPassengerData));
    }
    if (storedBusDetails) {
      setSelectedBusDetails(JSON.parse(storedBusDetails));
    }

    const seats = JSON.parse(localStorage.getItem('selectedSeats')) || [];
    setSelectedSeats(seats);
  }, []);

  const downloadTicket = () => {
    if (!bookingDetails || passengerData.length === 0) {
      console.error("Missing booking details or passenger data");
      return;
    }

    const doc = new jsPDF();
    const { From, To } = selectedBusDetails || {};

    doc.text("Bus Ticket", 20, 20);
    doc.text(`From: ${From || 'N/A'}`, 20, 30);
    doc.text(`To: ${To || 'N/A'}`, 20, 40);
    doc.text(`Ticket No: ${bookingDetails.result.data.Result.TicketNo || 'N/A'}`, 20, 50);
    doc.text(`Bus ID: ${bookingDetails.result.data.Result.BusId || 'N/A'}`, 20, 60);
    doc.text(`Ticket Price: ${bookingDetails.result.data.Result.InvoiceAmount || 'N/A'} INR`, 20, 70);

    doc.autoTable({
      startY: 80,
      head: [['Passenger Name', 'Seat No.', 'Age']],
      body: passengerData.map((passenger, index) => [
        `${index + 1}. ${passenger.FirstName}`,
        passenger.Seat?.SeatName || 'N/A',
        passenger.Age,
      ]),
    });

    doc.save('ticket.pdf');
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
          <div className="mid">
            <div className="left">
              <h6 style={{ textTransform: "uppercase" }}>Passenger Name-</h6>
              <h6 style={{ textTransform: "uppercase" }}>Age-</h6>
              <h6 style={{ textTransform: "uppercase" }}>Seat No.-</h6>
              <h6 style={{ textTransform: "uppercase" }}>Bus Name-</h6>
              <h6 style={{ textTransform: "uppercase" }}>BusId-</h6>
              <h6 style={{ textTransform: "uppercase" }}>Boarding Point-</h6>
              <h6 style={{ textTransform: "uppercase" }}>Dropping Point-</h6>
              <h6 style={{ textTransform: "uppercase" }}>Ticket No.-</h6>
              <h6 style={{ textTransform: "uppercase" }}>Ticket Price-</h6>
            </div>
            <div className="right">
              <h6>
              {passengerData.map((passenger, index) => (
                <div key={index}>
                  <h6 style={{ fontWeight: "400" }}>{`${passenger.FirstName}`}</h6>
                  <h6 style={{ fontWeight: "400" }}>{passenger.Age}</h6>
                </div>
              ))}
              </h6>
              <h6 style={{ fontWeight: "400" }}>{selectedSeats.join(', ')}</h6>
              <h6 style={{ fontWeight: "400" }}>{selectedBusDetails?.busName}</h6>
              <h6 style={{ fontWeight: "400" }}>{bookingDetails?.result?.data?.Result?.BusId}</h6>

                <h6 style={{ fontWeight: "400" }}>
                    {selectedBusDetails && selectedBusDetails.boardingPoints && selectedBusDetails.boardingPoints.length > 0 ? (
                      selectedBusDetails.boardingPoints.map((point) => (
                        <span key={point.CityPointIndex}>{point.CityPointName}</span>
                      ))
                    ) : (
                      <p>No Boarding Points Available</p>
                    )}
                </h6>

                <h6 style={{ fontWeight: "400" }}>
                    {selectedBusDetails && selectedBusDetails.droppingPoints && selectedBusDetails.droppingPoints.length > 0 ? (
                      selectedBusDetails.droppingPoints.map((point) => (
                        <span key={point.CityPointIndex}>{point.CityPointName}</span>
                      ))
                    ) : (
                      <p>No Dropping Points Available</p>
                    )}
                </h6>

              <h6 style={{ fontWeight: "400" }}>{bookingDetails?.result?.data?.Result?.TicketNo}</h6>
              <h6 style={{ fontWeight: "400" }}>{bookingDetails?.result?.data?.Result?.InvoiceAmount} INR</h6>
            </div>
          </div>
          <div className="btm">
            <button>CANCEL</button>
            <button onClick={downloadTicket}>DOWNLOAD <i className="ri-download-line"></i></button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default BusTikit;
