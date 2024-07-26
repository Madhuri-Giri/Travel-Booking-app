import { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './BusList.css';
import busImg from "../../assets/images/bus.png2.png";
import BusLayout from './BusLayout';
import { searchBuses } from '../../redux-toolkit/slices/busSlice';


const BusLists = () => {
  const dispatch = useDispatch();
  const dateMidRef = useRef(null);
  const [layoutResponse, setLayoutResponse] = useState(null);
  const { from, to, selectedBusDate, searchResults, status, error } = useSelector((state) => state.bus);

  // State to manage the visibility of layout data for each bus
  const [visibleLayout, setVisibleLayout] = useState({});

  const [isTravelListVisible, setIsTravelListVisible] = useState(false);
  

  useEffect(() => {
    // Dispatch the searchBuses action when component mounts
    if (!searchResults.length) {
      dispatch(searchBuses({ from: 'Bhopal', to: 'Indore', departDate: '2024-07-26' })); 
    }
  }, [dispatch, searchResults.length]);

 
  const generateDates = (numDays) => {
    const dates = [];
    const today = new Date();
  
    for (let i = 0; i < numDays; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
  
    return dates;
  };
  
  // Example usage
  const numDays = 30; // Number of future days including today
  const dates = generateDates(numDays);
  
  const scrollLeft = () => {
    dateMidRef.current.scrollBy({
      left: -150,  // Adjust the value as per your requirement
      behavior: 'smooth',
    });
  };
  
  const scrollRight = () => {
    dateMidRef.current.scrollBy({
      left: 150,  // Adjust the value as per your requirement
      behavior: 'smooth',
    });
  };
  


  // Function to convert UTC time to IST
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

  const toggleTravelList = () => {
    setIsTravelListVisible((prev) => !prev);
  };

  
 

  const addSeatLayout = async () => {
    try {
      const traceId = localStorage.getItem('traceId');
      const resultIndex = localStorage.getItem('resultIndex');
  
      if (!traceId || !resultIndex) {
        throw new Error('TraceId or ResultIndex not found in localStorage');
      }
  
      const response = await fetch('https://sajyatra.sajpe.in/admin/api/AddseatLayout', {
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
  
      setLayoutResponse(data);
      
  
    } catch (error) {
      console.error('Error adding seat layout:', error.message);
    }
  };
  



  return (
    <div className='BusLists'>
      <div className="busList">
        {/* Top section */}
        <div className="B-lists-Top">
          <div className="text">
            <h5>
              <i style={{ color: "#00b7eb" }} className="ri-map-pin-line"></i>
              <div className="destination">
                <p><small style={{ color: "#00b7eb" }}>From</small>{from}</p>
                <i style={{ fontSize: "1.5vmax", color: "#00b7eb" }} className="ri-arrow-left-right-line"></i>
                <p><small style={{ color: "#00b7eb" }}>To</small>{to}</p>
              </div>
            </h5>
            <span>
              <i style={{ color: "#00b7eb" }} className="ri-calendar-line"></i>
              Depart Date: {selectedBusDate && (
                <>
                  {selectedBusDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' })}{' '}
                  {selectedBusDate.toLocaleString('default', { month: 'short' })}
                </>
              )}
            </span>
          </div>
        </div>

        {/* Bottom section */}
        <div className="B-lists-Btm">
          {/* Sidebar */}
          <div className="bus-sidebar">
            <div className="busSide">
              <h5>Filters</h5>
              <div className="seat-type">
                <h6>Seat Type</h6>
                <div className="filter-seat">
                      <div className="sleeper">
                          <p>Sleeper</p>
                      </div>
                      <div className="seater">
                      <p>Seater</p>
                      </div>
                </div>
              </div>
              <div className="Travel-operator"> 
                <h6 onClick={toggleTravelList}>
                <span> Travel Operators</span> <i  className={`ri-arrow-${isTravelListVisible ? 'up' : 'down'}-s-line down-aro`}></i>
                </h6>
                {isTravelListVisible && (
                  <div className="travel-list">
                    {searchResults.map((bus, index) => (
                      <p key={index}>{bus.TravelName}</p>
                    ))}
                  </div>
                )}
              </div>
              <div className="pick-up">
              <h6>
                <span>{from} </span>
              <i  className={`ri-arrow-${isTravelListVisible ? 'up' : 'down'}-s-line down-aro`}></i>
              </h6>
                {searchResults.map((bus, index) => (
                     <div key={index}>
                     <div className="pick-list">
                      <p>
                      <span style={{fontWeight:"600"}}>Pick-Up Point & Time:</span>
                      <small style={{fontSize:'0.8vmax'}}>{bus.BoardingPoints.map((point, i) => (
                        <div key={i}>
                           {point.CityPointLocation} ({convertUTCToIST(bus.ArrivalTime)})
                        </div>
                      ))}</small> 
                      </p>
                     </div>
                     </div>
                ))}
              </div>
              <div className="drop-up">
              <h6>
                <span>{to} </span>
              <i  className={`ri-arrow-${isTravelListVisible ? 'up' : 'down'}-s-line down-aro`}></i>
              </h6>
                 {searchResults.map((bus, index) => (       
                     <div key={index}>
                     <div className="drop-list">
                      <p>
                      <span style={{fontWeight:"500"}}>Drop Points & Time:</span>
                      <small style={{fontSize:'0.8vmax'}}>{bus.DroppingPoints.map((point, i) => (
                        <div key={i}>
                           {point.CityPointLocation} ({convertUTCToIST(bus.ArrivalTime)})
                        </div>
                      ))}</small> 
                      </p>
                     </div>
                     </div>
                ))}
              </div>
             
            </div>
          </div>

          {/* Bus lists */}
          <div className="btm-lists">
{/* ----------------------------------------------------------------------------------------------------------------- */}
            <div className="date-slider">
              <div className="d-slide">
                <div className="date-left" onClick={scrollLeft}>
                  <i className="ri-arrow-left-s-line"></i>
                </div>
                <div className="date-mid" ref={dateMidRef}>
                  {dates.map((date, index) => (
                    <div className="d-one" key={index}>
                      <h6>{date.toDateString()}</h6>
                    </div>
                  ))}
                </div>
                <div className="date-right" onClick={scrollRight}>
                  <i className="ri-arrow-right-s-line"></i>
                </div>
              </div>
            </div>
{/* -------------------------------------------------------------------------------------------------------- */}
            <div className="bus-divs">
              {status === 'loading' && <p>Loading...</p>}
              {status === 'failed' && <p>{error}</p>}
              {status === 'succeeded' && (
                <>
                  {searchResults.map((bus, index) => (
                    <div className="one" key={index}>
                      <div className="one-top">
                        <div className="name">
                          <span>{bus.BusType}</span>
                          <img width={40} src={busImg} alt="Bus" />
                          <h5>{bus.TravelName}</h5>
                        </div>
                        <div className="drop-time">
                          <h6><small>Arrival Time: </small><span style={{ color: "#000000b9", fontSize: "1.3vmax" }}>
                            {convertUTCToIST(bus.ArrivalTime)}
                          </span></h6>
                          <h6><small>Drop Time: </small><span style={{ color: "#000000b9", fontSize: "1.3vmax" }}>
                            {convertUTCToIST(bus.DepartureTime)}
                          </span></h6>
                        </div>
                        <div className="price">
                          <h4>${bus.Price.BasePrice}</h4>
                          <h6 style={{ textDecorationLine: 'line-through', color: "#000000b9" }}>$1000</h6>
                        </div>
                      </div>

                      <div className="one-btm">
                        <div className="rating">
                          <p>{bus.Ratings} Ratings</p>
                        </div>
                        <button onClick={() => {
                          toggleLayoutVisibility(index);  
                          addSeatLayout();
                        }}>
                          {visibleLayout[index] ? 'Hide Seat' : 'Select Seat'}
                        </button>
                      </div>
                      {/* --------------------------------------------------------------------------------------------------------------- */}

                      {visibleLayout[index] && (
                       <BusLayout layoutResponse={layoutResponse} />
                      )}


                      {/* ------------------------------------------------------------------------------------------------------------------------- */}

                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusLists;
