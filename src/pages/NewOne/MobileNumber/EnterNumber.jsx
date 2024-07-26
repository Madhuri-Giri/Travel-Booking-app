import './EnterNumber.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { BrowserView, MobileView, isBrowser, isMobile } from 'react-device-detect';

const EnterNumber = () => {
  const [error, setError] = useState('');
  const [mobile, setMobile] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate
  const deviceId = isBrowser ? 'browser' : isMobile ? 'mobile' : 'unknown'; 

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate mobile number
    const mobilePattern = /^[0-9]{10}$/; // Adjust the pattern as needed for your use case
    if (!mobilePattern.test(mobile)) {
      setError('Please enter a valid mobile number (10 digits).');
      return;
    }

    try {
      const response = await fetch('https://app.sajpe.in/api/v1/user/send_otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mobile: mobile, 
          device_id: deviceId, 
        }),
      });

      if (!response.ok) {
        throw new Error('OTP verification failed');
      }

      const data = await response.json();
      console.log(data);

      // Save response data to local storage
      localStorage.setItem('otpResponse', JSON.stringify(data));

      if (data.user_registered) {
        navigate('/login'); 
      } else {
        navigate('/signup'); 
      }

    } catch (error) {
      console.error('Error:', error);
      setError('Failed to verify OTP. Please try again.');
    }
  };

  const inputHandler = (e) => {
    setMobile(e.target.value); 
    setError(''); // Clear error message on input change
  };

  return (
    <div className='ForgotPassword'>
      <div className="forgot-password">
        <div className="top">
          <h5></h5>
        </div>
        <p>Enter your mobile number</p>
        <form onSubmit={handleSubmit}>
          <div className="f-btm">
            <div className="iptf">
              <input
                type="number"
                placeholder='Enter your mobile number'
                required
                value={mobile}
                onChange={inputHandler}
              />
            </div>
            <div className="sbt">
              <button type="submit">Send OTP</button>
            </div>
          </div>
          {error && <p className="error-message">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default EnterNumber;
