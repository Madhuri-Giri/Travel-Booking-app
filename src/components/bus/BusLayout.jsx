import { useEffect, useState } from 'react';
import './BusLayout.css';
import BusSeatImg from '../../assets/images/bussit.png';
// import BusSeatImgSleeper from '../../assets/images/car-seat.png';
import BusSeatImgSleeper from '../../assets/images/sleepImg.png';
import { useNavigate } from 'react-router-dom';
import { MdAirlineSeatReclineNormal } from "react-icons/md";
import Loading from '../../pages/loading/Loading';
import BoardAndDrop from "../bus/BoardAndDrop";

const BusLayout = () => {
  const navigate = useNavigate();
  const [lowerSeatsBus, setlowerSeatsBus] = useState([]);
  const [upperSeatsBus, setupperSeatsBus] = useState([]);

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [lowerBasePrices, setLowerBasePrices] = useState([]);
  const [lowerSeatNames, setLowerSeatNames] = useState([]);
  const [upperBasePrices, setUpperBasePrices] = useState([]);
  const [upperSeatNames, setUpperSeatNames] = useState([]);
  const [availableSeats, setAvailableSeats] = useState(0);
  const [loading, setLoading] = useState(false);
  const [boardingSelected, setBoardingSelected] = useState(false);
  const [droppingSelected, setDroppingSelected] = useState(false);

  // for seat tabs
  const [activeTab, setActiveTab] = useState('lower');

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    const busLayoutResponse = JSON.parse(localStorage.getItem('BuslayoutResponse')) || {};

    console.log("BuslayoutResponse", busLayoutResponse);

    const lowerSeats = (busLayoutResponse.Result || []).flat();
    const upperSeats = (busLayoutResponse.ResultUpperSeat || []).flat();
    const availableSeats = busLayoutResponse.AvailableSeats;
    setAvailableSeats(availableSeats);
    setlowerSeatsBus(lowerSeats);
    setupperSeatsBus(upperSeats);

    console.log("UpperSeat", upperSeats);
    console.log("LowerSeat", lowerSeats);

    const extractedLowerBasePrices = lowerSeats.map(seat => seat.Price.BasePrice);
    const extractedLowerSeatNames = lowerSeats.map(seat => seat.SeatName);
    const extractedUpperBasePrices = upperSeats.map(seat => seat.Price.BasePrice);
    const extractedUpperSeatNames = upperSeats.map(seat => seat.SeatName);

    setLowerBasePrices(extractedLowerBasePrices);
    setLowerSeatNames([...new Set(extractedLowerSeatNames)]); // Remove duplicates
    setUpperBasePrices(extractedUpperBasePrices);
    setUpperSeatNames([...new Set(extractedUpperSeatNames)]); // Remove duplicates
  }, []);

  const getLowerBasePrice = (seatName) => {
    const index = lowerSeatNames.indexOf(seatName);
    if (index !== -1) {
      const basePrice = lowerBasePrices[index];
      return basePrice - (basePrice * 0.18);
    }
    return null;
  };

  const getUpperBasePrice = (seatName) => {
    const index = upperSeatNames.indexOf(seatName);
    if (index !== -1) {
      const basePrice = upperBasePrices[index];
      return basePrice - (basePrice * 0.18);
    }
    return null;
  };

  const handleSeatSelect = (seatName) => {
    // Find the seat object based on the seatName
    const seatObject = [...lowerSeatsBus, ...upperSeatsBus].find(seat => seat.SeatName === seatName);

    if (seatObject) {
      let selectedSeatsData = JSON.parse(localStorage.getItem('selectedBusSeatData')) || [];

      if (selectedSeats.includes(seatName)) {
        // If seat is already selected, remove it from selectedSeatsData
        selectedSeatsData = selectedSeatsData.filter(seat => seat.SeatName !== seatName);
      } else {
        // If seat is not selected, add it to selectedSeatsData
        selectedSeatsData.push(seatObject);
      }

      // Save the updated array to localStorage
      localStorage.setItem('selectedBusSeatData', JSON.stringify(selectedSeatsData));
      console.log("Updated selected seat objects:", selectedSeatsData);
    } else {
      console.log("Seat object not found");
    }

    const isSelected = selectedSeats.includes(seatName);
    const price = getLowerBasePrice(seatName) || getUpperBasePrice(seatName) || 0;

    setSelectedSeats((prevSeats) => {
      if (isSelected) {
        return prevSeats.filter((seat) => seat !== seatName);
      } else {
        return [...prevSeats, seatName];
      }
    });

    setTotalPrice((prevTotal) => {
      return isSelected ? prevTotal - price : prevTotal + price;
    });
  };



  const handleProceed = async () => {
    if (!boardingSelected || !droppingSelected) {
      alert('Please select both boarding and dropping points before proceeding.');
      return;
    }

    setLoading(true);
    try {
      const traceId = localStorage.getItem('traceId');
      const resultIndex = localStorage.getItem('resultIndex');

      if (!traceId || !resultIndex) {
        throw new Error('TraceId or ResultIndex not found in localStorage');
      }

      localStorage.setItem('selectedSeats', JSON.stringify(selectedSeats));
      localStorage.setItem('totalPrice', totalPrice);

      const response = await fetch('https://sajyatra.sajpe.in/admin/api/addboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ResultIndex: resultIndex,
          TraceId: traceId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add seat layout');
      }

      const data = await response.json();
      console.log('bord-drop API Response:', data);
      navigate('/review-booking');
    } catch (error) {
      console.error('Error adding seat layout:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBoardingSelect = (point) => {
    setBoardingSelected(true);
  };

  const handleDroppingSelect = (point) => {
    setDroppingSelected(true);
  };

  if (loading) {
    return <Loading />;
  }

  const [seatType, setSeatType] = useState('Sitting'); // Default value

  const handleSeatTypeChange = (event) => {
    setSeatType(event.target.value);
    // You can add additional logic here if needed when the seat type changes
  };


  return (
    <div className="BusLayout">
      <div className="Seat-layout">
        <div className="seats">
          <div className="seat-type-dropdown">
            <label htmlFor="seatType">Seat Type: </label>
            <select id="seatType" value={seatType} onChange={handleSeatTypeChange}>
              <option value="Sitting">Sitting</option>
              <option value="Sleeper">Sleeper</option>
            </select>
          </div>
          <div className="left">
            <div className="left-top">
              <h6>SELECT BUS SEATS</h6>
              <p><MdAirlineSeatReclineNormal /> available seats ({availableSeats})</p>
            </div>
            <div className='sel'>please selct seats and boarding droping points before proceed.</div>

            <div className="left-btm">


              <div className='busseatTabs'>
                {/* Tab Buttons */}
                <div className="tabs busseatTabsBTN">
                  <button
                    className={activeTab === 'lower' ? 'active' : ''}
                    onClick={() => handleTabClick('lower')}
                  >
                    Lower Seats
                  </button>
                  <button
                    className={activeTab === 'upper' ? 'active' : ''}
                    onClick={() => handleTabClick('upper')}
                  >
                    Upper Seats
                  </button>
                </div>

                {/* Tab Content */}
                {activeTab === 'lower' && seatType === 'Sitting' && (
                  <div className="lower sittingSeat">
                    <div className="sit">
                      {lowerSeatNames.map((seatName) => {
                        const seatObject = lowerSeatsBus.find(seat => seat.SeatName === seatName);
                        if (!seatObject) return null;

                        const isSelected = selectedSeats.includes(seatName);
                        const basePrice = getLowerBasePrice(seatName);
                        const isDisabled = basePrice === null;

                        return (
                          <div
                            onClick={!isDisabled ? () => handleSeatSelect(seatName) : undefined}
                            style={{
                              backgroundColor: isSelected ? '#ccc' : isDisabled ? '#f0f0f0' : 'transparent',
                              pointerEvents: isDisabled ? 'none' : 'auto',
                            }}
                            className={`sit-img ${seatObject.isLastRow ? 'last-row' : seatObject.seatIndex % 4 === 2 ? 'aisle' : ''} ${isDisabled ? 'disabled' : ''}`}
                            key={seatName}
                          >
                            <span>{seatName}</span>
                            <img width={25} src={BusSeatImg} alt="seat" />
                            <p>₹{basePrice !== null ? `${basePrice.toFixed(2)}` : 'N/A'}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {activeTab === 'lower' && seatType === 'Sleeper' && (
                  <div className="lower sleeperSeat">
                    <div className="sit">
                      {lowerSeatNames.map((seatName) => {
                        const seatObject = lowerSeatsBus.find(seat => seat.SeatName === seatName);
                        if (!seatObject) return null;

                        const isSelected = selectedSeats.includes(seatName);
                        const basePrice = getLowerBasePrice(seatName);
                        const isDisabled = basePrice === null;

                        return (
                          <div
                            onClick={!isDisabled ? () => handleSeatSelect(seatName) : undefined}
                            style={{
                              backgroundColor: isSelected ? '#ccc' : isDisabled ? '#f0f0f0' : 'transparent',
                              pointerEvents: isDisabled ? 'none' : 'auto',
                            }}
                            className={`sit-img ${seatObject.isLastRow ? 'last-row' : seatObject.seatIndex % 4 === 2 ? 'aisle' : ''} ${isDisabled ? 'disabled' : ''}`}
                            key={seatName}
                          >
                            <span>{seatName}</span>
                            <img width={45} src={BusSeatImgSleeper} alt="seat" />
                            <p>₹{basePrice !== null ? `${basePrice.toFixed(2)}` : 'N/A'}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {activeTab === 'upper' && seatType === 'Sitting' && (
                  <div className="upper sittingSeat">
                    <div className="sit">
                      {upperSeatNames.map((seatName) => {
                        const seatObject = upperSeatsBus.find(seat => seat.SeatName === seatName);
                        if (!seatObject) return null;

                        const isSelected = selectedSeats.includes(seatName);
                        const basePrice = getUpperBasePrice(seatName);
                        const isDisabled = basePrice === null;

                        return (
                          <div
                            onClick={!isDisabled ? () => handleSeatSelect(seatName) : undefined}
                            style={{
                              backgroundColor: isSelected ? '#ccc' : isDisabled ? '#f0f0f0' : 'transparent',
                              pointerEvents: isDisabled ? 'none' : 'auto',
                            }}
                            className={`sit-img ${seatObject.isLastRow ? 'last-row' : seatObject.seatIndex % 4 === 2 ? 'aisle' : ''} ${isDisabled ? 'disabled' : ''}`}
                            key={seatName}
                          >
                            <span>{seatName}</span>
                            <img width={25} src={BusSeatImg} alt="seat" />
                            <p>₹{basePrice !== null ? `${basePrice.toFixed(2)}` : 'N/A'}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {activeTab === 'upper' && seatType === 'Sleeper' && (
                  <div className="upper sleeperSeat">
                    <div className="sit">
                      {upperSeatNames.map((seatName) => {
                        const seatObject = upperSeatsBus.find(seat => seat.SeatName === seatName);
                        if (!seatObject) return null;

                        const isSelected = selectedSeats.includes(seatName);
                        const basePrice = getUpperBasePrice(seatName);
                        const isDisabled = basePrice === null;

                        return (
                          <div
                            onClick={!isDisabled ? () => handleSeatSelect(seatName) : undefined}
                            style={{
                              backgroundColor: isSelected ? '#ccc' : isDisabled ? '#f0f0f0' : 'transparent',
                              pointerEvents: isDisabled ? 'none' : 'auto',
                            }}
                            className={`sit-img ${seatObject.isLastRow ? 'last-row' : seatObject.seatIndex % 4 === 2 ? 'aisle' : ''} ${isDisabled ? 'disabled' : ''}`}
                            key={seatName}
                          >
                            <span>{seatName}</span>
                            <img width={45} src={BusSeatImgSleeper} alt="seat" />
                            <p>₹{basePrice !== null ? `${basePrice.toFixed(2)}` : 'N/A'}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

              </div>

              {seatType === 'Sitting' && (
                <>
                  <div className="lower lowerSeatWEB sittingSeat">
                    <h6>Lower Seats</h6>
                    <div className="sit">
                      {lowerSeatNames.map((seatName) => {
                        const seatObject = lowerSeatsBus.find(seat => seat.SeatName === seatName);
                        if (!seatObject) return null;

                        const isSelected = selectedSeats.includes(seatName);
                        const basePrice = getLowerBasePrice(seatName);
                        const isDisabled = basePrice === null;

                        return (
                          <div
                            onClick={!isDisabled ? () => handleSeatSelect(seatName) : undefined}
                            style={{
                              backgroundColor: isSelected ? '#ccc' : isDisabled ? '#f0f0f0' : 'transparent',
                              pointerEvents: isDisabled ? 'none' : 'auto',
                            }}
                            className={`sit-img ${seatObject.isLastRow ? 'last-row' : seatObject.seatIndex % 4 === 2 ? 'aisle' : ''} ${isDisabled ? 'disabled' : ''}`}
                            key={seatName}
                          >
                            <span>{seatName}</span>
                            <img width={30} src={BusSeatImg} alt="seat" />
                            <p>₹{basePrice !== null ? `${basePrice.toFixed(2)}` : 'N/A'}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="upper upperSeatWEB sittingSeat">
                    <h6>Upper Seats</h6>
                    <div className="sit">
                      {upperSeatNames.map((seatName) => {
                        const seatObject = upperSeatsBus.find(seat => seat.SeatName === seatName);
                        if (!seatObject) return null;

                        const isSelected = selectedSeats.includes(seatName);
                        const basePrice = getUpperBasePrice(seatName);
                        const isDisabled = basePrice === null;

                        return (
                          <div
                            onClick={!isDisabled ? () => handleSeatSelect(seatName) : undefined}
                            style={{
                              backgroundColor: isSelected ? '#ccc' : isDisabled ? '#f0f0f0' : 'transparent',
                              pointerEvents: isDisabled ? 'none' : 'auto',
                            }}
                            className={`sit-img ${seatObject.isLastRow ? 'last-row' : seatObject.seatIndex % 4 === 2 ? 'aisle' : ''} ${isDisabled ? 'disabled' : ''}`}
                            key={seatName}
                          >
                            <span>{seatName}</span>
                            <img width={30} src={BusSeatImg} alt="seat" />
                            <p>₹{basePrice !== null ? `${basePrice.toFixed(2)}` : 'N/A'}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}

              {seatType === 'Sleeper' && (
                <>
                  <div className="lower lowerSeatWEB sleeperSeat">
                    <h6>Lower Seats</h6>
                    <div className="sit">
                      {lowerSeatNames.map((seatName) => {
                        const seatObject = lowerSeatsBus.find(seat => seat.SeatName === seatName);
                        if (!seatObject) return null;

                        const isSelected = selectedSeats.includes(seatName);
                        const basePrice = getLowerBasePrice(seatName);
                        const isDisabled = basePrice === null;

                        return (
                          <div
                            onClick={!isDisabled ? () => handleSeatSelect(seatName) : undefined}
                            style={{
                              backgroundColor: isSelected ? '#ccc' : isDisabled ? '#f0f0f0' : 'transparent',
                              pointerEvents: isDisabled ? 'none' : 'auto',
                            }}
                            className={`sit-img ${seatObject.isLastRow ? 'last-row' : seatObject.seatIndex % 4 === 2 ? 'aisle' : ''} ${isDisabled ? 'disabled' : ''}`}
                            key={seatName}
                          >
                            <span>{seatName}</span>
                            <img width={45} src={BusSeatImgSleeper} alt="seat" />
                            <p>₹{basePrice !== null ? `${basePrice.toFixed(2)}` : 'N/A'}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="upper upperSeatWEB sleeperSeat">
                    <h6>Upper Seats</h6>
                    <div className="sit">
                      {upperSeatNames.map((seatName) => {
                        const seatObject = upperSeatsBus.find(seat => seat.SeatName === seatName);
                        if (!seatObject) return null;

                        const isSelected = selectedSeats.includes(seatName);
                        const basePrice = getUpperBasePrice(seatName);
                        const isDisabled = basePrice === null;

                        return (
                          <div
                            onClick={!isDisabled ? () => handleSeatSelect(seatName) : undefined}
                            style={{
                              backgroundColor: isSelected ? '#ccc' : isDisabled ? '#f0f0f0' : 'transparent',
                              pointerEvents: isDisabled ? 'none' : 'auto',
                            }}
                            className={`sit-img ${seatObject.isLastRow ? 'last-row' : seatObject.seatIndex % 4 === 2 ? 'aisle' : ''} ${isDisabled ? 'disabled' : ''}`}
                            key={seatName}
                          >
                            <span>{seatName}</span>
                            <img width={45} src={BusSeatImgSleeper} alt="seat" />
                            <p>₹{basePrice !== null ? `${basePrice.toFixed(2)}` : 'N/A'}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}

            </div>




          </div>

          <div className="bord-drop">
            <BoardAndDrop
              onBoardingSelect={handleBoardingSelect}
              onDroppingSelect={handleDroppingSelect}
            />
          </div>

          <div className="right">
            <div className="right-btm">
              <div className="tax">
                <p><MdAirlineSeatReclineNormal /> Selected Seats: {selectedSeats.join(', ')}</p>
                <p className='busseatpricee'>Total Price: <span>₹{Math.round(totalPrice)}</span></p>
              </div>
              <div className="proceed">
                <button
                  onClick={handleProceed}
                  style={{ backgroundColor: selectedSeats.length > 0 && boardingSelected && droppingSelected ? '#00b7eb' : '#ccc' }}
                  disabled={!(selectedSeats.length > 0 && boardingSelected && droppingSelected)} // Disable if not selected
                >
                  Proceed
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusLayout;
