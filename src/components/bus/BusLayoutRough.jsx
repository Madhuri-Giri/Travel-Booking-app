import { useEffect, useState } from 'react';
import './BusLayout.css';
import BusSeatImg from '../../assets/images/bussit.png';
import { useNavigate } from 'react-router-dom';
import { MdAirlineSeatReclineNormal } from "react-icons/md";
import Loading from '../../pages/loading/Loading';
import BoardAndDrop from "../bus/BoardAndDrop";

const BusLayout = () => {
  const navigate = useNavigate();
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

  // for seat tabs----------------------
  const [activeTab, setActiveTab] = useState('lower');

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  // for seat tabs----------------------

  useEffect(() => {
    const busLayoutResponse = JSON.parse(localStorage.getItem('BuslayoutResponse')) || {};

    const lowerSeats = (busLayoutResponse.Result || []).flat();
    const upperSeats = (busLayoutResponse.ResultUpperSeat || []).flat();
    const availableSeats = busLayoutResponse.AvailableSeats;
    setAvailableSeats(availableSeats);

    const extractedLowerBasePrices = lowerSeats.map(seat => seat.Price.BasePrice);
    const extractedLowerSeatNames = lowerSeats.map(seat => seat.SeatName);
    const extractedUpperBasePrices = upperSeats.map(seat => seat.Price.BasePrice);
    const extractedUpperSeatNames = upperSeats.map(seat => seat.SeatName);

    setLowerBasePrices(extractedLowerBasePrices);
    setLowerSeatNames(extractedLowerSeatNames);
    setUpperBasePrices(extractedUpperBasePrices);
    setUpperSeatNames(extractedUpperSeatNames);
  }, []);

  const lowerSeats = Array.from({ length: 29 }, (_, i) => i + 1);
  const upperSeats = Array.from({ length: 29 }, (_, i) => i + 1);

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

  return (
    <div className="BusLayout">
      <div className="Seat-layout">
        <div className="seats">
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
                {activeTab === 'lower' && (
                  <div className="lower">
                    {/* <h6>Lower Seats</h6> */}
                    <div className="sit">
                      {lowerSeats.map((seat, index) => {
                        const seatName = lowerSeatNames[index];
                        const isLastRow = index >= lowerSeats.length - 5;
                        const seatSelected = selectedSeats.includes(seatName);
                        const basePrice = getLowerBasePrice(seatName);
                        const isDisabled = basePrice === null;

                        return (
                          <div
                            onClick={!isDisabled ? () => handleSeatSelect(seatName) : undefined}
                            style={{
                              backgroundColor: seatSelected ? '#ccc' : isDisabled ? '#f0f0f0' : 'transparent',
                              pointerEvents: isDisabled ? 'none' : 'auto',
                            }}
                            className={`sit-img ${isLastRow ? 'last-row' : index % 4 === 2 ? 'aisle' : ''} ${isDisabled ? 'disabled' : ''}`}
                            key={seatName}
                          >
                            <span>{seatName}</span>
                            <img width={25} src={BusSeatImg} alt="seat" />
                            <p>{basePrice !== null ? `${basePrice.toFixed(2)}` : 'N/A'}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {activeTab === 'upper' && (
                  <div className="upper">
                    {/* <h6>Upper Seats</h6> */}
                    <div className="sit">
                      {upperSeats.map((seat, index) => {
                        const seatName = upperSeatNames[index];
                        const isLastRow = index >= upperSeats.length - 5;
                        const seatSelected = selectedSeats.includes(seatName);
                        const basePrice = getUpperBasePrice(seatName);
                        const isDisabled = basePrice === null;

                        return (
                          <div
                            onClick={!isDisabled ? () => handleSeatSelect(seatName) : undefined}
                            style={{
                              backgroundColor: seatSelected ? '#ccc' : isDisabled ? '#f0f0f0' : 'transparent',
                              pointerEvents: isDisabled ? 'none' : 'auto',
                            }}
                            className={`sit-img ${isLastRow ? 'last-row' : index % 4 === 2 ? 'aisle' : ''} ${isDisabled ? 'disabled' : ''}`}
                            key={seatName}
                          >
                            <span>{seatName}</span>
                            <img width={25} src={BusSeatImg} alt="seat" />
                            <p>{basePrice !== null ? `${basePrice.toFixed(2)}` : 'N/A'}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>



              <div className="lower lowerSeatWEB">
                <h6>Lower Seats</h6>
                <div className="sit">
                  {lowerSeats.map((seat, index) => {
                    const seatName = lowerSeatNames[index];
                    const isLastRow = index >= lowerSeats.length - 5;
                    const seatSelected = selectedSeats.includes(seatName);
                    const basePrice = getLowerBasePrice(seatName);
                    const isDisabled = basePrice === null;

                    return (
                      <div
                        onClick={!isDisabled ? () => handleSeatSelect(seatName) : undefined}
                        style={{
                          backgroundColor: seatSelected ? '#ccc' : isDisabled ? '#f0f0f0' : 'transparent',
                          pointerEvents: isDisabled ? 'none' : 'auto',
                        }}
                        className={`sit-img ${isLastRow ? 'last-row' : index % 4 === 2 ? 'aisle' : ''} ${isDisabled ? 'disabled' : ''}`}
                        key={seatName}
                      >
                        <span>{seatName}</span>
                        <img width={25} src={BusSeatImg} alt="seat" />
                        <p>{basePrice !== null ? `${basePrice.toFixed(2)}` : 'N/A'}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="upper upperSeatWEB">
                <h6>Upper Seats</h6>
                <div className="sit">
                  {upperSeats.map((seat, index) => {
                    const seatName = upperSeatNames[index];
                    const isLastRow = index >= upperSeats.length - 5;
                    const seatSelected = selectedSeats.includes(seatName);
                    const basePrice = getUpperBasePrice(seatName);
                    const isDisabled = basePrice === null;

                    return (
                      <div
                        onClick={!isDisabled ? () => handleSeatSelect(seatName) : undefined}
                        style={{
                          backgroundColor: seatSelected ? '#ccc' : isDisabled ? '#f0f0f0' : 'transparent',
                          pointerEvents: isDisabled ? 'none' : 'auto',
                        }}
                        className={`sit-img ${isLastRow ? 'last-row' : index % 4 === 2 ? 'aisle' : ''} ${isDisabled ? 'disabled' : ''}`}
                        key={seatName}
                      >
                        <span>{seatName}</span>
                        <img width={25} src={BusSeatImg} alt="seat" />
                        <p>{basePrice !== null ? `${basePrice.toFixed(2)}` : 'N/A'}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
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
                <p>Total Price: ${totalPrice}</p>
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
