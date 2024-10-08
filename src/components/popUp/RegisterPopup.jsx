import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { RiEyeFill, RiEyeOffFill } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import "../popUp/RegisterPopup.css";
import Lottie from 'lottie-react';
import LottieImg from '../../assets/images/languageanimation.json';

const RegisterModal = ({ showModal, onClose, mobile }) => {
  const navigate = useNavigate();
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [formData, setFormData] = useState({
    name: '',
    mobile: mobile || '', // Pre-fill mobile number if available
    email: '',
    otp: '',
    code: '',
    agreeTerms: false
  });
  const [otpShown, setOtpShown] = useState(false); 
  const [error, setError] = useState(""); // State for error messages

  const toggleOtpVisibility = () => {
    setOtpShown(!otpShown);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://new.sajpe.in/api/v1/user/login', { // Use correct API endpoint for registration
        method: 'POST',
        headers: {
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Registration successful:', data);
        navigate('/login-popup'); // Navigate to login page on successful registration
      } else {
        console.log('Registration failed:', data);
        setError(data.message || "Registration failed. Please try again."); // Show error message
      }
    } catch (error) {
      console.error('Error:', error);
      setError("An error occurred during registration. Please try again.");
    }
  };                                    

  const loginHandler = () => {
    navigate('/login-popup');
  };

  const toggleLanguageDropdown = () => {
    setShowLanguageDropdown(!showLanguageDropdown);
  };

  const closeLanguageDropdown = () => {
    setShowLanguageDropdown(false);
  };

  const selectLanguage = (language) => {
    setSelectedLanguage(language);
    setShowLanguageDropdown(false);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    setError(""); // Clear error message on input change
  };

  return (
    <>
      <Modal
        show={showModal}
        onHide={onClose}
        size="lg"
        centered
        className="popup-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Register Your Account</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="Join_Container">
            <div className="Join">
              <div className="JoinLeft">
                <Lottie animationData={LottieImg} className="lottie-img" />
              </div>
              <div className="JoinRight">
                <div className="Medium">
                  <form onSubmit={submitHandler}>
                    {['name', 'mobile', 'email', 'code'].map(field => (
                      <div className="one" key={field}>
                        <label htmlFor={field}>{`Enter Your ${field.charAt(0).toUpperCase() + field.slice(1)}`}</label>
                        <div className="int">
                          <input
                            type={field === 'email' ? 'email' : 'text'}
                            name={field}
                            id={field}
                            placeholder={`Enter Your ${field.charAt(0).toUpperCase() + field.slice(1)}`}
                            value={formData[field]}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                    ))}
                    <div className="one">
                      <label htmlFor="otp">Enter Your OTP</label>
                      <div className="int password-container">
                        <input
                          type={otpShown ? 'text' : 'password'}
                          name="otp"
                          id="otp"
                          placeholder="Enter Your OTP"
                          value={formData.otp}
                          onChange={handleInputChange}
                          required
                        />
                        <span onClick={toggleOtpVisibility} className="password-toggle-icon">
                          {otpShown ? <RiEyeFill /> : <RiEyeOffFill />}
                        </span>
                      </div>
                    </div>
                    {error && <div className="error-message">{error}</div>} {/* Display error message */}
                    <p>
                      <input
                        type="checkbox"
                        name="agreeTerms"
                        id="agreeTerms"
                        checked={formData.agreeTerms}
                        onChange={handleInputChange}
                        required
                      />
                      I agree to the Terms Of Services and Privacy Policy
                    </p>
                    <div className="one">
                      <button type="submit">Register</button>
                    </div>
                    <div className="line">
                      <p>Already a member?</p>
                    </div>
                    <div className="one">
                      <button type="button" onClick={loginHandler}>Login</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default RegisterModal;
