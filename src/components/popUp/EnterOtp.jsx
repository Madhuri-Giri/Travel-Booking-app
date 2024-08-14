import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { isBrowser, isMobile } from "react-device-detect";
import './EnterOtp.css'; 

const EnterOtp = () => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ mobile: "", otp: "" });
  const [otpShown, setOtpShown] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const deviceId = isBrowser ? "browser" : isMobile ? "mobile" : "unknown";

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate mobile number
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
      console.log(data);

      localStorage.setItem("otpResponse", JSON.stringify(data));

      if (data.user_registered) {
        navigate("/register");
      } else {
        navigate("/register");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to verify OTP. Please try again.");
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const toggleOtpVisibility = () => {
    setOtpShown(!otpShown);
  };

  return (
    <>
      <Button onClick={() => setShowModal(true)}>Enter Number</Button>

      {showModal && <div className="modal-overlay" />} {/* Overlay div */}

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        className="small-popup-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Enter Mobile Number</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="Login_container">
            <div className="login">
              <form onSubmit={handleSubmit}>
                <div className="one">
                  <input
                    type="number"
                    placeholder="Enter Your Mobile Number"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="lgin">
                  <button type="submit">Submit</button>
                </div>
                {error && <div className="error-message">{error}</div>}
              </form>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default EnterOtp;
