/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import './BusLayout.css';
import BusSeatImg from '../../assets/images/bussittt.png';
import BusSeatImgSleeper from '../../assets/images/sleepImg.png';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { TbSteeringWheel } from "react-icons/tb";

const BusLayout = ({ busType }) => {
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

  // console.log('busType', busType)

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
      // console.log('seatDetails', seatDetails);

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


  // const renderSeats = (seats) => {
  //   console.log('sss', seats);

  //   const totalSeats = seats.length;

  //   // Calculate the number of rows based on total seats
  //   let numberOfRows = 4; // You can adjust the number of rows if needed
  //   const seatsPerRow = Math.ceil(totalSeats / (numberOfRows - 1)); // Calculate seats per row dynamically, excluding the empty row

  //   const rows = [[], [], [], []]; // Initial rows, where the third row will be empty

  //   // Distribute seats across rows dynamically
  //   let currentRow = 0;
  //   seats.forEach((seat, index) => {
  //     if (currentRow === 2) currentRow++; // Skip the empty row (third row)
  //     if (rows[currentRow].length >= seatsPerRow && currentRow < numberOfRows - 1) {
  //       currentRow++; // Move to the next row once the current row is filled
  //     }
  //     rows[currentRow].push(seat);
  //   });

  //   const renderRow = (rowSeats, rowIndex) => {
  //     return (
  //       <div key={rowIndex} className={`seat-row row-${rowIndex + 1}`}>
  //         {rowSeats.length > 0 ? (
  //           rowSeats.map((seat) => {
  //             const seatClass = seat.SeatStatus ? 'seat-available' : 'seat-disabled';
  //             const seatTypeClass = seat.SeatType === 2 ? 'sleeper-seat' : 'sitting-seat';
  //             const seatImg = seat.SeatType === 2 ? BusSeatImgSleeper : BusSeatImg;
  //             const isSelected = selectedSeats.includes(seat.SeatName);

  //             return (
  //               <div
  //                 key={seat.SeatIndex}
  //                 className={`seat ${seatClass} ${seatTypeClass} ${isSelected ? 'selected-seat' : ''}`}
  //                 onClick={() => handleSeatSelect(seat)}
  //               >
  //                 <img src={seatImg} alt={seat.SeatName} />
  //                 <div className='seatHoverdiv'>
  //                   <div className="seat-name">
  //                     <span className='seatName'>{seat.SeatName},</span>
  //                     <span className='seatPrice'> ₹{Math.round(seat.Price.BasePrice - (seat.Price.BasePrice * 0.18))}</span>
  //                   </div>
  //                 </div>
  //               </div>
  //             );
  //           })
  //         ) : (
  //           <div className="empty-row"></div> // Display for the empty row
  //         )}
  //       </div>
  //     );
  //   };

  //   return (
  //     <div className="seat-layout">
  //       {rows.map((row, index) => renderRow(row, index))}
  //     </div>
  //   );
  // };

  const renderSeats = (seats) => {
    // console.log('seatssss', seats);
    // console.log('busType', busType);
  
    // Extract seat configuration from the busType (like (2+1), (2+2), (2+3))
    const seatConfigMatch = busType?.match(/\((\d+)\+(\d+)\)/);
    
    let leftSideSeats = 2; // default
    let rightSideSeats = 2; // default
    if (seatConfigMatch) {
      leftSideSeats = parseInt(seatConfigMatch[1], 10);
      rightSideSeats = parseInt(seatConfigMatch[2], 10);
    }
    // Determine number of rows based on configuration
    const totalRows = leftSideSeats + rightSideSeats; // Total number of rows minus the empty row
    const totalSeats = seats.length;
    // Create dynamic row structure
    const rows = Array.from({ length: totalRows + 1 }, () => []); // "+1" to account for the empty row
    // Insert an empty row (3rd row)
    const emptyRowIndex = 2; // Empty row will always be in the 3rd position
    rows.splice(emptyRowIndex, 0, []);
    // Dynamically distribute seats across rows (excluding the empty row)
    let currentRow = 0;
    seats.forEach((seat, index) => {
      if (currentRow === emptyRowIndex) currentRow++; // Skip the empty row
      rows[currentRow].push(seat);
      currentRow = (currentRow + 1) % (totalRows + 1); // Loop back to the first row if we exceed total rows
    });
    const renderRow = (rowSeats, rowIndex) => {
      return (
        <div key={rowIndex} className={`seat-row row-${rowIndex + 1}`}>
          {rowSeats.length > 0 ? (
            rowSeats.map((seat) => {
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
                  <img src={seatImg} alt={seat.SeatName} />
                  <div className='seatHoverdiv'>
                    <div className="seat-name">
                      <span className='seatName'>{seat.SeatName},</span>
                      <span className='seatPrice'> ₹{Math.round(seat.Price.BasePrice - (seat.Price.BasePrice * 0.18))}</span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="empty-row"></div> // Empty row placeholder
          )}
        </div>
      );
    };
  
    return (
      <div className="seat-layout">
        {rows.map((row, index) => renderRow(row, index))}
      </div>
    );
  };
  

  // const renderSeats = (seats) => {
  //   console.log('seatssss', seats);

  //   const seatsPerRow = 9; // Number of seats per row
  //   const totalSeats = seats.length;

  //   // Create rows based on the available seats
  //   const rows = [];

  //   // Split seats into rows dynamically (except for the empty row)
  //   for (let i = 0; i < totalSeats; i += seatsPerRow) {
  //     rows.push(seats.slice(i, i + seatsPerRow));
  //   }

  //   // Ensure the third row is always empty
  //   rows.splice(2, 0, []); // Insert an empty row at the third position

  //   const renderRow = (rowSeats, rowIndex) => {
  //     return (
  //       <div key={rowIndex} className={`seat-row row-${rowIndex + 1}`}>
  //         {rowSeats.length > 0 ? (
  //           rowSeats.map((seat) => {
  //             const seatClass = seat.SeatStatus ? 'seat-available' : 'seat-disabled';
  //             const seatTypeClass = seat.SeatType === 2 ? 'sleeper-seat' : 'sitting-seat';
  //             const seatImg = seat.SeatType === 2 ? BusSeatImgSleeper : BusSeatImg;
  //             const isSelected = selectedSeats.includes(seat.SeatName);

  //             return (
  //               <div
  //                 key={seat.SeatIndex}
  //                 className={`seat ${seatClass} ${seatTypeClass} ${isSelected ? 'selected-seat' : ''}`}
  //                 onClick={() => handleSeatSelect(seat)}
  //               >
  //                 <img src={seatImg} alt={seat.SeatName} />
  //                 <div className='seatHoverdiv'>
  //                   <div className="seat-name">
  //                     <span className='seatName'>{seat.SeatName},</span>
  //                     <span className='seatPrice'> ₹{Math.round(seat.Price.BasePrice - (seat.Price.BasePrice * 0.18))}</span>
  //                   </div>
  //                 </div>
  //               </div>
  //             );
  //           })
  //         ) : (
  //           <div className="empty-row"></div> // Display for the empty row
  //         )}
  //       </div>
  //     );
  //   };

  //   return (
  //     <div className="seat-layout">
  //       {rows.map((row, index) => renderRow(row, index))}
  //     </div>
  //   );
  // };



  // const renderSeats = (seats) => {
  //   console.log('seatssss', seats);

  //   // Split seats into 4 lines - dynamically adjust as per seat data
  //   const rows = [[], [], [], []]; // 4 lines of seats, 3rd row will be empty

  //   // Distribute seats across the 1st, 2nd, and 4th rows (leave 3rd row empty)
  //   seats.forEach((seat, index) => {
  //     if (index < 8) {
  //       rows[0].push(seat); // First row, 8 seats
  //     } else if (index < 16) {
  //       rows[1].push(seat); // Second row, next 8 seats
  //     } else if (index < 24) {
  //       rows[3].push(seat); // Fourth row, next 8 seats
  //     }
  //     // Add more rows or adjust if you have more than 24 seats
  //   });

  //   const renderRow = (rowSeats, rowIndex) => {
  //     return (
  //       <div key={rowIndex} className={`seat-row row-${rowIndex + 1}`}>
  //         {rowSeats.map((seat) => {
  //           const seatClass = seat.SeatStatus ? 'seat-available' : 'seat-disabled';
  //           const seatTypeClass = seat.SeatType === 2 ? 'sleeper-seat' : 'sitting-seat';
  //           const seatImg = seat.SeatType === 2 ? BusSeatImgSleeper : BusSeatImg;
  //           const isSelected = selectedSeats.includes(seat.SeatName);

  //           return (
  //             <div
  //               key={seat.SeatIndex}
  //               className={`seat ${seatClass} ${seatTypeClass} ${isSelected ? 'selected-seat' : ''}`}
  //               onClick={() => handleSeatSelect(seat)}
  //             >
  //               <img src={seatImg} alt={seat.SeatName} />
  //               <div className='seatHoverdiv'>
  //                 <div className="seat-name">
  //                   <span className='seatName'>{seat.SeatName},</span>
  //                   <span className='seatPrice'> ₹{Math.round(seat.Price.BasePrice - (seat.Price.BasePrice * 0.18))}</span>
  //                 </div>
  //               </div>
  //             </div>
  //           );
  //         })}
  //       </div>
  //     );
  //   };

  //   return (
  //     <div className="seat-layout">
  //       {rows.map((row, index) => renderRow(row, index))}
  //     </div>
  //   );
  // };




  // const renderSeats = (seats) => {
  //   console.log('seats',seats);
  //   return seats.map((seat) => {
  //     const seatClass = seat.SeatStatus ? 'seat-available' : 'seat-disabled';
  //     const seatTypeClass = seat.SeatType === 2 ? 'sleeper-seat' : 'sitting-seat';
  //     const seatImg = seat.SeatType === 2 ? BusSeatImgSleeper : BusSeatImg;
  //     const isSelected = selectedSeats.includes(seat.SeatName);
  //     return (
  //       <div
  //         key={seat.SeatIndex}
  //         className={`seat ${seatClass} ${seatTypeClass} ${isSelected ? 'selected-seat' : ''}`}
  //         onClick={() => handleSeatSelect(seat)}
  //       >
  //         <img src={seatImg} alt={seat.SeatName} />
  //          <div className='seatHoverdiv'>
  //         <div className="seat-name ">
  //          <span className='seatName'>{seat.SeatName}</span>
  //          <span className='seatPrice'> ₹{Math.round(seat.Price.BasePrice - (seat.Price.BasePrice * 0.18))}</span>
  //          </div>

  //         </div>
  //       </div>
  //     );
  //   });
  // };

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

      // console.log('Selected Boarding Point:', selectedBoardingPoint);
      // console.log('Selected Dropping Point:', selectedDroppingPoint);
      // console.log('Selected Bus Seat Data:', selectedBusSeatData);
      // console.log('Total Price:', totalPrice);

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
        // console.log('Boarding Response:', responseData);
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
              <p>Selected Seats: <span className='selectedsetss'>{selectedSeats.join(', ')}</span></p>
              <span>Available Seats: {totalAvailableSeats}</span>
            </div>


            {/* ----------------------------------------seat code ---------------------------------------------------------------- */}
            <div className="Seats-layout">
              <small>{busType}</small>
              <div className="lower-seats ">
                <h6>LOWER</h6>
                <div className='d-flex'>
                <TbSteeringWheel className='mt-2'/>
                  {lowerSeatsBus.length > 0 ? (
                    <div className="seat-row">
                      {renderSeats(lowerSeatsBus)}
                    </div>
                  ) : (
                    <div className="error-message">No Lower Seats Available</div>
                  )}
                </div>
              </div>
              {upperSeatsBus.length > 0 && (
                <div className="upper-seats ">
                  <h6>UPPER</h6>
                  <div>
                    <div className="seat-row">
                      {renderSeats(upperSeatsBus)}
                    </div>
                  </div>
                </div>
              )}

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
                <h6 style={{fontSize:"1vmax"}}>Total Price: </h6>
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
