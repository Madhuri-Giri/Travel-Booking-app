import "./BusLayout.css"
import BusSeatImg from "../../assets/images/bussit.png"

const BusLayout = () => {
  const seats = Array.from({ length: 29 }, (_, i) => i + 1); 

  const handleProceed = () => {
      
  }

  return (
    <div className='BusLayout'>
      <div className="Seat-layout">
        <div className="seats">
          {/* --------------------------- */}
          <div className="left">
            <div className="left-top">
              <h6>Select Seats</h6>
            </div>
            <div className="left-btm">
              <div className="lower">
                <h6>Lower Seats</h6>
                <div className="sit">
                  {seats.map((seat, index) => {
                    const isLastRow = index >= seats.length - 5;
                    return (
                      <div className={`sit-img ${isLastRow ? 'last-row' : index % 4 === 2 ? 'aisle' : ''}`} key={seat}>
                        <span>{seat}</span>
                        <img width={30} src={BusSeatImg} alt="seat" />
                        <p>$399</p>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="upper">
                <h6>Upper Seats</h6>
                <div className="sit">
                  {seats.map((seat, index) => {
                    const isLastRow = index >= seats.length - 5;
                    return (
                      <div className={`sit-img ${isLastRow ? 'last-row' : index % 4 === 2 ? 'aisle' : ''}`} key={seat + 40}>
                        <span>{seat + 40}</span>
                        <img width={30} src={BusSeatImg} alt="seat" />
                        <p>$399</p>
                      </div>
                    );
                  })}
                </div>
              </div>
              {/* --- */}
            </div>
          </div>
          {/* -------------------------- */}
          <div className="right">
                     
          <div className="right-top">
              <h6>Selected</h6>
            </div>
            <small>Know your seat</small>

            <div className="two-last">
                        <p><i className="ri-armchair-fill"></i>Available Seat</p>
                        <p><i style={{ color: 'green' }} className="ri-armchair-fill"></i>Selected Seat</p>
                        <p><i style={{ color: 'purple' }} className="ri-armchair-fill"></i>Occupied Seat</p>
                        <p><i style={{ color: 'gray' }} className="ri-armchair-fill"></i>Booked Seat</p>
                        <p><i style={{ color: 'gray' }} className="ri-armchair-fill"></i>Blocked Seat</p>                  
          </div>

                   
             <div className="right-btm">
                      <div className="tax">
                              <p>Selected Seats:</p>
                              <p>$300 Tax</p>
                      </div>
                     <div className="proceed">
                     <button onClick={handleProceed}>Proceed</button>
                     </div>
             </div>
                   
          </div>


{/* --------------------------------------------------- */}
</div>
</div>
    </div>
  );
}

export default BusLayout;






// import React from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { addSeatLayout } from './seatLayoutSlice'; // Adjust the import path as necessary
// import "./BusLayout.css";
// import BusSeatImg from "../../assets/images/bussit.png";

// const BusLayout = () => {
//   const seats = Array.from({ length: 29 }, (_, i) => i + 1);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   // Retrieve traceId and resultIndex from bus slice
//   const traceId = useSelector((state) => state.bus.traceId);
//   const resultIndex = useSelector((state) => state.bus.resultIndex);

//   const handleProceed = () => {
//     if (traceId && resultIndex) {
//       dispatch(addSeatLayout({ traceId, resultIndex }))
//         .then(() => {
//           navigate('/board-drop');
//         })
//         .catch((error) => {
//           console.error('Failed to add seat layout:', error);
//         });
//     } else {
//       console.error('TraceId or ResultIndex not available');
//     }
//   };

//   return (
//     <div className='BusLayout'>
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
//                   {seats.map((seat, index) => {
//                     const isLastRow = index >= seats.length - 5;
//                     return (
//                       <div className={`sit-img ${isLastRow ? 'last-row' : index % 4 === 2 ? 'aisle' : ''}`} key={seat}>
//                         <span>{seat}</span>
//                         <img width={30} src={BusSeatImg} alt="seat" />
//                         <p>$399</p>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
//               <div className="upper">
//                 <h6>Upper Seats</h6>
//                 <div className="sit">
//                   {seats.map((seat, index) => {
//                     const isLastRow = index >= seats.length - 5;
//                     return (
//                       <div className={`sit-img ${isLastRow ? 'last-row' : index % 4 === 2 ? 'aisle' : ''}`} key={seat + 40}>
//                         <span>{seat + 40}</span>
//                         <img width={30} src={BusSeatImg} alt="seat" />
//                         <p>$399</p>
//                       </div>
//                     );
//                   })}
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
//               <p><i style={{ color: 'gray' }} className="ri-armchair-fill"></i>Booked Seat</p>
//               <p><i style={{ color: 'gray' }} className="ri-armchair-fill"></i>Blocked Seat</p>
//             </div>
//             <div className="right-btm">
//               <div className="tax">
//                 <p>Selected Seats:</p>
//                 <p>$300 Tax</p>
//               </div>
//               <div className="proceed">
//                 <button onClick={handleProceed}>Proceed</button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BusLayout;

