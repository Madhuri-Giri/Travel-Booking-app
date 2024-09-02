// LoginPopUp Component
import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { RiEyeFill, RiEyeOffFill } from 'react-icons/ri';
import { Link } from 'react-router-dom';
import "../popUp/LoginPopUp.css";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginPopUp = ({ showModal, onClose, prefilledMobile }) => {
  const [otpShown, setOtpShown] = useState(false);
  const [formData, setFormData] = useState({
    mobile: prefilledMobile || '',  // Initialize with prop value
    otp: ''
  });

  const [error, setError] = useState('');

  useEffect(() => {
    // Update formData.mobile if prefilledMobile changes
    setFormData(prevData => ({ ...prevData, mobile: prefilledMobile }));
  }, [prefilledMobile]);

  const toggleOtpVisibility = () => {
    setOtpShown(prev => !prev);
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
        localStorage.setItem('loginId', data.data.id);
        localStorage.setItem('loginData', JSON.stringify(data.data));

        toast.success('Login successful!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        onClose();
      } else {
        setError(data.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  return (
    <>
      {showModal && <div className="custom-overlay"></div>}
      <Modal 
        show={showModal} 
        onHide={onClose} 
        size="md" 
        centered 
        className="small-popup-modal"
        backdrop="static"
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
                    id="mobileNo"
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
