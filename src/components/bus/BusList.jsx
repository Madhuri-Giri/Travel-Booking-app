import { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './BusList.css';
import busImg from "../../assets/images/bus.png2.png";
import BusLayout from './BusLayout';
import { searchBuses } from '../../redux-toolkit/slices/busSlice';
import { useNavigate } from 'react-router-dom';

const BusLists = () => {
  const dispatch = useDispatch();
  const dateMidRef = useRef(null);
  const navigate = useNavigate();
  const [layoutResponse, setLayoutResponse] = useState(null);
  const { from, to, selectedBusDate, searchResults, status, error } = useSelector((state) => state.bus);

  const [visibleLayout, setVisibleLayout] = useState(null);
  const [isTravelListVisible, setIsTravelListVisible] = useState(false);
  const [timer, setTimer] = useState(600000);

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prev) => prev - 100);
    }, 100);

    if (timer <= 0) {
      clearInterval(countdown);
      navigate('/bus-search');
    }

    return () => clearInterval(countdown);
  }, [timer, navigate]);

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes} min ${seconds} sec left`;
  };

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

  const handleSelectSeat = async (index) => {
    setVisibleLayout(index);
    await addSeatLayout(); // Call the function to fetch and set the layout
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

  return (
    <div className='BusLists'>
      <div className="busList">
        <div className="timer-bus">
          <p>Redirecting in {formatTime(timer)}...</p>
        </div>
        <div className="B-lists-Top">
          <div className="text">
            <h5>
              <div className="destination">
                <i style={{ color: "#fff" }} className="ri-map-pin-line"></i>
                <p>{from}</p>
                <p><i style={{ fontSize: "1vmax" }} className="ri-arrow-left-right-line"></i></p>
                <p>{to}</p>
              </div>
            </h5>
            <span>
              <i style={{ color: "#fff" }} className="ri-calendar-line"></i>
              Depart Date: {selectedBusDate && (
                <>
                  {selectedBusDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' })}{' '}
                </>
              )}
            </span>
            <div className="search-functinality">
              <button onClick={navigateSearch}><i className="ri-pencil-fill"></i>Modify</button>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="B-lists-Btm">
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
                  <span> Travel Operators</span> <i className={`ri-arrow-${isTravelListVisible ? 'up' : 'down'}-s-line down-aro`}></i>
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
                  <i className={`ri-arrow-${isTravelListVisible ? 'up' : 'down'}-s-line down-aro`}></i>
                </h6>
                {searchResults.map((bus, index) => (
                  <div key={index}>
                    <div className="pick-list">
                      <p>
                        <span style={{ fontWeight: "600" }}>Pick-Up Point & Time:</span>
                        <small style={{ fontSize: '0.8vmax' }}>{bus.BoardingPoints.map((point, i) => (
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
                  <i className={`ri-arrow-${isTravelListVisible ? 'up' : 'down'}-s-line down-aro`}></i>
                </h6>
                {searchResults.map((bus, index) => (
                  <div key={index}>
                    <div className="drop-list">
                      <p>
                        <span style={{ fontWeight: "500" }}>Drop Points & Time:</span>
                        <small style={{ fontSize: '0.8vmax' }}>{bus.DroppingPoints.map((point, i) => (
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
                          <h4>${(bus.Price.BasePrice * (1 - 0.18)).toFixed(2)}</h4>
                          <h6 style={{ textDecorationLine: 'line-through', color: "#000000b9" }}>$1000</h6>
                        </div>
                      </div>

                      <div className="one-btm">
                        <div className="rating">
                          <a href="/bord-drop">boarding points<i className="ri-arrow-down-s-line"></i></a>
                          <a href='/bord-drop'>dropping points<i className="ri-arrow-down-s-line"></i></a>
                        </div>
                        <button className="btn btn-primary" onClick={() => handleSelectSeat(index)}>Select Seat</button>
                      </div>

                      {visibleLayout !== null && (
                        <div className="overlay" onClick={() => setVisibleLayout(null)}>
                          <div className="overlay-content" onClick={(e) => e.stopPropagation()}>
                            <div className="tppp">
                              <h5>{from}-{to} <br />
                                     <span style={{fontSize:"1vmax", color:"green"}}>({bus.TravelName})</span>
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
    </div>
  );
};

export default BusLists;
