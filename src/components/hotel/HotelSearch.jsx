import React, { useState, useRef } from 'react';
import { Row, Col, Button, Form, Container } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './HotelSearch.css';
import hotel_img from '../../../src/assets/images/hotel_img.png';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import offer_img1 from '../../../src/assets/images/offer_img6.jpg';
import offer_img2 from '../../../src/assets/images/offer_img7.jfif';
 import offer_img3 from '../../../src/assets/images/offer_img8.jpg';

const HotelSearch = () => {
  const [inputs, setInputs] = useState({
    cityOrHotel: '',
    checkIn: new Date(),
    checkOut: new Date(),
    adults: 1,
    children: 0
  });
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
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
  
  const [showGuestOptions, setShowGuestOptions] = useState(false);
  const guestRef = useRef(null);

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
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

  React.useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className='hotel_container'>
        <Row className='align-items-center'>
          <Col xs={12} md={8} className='content-col'>
            <p className='hotel_description'>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores dignissimos vel tempore dolore voluptas dolorem velit. Velit, eveniet dolorem? Esse facilis minus qui, corporis odit ipsam quasi necessitatibus repellendus reprehenderit! Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae, sed exercitationem at explicabo reiciendis sunt consequatur dolore voluptatibus totam a.
            </p>
          </Col>
          <Col xs={12} md={4} className='image-col'>
            <img 
              src={hotel_img} 
              alt='hotelimage' 
              className='hotel_img'
            />
          </Col>
        </Row>
        <div className='hotel_booking'>
          <Form onSubmit={handleSubmit}>
            <Row className='justify-content-center'>
              <Col xs={12} md={4} className='form-field'>
                <Form.Group controlId='formCityOrHotel'>
                  <Form.Label>City or Hotel Name</Form.Label>
                  <Form.Control
                    type='text'
                    name='cityOrHotel'
                    value={inputs.cityOrHotel}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

              <Col xs={12} md={2} className='form-field'>
                <Form.Group controlId='formCheckIn'>
                  <Form.Label>Check-In</Form.Label>
                  <DatePicker
                    selected={inputs.checkIn}
                    onChange={date => handleDateChange(date, 'checkIn')}
                    className='form-control'
                  />
                </Form.Group>
              </Col>

              <Col xs={12} md={2} className='form-field'>
                <Form.Group controlId='formCheckOut'>
                  <Form.Label>Check-Out</Form.Label>
                  <DatePicker
                    selected={inputs.checkOut}
                    onChange={date => handleDateChange(date, 'checkOut')}
                    className='form-control'
                  />
                </Form.Group>
              </Col>

              <Col xs={12} md={2} className='form-field'>
                <Form.Group controlId='formGuests' ref={guestRef}>
                  <Form.Label>Guests</Form.Label>
                  <Form.Control
                    type='text'
                    name='guests'
                    value={`${inputs.adults} Adults, ${inputs.children} Children`}
                    onFocus={() => setShowGuestOptions(true)}
                    readOnly
                  />
                  {showGuestOptions && (
                    <div className='guest-options'>
                      <div className='guest-type'>
                        <span>Adults</span>
                        <Button variant='secondary' onClick={() => handleGuestChange('adults', 'decrement')}>-</Button>
                        <span>{inputs.adults}</span>
                        <Button variant='secondary' onClick={() => handleGuestChange('adults', 'increment')}>+</Button>
                      </div>
                      <div className='guest-type'>
                        <span>Children</span>
                        <Button variant='secondary' onClick={() => handleGuestChange('children', 'decrement')}>-</Button>
                        <span>{inputs.children}</span>
                        <Button variant='secondary' onClick={() => handleGuestChange('children', 'increment')}>+</Button>
                      </div>
                      <Button variant='primary' onClick={() => setShowGuestOptions(false)}>Done</Button>
                    </div>
                  )}
                </Form.Group>
              </Col>
              <Col xs={12} md={2} className='form-field'>
                <Button type='submit' className='btn-block'>
                  Submit
                </Button>
              </Col>
            </Row>
          </Form>
        </div>
      </div>

      
      <div className='offer_container'>
      <Slider {...settings}>
      <div>
            <img  src={offer_img1}  alt='offerimage'  className='offer_img'/>
            </div>

            <div>
             <img src={offer_img2} alt='offerimage' className='offer_img' />
            </div>

            <div>
             <img src={offer_img3} alt='offerimage'  className='offer_img' />
            </div>

            <div>
             <img  src={offer_img1}  alt='offerimage'  className='offer_img'/>
             </div>

             <div>
            <img src={offer_img2} alt='offerimage' className='offer_img' />
            </div>
            <div>
            <img src={offer_img3} alt='offerimage'  className='offer_img' />
            </div>
            </Slider>
      </div>
      
    </>
  );
}

export default HotelSearch;
