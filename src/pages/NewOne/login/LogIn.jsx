/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'; // <-- Import useDispatch from Redux
import "./LogIn.css";
import loginLogo from "../../../assets/images/main logo.png"
import { Link, useNavigate } from 'react-router-dom';
import { RiEyeFill, RiEyeOffFill } from 'react-icons/ri';
import { useLocation } from 'react-router-dom';
import { setLoginData, setTransactionDetails } from '../../../redux-toolkit/slices/loginSlice'; // <-- Import the setLoginData action
import { userLogin } from '../../../API/loginAction';

const LogIn = () => {

  // const loginData = useSelector((state) => state.loginReducer); // Assuming the slice is named 'login'
  // console.log('slice login data:', loginData);
  // console.log('usedetailss:', loginData.userData);
  // console.log('transactions details:', loginData.transactionDetails);
  // console.log('login id:', loginData.loginId);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { mobileNumber } = location.state || {};
  const [otpShown, setOtpShown] = useState(false);
  const [formData, setFormData] = useState({
    // mobile: '',
    mobile: mobileNumber || '',  // Initialize with prop value
    otp: ''
  });

  const [error, setError] = useState('');

  const toggleOtpVisibility = () => {
    setOtpShown(!otpShown);
  };

  const loginHandler = async (e) => {
    e.preventDefault();

    dispatch(userLogin({ formData, setError, navigate }))
    // try {
    //   const response = await fetch('https://sajyatra.sajpe.in/admin/api/login', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify(formData)
    //   });

    //   const data = await response.json();

    //   if (response.ok) {
    //     console.log('login successful:', data);
    //     localStorage.setItem('loginId', data.data.id);
    //     localStorage.setItem('loginData', JSON.stringify(data.data));

    //     // save login datas on the Redux
    //     dispatch(setLoginData({
    //       // userData: data.data,
    //       loginId: data.data.id,
    //       loginData: data.data,
    //       transactionDetails: null, // To be updated after userDetailsHandler
    //     }));


    //     // Call the userDetailsHandler after setting the loginId
    //     await userDetailsHandler();

    //     const redirectTo = state?.from ? state.from : '/flight-search';
    //     navigate(redirectTo);
    //   } else {
    //     console.log('login failed:', data);
    //     setError('Login failed. Please check your credentials.');
    //   }
    // } catch (error) {
    //   console.error('Error:', error);
    //   setError('An error occurred. Please try again later.');
    // }
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
