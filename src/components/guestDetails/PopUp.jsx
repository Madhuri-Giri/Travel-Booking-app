import React from 'react';
import '../guestDetails/PopUp.css'; // Ensure this path is correct

const Popup = ({ show, onClose, formData }) => {
    if (!show) return null;

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                {/* <button className="close-btn" onClick={onClose}>×</button> */}
                <h2>Form Details</h2>
                {formData && formData.map((data, index) => (
                    <div key={index} className="popup-form-data">
                    <div className="row">
                    <div className="col-md-6">
                        <p><strong>First Name:</strong> <span className="popup-input">{data.fname}</span></p>
                        <p><strong>Middle Name:</strong> <span className="popup-input">{data.mname}</span></p>
                        <p><strong>Last Name:</strong> <span className="popup-input">{data.lname}</span></p>
                        <p><strong>Age:</strong> <span className="popup-input">{data.age}</span></p>
                       
                        </div>
                        <div className="col-md-6">
                        <p><strong>Contact Number:</strong> <span className="popup-input">{data.mobile}</span></p>
                        <p><strong>Email:</strong> <span className="popup-input">{data.email}</span></p>
                        <p><strong>PAN No.:</strong> <span className="popup-input">{data.pan}</span></p>
                        <p><strong>Passport No.:</strong> <span className="popup-input">{data.passportNo}</span></p>
                    </div>
                    </div>
                    </div>
                ))}
                <button className="submit-btn" onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default Popup;
