import { useEffect, useState } from 'react';
import './Test.css';
import BusSeatImg from '../../assets/images/bussittt.png';
import BusSeatImgSleeper from '../../assets/images/sleepImg.png';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Test = () => {
  const [lowerSeatsBus, setLowerSeatsBus] = useState([]);
  const [upperSeatsBus, setUpperSeatsBus] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedBusSeatData, setSelectedBusSeatData] = useState([]); 
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedBoardingPoint, setSelectedBoardingPoint] = useState(null);
  const [selectedDroppingPoint, setSelectedDroppingPoint] = useState(null);
  const { layout, loadingg } = useSelector((state) => state.seatLayout);
  const navigate = useNavigate();

  const seatDetails = layout?.Result?.SeatLayout?.SeatLayoutDetails?.Layout?.seatDetails || [];
  const totalAvailableSeats = layout?.Result?.SeatLayout?.SeatLayoutDetails?.AvailableSeats || 0; // Get total available seats

  useEffect(() => {
    if (seatDetails.length > 0) {
      let upperSeats = [];
      let lowerSeats = [];

      seatDetails.forEach(seatArray => {
        seatArray.forEach(seat => {
          if (seat.IsUpper) {
            upperSeats.push(seat);
          } else {
            lowerSeats.push(seat);
          }
        });
      });

      lowerSeats.sort((a, b) => a.SeatName.localeCompare(b.SeatName));
      upperSeats.sort((a, b) => a.SeatName.localeCompare(b.SeatName));

      setLowerSeatsBus(lowerSeats);
      setUpperSeatsBus(upperSeats);
    }
  }, [seatDetails]);

  const boardingPoints = [
    'Select Boarding Point',
    'Point A',
    'Point B',
    'Point C'
  ];

  const droppingPoints = [
    'Select Dropping Point',
    'Point D',
    'Point E',
    'Point F'
  ];

  const handleSeatSelect = (seat) => {
    if (!seat.SeatStatus) return;

    const seatName = seat.SeatName;
    const seatObject = [...lowerSeatsBus, ...upperSeatsBus].find(seat => seat.SeatName === seatName);

    if (seatObject) {
      let updatedBusSeatData = [...selectedBusSeatData];

      if (selectedSeats.includes(seatName)) {
        updatedBusSeatData = updatedBusSeatData.filter(seat => seat.SeatName !== seatName);
      } else {
        updatedBusSeatData.push(seatObject);
      }
      setSelectedBusSeatData(updatedBusSeatData);
    }

    const isSelected = selectedSeats.includes(seatName);
    const price = seat.Price.BasePrice;

    setSelectedSeats((prevSeats) => {
      const newSeats = isSelected
        ? prevSeats.filter((seat) => seat !== seatName)
        : [...prevSeats, seatName];

      localStorage.setItem('selectedSeatCount', newSeats.length);

      return newSeats;
    });

    setTotalPrice((prevTotal) => {
      return isSelected ? prevTotal - price : prevTotal + price;
    });
  };

  const renderSeats = (seats) => {
    return seats.map((seat) => {
      const seatClass = seat.SeatStatus ? 'seat-available' : 'seat-disabled';
      const seatTypeClass = seat.SeatType === 2 ? 'sleeper-seat' : 'sitting-seat';
      const seatImg = seat.SeatType === 2 ? BusSeatImgSleeper : BusSeatImg;
      const isSelected = selectedSeats.includes(seat.SeatName); // Check if the seat is selected
  
      return (
        <div
          key={seat.SeatIndex}
          className={`seat ${seatClass} ${seatTypeClass} ${isSelected ? 'selected-seat' : ''}`} // Add 'selected-seat' class if selected
          onClick={() => handleSeatSelect(seat)}
        >
          <div className="seat-name">{seat.SeatName}</div>
          <img src={seatImg} alt={seat.SeatName} />
          <div className="seat-price-main">₹{Math.round(seat.Price.BasePrice)}</div>
        </div>
      );
    });
  };

  const handleProceed = () => {
    if (selectedBoardingPoint && selectedDroppingPoint) {
      console.log('Selected Boarding Point:', selectedBoardingPoint);
      console.log('Selected Dropping Point:', selectedDroppingPoint);
      console.log('Selected Bus Seat Data:', selectedBusSeatData);
      console.log('Total Price:', totalPrice);

      navigate('/review-booking', {
        state: {
          selectedBoardingPoint,
          selectedDroppingPoint,
          selectedBusSeatData,
          totalPrice: Math.round(totalPrice)
        }
      });
    } else {
      console.error('Please select both boarding and dropping points');
    }
  };

  return (
    <div className="Buslayout-Main">
      <div className="Bus-layout-new">
        {loadingg ? (
          <div style={{ marginTop: "2vmax" }} className="loading-spinner">Loading Seats...</div> 
        ) : (
          <div className="layout-bus">
            <div className="top-main-seat">
              <span>Selected Seats: {selectedSeats.join(', ')}</span> {/* Display selected seats */}
              <span>Available Seats: {totalAvailableSeats}</span> {/* Display total available seats */}
            </div>
            <div className="Seats-layout">
              <div className="lower-seats">
                <h6>Lower Seats</h6>
                {lowerSeatsBus.length > 0 ? (
                  <div className="seat-row">
                    {renderSeats(lowerSeatsBus)}
                  </div>
                ) : (
                  <div className="error-message">No Lower Seats Available</div>
                )}
              </div>
              <div className="upper-seats">
                <h6>Upper Seats</h6>
                {upperSeatsBus.length > 0 ? (
                  <div className="seat-row">
                    {renderSeats(upperSeatsBus)}
                  </div>
                ) : (
                  <div className="error-message">No Upper Seats Available</div>
                )}
              </div>
            </div>

            <div className="bord-drop-point">
              <div className="bor-dro">
                <div className="b-ipts">
                  <select
                    value={selectedBoardingPoint}
                    onChange={(e) => setSelectedBoardingPoint(e.target.value)}
                    className="boarding-select"
                  >
                    {boardingPoints.map((point, index) => (
                      <option key={index} value={point}>
                        {point}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="b-ipts">
                  <select
                    value={selectedDroppingPoint}
                    onChange={(e) => setSelectedDroppingPoint(e.target.value)}
                    className="dropping-select"
                  >
                    {droppingPoints.map((point, index) => (
                      <option key={index} value={point}>
                        {point}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="seat-Price">
              <div className="price-seats">
                <h6>Total Price: </h6> 
                <h5>₹{Math.round(totalPrice)}</h5>
              </div>

              <div className="proceed-btm">
                <button
                  onClick={handleProceed}
                  disabled={selectedSeats.length === 0 || !selectedBoardingPoint || !selectedDroppingPoint}
                  style={{
                    backgroundColor: selectedSeats.length === 0 || !selectedBoardingPoint || !selectedDroppingPoint ? '#ccc' : '#007bff',
                    color: selectedSeats.length === 0 || !selectedBoardingPoint || !selectedDroppingPoint ? '#666' : '#fff',
                    cursor: selectedSeats.length === 0 || !selectedBoardingPoint || !selectedDroppingPoint ? 'not-allowed' : 'pointer',
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '4px'
                  }}
                >
                  Proceed
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Test;
