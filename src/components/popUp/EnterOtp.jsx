import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { isBrowser, isMobile } from "react-device-detect";
import './EnterOtp.css'; 
import RegisterModal from "./RegisterPopup";
import LoginPopUp from "./LoginPopUp";

const EnterOtp = ({ showModal, onClose }) => {
  const [formData, setFormData] = useState({ mobile: "" });
  const [error, setError] = useState("");
  const [showRegisterModal, setShowRegisterModal] = useState(false); // State for RegisterModal
  const [showLoginModal, setShowLoginModal] = useState(false); // State for LoginModal
  const navigate = useNavigate();
  const deviceId = isBrowser ? "browser" : isMobile ? "mobile" : "unknown";

  const handleOtpRequest = async () => {
    const mobilePattern = /^[0-9]{10}$/;
    if (!mobilePattern.test(formData.mobile)) {
      setError("Please enter a valid mobile number (10 digits).");
      return;
    }

    try {
      const response = await fetch(
        "https://sajyatra.sajpe.in/admin/api/send-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mobile: formData.mobile,
            device_id: deviceId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("OTP verification failed");
      }

      const data = await response.json();
      console.log('send otp', data);

      localStorage.setItem("otpResponse", JSON.stringify(data));

      onClose(); 


      // Show the appropriate modal based on the user registration status
      if (data.user_registered) {
        setShowLoginModal(true);
      } else {
        setShowRegisterModal(true);
      }

    } catch (error) {
      console.error("Error:", error);
      setError("Failed to send OTP. Please try again.");
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  return (
    <>
      {showModal && <div className="modal-overlay" />} {/* Overlay div */}

      <Modal
        show={showModal}
        onHide={onClose} // Use the onClose prop to close the modal
        centered
        className="small-popup-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Enter Mobile Number</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="Login_container">
            <div className="login">
              <input
                type="number"
                placeholder="Enter Your Mobile Number"
                name="mobile"
                value={formData.mobile}
                onChange={handleInputChange}
                required
              />
              <div className="lgin">
                <Button onClick={handleOtpRequest}>Submit</Button>
              </div>
              {error && <div className="error-message">{error}</div>}
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <RegisterModal
        showModal={showRegisterModal}
        onClose={() => setShowRegisterModal(false)} 
      />

        <LoginPopUp
          showModal={showLoginModal}
          onClose={() => setShowLoginModal(false)}
        />
    </>
  );
};

export default EnterOtp;
