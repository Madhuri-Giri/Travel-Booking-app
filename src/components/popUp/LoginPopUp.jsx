import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { RiEyeFill, RiEyeOffFill } from 'react-icons/ri';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import loginLogo from "../../../src/assets/images/main logo.png";
import "../popUp/LoginPopUp.css";

const LoginPopUp = ({ showModal, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [otpShown, setOtpShown] = useState(false);
  const [formData, setFormData] = useState({
    mobile: '',
    otp: ''  
  });
  const [error, setError] = useState('');

  const toggleOtpVisibility = () => {
    setOtpShown(prev => !prev);
  };

  const loginHandler = async (e) => {
    e.preventDefault();
    const { state } = location;

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
        console.log('Login successful:', data);
        localStorage.setItem('loginId', data.data.id);
        localStorage.setItem('loginData', JSON.stringify(data.data));
        const redirectTo = state?.from || '/flight-search';
        navigate(redirectTo);
        
        onClose();  // Close the modal on successful login
      } else {
        setError(data.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  return (
    <>
      <Modal 
        show={showModal} 
        onHide={onClose} 
        size="md" 
        centered 
        className="small-popup-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Login to Your Account</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='Login_container'>
            <div className="login">
              <form onSubmit={loginHandler}>
                <div className="one">
                  <label htmlFor="mobile">Enter Your Mobile No</label>
                  <input 
                    type="tel" 
                    placeholder='Enter Your Mobile Number' 
                    name='mobile' 
                    id="mobile"
                    value={formData.mobile} 
                    onChange={handleInputChange} 
                    required 
                    pattern="[0-9]{10}"
                  />
                </div>
                <div className="one">
                  <label htmlFor="otp">OTP</label>
                  <div className="password-container">
                    <input 
                      type={otpShown ? 'text' : 'password'} 
                      placeholder='Enter Your OTP' 
                      name='otp'  
                      id="otp"
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
        </Modal.Body>
      </Modal>
    </>
  );
};

export default LoginPopUp;
