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
  const [from, setFromState] = useState(''); // Local state for 'from'
  const [to, setToState] = useState(''); // Local state for 'to'
  const [selectedBusDate, setSelectedBusDateState] = useState(''); // Local state for date
  const dateInputRef = useRef(null);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { fromSuggestions, toSuggestions, fromCode, toCode } = useSelector((state) => state.bus);

  // Fetch IP Address
  useEffect(() => {
    const fetchIPAddress = async () => {
      try {
        const response = await axios.get('https://api.ipify.org?format=json');
        console.log('IP Address:', response.data.ip);
      } catch (error) {
        console.error('Error fetching IP address:', error);
      }
    };
    fetchIPAddress();
  }, []);

  const handleIconClick = () => {
    dateInputRef.current.showPicker();
  };

  const now = new Date();
  let minDate = now.toISOString().split('T')[0]; // Format as YYYY-MM-DD

  const fetchSuggestions = async (query, isFromField) => {
    try {
      const response = await fetch(`https://sajyatra.sajpe.in/admin/api/bus_list`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query })
      });
      const data = await response.json();

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
    setFromState(value); // Update local state
    if (value.length >= 1) {
      fetchSuggestions(value, true);
    } else {
      dispatch(setFromSuggestions([]));
    }
  };

  const handleToChange = (event) => {
    const value = event.target.value;
    setToState(value); // Update local state
    if (value.length >= 1) {
      fetchSuggestions(value, false);
    } else {
      dispatch(setToSuggestions([]));
    }
  };

  const handleDateChange = (e) => {
    const dateValue = e.target.value;
    if (dateValue) {
      const dateObj = new Date(dateValue);
      if (!isNaN(dateObj)) {
        setSelectedBusDateState(dateObj); // Update local state
      }
    }
  };

  const handleSearch = () => {
    setLoading(true);
    dispatch(searchBuses({
      from,
      to,
      departDate: selectedBusDate instanceof Date && !isNaN(selectedBusDate.getTime())
        ? selectedBusDate.toISOString().split('T')[0]
        : null,
      fromCode,
      toCode
    }))
      .then((response) => {
        setLoading(false);
        console.log('response:', response.payload);

        if (response.payload.result === false) {
          Swal.fire({
            title: "No buses found",
            text: response.payload.message || "Please try again later.",
            icon: "warning",
            confirmButtonText: "OK",
          });
        } else {
          navigate('/bus-list');
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error('Error searching buses:', error);
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
                      />
                    </div>
                    {fromSuggestions.length > 0 && (
                      <div className="suggestions-list-from">
                        {fromSuggestions.map((suggestion) => (
                          <span key={suggestion.busodma_destination_code} onClick={() => {
                            setFromState(suggestion.busodma_destination_name);
                            dispatch(setFrom(suggestion.busodma_destination_name));
                            dispatch(setFromCode(suggestion.busodma_origin_code));
                            dispatch(setFromSuggestions([]));
                          }}>
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
                      />
                    </div>
                    {toSuggestions.length > 0 && (
                      <div className="suggestions-list-to">
                        {toSuggestions.map((suggestion, index) => (
                          <span key={index} onClick={() => {
                            setToState(suggestion.busodma_destination_name);
                            dispatch(setTo(suggestion.busodma_destination_name));
                            dispatch(setToCode(suggestion.busodma_origin_code));
                            dispatch(setToSuggestions([]));
                          }}>
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
                        value={selectedBusDate instanceof Date && !isNaN(selectedBusDate.getTime())
                          ? selectedBusDate.toISOString().split('T')[0]
                          : ''}
                        onChange={handleDateChange}
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
