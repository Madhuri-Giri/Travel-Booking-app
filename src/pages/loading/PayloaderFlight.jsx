import React from 'react';
import payloader from "../../assets/images/payment.gif";
import '../../pages/loading/PayloaderFlight.css'; 

const PayloaderFlight = () => {
  return (
    <div className="flight_bg_img">
      <div className='flight_payload'>
        <img src={payloader} alt="Loading..." />
        <h5>Payment updated successfully.</h5>
      </div>
      <div className='flight_payload'>
        <h5>Please wait, your booking is processing.</h5>
      </div>
    </div>
  );
};

export default PayloaderFlight;
