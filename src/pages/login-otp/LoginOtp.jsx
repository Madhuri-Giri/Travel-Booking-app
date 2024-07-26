import './LoginOtp.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginOtp = () => {
  const navigate = useNavigate(); // Initialize navigate
  const [otp, setOtp] = useState(['', '', '', '', '', '']); 

  const handleChange = (e, index) => {
    const newOtp = [...otp]; 
    newOtp[index] = e.target.value; 

    if (e.target.value && index < otp.length - 1) {
      document.getElementById(`otp-input-${index + 1}`).focus();
    }

    if (!e.target.value && index > 0) {
      document.getElementById(`otp-input-${index - 1}`).focus();
    }

    setOtp(newOtp); 
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index]) {
      if (index > 0) {
        document.getElementById(`otp-input-${index - 1}`).focus();
      }
    }
  };

  const handleVerify = () => {
    console.log('OTP entered:', otp.join(''));
  };

  const handleRegister = () => {
    navigate('/signup'); // Navigate to the registration page
  };

  return (
    <div className='LoginOtp'>
      <div className="login-otp">
        <h5></h5>
        <p>Enter Your Mobile Number</p>
        <div className="otp-box">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-input-${index}`} 
              type="text"
              maxLength={1}
              value={digit}
              className="otp-input"
              onChange={(e) => handleChange(e, index)} 
              onKeyDown={(e) => handleKeyDown(e, index)}
            />
          ))}
        </div>
        <button className='verify-otp' onClick={handleVerify}>Send Otp</button>
        <p>Don't have an account?</p>
        <div className='regbtn'>
          <button type="button" onClick={handleRegister}>Register</button>
        </div>
      </div>
    </div>
  );
};

export default LoginOtp;
