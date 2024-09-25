/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  setFrom,
  setTo,
  setFromCode,
  setToCode,
  setFromSuggestions,
  setToSuggestions,
  setSelectedBusDate,
  searchBuses
} from '../../redux-toolkit/bus/busSlice';
import busAnim from "../../assets/images/mainBus.json";
import Lottie from 'lottie-react';
import "./BusSearch.css";
import BusGurantee from './BusGurantee';
import Loading from '../../pages/loading/Loading';
import CustomNavbar from '../../pages/navbar/CustomNavbar';
import Footer from '../../pages/footer/Footer';
import axios from 'axios';
import Swal from 'sweetalert2';

const BusSearch = () => {
  const [loading, setLoading] = useState(false);
  const dateInputRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { from, to, fromSuggestions, toSuggestions, selectedBusDate, fromCode, toCode } = useSelector((state) => state.bus);

  // Function to fetch the IP address
  const fetchIPAddress = async () => {
    try {
      const response = await axios.get('https://api.ipify.org?format=json');
      console.log('IP Address:', response.data.ip);
    } catch (error) {
      console.error('Error fetching IP address:', error);
    }
  };

  // Fetch the IP address when the component mounts
  useEffect(() => {
    fetchIPAddress();
  }, []);

  const handleIconClick = () => {
    dateInputRef.current.showPicker();
  };

  // const today = new Date();
  // today.setHours(0, 0, 0, 0); // Set time to midnight to avoid time issues
  // const minDate = today.toISOString().split('T')[0]; // Format as YYYY-MM-DD

  const now = new Date();
  let minDate;

  // Check if the current time is after 12 AM
  if (now.getHours() >= 0) {
    now.setHours(24, 0, 0, 0); // Set the time to midnight (12:00 AM) of the next day
  } else {
    now.setHours(0, 0, 0, 0); // If it's before midnight, allow today
  }

  minDate = now.toISOString().split('T')[0]; // Format as YYYY-MM-DD

  const fetchSuggestions = async (query, setSuggestions, isFromField) => {
    try {
      const response = await fetch(`https://sajyatra.sajpe.in/admin/api/bus_list`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query })
      });
      const data = await response.json();

      // console.log('Suggestions Data:', data); 

      const filteredSuggestions = data.data.filter(suggestion =>
        suggestion.busodma_destination_name.toLowerCase().includes(query.toLowerCase())
      );

      if (isFromField) {
        dispatch(setFromSuggestions(filteredSuggestions.slice(0, 7)));
      } else {
        dispatch(setToSuggestions(filteredSuggestions.slice(0, 7)));
      }

    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const handleFromChange = (event) => {
    const value = event.target.value;
    dispatch(setFrom(value));
    if (value.length >= 1) {
      fetchSuggestions(value, setFromSuggestions, true);
    } else {
      dispatch(setFromSuggestions([]));
    }
  };

  const handleToChange = (event) => {
    const value = event.target.value;
    dispatch(setTo(value));
    if (value.length >= 1) {
      fetchSuggestions(value, setToSuggestions, false);
    } else {
      dispatch(setToSuggestions([]));
    }
  };

  const handleFromFocus = () => {
    fetchSuggestions(from, setFromSuggestions, true);
  };

  const handleToFocus = () => {
    fetchSuggestions(to, setToSuggestions, false);
  };

  const handleFromSelect = (suggestion) => {
    // console.log('Selected From Suggestion:', suggestion); 
    dispatch(setFrom(suggestion.busodma_destination_name));
    dispatch(setFromCode(suggestion.busodma_origin_code));
    dispatch(setFromSuggestions([]));
  };

  const handleToSelect = (suggestion) => {
    // console.log('Selected To Suggestion:', suggestion); 
    dispatch(setTo(suggestion.busodma_destination_name));
    dispatch(setToCode(suggestion.busodma_origin_code));
    dispatch(setToSuggestions([]));
  };

  const handleSearch = () => {
    setLoading(true);
    dispatch(searchBuses({
      from,
      to,
      departDate: selectedBusDate ? selectedBusDate.toISOString().split('T')[0] : null,
      fromCode,
      toCode
    }))
      .then((response) => {
        setLoading(false);
        console.log('responseeeee', response.payload );
        
        // Check if the result is false and show the SweetAlert if no results are found
        if (response.payload.result === false) {
          console.log('responseeeee', response.payload );
          Swal.fire({
            title: "No buses found",
            text: response.payload.message || "Please try again later.",
            icon: "warning",
            confirmButtonText: "OK",
          });
        } else {
          // If buses are found, navigate to the bus list
          navigate('/bus-list');
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error('Error searching buses:', error);
  
        // Show an error SweetAlert if the API call fails
        Swal.fire({
          title: "Error",
          text: "There was an error searching buses. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
      });
  };
  

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <CustomNavbar />
      <div className='BusSearch'>
        <div className="bus-search">
          <div className="B-main">
            <div className="B-main-top">
              {/* {/ <img src={BusMainImg} alt="" /> /} */}
              <Lottie className='lotti-bus' animationData={busAnim} style={{ marginTop: "-4vmax" }} />
            </div>
            <div className="B-main-btm">
              <div className="sarch-tab">
                <div className="one">
                  <div className="ipt-bus">
                    <label>From</label>
                    <div className="ipt-handle">
                      <i className="ri-map-pin-line"></i>
                      <input
                        type="text"
                        placeholder='Starting Point'
                        value={from}
                        onChange={handleFromChange}
                        onFocus={handleFromFocus}
                      />
                    </div>

                    {fromSuggestions.length > 0 && (
                      <div className="suggestions-list-from">
                        {fromSuggestions.map((suggestion) => (
                          <span key={suggestion.busodma_destination_code} onClick={() => handleFromSelect(suggestion)}>
                            {suggestion.busodma_destination_name}
                          </span>
                        ))}
                      </div>
                    )}


                  </div>
                </div>
                <div className="one">
                  <div className="ipt-bus">
                    <label>To</label>
                    <div className="ipt-handle">
                      <i className="ri-map-pin-line"></i>
                      <input
                        type="text"
                        placeholder='Destination'
                        value={to}
                        onChange={handleToChange}
                        onFocus={handleToFocus}
                      />
                    </div>
                    {toSuggestions.length > 0 && (
                      <div className="suggestions-list-to">
                        {toSuggestions.map((suggestion, index) => (
                          <span key={index} onClick={() => handleToSelect(suggestion)}>
                            {suggestion.busodma_destination_name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="one">
                  <div className="ipt-bus" onClick={handleIconClick}>
                    <label>Departure Date</label>
                    <div className="ipt-handle">
                      <i className="ri-calendar-2-line"></i>
                      <input
                        type="date"
                        ref={dateInputRef}
                        className="date-input"
                        value={selectedBusDate ? selectedBusDate.toISOString().split('T')[0] : ''}
                        onChange={(e) => dispatch(setSelectedBusDate(new Date(e.target.value)))}
                        min={minDate}
                      />
                    </div>
                  </div>
                </div>

                <div className="search-bus-btn">
                  <label>Search Bus</label>
                  <button onClick={handleSearch}>Search Buses</button>
                </div>
              </div>
            </div>
          </div>
          <BusGurantee />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BusSearch;