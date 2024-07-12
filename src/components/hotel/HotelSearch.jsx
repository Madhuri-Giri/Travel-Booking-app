import React, { useState, useRef, useEffect } from 'react';
import { Button, Container} from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './HotelSearch.css';
import hotel_img from '../../../src/assets/images/hotel_img.png';
import offer_img1 from '../../../src/assets/images/offer_img6.jpg';
import offer_img2 from '../../../src/assets/images/offer_img7.jfif';
import offer_img3 from '../../../src/assets/images/offer_img8.jpg';
import play_store_img from '../../../src/assets/images/play_store_img.png';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const HotelSearch = () => {
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
    return () => clearInterval(intervalRef.current);
  }, []);

  const [inputs, setInputs] = useState({
    cityOrHotel: '',
    checkIn: new Date(),
    checkOut: new Date(),
    adults: 1,
    children: 0
  });

  const [showGuestOptions, setShowGuestOptions] = useState(false);
  const guestRef = useRef(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setInputs(values => ({ ...values, [name]: value }));
  };

  const handleDateChange = (date, name) => {
    setInputs(values => ({ ...values, [name]: date }));
  };

  const handleGuestChange = (name, operation) => {
    setInputs(values => ({
      ...values,
      [name]: operation === 'increment' ? values[name] + 1 : values[name] > 0 ? values[name] - 1 : 0
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(inputs);
  };

  const handleClickOutside = (event) => {
    if (guestRef.current && !guestRef.current.contains(event.target)) {
      setShowGuestOptions(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1
        }
      }
    ]
  };

  return (
    <>
    
      <div className='hotel_container'>
        <div className='content-row'>
          <div className='image-col'>
            <img
              src={hotel_img}
              alt='hotelimage'
              className='hotel_img'
            />
          </div>
          <div className='content-col'>
            <p className='hotel_description'>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores dignissimos vel tempore dolore voluptas dolorem velit. Velit, eveniet dolorem? Esse facilis minus qui, corporis odit ipsam quasi necessitatibus repellendus reprehenderit! Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae, sed exercitationem at explicabo reiciendis sunt consequatur dolore voluptatibus totam a.
            </p>
            </div>
            </div>
<section>
      <div className='hotel_booking'>
        <form onSubmit={handleSubmit}>
          <div className='form-row'>
            <div className='form-field'>
              <label htmlFor='cityOrHotel'>City or Hotel Name: </label>
              <input
                type='text'
                id='cityOrHotel'
                name='cityOrHotel'
                placeholder='Enter city or hotel name'
                value={inputs.cityOrHotel}
                onChange={handleChange}
              />
            </div>
            <div className='form-field'>
              <label htmlFor='checkIn'>Check-In: </label>
              <DatePicker
                id='checkIn'
                selected={inputs.checkIn}
                onChange={date => handleDateChange(date, 'checkIn')}
              />
            </div>
            <div className='form-field'>
              <label htmlFor='checkOut'>Check-Out: </label>
              <DatePicker
                id='checkOut'
                selected={inputs.checkOut}
                onChange={date => handleDateChange(date, 'checkOut')}
              />
            </div>
            <div className='form-field'>
              <label htmlFor='guests'>Guests: </label>
              <input
                type='text'
                id='guests'
                name='guests'
                value={`${inputs.adults} Adults, ${inputs.children} Children`}
                onFocus={() => setShowGuestOptions(true)}
                readOnly
              />
              {showGuestOptions && (
                <div className='guest-options' ref={guestRef}>
                  <div className='guest-type'>
                    <span>Adults</span>
                    <Button  onClick={() => handleGuestChange('adults', 'decrement')}>-</Button>
                    <span>{inputs.adults}</span>
                    <Button  onClick={() => handleGuestChange('adults', 'increment')}>+</Button>
                  </div>
                  <div className='guest-type'>
                    <span>Children</span>
                    <Button  onClick={() => handleGuestChange('children', 'decrement')}>-</Button>
                    <span>{inputs.children}</span>
                    <Button onClick={() => handleGuestChange('children', 'increment')}>+</Button>
                  </div>
                  <Button className='btn_sub' onClick={() => setShowGuestOptions(false)}>Done</Button>
                </div>
              )}
            </div>
            <div>
              <Button type='submit' className='btn-sub'>
                Submit
              </Button>
            </div>
          </div>
        </form>
      </div>
      </section>
</div>

<section>
<Container>
<div className="Exclusive-offer">
        <h5>Exclusive <span style={{color:"#00b7eb"}}>Offers</span></h5>
        </div><div className='offer_container'>
      <div className='offer_box' onMouseEnter={stopAutoScroll} onMouseLeave={startAutoScroll}>
        <Slider ref={slideRef} {...settings}>
          <div>
            <img src={offer_img1} alt='offerimage' className='offer_img' />
          </div>
          <div>
            <img src={offer_img2} alt='offerimage' className='offer_img' />
          </div>
          <div>
            <img src={offer_img3} alt='offerimage' className='offer_img' />
          </div>
          <div>
            <img src={offer_img1} alt='offerimage' className='offer_img' />
          </div>
          <div>
            <img src={offer_img2} alt='offerimage' className='offer_img' />
          </div>
          <div>
            <img src={offer_img3} alt='offerimage' className='offer_img' />
          </div>
        </Slider>
      </div>
      </div>
      </Container>
      </section>

      <section>
      <div className='booking_head'>
      <h5>Hotel Booking <span style={{color:"#00b7eb"}}>Now</span></h5>
      </div>
      <div className="Hotel_Booking_container">
             <div className="booking_box">
                <h5>BOOK HOTEL FASTER.</h5>
                <h5> DOWNLOAD OUR MOBILE APPS TODAY</h5>
                <p>The application will help you find attractions, tours or adventures in a new city</p>
                
                <img className='play_store' src='https://play.google.com/intl/en_us/badges/images/generic/en_badge_web_generic.png' />
                <img className='apple_play_store' src={play_store_img}/>
             </div>
         </div>
         </section>
      </>
  );
}

export default HotelSearch;
