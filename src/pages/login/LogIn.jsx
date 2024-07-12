/* eslint-disable react/no-unescaped-entities */
import { useState } from 'react';
import "./LogIn.css";
import loginLogo from "../../assets/images/main logo.png";
import { Link, useNavigate } from 'react-router-dom';
import { RiEyeFill, RiEyeOffFill } from 'react-icons/ri';

const LogIn = () => {
  const navigate = useNavigate();
  const [passwordShown, setPasswordShown] = useState(false);
  const [formData, setFormData] = useState({
    mobile: '',
    password: ''
  });
  const [error, setError] = useState('');

  const togglePasswordVisibility = () => {
    setPasswordShown(!passwordShown);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.mobile.length !== 10) {
      setError('Mobile number must be exactly 10 digits.');
      return;
    }

    try {
      const response = await fetch('https://srninfotech.com/projects/travel-app/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mobile: formData.mobile,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Login successful!');
        navigate('/login-otp', { state: { email: data.data.email, userId: data.data.user_id } });
      } else {
        setError(data.message || 'An error occurred.');
        console.log('Error response data:', data);
      }
    } catch (error) {
      setError('An error occurred. Please try again later.');
      console.log('Fetch error:', error);
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
        <form onSubmit={submitHandler}>
          <div className="one">
            <label>Enter Your Mobile No</label>
            <input 
              type="number" 
              placeholder='' 
              name='mobile' 
              value={formData.mobile} 
              onChange={handleInputChange} 
              required 
            />
          </div>
          <div className="one">
            <label>Password</label>
            <div className="password-container">
              <input 
                type={passwordShown ? 'text' : 'password'} 
                placeholder='' 
                name='password' 
                value={formData.password} 
                onChange={handleInputChange} 
                required 
              />
              <span onClick={togglePasswordVisibility} className="password-toggle-icon">
                {passwordShown ? <RiEyeFill /> : <RiEyeOffFill />}
              </span>
            </div>
          </div>
          {error && <p className="error">{error}</p>}
          <div className="forgot">
            <Link style={{ textDecoration: "none", color: "#000", fontWeight: '700' }} to='/forgotpassword'>
              Forgot Your Password?
            </Link>
          </div>
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
