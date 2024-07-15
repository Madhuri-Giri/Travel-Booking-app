// src/components/BusSearch/BusSearch.js
import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setFrom, setTo, setFromSuggestions, setToSuggestions, setSelectedBusDate, searchBuses } from '../../redux-toolkit/slices/busSlice';
import BusMainImg from "../../assets/images/busMainImg.png";
import "./BusSearch.css";
import BusGurantee from './BusGurantee';

const BusSearch = () => {
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
      const response = await fetch(`https://srninfotech.com/projects/travel-app/api/bus_list?query=${query}`);
      const data = await response.json();
      const filteredSuggestions = data.data.filter(suggestion =>
        suggestion.busodma_destination_name.toLowerCase().includes(query.toLowerCase())
      );
      dispatch(setSuggestions(filteredSuggestions));
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const handleFromChange = (event) => {
    const value = event.target.value;
    dispatch(setFrom(value));
    if (value.length > 2) {
      fetchSuggestions(value, setFromSuggestions);
    } else {
      dispatch(setFromSuggestions([]));
    }
  };

  const handleToChange = (event) => {
    const value = event.target.value;
    dispatch(setTo(value));
    if (value.length > 2) {
      fetchSuggestions(value, setToSuggestions);
    } else {
      dispatch(setToSuggestions([]));
    }
  };

  const handleSuggestionClick = (suggestion, fieldSetter) => {
    fieldSetter(suggestion.busodma_destination_name);
  };

  const handleFromSelect = (suggestion) => {
    handleSuggestionClick(suggestion, setFrom);
    dispatch(setFromSuggestions([]));
  };

  const handleToSelect = (suggestion) => {
    handleSuggestionClick(suggestion, setTo);
    dispatch(setToSuggestions([]));
  };

  const handleSearch = () => {
    dispatch(searchBuses({ from, to, departDate: selectedBusDate ? selectedBusDate.toISOString().split('T')[0] : null }))
      .then(() => {
        navigate('/bus-list');
      })
      .catch((error) => {
        console.error('Error searching buses:', error);
      });
  };

  return (
    <>
      <div className='BusSearch'>
        <div className="bus-search">
          <div className="B-main">
            <div className="B-main-top">
              <img src={BusMainImg} alt="" />
            </div>
            <div className="B-main-btm">
              <div className="sarch-tab">
                <div className="one">
                  <div className="ipt">
                    <label>From</label>
                    <div className="input-content">
                      <i className="ri-map-pin-line"></i>
                      <input
                        type="text"
                        placeholder='Starting Point'
                        value={from}
                        onChange={handleFromChange}
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
                  <div className="ipt">
                    <label>To</label>
                    <div className="input-content">
                      <i className="ri-map-pin-line"></i>
                      <input
                        type="text"
                        placeholder='Destination'
                        value={to}
                        onChange={handleToChange}
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
                  <div className="ipt">
                    <label>Departure Date</label>
                    <div className="input-content">
                      <i className="ri-calendar-2-line" onClick={handleIconClick}></i>
                      <input
                        type="date"
                        placeholder=''
                        ref={dateInputRef}
                        className="date-input"
                        value={selectedBusDate ? selectedBusDate.toISOString().split('T')[0] : ''}
                        onChange={(e) => dispatch(setSelectedBusDate(new Date(e.target.value)))}
                        min={new Date().toISOString().split('T')[0]}
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
    </>
  );
};

export default BusSearch;
