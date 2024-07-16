import React, { useState, useRef, useEffect } from 'react';
import { Button, Row, Col, Container } from 'react-bootstrap';
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
import { useNavigate } from 'react-router-dom';

const HotelSearch = () => {
  const slideRef = useRef(null);
  const intervalRef = useRef(null);
  const scrollWidthRef = useRef(0);

  const navigate =  useNavigate()

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
    children: 0,
  });

  const [showGuestOptions, setShowGuestOptions] = useState(false);
  const guestRef = useRef(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleDateChange = (date, name) => {
    setInputs((values) => ({ ...values, [name]: date }));
  };

  const handleGuestChange = (name, operation) => {
    setInputs((values) => ({
      ...values,
      [name]: operation === 'increment' ? values[name] + 1 : values[name] > 0 ? values[name] - 1 : 0,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(inputs);

    navigate('/hotel-list')
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
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
    ],
  };

  const navigateHandler = () => {
    navigate('/hotel-list')
  }

  return (
    <>
      <div className="hotel_container">
        <div className="content_wrapper">
          <Row>
            <Col xl={4} md={12} className="order-md-1 order-2">
              <div className="content_box">
                <h1>Discover Your Perfect Getaway</h1>
                <p>
                  Experience luxury and comfort at Hotel. Located in the heart of City, our hotel offers top-notch
                  amenities and services.Explore our curated list of top-rated hotels tailored just for you.Choose from a
                  variety of room types to suit your needs and preferences.Enter your destination, dates, and preferences
                  to find the perfect stay.
                </p>
              </div>
            </Col>
            <Col xl={8} md={12} className="order-md-2 order-1">
              <div className="images_container">
                <img
                  src="https://cf.bstatic.com/xdata/images/hotel/270x200/31211348.jpg?k=45c6e30d9c7802e893d6046b03428c5c28318b4724f941f19e2b5631e5a47ad3&o="
                  alt="Image 1"
                  className="img_box image1"
                />
                <img
                  src="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/11/9e/89/c2/achat-comfort-city-frankfurt.jpg?w=300&h=-1&s=1"
                  alt="Image 2"
                  className="img_box image2"
                />
                <img
                  src="https://cf.bstatic.com/xdata/images/hotel/max200/485546587.jpg?k=932ec3cf4220d05e7a6e4b5b2bc397d5b71e415d9c7f659ef7f4b991e572a7eb&o=&hp=1"
                  alt="Image 3"
                  className="img_box image3"
                />
              </div>
            </Col>
          </Row>
        </div>

        <section className='w-100 d-flex align-items-center justify-content-center'>
          <div className="hotel_booking">
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-field">
                  <label className='form_lable' htmlFor="cityOrHotel">City or Hotel Name: </label>
                  <input className='form_in'
                    type="text"
                    id="cityOrHotel"
                    name="cityOrHotel"
                    placeholder="Enter city or hotel name"
                    value={inputs.cityOrHotel}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-field">
                  <label className='form_lable' htmlFor="checkIn">Check-In: </label>
                  <DatePicker className='form_in' id="checkIn" selected={inputs.checkIn} onChange={(date) => handleDateChange(date, 'checkIn')} />
                </div>
                <div className="form-field">
                  <label className='form_lable' htmlFor="checkOut">Check-Out: </label>
                  <DatePicker className='form_in'  id="checkOut" selected={inputs.checkOut} onChange={(date) => handleDateChange(date, 'checkOut')} />
                </div>
                <div className="form-field">
                  <label className='form_lable' htmlFor="guests">Guests: </label>
                  <input className='form_in'
                    type="text"
                    id="guests"
                    name="guests"
                    value={`${inputs.adults} Adults, ${inputs.children} Children`}
                    onFocus={() => setShowGuestOptions(true)}
                    readOnly
                  />
                  {showGuestOptions && (
                    <div className="guest-options" ref={guestRef}>
                      <div className="guest-type">
                        <span>Adults</span>
                        <Button onClick={() => handleGuestChange('adults', 'decrement')}>-</Button>
                        <span className='form_span'>{inputs.adults}</span>
                        <Button onClick={() => handleGuestChange('adults', 'increment')}>+</Button>
                      </div>
                      <div className="guest-type">
                        <span>Children</span>
                        <Button onClick={() => handleGuestChange('children', 'decrement')}>-</Button>
                        <span className='form_span'>{inputs.children}</span>
                        <Button onClick={() => handleGuestChange('children', 'increment')}>+</Button>
                      </div>
                      <Button className="btn_sub_guest" onClick={() => setShowGuestOptions(false)}>
                        Done
                      </Button>
                    </div>
                  )}
                </div>
                <div>
                  <label style={{visibility:"hidden"}} className='vbnm' htmlFor="guests">Guests: </label>
                   
                  <button  type="submit" className="btn-sub ">
                    Submit
                  </button>
                </div>
              </div>
            </form>
          </div>
        </section>
      </div>

      <section>
        <Container>
          <div className="Exclusive-offer">
            <h5>
              Exclusive <span style={{ color: '#00b7eb' }}>Offers</span>
            </h5>
          </div>
          <div className="offer_container">
            <div className="offer_box" onMouseEnter={stopAutoScroll} onMouseLeave={startAutoScroll}>
              <Slider ref={slideRef} {...settings}>
                <div>
                  <img src={offer_img1} alt="Offer Image 1" className="offer_img" />
                </div>
                <div>
                  <img src={offer_img2} alt="Offer Image 2" className="offer_img" />
                </div>
                <div>
                  <img src={offer_img3} alt="Offer Image 3" className="offer_img" />
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
};

export default HotelSearch;
