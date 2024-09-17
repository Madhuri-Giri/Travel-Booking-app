import { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './BusList.css';
import busImg from "../../assets/images/bus.png2.png";
import BusLayout from './BusLayout';
import { searchBuses } from '../../redux-toolkit/slices/busSlice';
import { useNavigate } from 'react-router-dom';
import Footer from '../../pages/footer/Footer';
import CustomNavbar from '../../pages/navbar/CustomNavbar';
import EnterOtp from '../popUp/EnterOtp';
import TimerBus from '../timmer/TimerBus';
const BusLists = () => {
  const dispatch = useDispatch();
  const dateMidRef = useRef(null);
  const navigate = useNavigate();
  const [layoutResponse, setLayoutResponse] = useState(null);
  const { from, to, selectedBusDate, searchResults, status, error } = useSelector((state) => state.bus);

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

    localStorage.setItem('selectedBusDetails', JSON.stringify(selectedBusDetails));
  };
  

  const handleSelectSeat = async (index) => {
    
    const loginId = localStorage.getItem('loginId');
    // console.log('Current loginId:', loginId); 

     await useridHandler();


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

  const useridHandler = async () => {

  const loginId = localStorage.getItem('loginId');
     
    try {
      const requestBody = {
        user_id:loginId , 
      };
  
      const response = await fetch('https://sajyatra.sajpe.in/admin/api/user-detail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch user details');
      }
  
      const data = await response.json();
      console.log('User details:', data);
      // console.log('trans', data.transaction.transaction_num)
      if (data.result && data.transaction) {
        localStorage.setItem('transactionIdBus', data.transaction.id);
        localStorage.setItem('transactionNum', data.transaction.transaction_num);
      }
    } catch (error) {
      console.error('Error fetching user details:', error.message);
    }
  };
  


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



  const addSeatLayout = async () => {
    try {
      const traceId = localStorage.getItem('traceId');
      console.log('trace bus', traceId)
      const resultIndex = localStorage.getItem('resultIndex');
      console.log('resultIndex bus', resultIndex)


      if (!traceId || !resultIndex) {
        throw new Error('TraceId or ResultIndex not found in localStorage');
      }

      const response = await fetch('https://sajyatra.sajpe.in/admin/api/add-seat-layout', {
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
       console.log('seat layoout', data)

      localStorage.setItem('BuslayoutResponse', JSON.stringify(data));
      setLayoutResponse(data);

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

  // const filteredResults = searchResults.filter(bus => {
  //   const withinPrice = bus.Price.BasePrice <= priceFilter;
  //   const matchesOperator = operatorFilter ? bus.TravelName === operatorFilter : true;
  //   return withinPrice && matchesOperator;
  // });

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
          {/* <span>
            <i style={{ color: "#fff" }} className="ri-calendar-line"></i>
            Depart Date: {selectedBusDate && (
              <>
                {selectedBusDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' })}{' '}
              </>
            )}
          </span> */}
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
            {/* <div className="Travel-operator">
              <h6 onClick={toggleTravelList}>
                <span> Travel Operators</span> <i className={`ri-arrow-${isTravelListVisible ? 'up' : 'down'}-s-line down-aro`}></i>
              </h6>
             
              <div className="travel-fixed">
                 <div className="fix-trav">
                 {isTravelListVisible && (
                <div className="travel-list">
                  {searchResults.map((bus, index) => (
                    <p key={index} onClick={() => setOperatorFilter(bus.TravelName)}>{bus.TravelName}</p>
                  ))}
                </div>
              )}
                 </div>
              </div>
            </div> */}
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
                    <p key={index} onClick={() => setOperatorFilter(bus.TravelName)}>{bus.TravelName}</p>
                  ))}
                </div>
      </div>
    </div>
  )}
</div>

             
            <div className="pick-up">
  <h6 onClick={togglePickupVisibility}>
    <span>{from} </span>
    <i className={`ri-arrow-${isPickupVisible ? 'up' : 'down'}-s-line down-aro`}></i>
  </h6>
  {isPickupVisible && searchResults.map((bus, index) => (
    <div key={index} className="pick-list">
      <p>
        <span style={{ fontWeight: "600" }}>Pick-Up Point & Time:</span>
        <small style={{ fontSize: '0.8vmax' }}>{bus.BoardingPoints.map((point, i) => (
          <div key={i}>
            {point.CityPointLocation} ({convertUTCToIST(bus.ArrivalTime)})
          </div>
        ))}</small>
      </p>
    </div>
  ))}
