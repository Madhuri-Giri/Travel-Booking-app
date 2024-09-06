import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Timer.css';

const TIMER_DURATION = 10 * 60 * 1000; // 10 minutes in milliseconds

const TimerBus = () => {
  const [timeRemaining, setTimeRemaining] = useState(TIMER_DURATION);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const now = Date.now();
    const startTime = localStorage.getItem('timerStartTime');
    const isHotelSearchPage = location.pathname == '/bus-list';

    if (isHotelSearchPage) {
      // Reset timer if navigating to /bus-search
      localStorage.setItem('timerStartTime', now.toString());
      setTimeRemaining(TIMER_DURATION);
    } else if (startTime) {
      const elapsedTime = now - parseInt(startTime, 10);
      const newTimeRemaining = TIMER_DURATION - elapsedTime;

      if (newTimeRemaining <= 0) {
        // Timer expired, navigate to /bus-search
        navigate('/bus-search');
        localStorage.removeItem('timerStartTime');
      } else {
        setTimeRemaining(newTimeRemaining);
      }
    } else {
      // Initialize timer if there's no start time in local storage
      localStorage.setItem('timerStartTime', now.toString());
      setTimeRemaining(TIMER_DURATION);
    }

    const intervalId = setInterval(() => {
      const now = Date.now();
      const startTime = localStorage.getItem('timerStartTime');

      if (startTime) {
        const elapsedTime = now - parseInt(startTime, 10);
        const newTimeRemaining = TIMER_DURATION - elapsedTime;

        if (newTimeRemaining <= 0) {
          clearInterval(intervalId);
          navigate('/bus-search');
          localStorage.removeItem('timerStartTime');
        } else {
          setTimeRemaining(newTimeRemaining);
        }
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [navigate, location.pathname]);

  const getFormattedTime = (milliseconds) => {
    const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className='timer'>
      <h5 style={{marginTop:"1vmax", fontFamily:"cursive"}}>Remaining Time... {getFormattedTime(timeRemaining)}</h5>
    </div>
  );
};

export default TimerBus;
