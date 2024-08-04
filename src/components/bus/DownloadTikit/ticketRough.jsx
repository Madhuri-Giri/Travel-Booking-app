import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import "./BusTikit.css";
import busTikitImg from "../../../assets/images/bus-tikit.png";

const BusTikit = () => {
  const [bookingDetails, setBookingDetails] = useState(null);
  const [passengerData, setPassengerData] = useState([]);

  // Accessing Redux state
  const { from, to} = useSelector((state) => state.bus);

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

  return (
    <div className="BusTikit">
      <div className="hed">
        <h5>Download Ticket Status</h5>
      </div>
      <div className="down">
        <div className="tikit-status">
          <div className="download-tikit">
            <div className="dest">
              <h4>{from}</h4>
              <i className="ri-arrow-left-right-line"></i>
              <h4>{to}</h4>
            </div>
            <div className="sdxfcvghb">
              <p>(CBCE-106-654)</p>
            </div>

            {/* Passenger Details */}
            <div className="tikit-details">
              <div className="t-left">
                <img src={busTikitImg} alt="" />
              </div>
              <div className="t-right">
                {passengerData.length > 0 ? (
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
                          <p>{passenger.Seat.SeatName}</p>
                          <p>{passenger.Age}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>Loading passenger data...</div>
                )}

                {/* Booking Details */}
                {bookingDetails ? (
                  <div className="details-top">
                    <div className="left">
                      <p>Ticket No.</p>
                      <p>Bus ID</p>
                      <p>Ticket Price</p>
                    </div>
                    <div className="right">
                      <p>{bookingDetails.result.data.Result.TicketNo}</p>
                      <p>{bookingDetails.result.data.Result.BusId}</p>
                      <p>{bookingDetails.result.data.Result.InvoiceAmount} INR</p>
                    </div>
                  </div>
                ) : (
                  <div>Loading booking details...</div>
                )}

                {/* Boarding Points */}
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

                {/* Dropping Points */}
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
                  <button>Download Ticket</button>
                  <button>Cancel Download</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --------------------------------------  */}
{/* 
      <div className="download-ticket-code">
        <div className="downloaded">
          <h6>Download Ticket</h6>
          <div className="down-pass">
            {passengerData.length > 0 ? (
              passengerData.map((passenger, index) => (
                <div key={index}>
                  <p>Passenger Name - <small style={{fontWeight:'lighter'}}>{passenger.FirstName}</small></p>
                  <p>Age - <small style={{fontWeight:'lighter'}}>{passenger.Age}</small></p>
                  <p>Seat No. - <small style={{fontWeight:'lighter'}}>{passenger.Seat.SeatName}</small></p>
                </div>
              ))
            ) : (
              <p>Loading passenger data...</p>
            )}
          </div>
          <h6>Ticket Details</h6>
          <div className="tik">
            {bookingDetails ? (
              <>
                <p>Ticket Number - <small style={{fontWeight:'lighter'}}>{bookingDetails.result.data.Result.TicketNo}</small></p>
                <p>Bus ID - <small style={{fontWeight:'lighter'}}>{bookingDetails.result.data.Result.BusId}</small></p>
                <p>Ticket Price - <small style={{fontWeight:'lighter'}}>{bookingDetails.result.data.Result.InvoiceAmount} INR</small></p>
              </>
            ) : (
              <p>Loading booking details...</p>
            )}
          </div>
          <h6>Bus Details</h6>
          <div className="bustik">
            {bookingDetails ? (
              <p>Bus ID - <small style={{fontWeight:'lighter'}}>{bookingDetails.result.data.Result.BusId}</small></p>
            ) : (
              <p>Loading bus details...</p>
            )}
          </div>
        </div>
      </div> */}

      
    </div>
  );
};

export default BusTikit;
