/* eslint-disable no-unused-vars */
import { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './BusList.css';
import busImg from "../../assets/images/bus.png2.png";
import BusLayout from './BusLayout';
import { searchBuses } from '../../redux-toolkit/bus/busSlice';
import { useNavigate } from 'react-router-dom';
import Footer from '../../pages/footer/Footer';
import CustomNavbar from '../../pages/navbar/CustomNavbar';
import EnterOtp from '../popUp/EnterOtp';
import TimerBus from '../timmer/TimerBus';

// import Loading from '../../pages/loading/Loading';


import { setSelectedBusIndex } from '../../redux-toolkit/bus/busSelectionSlice';
import { fetchSeatLayout } from '../../redux-toolkit/bus/seatLayoutSlice';
// import BoardAndDrop from './BoardAndDrop';


const BusLists = () => {
  const dispatch = useDispatch();
  const dateMidRef = useRef(null);
  const navigate = useNavigate();
  const [layoutResponse, setLayoutResponse] = useState(null);
  const { from, to, selectedBusDate, searchResults, status, error } = useSelector((state) => state.bus);
  
  const traceId = useSelector((state) => state.bus.traceId);
  const resultIndex = useSelector((state) => state.bus.resultIndex);
  // console.log('Redux wala Result  Index or prop ',resultIndex )


  // console.log('Redux ResultI:', resultIndex);

  const [visibleLayout, setVisibleLayout] = useState(null);
  const [isTravelListVisible, setIsTravelListVisible] = useState(false);


  const [showOtpOverlay, setShowOtpOverlay] = useState(false);

  // ------------------------------------------------------------------------------------------------ -------


  // --------------------------------------------------------------------------------------------------------

  const navigateSearch = () => {
    navigate('/bus-search');
  };

  useEffect(() => {
    if (!searchResults.length) {
      dispatch(searchBuses({ from: 'Bhopal', to: 'Indore', departDate: '2024-07-26' }));
    }
  }, [dispatch, searchResults.length]);


  const convertUTCToIST = (utcTimeString) => {
    const utcDate = new Date(utcTimeString);
    const istTime = new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }).format(utcDate);
    return istTime;
  };

  const toggleLayoutVisibility = (index) => {
    setVisibleLayout((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };


  const storeSelectedBusDetails = (bus) => {
    const selectedBusDetails = {
      selctedBusResult: bus.ResultIndex,    
      busName: bus.TravelName,
      boardingPoints: bus.BoardingPoints,
      droppingPoints: bus.DroppingPoints,
      
    };

    // localStorage.setItem('selectedBusDetails', JSON.stringify(selectedBusDetails));
  };
  
  const [selectedBusIndex, setSelectedBusIndex] = useState(null);


 

const handleSelectSeat = async (index) => {
  // console.log('Index clicked:', index);
  // console.log('Filtered Results:', filteredResults);

  if (index < 0 || index >= filteredResults.length) {
      console.error("Index out of bounds:", index);
      return;
  }

  const selectedBusIndex = filteredResults[index]?.ResultIndex;
  // console.log("Selected ResultIndex:", selectedBusIndex);
  localStorage.setItem('selectedBusIndex', selectedBusIndex);


   const travelName = filteredResults[index]?.TravelName;
   if (travelName) {
     localStorage.setItem('travelName', travelName);
    //  console.log("Travel name saved:", travelName);
   }



  if (selectedBusIndex === undefined) {
      console.error("Selected Bus Index is undefined for index:", index);
      return;
  }

  setSelectedBusIndex(selectedBusIndex);
  
  const loginId = localStorage.getItem('loginId');
  // await useridHandler();

  if (!loginId) {
      console.log('No loginId found, showing OTP overlay'); 
      setShowOtpOverlay(true); 
      return;
  }

  setVisibleLayout(index); 

  const selectedBus = searchResults[index];
  storeSelectedBusDetails(selectedBus);
      
  await addSeatLayout(); 
};



  const closeOtpOverlay = () => {
    setShowOtpOverlay(false); 
  };

  // const useridHandler = async () => {

  // const loginId = localStorage.getItem('loginId');
     
  //   try {
  //     const requestBody = {
  //       user_id:loginId , 
  //     };
  
  //     const response = await fetch('https://sajyatra.sajpe.in/admin/api/user-detail', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(requestBody),
  //     });
  
  //     if (!response.ok) {
  //       throw new Error('Failed to fetch user details');
  //     }
  
  //     const data = await response.json();
  //     console.log('User details:', data);
  //     console.log('trans', data.transaction.transaction_num)
  //     if (data.result && data.transaction) {
  //       localStorage.setItem('transactionIdBus', data.transaction.id);
  //       localStorage.setItem('transactionNum', data.transaction.transaction_num);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching user details:', error.message);
  //   }
  // };
  


  const toggleTravelList = () => {
    setIsTravelListVisible((prev) => !prev);
  };

  const [isPickupVisible, setIsPickupVisible] = useState(false);
const [isDropVisible, setIsDropVisible] = useState(false);

const togglePickupVisibility = () => {
  setIsPickupVisible((prev) => !prev);
};

const toggleDropVisibility = () => {
  setIsDropVisible((prev) => !prev);
};

// const addSeatLayout = async () => {
//   try {
//     console.log('Selected Bus Index layout function:', selectedBusIndex); 
//     await dispatch(fetchSeatLayout({ traceId, selectedBusIndex }));

//   } catch (error) {
//     console.error('Error adding seat layout:', error.message);
//   }
// };
const addSeatLayout = async () => {
  try {
    const selectedBusIndex = localStorage.getItem('selectedBusIndex');
    // console.log('Selected Bus Index layout function:', selectedBusIndex); 

    await dispatch(fetchSeatLayout({ traceId, selectedBusIndex }));

  } catch (error) {
    console.error('Error adding seat layout:', error.message);
  }
};

 
  
  const calculateTimeDifference = (arrivalTime, dropTime) => {
    const arrivalDate = new Date(arrivalTime);
    const dropDate = new Date(dropTime);
    const differenceInMs = dropDate - arrivalDate;

    const hours = Math.floor(differenceInMs / (1000 * 60 * 60));
    const minutes = Math.floor((differenceInMs % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m`;
  };

  const [price, setPrice] = useState(10000); // Default value is 10

  const handlePriceChange = (event) => {
    setPrice(event.target.value);
  };


  // const [priceFilter, setPriceFilter] = useState(10000); // Default max value
  const [operatorFilter, setOperatorFilter] = useState('');

 

  const filteredResults = searchResults.filter(bus => {
    // Ensure the Price and BasePrice exist before filtering
    const withinPrice = bus.Price && bus.Price.BasePrice <= price;
    const matchesOperator = operatorFilter ? bus.TravelName === operatorFilter : true;
    return withinPrice && matchesOperator;
  });

  const backHandle = () => {
    navigate('/bus-search')
  }

    // ----------------------------------// responsivesidebar----------------------------------
    const [isSidebarVisible, setIsSidebarVisible] = useState(false);

    const responsiveFilter = () => {
      setIsSidebarVisible(!isSidebarVisible);
    };

    // ----------------------------------// responsivesidebar----------------------------------



  return (
    <>
  <CustomNavbar />
  <TimerBus/>
  <div className='BusLists'>
    <div className="busList">
      <div className="timer-bus">
        {/* <p>Redirecting in 9 min. 59 second</p> */}
        
      </div>
      <div className="B-lists-Top">
        <div className="text">
          <div className="back">
          <i onClick={backHandle} className="ri-arrow-left-s-line"></i>
          </div>
          <h5>
            <div className="destination">
              <h6>{from} - {to}</h6>
            </div>
          </h5>
         
          <div className="search-functinality">
            <button onClick={responsiveFilter} className='filter-bus'><i className="ri-equalizer-line"></i> Filter</button>
            <button onClick={navigateSearch}><i className="ri-pencil-fill"></i>Modify</button>

          </div>
        </div>
      </div>

      {/* Bottom section */}
      <div className="B-lists-Btm">


        <div className="bus-sidebar">
          <div className="busSide">
            <h5><i style={{marginTop:"0.1vmax"}} className="ri-filter-2-line"></i> Filters</h5>
            <div className="seat-type">
             
              <h6><i style={{fontWeight:"lighter"}} className="ri-price-tag-2-line"></i> Price</h6>
              <div className="filter-seat">
                <input
                  type="range"
                  className="form-range"
                  id="customRange1"
                  min="10"
                  max="10000"
                  step="1"
                  value={price}
                  onChange={handlePriceChange}
                />
              </div>
              <div className="price-display">
                <span>{price} INR</span>
              </div>
            </div>
           
            <div className="Travel-operator">
  <h6 onClick={toggleTravelList}>
    <span>Travel Operators</span>
    <i className={`ri-arrow-${isTravelListVisible ? 'up' : 'down'}-s-line down-aro`}></i>
  </h6>
  {isTravelListVisible && (
    <div className="travel-fixed">
      <div className="fix-trav">
      <div className="travel-list">
                  {searchResults.map((bus, index) => (
                    <small key={index} onClick={() => setOperatorFilter(bus.TravelName)}>{bus.TravelName}</small>
                  ))}
                </div>
      </div>
    </div>
  )}
</div>


          </div>
        </div>

           {/* -----------------------responsive sidebar--------------- */}

           {isSidebarVisible && (
        <div className="response-sidebar">
          <div className="bus-sidebar-responsive">
            <div className="c-filter">
              <i className="ri-close-circle-line" onClick={responsiveFilter}></i>
            </div>
            <div className="busSide">
              <h5>Filters</h5>
              <div className="seat-type">
                <h6>Price</h6>
                <div className="filter-seat">
                  <input
                    type="range"
                    className="form-range"
                    id="customRange1"
                    min="10"
                    max="10000"
                    step="1"
                    value={price}
                    onChange={handlePriceChange}
                  />
                </div>
                <div className="price-display">
                  <span>{price} INR</span>
                </div>
              </div>
              <div className="Travel-operator">
  <h6 onClick={toggleTravelList}>
    <span>Travel Operators</span>
    <i className={`ri-arrow-${isTravelListVisible ? 'up' : 'down'}-s-line down-aro`}></i>
  </h6>
  {isTravelListVisible && (
    <div className="travel-fixed-responsive">
      <div className="fix-trav">
      <div className="travel-list">
                  {searchResults.map((bus, index) => (
                    <small key={index} onClick={() => setOperatorFilter(bus.TravelName)}>{bus.TravelName}</small>
                  ))}
                </div>
      </div>
    </div>
  )}
</div>
            </div>
          </div>
        </div>
      )}
           {/* -----------------------responsive sidebar--------------- */}
            
           <div className="btm-lists">
      <div className="bus-divs">
        {status === 'loading' && <p>Loading...</p>}
        {status === 'failed' && <p className='text-danger'>{error}</p>}
        {status === 'succeeded' && (
          <>
            {filteredResults.map((bus, index) => (
              <div className="one" key={index}>
                <div className="one-top">
                  <div className="name">
                    <span>{bus.BusType}</span>
                    <img width={40} src={busImg} alt="Bus" />
                    <h5>{bus.TravelName}</h5>
                  </div>
                  <div className="drop-time">
                    <h6>
                      <small>ARRIVAL TIME: </small>
                      <span style={{ fontSize: "1.2vmax" }}>
                        {convertUTCToIST(bus.ArrivalTime)}
                      </span>
                    </h6>
                    <p style={{ fontSize: "1.2vmax", color: "red", borderBottom: "1px solid red" }}>
                      {calculateTimeDifference(bus.ArrivalTime, bus.DepartureTime)}
                    </p>
                    <h6>
                      <small>DROP TIME: </small>
                      <span style={{ fontSize: "1.2vmax" }}>
                        {convertUTCToIST(bus.DepartureTime)}
                      </span>
                    </h6>
                  </div>
                  <div className="price">
                    <h4>₹{Math.round(bus.Price.PublishedPrice * (1 - 0.18))}</h4>
                    <h6 style={{ textDecorationLine: 'line-through', color: "green" }}>₹1000</h6>
                  </div>
                </div>

                <div className="one-btm">
                  <div className="rating">
                    <a style={{ textDecoration: "none", color: 'green' }}>Available Seats {bus.AvailableSeats}</a>
                  </div>
                  <button className="btn btn-primary" onClick={() => handleSelectSeat(index)}>Select Seat</button>
                </div>

                {visibleLayout !== null && (
                  <div className="overlay" onClick={() => setVisibleLayout(null)}>
                    <div className="overlay-content" onClick={(e) => e.stopPropagation()}>
                      <div className="tppp">
                        <h5>{from}-{to} <br />
                          <span style={{ fontSize: "0.8vmax", color: "green" }}>({bus.TravelName})</span>
                        </h5>
                        <i onClick={() => setVisibleLayout(null)} className="ri-close-line"></i>
                      </div>
                      <BusLayout          selectedBusIndex={selectedBusIndex}  layoutResponse={layoutResponse} />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </>
        )}
      </div>
    </div>


      </div>
    </div>
    <EnterOtp showModal={showOtpOverlay} onClose={() => setShowOtpOverlay(false)} />
    </div>
  <Footer />
</>

  );
};

export default BusLists;