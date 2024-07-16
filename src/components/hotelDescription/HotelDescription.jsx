import React from 'react';
import Container from 'react-bootstrap/Container';
import Carousel from 'react-bootstrap/Carousel';
import ratingStar from '../../../src/assets/images/star_img.png';
import './HotelDescription.css';
import { useNavigate } from "react-router-dom";


const HotelDescription = () => {
  const navigate = useNavigate();
  const roomHandler = () => {
    navigate('/hotel-room')
  }
  const images = [
    "https://www.siteminder.com/wp-content/uploads/2023/08/vala-hero.jpg",
    "https://www.siteminder.com/wp-content/uploads/2023/08/vala-hero.jpg",
    "https://www.siteminder.com/wp-content/uploads/2023/08/vala-hero.jpg",
    "https://www.siteminder.com/wp-content/uploads/2023/08/vala-hero.jpg",
    
  ];

  return (


    <Container>
     <div className="search_Item">
    <Carousel className="hotelCarousel">
          {images.map((img, index) => (
            <Carousel.Item key={index}>
              <img
                src={img}
                alt={`Slide ${index}`}
                className="hotel_Img"
              />
            </Carousel.Item>
          ))}
        </Carousel>
     
        <div className="Description_hotel">
          <h1 className="Title_hotel">Tower Street Apartments</h1>
          <span className="Distance_hotel">500m from center</span>
          <span className="Taxi_hotel">Free airport taxi</span>
          <span className="Subtitle_hotel">
            Studio Apartment with Air conditioning
          </span>
          <span className="Features_hotel">
            Entire studio • 1 bathroom • 21m² 1 full bed
          </span>
          <span className="Cancel_hotel">Free cancellation </span>
          <span className="Cancel_Subtitle">
            You can cancel later, so lock in this great price today!
          </span>
          <div className="Details_hotel">
            <div className="Rating_hotel">
              <span>Excellent</span>
              <img className="rating_star_hotel" src={ratingStar} alt="rating" />
            </div>
            <div className="DetailTexts_hotel">
              <span className="Price_hotel"> ₹112</span>
              <span className="Tax_hotel">Includes taxes and fees</span>
              <button onClick={roomHandler} className="hotel_Button">Add Room </button>
            </div>
          </div>
        </div>
        
      </div>
    </Container>
  );
};

export default HotelDescription;
