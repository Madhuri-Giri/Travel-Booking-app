import { useEffect, useState } from 'react';
import './BusLayout.css';
import BusSeatImg from '../../assets/images/bussit.png';
import { useNavigate } from 'react-router-dom';

const BusLayout = () => {
  const navigate = useNavigate();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const [lowerBasePrices, setLowerBasePrices] = useState([]);
  const [lowerSeatIndexes, setLowerSeatIndexes] = useState([]);
  const [upperBasePrices, setUpperBasePrices] = useState([]);
  const [upperSeatIndexes, setUpperSeatIndexes] = useState([]);

  useEffect(() => {
    const busLayoutResponse = JSON.parse(localStorage.getItem('BuslayoutResponse')) || {};
    console.log('BuslayoutResponse:', busLayoutResponse); 

    const lowerSeats = (busLayoutResponse.Result || []).flat();
    const upperSeats = (busLayoutResponse.ResultUpperSeat || []).flat();
    
    const extractedLowerBasePrices = lowerSeats.map(seat => seat.Price.BasePrice);
    const extractedLowerSeatIndexes = lowerSeats.map(seat => seat.SeatIndex);
    const extractedUpperBasePrices = upperSeats.map(seat => seat.Price.BasePrice);
    const extractedUpperSeatIndexes = upperSeats.map(seat => seat.SeatIndex);
  
    console.log('Extracted Lower Base Prices:', extractedLowerBasePrices); 
    console.log('Extracted Lower Seat Indexes:', extractedLowerSeatIndexes); 
    console.log('Extracted Upper Base Prices:', extractedUpperBasePrices); 
    console.log('Extracted Upper Seat Indexes:', extractedUpperSeatIndexes); 
  
    setLowerBasePrices(extractedLowerBasePrices);
    setLowerSeatIndexes(extractedLowerSeatIndexes);
    setUpperBasePrices(extractedUpperBasePrices);
    setUpperSeatIndexes(extractedUpperSeatIndexes);
  }, []);

  // Define seat arrays
  const lowerSeats = Array.from({ length: 29 }, (_, i) => i + 1);
  const upperSeats = Array.from({ length: 29 }, (_, i) => i + 1);

  // Function to get base price for a given seat index
  const getLowerBasePrice = (seatIndex) => {
    const index = lowerSeatIndexes.indexOf(seatIndex);
    return index !== -1 ? lowerBasePrices[index] : null; 
  };

  const getUpperBasePrice = (seatIndex) => {
    const index = upperSeatIndexes.indexOf(seatIndex);
    return index !== -1 ? upperBasePrices[index] : null; 
  };

  const handleSeatSelect = (seatIndex) => {
    const isSelected = selectedSeats.includes(seatIndex);
    const price = isSelected ? 0 : (getLowerBasePrice(seatIndex) || getUpperBasePrice(seatIndex) || 0);

    setSelectedSeats((prevSeats) => {
      if (isSelected) {
        return prevSeats.filter((seat) => seat !== seatIndex);
      } else {
        return [...prevSeats, seatIndex];
      }
    });
    
    // Update the total price here
    setTotalPrice((prevTotal) => {
      return isSelected ? prevTotal - price : prevTotal + price;
    });
  };

  const handleProceed = async () => {
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
      navigate('/bord-drop');
    } catch (error) {
      console.error('Error adding seat layout:', error.message);
    }
  };

  return (
    <div className="BusLayout">
      <div className="Seat-layout">
        <div className="seats">
          <div className="left">
            <div className="left-top">
              <h6>Select Seats</h6>
            </div>
            <div className="left-btm">
              <div className="lower">
                <h6>Lower Seats</h6>
                <div className="sit">
                  {lowerSeats.map((seat, index) => {
                    const isLastRow = index >= lowerSeats.length - 5;
                    const seatSelected = selectedSeats.includes(seat);
                    const basePrice = getLowerBasePrice(seat); 

                    const isDisabled = basePrice === null;

                    return (
                      <div
                        onClick={!isDisabled ? () => handleSeatSelect(seat) : undefined}
                        style={{
                          backgroundColor: seatSelected ? '#ccc' : isDisabled ? '#f0f0f0' : 'transparent',
                          pointerEvents: isDisabled ? 'none' : 'auto',
                        }}
                        className={`sit-img ${isLastRow ? 'last-row' : index % 4 === 2 ? 'aisle' : ''} ${isDisabled ? 'disabled' : ''}`}
                        key={seat}
                      >
                        <span>{seat}</span>
                        <img width={30} src={BusSeatImg} alt="seat" />
                        <p>{basePrice !== null ? `$${basePrice}` : 'N/A'}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="upper">
                <h6>Upper Seats</h6>
                <div className="sit">
                  {upperSeats.map((seat, index) => {
                    const isLastRow = index >= upperSeats.length - 5;
                    const seatSelected = selectedSeats.includes(seat);
                    const basePrice = getUpperBasePrice(seat); 

                    const isDisabled = basePrice === null;

                    return (
                      <div
                        onClick={!isDisabled ? () => handleSeatSelect(seat) : undefined}
                        style={{
                          backgroundColor: seatSelected ? '#ccc' : isDisabled ? '#f0f0f0' : 'transparent',
                          pointerEvents: isDisabled ? 'none' : 'auto',
                        }}
                        className={`sit-img ${isLastRow ? 'last-row' : index % 4 === 2 ? 'aisle' : ''} ${isDisabled ? 'disabled' : ''}`}
                        key={seat}
                      >
                        <span>{seat}</span>
                        <img width={30} src={BusSeatImg} alt="seat" />
                        <p>{basePrice !== null ? `$${basePrice}` : 'N/A'}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          <div className="right">
            <div className="right-top">
              <h6>Selected</h6>
            </div>
            <small>Know your seat</small>
            <div className="two-last">
              <p><i className="ri-armchair-fill"></i>Available Seat</p>
              <p><i style={{ color: 'green' }} className="ri-armchair-fill"></i>Selected Seat</p>
              <p><i style={{ color: 'purple' }} className="ri-armchair-fill"></i>Occupied Seat</p>
              <p><i style={{ color: 'pink' }} className="ri-armchair-fill"></i>Booked Seat</p>
              <p><i style={{ color: 'gray' }} className="ri-armchair-fill"></i>Blocked Seat</p>
            </div>
            <div className="right-btm">
              <div className="tax">
                <p>Selected Seats: {selectedSeats.join(', ')}</p>
                <p>Total Price: ${totalPrice}</p>
              </div>
              <div className="proceed">
                <button
                  onClick={handleProceed}
                  disabled={selectedSeats.length === 0}
                  style={{ backgroundColor: selectedSeats.length === 0 ? '#ccc' : '#00b7eb' }}
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





























// import React, { useEffect, useState } from 'react';
// import './BusLayout.css';
// import { useNavigate } from 'react-router-dom';
// import BusSeatImg from '../../assets/images/bussit.png';

// const BusLayout = ({ layoutResponse }) => {
//   const navigate = useNavigate();
//   const [selectedSeats, setSelectedSeats] = useState([]);
//   const [totalPrice, setTotalPrice] = useState(0);

//   useEffect(() => {
//     console.log('Layout Response:', layoutResponse);
//   }, [layoutResponse]);

//   const renderSeats = (seatData) => {
//     if (!Array.isArray(seatData)) {
//       return <p>No seats available</p>;
//     }

//     return seatData.map((seatRow, rowIndex) => (
//       <div key={rowIndex}>
//         {seatRow.map((seat, index) => {
//           const isLastRow = rowIndex === seatData.length - 1 && index === seatRow.length - 1;
//           const seatSelected = selectedSeats.includes(seat.SeatIndex);

//           return (
//             <div
//               onClick={() => handleSeatSelect(seat.SeatIndex)}
//               style={{ backgroundColor: seatSelected ? '#ccc' : 'transparent' }}
//               className={`sit-img ${isLastRow ? 'last-row' : index % 4 === 2 ? 'aisle' : ''}`}
//               key={seat.SeatIndex}
//             >
//               <span>{seat.SeatIndex}</span>
//               <img width={30} src={BusSeatImg} alt="seat" />
//               <p>${seat.Price.BasePrice}</p>
//             </div>
//           );
//         })}
//       </div>
//     ));
//   };

//   const handleSeatSelect = (seatIndex) => {
//     if (selectedSeats.includes(seatIndex)) {
//       setSelectedSeats(selectedSeats.filter((seat) => seat !== seatIndex));
//     } else {
//       setSelectedSeats([...selectedSeats, seatIndex]);
//     }
//   };

//   useEffect(() => {
//     let total = 0;
//     selectedSeats.forEach((seatIndex) => {
//       const lowerSeat = layoutResponse.Result.flat().find((seat) => seat.SeatIndex === seatIndex);
//       const upperSeat = layoutResponse.ResultUpperSeat.flat().find((seat) => seat.SeatIndex === seatIndex);

//       if (lowerSeat) {
//         total += lowerSeat.Price.BasePrice;
//       } else if (upperSeat) {
//         total += upperSeat.Price.BasePrice;
//       }
//     });
//     setTotalPrice(total);
//   }, [selectedSeats, layoutResponse]);

//   const handleProceed = async () => {
//     try {
//       const traceId = localStorage.getItem('traceId');
//       const resultIndex = localStorage.getItem('resultIndex');

//       if (!traceId || !resultIndex) {
//         throw new Error('TraceId or ResultIndex not found in localStorage');
//       }

//       // Store selected seats in localStorage
//       localStorage.setItem('selectedSeats', JSON.stringify(selectedSeats));
//       localStorage.setItem('totalPrice', totalPrice);

//       const response = await fetch('https://sajyatra.sajpe.in/admin/api/addboarding', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           ResultIndex: resultIndex,
//           TraceId: traceId,
//         }),
//       });

//       if (!response.ok) {
//         throw new Error('Failed to add seat layout');
//       }

//       const data = await response.json(); 
//       console.log('bord-drop API Response:', data);
//       navigate('/bord-drop');
//     } catch (error) {
//       console.error('Error adding seat layout:', error.message);
//     }
//   };

//   return (
//     <div className="BusLayout">
//       <div className="Seat-layout">
//         <div className="seats">
//           <div className="left">
//             <div className="left-top">
//               <h6>Select Seats</h6>
//             </div>
//             <div className="left-btm">
//               <div className="lower">
//                 <h6>Lower Seats</h6>
//                 <div className="sit">
//                   {layoutResponse && layoutResponse.Result && layoutResponse.Result.length > 0 ? (
//                     renderSeats(layoutResponse.Result)
//                   ) : (
//                     <p>No lower seats available</p>
//                   )}
//                 </div>
//               </div>
//               <div className="upper">
//                 <h6>Upper Seats</h6>
//                 <div className="sit">
//                   {layoutResponse && layoutResponse.ResultUpperSeat && layoutResponse.ResultUpperSeat.length > 0 ? (
//                     renderSeats(layoutResponse.ResultUpperSeat)
//                   ) : (
//                     <p>No upper seats available</p>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="right">
//             <div className="right-top">
//               <h6>Selected</h6>
//             </div>
//             <small>Know your seat</small>
//             <div className="two-last">
//               <p><i className="ri-armchair-fill"></i>Available Seat</p>
//               <p><i style={{ color: 'green' }} className="ri-armchair-fill"></i>Selected Seat</p>
//               <p><i style={{ color: 'purple' }} className="ri-armchair-fill"></i>Occupied Seat</p>
//               <p><i style={{ color: 'pink' }} className="ri-armchair-fill"></i>Booked Seat</p>
//               <p><i style={{ color: 'gray' }} className="ri-armchair-fill"></i>Blocked Seat</p>
//             </div>
//             <div className="right-btm">
//               <div className="tax">
//                 <p>Selected Seats: {selectedSeats.join(', ')}</p>
//                 <p>Total Price: ${totalPrice}</p>
//               </div>
//               <div className="proceed">
//                 <button
//                   onClick={handleProceed}
//                   disabled={selectedSeats.length === 0}
//                   style={{ backgroundColor: selectedSeats.length === 0 ? '#ccc' : '#00b7eb' }}
//                 >
//                   Proceed
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BusLayout;






