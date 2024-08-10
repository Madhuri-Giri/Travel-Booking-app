// Review.jsx
import React, { useState } from 'react';
import star from '../../assets/images/star_img.png';
import './Review.css';
import { Container } from 'react-bootstrap';
import Lottie from 'lottie-react';
import ReviewImg from '../../assets/images/Reviewsimage.json';
import CustomNavbar from '../../pages/navbar/CustomNavbar';
import Footer from '../../pages/footer/Footer';
const mockData = [
    {
        image: ReviewImg,
        Heading: "Please Rate the Travel Booking App!!!",
        Rating: star,
        description: "Your comments and suggestions help us improve the service quality better!"
    }
];

const Review = () => {
    const [message, setMessage] = useState('');

    const handleMessageChange = (e) => {
        setMessage(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Submitted message:', message);
        setMessage('');
    };

    return (
        <>
        <CustomNavbar/>        
        <section className='reviewSecMain'>
        <Container>
            <div className='review_container'>
                {mockData.map((review, index) => (
                    <div key={index} className='review_card'>
                    <Lottie
                            animationData={ReviewImg}
                            style={{ height: '20%', width: '100%' }}
                        />
                        <div className='review_info'>
                            <h3>{review.Heading}</h3>
                            <img src={review.Rating} alt="Rating" className='review_rating' />
                            <p>{review.description}</p>
                        </div>
                        <form onSubmit={handleSubmit} className="review_form">
                            <div className=" form-group-data">
                                <textarea 
                                    id="message"
                                    rows={8}
                                    value={message}
                                    onChange={handleMessageChange}
                                    placeholder="Enter your comment..."
                                />
                            </div>
                            <div className='submit_button'>
                                <button type="submit">Submit</button>
                            </div>
                        </form>
                    </div>
                ))}
            </div>
        </Container>
        </section>
        <Footer/>
        </>
    );
};

export default Review;
