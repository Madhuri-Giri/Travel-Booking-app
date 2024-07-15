import React from 'react';
import './HotelTest.css';

const HotelTest = () => {
  return (
    <>
    <div className="content_wrapper">
      <div className="content_box">
        <h1>Left Side Content</h1>
        <p>This is the content that will be displayed on the left side.</p>
      </div>
      <div className="images_container">
        <img src="https://cf.bstatic.com/xdata/images/hotel/270x200/31211348.jpg?k=45c6e30d9c7802e893d6046b03428c5c28318b4724f941f19e2b5631e5a47ad3&o=" alt="Image 1" className=" img_box image1" />
        <img src="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/11/9e/89/c2/achat-comfort-city-frankfurt.jpg?w=300&h=-1&s=1" alt="Image 2" className="img_box image2" />
        <img src="https://cf.bstatic.com/xdata/images/hotel/max200/485546587.jpg?k=932ec3cf4220d05e7a6e4b5b2bc397d5b71e415d9c7f659ef7f4b991e572a7eb&o=&hp=1" alt="Image 3" className="img_box image3" />
      </div>
    </div>
    <div className='blank_div'>

    </div>
    </>
  );
};

export default HotelTest;
