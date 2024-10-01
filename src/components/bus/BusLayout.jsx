import { useEffect, useState } from 'react';
import './BusLayout.css';
import BusSeatImg from '../../assets/images/bussittt.png';
import BusSeatImgSleeper from '../../assets/images/sleepImg.png';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const BusLayout = ({busType}) => {
  const [lowerSeatsBus, setLowerSeatsBus] = useState([]);
  const [upperSeatsBus, setUpperSeatsBus] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedBusSeatData, setSelectedBusSeatData] = useState([]); 
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedBoardingPoint, setSelectedBoardingPoint] = useState(null);
  const [selectedDroppingPoint, setSelectedDroppingPoint] = useState(null);
  const [boardingPoints, setBoardingPoints] = useState([]);
  const [droppingPoints, setDroppingPoints] = useState([]);
  const [loading, setLoading] = useState(false);
  const { layout, loadingg } = useSelector((state) => state.seatLayout);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  console.log('busType',busType)

  const seatDetails = layout?.Result?.SeatLayout?.SeatLayoutDetails?.Layout?.seatDetails || [];
  const totalAvailableSeats = layout?.Result?.SeatLayout?.SeatLayoutDetails?.AvailableSeats || 0;


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


// ---------------------------------------seats code -------------------------------------------------------------------------------

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


  const renderSeats = (seats) => {
    return seats.map((seat) => {
      const seatClass = seat.SeatStatus ? 'seat-available' : 'seat-disabled';
      const seatTypeClass = seat.SeatType === 2 ? 'sleeper-seat' : 'sitting-seat';
      const seatImg = seat.SeatType === 2 ? BusSeatImgSleeper : BusSeatImg;
      const isSelected = selectedSeats.includes(seat.SeatName); 

      return (
        <div
          key={seat.SeatIndex}
          className={`seat ${seatClass} ${seatTypeClass} ${isSelected ? 'selected-seat' : ''}`}
          onClick={() => handleSeatSelect(seat)}
        >
          <div className="seat-name">{seat.SeatName}</div>
          <img src={seatImg} alt={seat.SeatName} />
          <div className="seat-price-main">₹{Math.round(seat.Price.BasePrice - (seat.Price.BasePrice * 0.18))}</div>
        </div>
      );
    });
  };

  // ---------------------------------------------------------------------------------------------------------------------------------------------

  const handleProceed = () => {
    setErrorMessage("");
  
    if (selectedSeats.length === 0) {
      setErrorMessage("Please select at least one seat.");
      return;
    }
  
    if (!selectedBoardingPoint || !selectedDroppingPoint) {
      setErrorMessage("Please select both boarding and dropping points.");
      return;
    }
  
    const selectedBoardingPointDetail = boardingPoints.find(
      (point) => point.CityPointName === selectedBoardingPoint
    );
    
    const selectedDroppingPointDetail = droppingPoints.find(
      (point) => point.CityPointName === selectedDroppingPoint
    );
  
    if (selectedBoardingPointDetail && selectedDroppingPointDetail) {
      const boardingIndex = selectedBoardingPointDetail.CityPointIndex;
      const droppingIndex = selectedDroppingPointDetail.CityPointIndex;
  
      console.log('Selected Boarding Point:', selectedBoardingPoint);
      console.log('Selected Dropping Point:', selectedDroppingPoint);
      console.log('Selected Bus Seat Data:', selectedBusSeatData);
      console.log('Total Price:', totalPrice);
  
      navigate('/review-booking', {
        state: {
          selectedBoardingPoint: {
            name: selectedBoardingPoint,
            index: boardingIndex,
          },
          selectedDroppingPoint: {
            name: selectedDroppingPoint,
            index: droppingIndex,
          },
          selectedBusSeatData,
          totalPrice: Math.round(totalPrice - (totalPrice * 0.18)), 
        },
      });
    } else {
      console.error('Please select both boarding and dropping points');
    }
  };
  



  const traceId = useSelector((state) => state.bus.traceId);
  const boardHandler = () => {
    const selectedBusIndex = localStorage.getItem('selectedBusIndex');
    setLoading(true);
    const url = 'https://sajyatra.sajpe.in/admin/api/add-boarding-point';
    const data = {
      TraceId: traceId,
      ResultIndex: selectedBusIndex,
    };

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(responseData => {
        console.log('Boarding Response:', responseData);
        setBoardingPoints(responseData.GetBusRouteDetailResult.BoardingPointsDetails);
        setDroppingPoints(responseData.GetBusRouteDetailResult.DroppingPointsDetails);
      })
      .catch(error => {
        console.error('Error:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="Buslayout-Main">
      <div className="Bus-layout-new">
        {loadingg ? (
          <div style={{ marginTop: "2vmax" }} className="loading-spinner">Loading Seats...</div> 
        ) : (
          <div className="layout-bus">
              {errorMessage && <div className="error-message">{errorMessage}</div>}
              <div className='alert-msg'>please selct seats and boarding droping points before proceed.</div>
            <div className="top-main-seat">
              <span>Selected Seats: {selectedSeats.join(', ')}</span>
              <span>Available Seats: {totalAvailableSeats}</span>
            </div>




      {/* ----------------------------------------seat code ---------------------------------------------------------------- */}


            <div className="Seats-layout">
            <small>{busType}</small>

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


 {/* ---------------------------------------------------------------------------------------------------------------------------------------            */}

            <div className="bord-drop-point">
              <div className="bor-dro">
                <div className="b-ipts">
                  <select
                    value={selectedBoardingPoint}
                    onChange={(e) => setSelectedBoardingPoint(e.target.value)}
                    onFocus={boardHandler} 
                    className="boarding-select"
                  >
                    <option value="">Select Boarding Point</option>
                    {boardingPoints.map((point, index) => (
                      <option key={index} value={point.CityPointName}>
                        {point.CityPointName} 
                      </option>
                    ))}
                  </select>
                </div>

                <div className="b-ipts">
                  <select
                    value={selectedDroppingPoint}
                    onChange={(e) => setSelectedDroppingPoint(e.target.value)}
                    onFocus={boardHandler} 
                    className="dropping-select"
                  >
                    <option value="">Select Dropping Point</option>
                    {droppingPoints.map((point, index) => (
                      <option key={index} value={point.CityPointName}>
                        {point.CityPointName} 
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="seat-Price">
              <div className="price-seats">
                <h6>Total Price: </h6> 
                <h5>₹{Math.round(totalPrice - (totalPrice * 0.18))}</h5>              </div>

              
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

export default BusLayout;
