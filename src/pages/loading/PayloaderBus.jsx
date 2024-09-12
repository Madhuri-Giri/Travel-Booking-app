import React from 'react';
import payloader from "../../assets/images/payment.gif";
import '../../pages/loading/PayloaderBus.css'; 

const PayloaderBus = () => {
  return (
    <div className="bus_bg_img">
      <div className='bus_payload'>
        <img src={payloader} alt="Loading..." />
        <h5>Payment updated successfully.</h5>
      </div>
      <div className='bus_payload'>
        <h5>Please wait, your booking is processing.</h5>
      </div>
    </div>
  );
};

export default PayloaderBus;
