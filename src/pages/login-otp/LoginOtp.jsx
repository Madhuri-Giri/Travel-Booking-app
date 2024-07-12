import { useState, useEffect } from 'react';
import './LoginOtp.css';
import { useLocation, useNavigate } from 'react-router-dom';

const LoginOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const registeredEmail = location.state?.email || ''; 
  const userId = location.state?.userId || ''; 

  useEffect(() => {
    if (!userId || !registeredEmail) {
      setError('User ID or email not found.');
      console.error('User ID or email not found in state:', location.state);
    }
  }, [userId, registeredEmail]);

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');

  const handleInputChange = (index, value) => {
    if (/^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value.slice(0, 1);
      setOtp(newOtp);

      if (value !== '' && index < otp.length - 1) {
        const nextInput = document.getElementById(`otp-input-${index + 1}`);
        if (nextInput) {
          nextInput.focus();
        }
      }
    }
  };

  const verifyOTP = async () => {
    try {
      const enteredOTP = otp.join('');
      const response = await fetch('https://srninfotech.com/projects/travel-app/api/checkotp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          otp: enteredOTP,
          email: registeredEmail, 
          user_id: userId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('OTP verification successful!');
        navigate('/'); 
      } else {
        setError(data.message || 'Invalid OTP. Please try again.');
        console.log('Error response data:', data);
      }
    } catch (error) {
      setError('An error occurred. Please try again later.');
      console.error('Fetch error:', error);
    }
  };

  const resendOTP = async () => {
    try {
      const response = await fetch('https://srninfotech.com/projects/travel-app/api/resend-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setError(''); 
        console.log('Resend OTP request successful!');
      } else {
        setError(data.message || 'Failed to resend OTP. Please try again.');
        console.error('Error response data:', data);
      }
    } catch (error) {
      setError('An error occurred while resending OTP. Please try again later.');
      console.error('Fetch error:', error);
    }
  };

  return (
    <div className='LoginOtp'>
      <div className="login-otp">
        <h5>Enter 6 Digit OTP</h5>
        <p>A 6 digit code has been sent to your registered email</p>
        <div className="otp-box">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-input-${index}`}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleInputChange(index, e.target.value)}
              className="otp-input"
            />
          ))}
        </div>
        {error && <p className="error">{error}</p>}
        <div className="last">
          <p>Not received the code? <span onClick={resendOTP}>Resend</span></p>
        </div>
        <button className='verify-otp' onClick={verifyOTP}>Verify</button>
      </div>
    </div>
  );
};

export default LoginOtp;
