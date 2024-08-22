import { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  setFrom,
  setTo,
  setFromSuggestions,
  setToSuggestions,
  setSelectedBusDate,
  searchBuses
} from '../../redux-toolkit/slices/busSlice';
// import BusMainImg from "../../assets/images/busMainImg.png";
import busAnim from "../../assets/images/mainBus.json"
import Lottie from 'lottie-react';
import "./BusSearch.css";
import BusGurantee from './BusGurantee';
import Loading from '../../pages/loading/Loading';
import CustomNavbar from '../../pages/navbar/CustomNavbar';
import Footer from '../../pages/footer/Footer';

const BusSearch = () => {
  const [loading, setLoading] = useState(false);
  const dateInputRef = useRef(null);

  const handleIconClick = () => {
    dateInputRef.current.showPicker();
  };

  const today = new Date().toISOString().split('T')[0];

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { from, to, fromSuggestions, toSuggestions, selectedBusDate } = useSelector((state) => state.bus);

  const fetchSuggestions = async (query, setSuggestions) => {
    try {
      const response = await fetch(`https://sajyatra.sajpe.in/admin/api/bus_list`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query })
      });
      const data = await response.json();

      // Filter suggestions on the client side for partial matches
      const filteredSuggestions = data.data.filter(suggestion =>
        suggestion.busodma_destination_name.toLowerCase().includes(query.toLowerCase())
      );

      dispatch(setSuggestions(filteredSuggestions.slice(0, 7))); // Limit to 7 suggestions
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const handleFromChange = (event) => {
    const value = event.target.value;
    dispatch(setFrom(value));
    if (value.length >= 1) {
      fetchSuggestions(value, setFromSuggestions);
    } else {
      dispatch(setFromSuggestions([]));
    }
  };

  const handleToChange = (event) => {
    const value = event.target.value;
    dispatch(setTo(value));
    if (value.length >= 1) {
      fetchSuggestions(value, setToSuggestions);
    } else {
      dispatch(setToSuggestions([]));
    }
  };

  const handleFromFocus = () => {
    fetchSuggestions(from, setFromSuggestions);
  };

  const handleToFocus = () => {
    fetchSuggestions(to, setToSuggestions);
  };

  const handleFromSelect = (suggestion) => {
    dispatch(setFrom(suggestion.busodma_destination_name));
    dispatch(setFromSuggestions([]));
  };

  const handleToSelect = (suggestion) => {
    dispatch(setTo(suggestion.busodma_destination_name));
    dispatch(setToSuggestions([]));
  };

  const handleSearch = () => {
    setLoading(true);
    dispatch(searchBuses({ from, to, departDate: selectedBusDate ? selectedBusDate.toISOString().split('T')[0] : null }))
      .then(() => {
        setLoading(false);
        navigate('/bus-list');
      })
      .catch((error) => {
        setLoading(false);
        console.error('Error searching buses:', error);
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
            {/* <img src={BusMainImg} alt="" /> */}
            <Lottie className='lotti-bus' animationData={busAnim} style={{ marginTop:"-4vmax"}}  />
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
                    <ul className="suggestions-list">
                      {fromSuggestions.map((suggestion, index) => (
                        <li key={index} onClick={() => handleFromSelect(suggestion)}>
                          {suggestion.busodma_destination_name}
                        </li>
                      ))}
                    </ul>
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
                    <ul className="suggestions-list">
                      {toSuggestions.map((suggestion, index) => (
                        <li key={index} onClick={() => handleToSelect(suggestion)}>
                          {suggestion.busodma_destination_name}
                        </li>
                      ))}
                    </ul>
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
                      min={today}
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
