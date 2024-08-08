import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import jsPDF from 'jspdf';
import "jspdf-autotable";
import "./BusTikit.css";
import busTikitImg from "../../../assets/images/bus-tikit.png";

const BusTikit = () => {
  const [bookingDetails, setBookingDetails] = useState(null);
  const [passengerData, setPassengerData] = useState([]);

  // Accessing Redux state
  const { from, to } = useSelector((state) => state.bus);
  const boardingPoints = useSelector((state) => state.bus.boardingPoints);
  const droppingPoints = useSelector((state) => state.bus.droppingPoints);

  useEffect(() => {
    const storedBookingDetails = localStorage.getItem('busTikitDetails');
    if (storedBookingDetails) {
      setBookingDetails(JSON.parse(storedBookingDetails));
    }

    const storedPassengerData = localStorage.getItem('passengerData');
    if (storedPassengerData) {
      setPassengerData(JSON.parse(storedPassengerData));
    }
  }, []);

  const downloadTicket = () => {
    if (!bookingDetails || passengerData.length === 0) {
      console.error("Missing booking details or passenger data");
      return;
    }

    const doc = new jsPDF();

    doc.text("Bus Ticket", 20, 20);
    doc.text(`From: ${from}`, 20, 30);
    doc.text(`To: ${to}`, 20, 40);
    doc.text(`Ticket No: ${bookingDetails?.result?.data?.Result?.TicketNo || 'N/A'}`, 20, 50);
    doc.text(`Bus ID: ${bookingDetails?.result?.data?.Result?.BusId || 'N/A'}`, 20, 60);
    doc.text(`Ticket Price: ${bookingDetails?.result?.data?.Result?.InvoiceAmount || 'N/A'} INR`, 20, 70);

    doc.autoTable({
      startY: 80,
      head: [['Passenger Name', 'Seat No.', 'Age']],
      body: passengerData.map((passenger, index) => [
        `${index + 1}. ${passenger.FirstName}`,
        passenger.Seat?.SeatName || 'N/A',
        passenger.Age,
      ]),
    });

    if (boardingPoints.length > 0) {
      doc.autoTable({
        startY: doc.previousAutoTable.finalY + 10,
        head: [['Boarding Points']],
        body: boardingPoints.map((point, index) => [`${index + 1}. ${point.CityPointName}`]),
      });
    }

    if (droppingPoints.length > 0) {
      doc.autoTable({
        startY: doc.previousAutoTable.finalY + 10,
        head: [['Dropping Points']],
        body: droppingPoints.map((point, index) => [`${index + 1}. ${point.CityPointName}`]),
      });
    }

    doc.save('ticket.pdf');
  };

  const isDataMissing = !bookingDetails || passengerData.length === 0;

  return (
    <div className="BusTikit">
      <div className="hed">
        <h5>Download Ticket Status</h5>
      </div>
      <div className="down">
        <div className="tikit-status">
          <div className="download-tikit">
            <div className="dest">
              <h4>{from || 'Bhopal'}</h4>
              <i className="ri-arrow-left-right-line"></i>
              <h4>{to || 'Indore'}</h4>
            </div>
            <div className="sdxfcvghb">
              <p>(CBCE-106-654)</p>
            </div>

            <div className="tikit-details">
              <div className="t-left">
                <img src={busTikitImg} alt="" />
              </div>
              <div className="t-right">
                {isDataMissing ? (
                  <div style={{ color: 'red' }}>Data Not Found</div>
                ) : (
                  <>
                    <div className="details-top">
                      <div className="left">
                        <p>Passenger Name</p>
                        <p>Seat No.</p>
                        <p>Age</p>
                      </div>
                      <div className="right">
                        {passengerData.map((passenger, index) => (
                          <div key={index} className="passenger-info">
                            <p>{`${index + 1}. ${passenger.FirstName}`}</p>
                            <p>{passenger.Seat ? passenger.Seat.SeatName : 'N/A'}</p>
                            <p>{passenger.Age}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="details-top">
                      <div className="left">
                        <p>Ticket No.</p>
                        <p>Bus ID</p>
                        <p>Ticket Price</p>
                      </div>
                      <div className="right">
                        <p>{bookingDetails.result.data.Result.TicketNo}</p>
                        <p>{bookingDetails.result.data.Result.BusId}</p>
                        <p>{bookingDetails.result.data.Result.InvoiceAmount}INR</p>
                      </div>
                    </div>

                    {boardingPoints.length > 0 && (
                      <div className="details-top">
                        <div className="left">
                          <p>Boarding Point</p>
                        </div>
                        <div className="right">
                          {boardingPoints.map((point, index) => (
                            <p key={index}>{`${index + 1}. ${point.CityPointName}`}</p>
                          ))}
                        </div>
                      </div>
                    )}

                    {droppingPoints.length > 0 && (
                      <div className="details-top">
                        <div className="left">
                          <p>Dropping Point</p>
                        </div>
                        <div className="right">
                          {droppingPoints.map((point, index) => (
                            <p key={index}>{`${index + 1}. ${point.CityPointName}`}</p>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="detils-dowm">
                      <button onClick={downloadTicket}>Download Ticket</button>
                      <button>Cancel Download</button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusTikit;
