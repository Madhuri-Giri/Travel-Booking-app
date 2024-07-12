import React, { useRef, useEffect } from 'react';
import './BusGurantee.css';
import { Link } from 'react-router-dom';

const BusGurantee = () => {
  const slideRef = useRef(null);
  const intervalRef = useRef(null);
  const scrollWidthRef = useRef(0);

  const startAutoScroll = () => {
    intervalRef.current = setInterval(() => {
      if (slideRef.current) {
        const imageWidth = slideRef.current.querySelector('img').clientWidth + 32; // Including gap between images
        scrollWidthRef.current += imageWidth;
        
        slideRef.current.scrollTo({
          left: scrollWidthRef.current,
          behavior: 'smooth',
        });

        // Reset scroll to start when it reaches the end
        if (scrollWidthRef.current >= slideRef.current.scrollWidth - slideRef.current.clientWidth) {
          scrollWidthRef.current = 0;
          slideRef.current.scrollTo({
            left: 0,
            behavior: 'auto',
          });
        }
      }
    }, 2000); // Adjust scroll interval as needed
  };

  const stopAutoScroll = () => {
    clearInterval(intervalRef.current);
  };

  useEffect(() => {
    startAutoScroll();

    // Clean up interval on component unmount
    return () => {
      stopAutoScroll();
    };
  }, []);

  return (
    <div className='BusPage'>
      <div className="gurantee">
        <h5>SajYatra <span style={{color:"#00b7eb"}}>Guarantee</span></h5>
        <div className="g-pages">
          <div className="g-one">
            <div className="g-left">
              <i className="ri-bus-fill"></i>
            </div>
            <div className="g-right">
              <h6>FAST BOOKING</h6>
              <p>We offer fast booking, fantastic products, competitive pricing & amazing experience.</p>
            </div>
          </div>
          <div className="g-one">
            <div className="g-left">
              <i className="ri-shake-hands-fill"></i>
            </div>
            <div className="g-right">
              <h6>EXCITING DEALSFAST BOOKING</h6>
              <p>Enjoy exciting deals on flights, hotels, buses, car rental, tour packages and more.</p>
            </div>
          </div>
          <div className="g-one">
            <div className="g-left">
              <i className="ri-folder-user-fill"></i>
            </div>
            <div className="g-right">
              <h6>24/7 SUPPORT</h6>
              <p>Get assistance 24/7 on any kind of travel-related query. We are happy to assist you. We offer any kind of travel.</p>
            </div>
          </div>
        </div>
      </div>
      {/* ----------------- */}
      <div className="Exclusive-offer">
        <h5>Exclusive <span style={{color:"#00b7eb"}}>Offers</span></h5>
        <div className="offer-slider" onMouseEnter={stopAutoScroll} onMouseLeave={startAutoScroll}>
          <div className="slide" ref={slideRef}>
            <img src="https://static.abhibus.com/offerbanners/Jun2024/04/1717450497-hrtc-bus-offer.webp" alt="Offer 1" />
            <img src="https://www.vimaansafar.com/img/bus-image-5.png" alt="Offer 2" />
            <img src="https://www.vimaansafar.com/img/bus-image-3.png" alt="Offer 3" />
            <img src="https://static.abhibus.com/offerbanners/Jun2024/04/1717450497-hrtc-bus-offer.webp" alt="Offer 4" />
            <img src="https://www.vimaansafar.com/img/bus-image-5.png" alt="Offer 5" />
            <img src="https://www.vimaansafar.com/img/bus-image-3.png" alt="Offer 6" />
          </div>
        </div>
      </div>
      {/* ---------------------- */}
         <div className="Download-app">
             <div className="bus-text">
                <h5>BOOK TICKET FASTER.</h5>
                <h5> DOWNLOAD OUR MOBILE APPS TODAY</h5>
                <p>The application will help you find attractions, tours or adventures in a new city</p>
                <a href="/"><small>Android App On</small><span><i style={{fontWeight:"lighter"}} className="ri-google-play-line"></i>Google Play</span></a>
             </div>
         </div>
    </div>
  );
};

export default BusGurantee;
