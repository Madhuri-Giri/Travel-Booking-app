import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Button } from 'react-bootstrap';
import './HotelList.css'
const HotelList = () => {
  const [inputs, setInputs] = useState({
    destination: '',
    rooms: 1,
    adults: 1,
    children: 0,
    checkIn: new Date(),
    checkOut: new Date(),
  });

  const handleGuestChange = (name, operation) => {
    setInputs((values) => ({
      ...values,
      [name]: operation === 'increment' ? values[name] + 1 : values[name] > 0 ? values[name] - 1 : 0,
    }));
  };

  const handleDateChange = (date, name) => {
    setInputs((values) => ({ ...values, [name]: date }));
  };

  return (
    <div className='sidebar_container'>
      <div className='sidebar_box'>
        <div className='sidebar_block'>
          <h1 className='sidebar_wrapper'>Search</h1>
          <div className='sidebar_con'>
            <label>Destination</label>
            <input
              placeholder='Destination'
              type='text'
              value={inputs.destination}
              onChange={(e) => setInputs({ ...inputs, destination: e.target.value })}
            />
          </div>
          <div className='sidebar_con'>
            <label>Min price per night</label>
            <input
              placeholder='MinPrice'
              type='text'
              value={inputs.minprice}
              onChange={(e) => setInputs({ ...inputs, minprice: e.target.value })}
            />
          </div>
          <div className='sidebar_con'>
            <label>Max price per night</label>
            <input
              placeholder='MaxPrice'
              type='text'
              value={inputs.maxprice}
              onChange={(e) => setInputs({ ...inputs, maxprice: e.target.value })}
            />
          </div>
          <div className='sidebar_con'>
            <span>Rooms</span>
            <Button onClick={() => handleGuestChange('rooms', 'decrement')}>-</Button>
            {inputs.rooms}
            <Button onClick={() => handleGuestChange('rooms', 'increment')}>+</Button>
          </div>
          <div className='sidebar_con'>
            <span>Adults</span>
            <Button onClick={() => handleGuestChange('adults', 'decrement')}>-</Button>
            {inputs.adults}
            <Button onClick={() => handleGuestChange('adults', 'increment')}>+</Button>
          </div>
          <div className='sidebar_con'>
            <span>Children</span>
            <Button onClick={() => handleGuestChange('children', 'decrement')}>-</Button>
            {inputs.children}
            <Button onClick={() => handleGuestChange('children', 'increment')}>+</Button>
          </div>
          <div className='check_form'>
            <label>Check-In: </label>
            <DatePicker
              id='checkIn'
              selected={inputs.checkIn}
              onChange={(date) => handleDateChange(date, 'checkIn')}
            />
          </div>
          <div className='check_form'>
            <label>Check-Out: </label>
            <DatePicker
              id='checkOut'
              selected={inputs.checkOut}
              onChange={(date) => handleDateChange(date, 'checkOut')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelList;
