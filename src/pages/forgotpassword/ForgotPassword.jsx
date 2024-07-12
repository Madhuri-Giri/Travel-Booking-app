import  { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Form } from 'react-bootstrap';
import './ForgotPassword.css'

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showPasswordResetModal, setShowPasswordResetModal] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [resetError, setResetError] = useState('');

  const handleBackClick = () => {
    navigate('/login');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    const emailInput = email;

    setEmail(''); 

    try {
      const response = await fetch('https://srninfotech.com/projects/travel-app/api/forget-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: emailInput }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(data.message || 'Password reset link sent successfully.');
        alert(data.message || 'Password reset link sent successfully.');
        setShowPasswordResetModal(true);
      } else {
        setError(data.message || 'An error occurred.');
        console.log('Error response data:', data);
      }
    } catch (error) {
      setError('An error occurred. Please try again later.');
      console.log('Fetch error:', error);
    }
  };

  const handlePasswordResetSubmit = async () => {
    setResetError('');
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('https://srninfotech.com/projects/travel-app/api/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password: newPassword,
          confirm_password: confirmPassword,
          otp: otp.join(''),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('Password reset successfully. Please log in with your new password.');
        alert('Password reset successfully. Please log in with your new password.');
        setShowPasswordResetModal(false);
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setResetError(data.message || 'Invalid OTP or password reset failed.');
      }
    } catch (error) {
      setResetError('An error occurred. Please try again later.');
      console.log('Fetch error:', error);
    }
  };

  const handleOtpChange = (index, value) => {
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

  return (
    <div className='ForgotPassword'>
      <div className="forgot-password">
        <div className="top">
          <i className="ri-arrow-left-s-line" onClick={handleBackClick}></i>
          <h5>Forgot Password</h5>
        </div>
        <p>Enter email to reset your password 🔒</p>
        <form onSubmit={handleSubmit}>
          <div className="f-btm">
            <div className="iptf">
              <input
                type="email"
                placeholder='Enter your email address'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="sbt">
              <button type="submit">Submit</button>
            </div>
          </div>
        </form>
        {error && <p className="error">{error}</p>}
      </div>

      <Modal show={showPasswordResetModal} onHide={() => setShowPasswordResetModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Reset Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formNewPassword">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="formConfirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </Form.Group>
            {passwordError && <p className="error">{passwordError}</p>}
            <Form.Group controlId="formOtp">
              <Form.Label style={{ marginTop: '1vmax' }}>OTP</Form.Label>
              <div className="otp-box">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-input-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    className="otp-input"
                  />
                ))}
              </div>
            </Form.Group>
            {resetError && <p className="text-danger">{resetError}</p>}
            <Button style={{ marginTop: "2vmax", width: "100%" }} variant="primary" onClick={handlePasswordResetSubmit}>Reset Password</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ForgotPassword;
