import React from 'react';
import payloader from "../../assets/images/payment.gif";
import '../../pages/loading/PayloaderHotel.css'; 

const PayloaderHotel = () => {
  return (
    <div className="hotel_bg_img">
      <div className='hotel_payload'>
        <img src={payloader} alt="Loading..." />
        <h5>Payment updated successfully.</h5>
      </div>
      <div className='hotel_payload'>
        <h5>Please wait, your booking is processing.</h5>
      </div>
    </div>
  );
};

export default PayloaderHotel;
