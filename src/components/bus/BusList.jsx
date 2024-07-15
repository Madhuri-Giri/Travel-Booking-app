import React, { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './BusList.css';
import busImg from "../../assets/images/bus.png2.png";
import { searchBuses } from '../../redux-toolkit/slices/busSlice';
import BusLayout from './BusLayout';

const BusLists = () => {
  const dispatch = useDispatch();
  const dateMidRef = useRef(null);
  const { from, to, selectedBusDate, searchResults, status, error } = useSelector((state) => state.bus);

  // State to manage the visibility of layout data for each bus
  const [visibleLayout, setVisibleLayout] = useState({});

  useEffect(() => {
    // Dispatch the searchBuses action when component mounts
    if (!searchResults.length) {
      dispatch(searchBuses({ from: 'Bhopal', to: 'Indore', departDate: '2024-07-26' })); // Replace with actual values or props
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

  const dates = generateDates(30);

  // Sample data for sidebar
  const seatTypes = ['Sleeper', 'Seater'];
  const travelOperators = ['Operator 1', 'Operator 2', 'Operator 3'];
  const pickUpPoints = ['Point A', 'Point B'];
  const dropPoints = ['Point C', 'Point D'];

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

  return (
    <div className='BusLists'>
      <div className="busList">
        {/* ----------------------------------------------------------------------------------------------- */}
        <div className="B-lists-Top">
          <div className="text">
            <h5><i style={{color:"#00b7eb"}} className="ri-map-pin-line"></i> 
            <div className="destination">
              <p><small style={{color:"#00b7eb"}}>From</small>{from}</p>
              <i style={{fontSize:"1.5vmax", color:"#00b7eb"}} className="ri-arrow-left-right-line"></i>
              <p><small style={{color:"#00b7eb"}}>To</small>{to}</p>
            </div></h5>
            <span>
  <i style={{color:"#00b7eb"}} className="ri-calendar-line"></i> 
  Depart Date: {selectedBusDate && (
    <>
      {selectedBusDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' })}{' '}
      {selectedBusDate.toLocaleString('default', { month: 'short' })}
    </>
  )}
</span>
          </div>
        </div>
        {/* ----------------------------------------------------------------------------------------------- */}

        <div className="B-lists-Btm">
          {/* -----------------sidebar-start--------------- */} 
          <div className="bus-sidebar">
            <div className="busSide">
              <h5>Filters</h5>
              <div className="seat-type">
                <h6>Seat Type</h6>  
                <div className="filter-seat">
                  {seatTypes.map((seat, index) => (
                    <p key={index} style={{cursor:'pointer'}}>{seat}</p>
                  ))}
                </div> 
              </div>
              <div className="Travel-operator">
                <h6>Travel Operators</h6>  
                <div className="travel-list">
                  {travelOperators.map((operator, index) => (
                    <p key={index}>{operator}</p>
                  ))}
                </div>
              </div>
              <div className="pick-up">
                <h6><span>Pick Up Points </span> <span>Pick Up Time: <small style={{color:"#000000b9"}}>12 AM</small></span></h6>  
                <div className="pick-list">
                  {pickUpPoints.map((point, index) => (
                    <p key={index}>{point}</p>
                  ))}
                </div>
              </div>
              <div className="drop-up">
                <h6><span>Drop Points</span> <span>Drop Time: <small style={{color:"#000000b9"}}>12 AM</small></span></h6>  
                <div className="drop-list">
                  {dropPoints.map((point, index) => (
                    <p key={index}>{point}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* -----------------sidebar-end--------------- */}

          {/* --------------------btm-lists-start--------------- */}
          <div className="btm-lists">
            {/* ---------------date slider start---------------------------- */}
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
            {/* ---------------date slider end------------------------------- */}
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
                          <h6><small>Arrival Time: </small><span style={{color:"#000000b9", fontSize:"1.3vmax"}}>
                            {convertUTCToIST(bus.ArrivalTime)}
                          </span></h6>
                          <h6><small>Drop Time: </small><span style={{color:"#000000b9", fontSize:"1.3vmax"}}>
                            {convertUTCToIST(bus.DepartureTime)}
                          </span></h6>
                        </div>
                        <div className="price">
                          <h4>${bus.Price.BasePrice}</h4>
                          <h6 style={{textDecorationLine:'line-through', color:"#000000b9"}}>$1000{bus.Price.OriginalPrice}</h6>
                          <p><i className="ri-wheelchair-line"></i>{bus.AvailableSeats} seats left</p>
                        </div>
                      </div>
                      <div className="one-btm">
                        <div className="rating">
                          <p>{bus.Ratings} Ratings</p>
                        </div>
                        <button onClick={() => toggleLayoutVisibility(index)}>
                          {visibleLayout[index] ? 'Hide Seat' : 'Select Seat'}
                        </button>
                      </div>
                      {visibleLayout[index] && (
                        <div className="kuch-bhi">
                            <BusLayout bus={bus} />
                        </div>
                      )}
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
          {/* ------------------------btm-lists-end-------------------------------- */}
        </div>
      </div>
    </div>
  );
};

export default BusLists;
