import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2'; // Import SweetAlert2
import './Timer.css';

const TIMER_DURATION = 10 * 60 * 1000; // 1 minute in milliseconds

const TimerFlight = () => {
  const [timeRemaining, setTimeRemaining] = useState(TIMER_DURATION);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const now = Date.now();
    const startTime = localStorage.getItem('timerStartTime');
    const isFlightSearchPage = location.pathname === '/flight-list';

    if (isFlightSearchPage) {
      // Reset timer if navigating to /flight-list
      localStorage.setItem('timerStartTime', now.toString());
      
    } else if (startTime) {
      // Calculate remaining time
      const elapsedTime = now - parseInt(startTime, 10);
      const newTimeRemaining = TIMER_DURATION - elapsedTime;

      if (newTimeRemaining <= 0) {
        // Timer expired, navigate to /flight-search
        navigate('/flight-search');
        localStorage.removeItem('timerStartTime');
      } else {
        setTimeRemaining(newTimeRemaining);
      }
    } else {
      // Initialize timer if there's no start time in local storage
      localStorage.setItem('timerStartTime', now.toString());
    }

    const intervalId = setInterval(() => {
      const now = Date.now();
      const startTime = localStorage.getItem('timerStartTime');

      if (startTime) {
        const elapsedTime = now - parseInt(startTime, 10);
        const newTimeRemaining = TIMER_DURATION - elapsedTime;

        // Check if timer has expired
        if (newTimeRemaining <= 0) {
          clearInterval(intervalId);
          localStorage.removeItem('timerStartTime');
          navigate('/flight-search');
        } else {
          setTimeRemaining(newTimeRemaining);

          // Display alert when there are 5 seconds left
          if (newTimeRemaining <= 5000 && newTimeRemaining > 4000) {
            Swal.fire({
              title: 'Your session has expired.',
              text: 'Please try again.',
              icon: 'warning',
              confirmButtonText: 'Okay'
            });
          }
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
      <p>Time remaining: {getFormattedTime(timeRemaining)}</p>
    </div>
  );
};

export default TimerFlight;
