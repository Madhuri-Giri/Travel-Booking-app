/* eslint-disable react/no-unescaped-entities */
import { useState } from 'react';
import "./LogIn.css";
import loginLogo from "../../../assets/images/main logo.png"
import { Link, useNavigate } from 'react-router-dom';
import { RiEyeFill, RiEyeOffFill } from 'react-icons/ri';

const LogIn = () => {
  const navigate = useNavigate();
  const [otpShown, setOtpShown] = useState(false);
  const [formData, setFormData] = useState({
    mobile: '',
    otp: ''  
  });
  const [error, setError] = useState('');

  const toggleOtpVisibility = () => {
    setOtpShown(!otpShown);
  };

  const loginHandler = async (e) => {
    e.preventDefault();
    try {
        const response = await fetch('https://sajyatra.sajpe.in/admin/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (response.ok) {
            console.log('login successful:', data);
            localStorage.setItem('loginId', data.data.id);
            navigate('/flight-search');
        } else {
            console.log('login failed:', data);
        }
    } catch (error) {
        console.error('Error:', error);
    }
};

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  return (
    <div className='Login'>
      <div className="login">
        <div className="logo">
          <img src={loginLogo} alt="Logo" />
        </div>
        <h5>Login to Your Account <span>!</span></h5>
        <form onSubmit={loginHandler}>
          <div className="one">
            <label>Enter Your Mobile No</label>
            <input 
              type="number" 
              placeholder='Enter Your Mobile Number' 
              name='mobile' 
              value={formData.mobile} 
              onChange={handleInputChange} 
              required 
            />
          </div>
          <div className="one">
            <label>OTP</label>
            <div className="password-container">
              <input 
                type={otpShown ? 'text' : 'password'} 
                placeholder='Enter Your OTP' 
                name='otp'  
                value={formData.otp} 
                onChange={handleInputChange} 
                required 
              />
              <span onClick={toggleOtpVisibility} className="password-toggle-icon">
                {otpShown ? <RiEyeFill /> : <RiEyeOffFill />}
              </span>
            </div>
          </div>
          {error && <p className="error">{error}</p>}
          
          <div className="lgin">
            <button type="submit">Login</button>
          </div>
          <p>Don't have an account?</p>
          <div className='regbtn'>
            <Link to='/signup' style={{ textDecoration: 'none' }}>
              <button type="button">Register</button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LogIn;