</div>

<div className="drop-up">
  <h6 onClick={toggleDropVisibility}>
    <span>{to} </span>
    <i className={`ri-arrow-${isDropVisible ? 'up' : 'down'}-s-line down-aro`}></i>
  </h6>
  {isDropVisible && searchResults.map((bus, index) => (
    <div key={index} className="drop-list">
      <p>
        <span style={{ fontWeight: "500" }}>Drop Points & Time:</span>
        <small style={{ fontSize: '0.8vmax' }}>{bus.DroppingPoints.map((point, i) => (
          <div key={i}>
            {point.CityPointLocation} ({convertUTCToIST(bus.ArrivalTime)})
          </div>
        ))}</small>
      </p>
    </div>
  ))}
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
                  <div className="travel-list">
                    {searchResults.map((bus, index) => (
                      <p key={index} onClick={() => setOperatorFilter(bus.TravelName)}>{bus.TravelName}</p>
                    ))}
                  </div>
                )}
              </div>

              <div className="pick-up">
                <h6 onClick={togglePickupVisibility}>
                  <span>Pick-Up Point</span>
                  <i className={`ri-arrow-${isPickupVisible ? 'up' : 'down'}-s-line down-aro`}></i>
                </h6>
                {isPickupVisible && searchResults.map((bus, index) => (
                  <div key={index} className="pick-list">
                    <p>
                      <span style={{ fontWeight: "600" }}>Pick-Up Point & Time:</span>
                      <small style={{ fontSize: '0.8vmax' }}>{bus.BoardingPoints.map((point, i) => (
                        <div key={i}>
                          <h3>{point.CityPointLocation} ({convertUTCToIST(bus.ArrivalTime)})</h3>
                        </div>
                      ))}</small>
                    </p>
                  </div>
                ))}
              </div>

              <div className="drop-up">
                <h6 onClick={toggleDropVisibility}>
                  <span>Drop Points</span>
                  <i className={`ri-arrow-${isDropVisible ? 'up' : 'down'}-s-line down-aro`}></i>
                </h6>
                {isDropVisible && searchResults.map((bus, index) => (
                  <div key={index} className="drop-list">
                    <p>
                      <span style={{ fontWeight: "500" }}>Drop Points & Time:</span>
                      <small style={{ fontSize: '0.8vmax' }}>{bus.DroppingPoints.map((point, i) => (
                        <div key={i}>
                          <h3>{point.CityPointLocation} ({convertUTCToIST(bus.ArrivalTime)})</h3>
                        </div>
                      ))}</small>
                    </p>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>
      )}
           {/* -----------------------responsive sidebar--------------- */}
            
        



        {/* Bus lists */}
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
                        <h6><small>ARRIVAL TIME: </small><span style={{ fontSize: "1.2vmax" }}>
                          {convertUTCToIST(bus.ArrivalTime)}
                        </span></h6>
                        <p style={{ fontSize: "1.2vmax", color: "red", borderBottom: "1px solid red" }}>
                          {calculateTimeDifference(bus.ArrivalTime, bus.DepartureTime)}
                        </p>
                        <h6><small>DROP TIME: </small><span style={{ fontSize: "1.2vmax" }}>
                          {convertUTCToIST(bus.DepartureTime)}
                        </span></h6>
                      </div>
                      <div className="price">
                      <h4>₹{Math.round(bus.Price.BasePrice * (1 - 0.18))}</h4>
                    <h6 style={{ textDecorationLine: 'line-through', color: "green" }}>₹1000</h6>
                      </div>
                    </div>

                    <div className="one-btm">
                      <div className="rating">
                        <a style={{ textDecoration: "none", color: 'green' }}>select boarding & droping points</a>
                        {/* <a style={{ textDecoration: "none", color: 'green' }}>dropping points</a> */}
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
                          <BusLayout layoutResponse={layoutResponse} />
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