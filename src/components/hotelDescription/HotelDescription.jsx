import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Col, Carousel } from "react-bootstrap";
import "./HotelDescription.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

const renderStar = (rating) => {
  let stars = [];
  for (let i = 0; i < rating; i++) {
    stars.push(
      <FontAwesomeIcon key={i} icon={faStar} size="lg" className="rating_star_hotel" />
    );
  }
  return stars;
};

const HotelDescription = () => {
  const location = useLocation();
  const navigate = useNavigate(); 
  const [error, setError] = useState(null); 
  const hotelDetails = location.state?.hotelDetails;

  const fetchHotelRoom = async () => {
    try {
      const requestData = {
        ResultIndex: "9",
        SrdvIndex: "SrdvTB",
        SrdvType: "SingleTB",
        HotelCode: "92G|DEL",
        TraceId: "1",
      };
  
      console.log("Request data:", requestData);
  
      const response = await fetch("/api/admin/api/hotel-room", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log("Hotel room details response:", data);
  
      if (data && data.GetHotelRoomResult && data.GetHotelRoomResult.HotelRoomsDetails) {
        console.log("Navigating with data:", data.GetHotelRoomResult.HotelRoomsDetails);
        navigate("/hotel-room", { state: { hotelRooms: data.GetHotelRoomResult.HotelRoomsDetails } });
      } else {
        console.log("Data received is not in the expected format");
        setError(data.message || "No hotel room data available.");
      }
    } catch (error) {
      console.error("Error fetching hotel room details:", error);
      setError("Failed to fetch hotel room details. Please try again later.");
    }
  };
  
  return (
    <Container>
      <Row>
        <Col md={12}>
          <Carousel className="hotelCarousel">
            {hotelDetails.Images && hotelDetails.Images.map((image, index) => (
              image && (
                <Carousel.Item key={index}>
                  <img
                    className="hotel_Img"
                    src={image}
                    alt={`${hotelDetails.HotelName} ${index + 1}`}
                  />
                </Carousel.Item>
              )
            ))}
          </Carousel>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <div className="search_Item">
            <div className="Description_hotel">
              <h1 className="Title_hotel">{hotelDetails.HotelName}</h1>
              <div dangerouslySetInnerHTML={{ __html: hotelDetails.Description }}></div>
              <span className="Distance_hotel">{hotelDetails.Address}</span>
              <span className="Taxi_hotel">
                {hotelDetails.freeTaxi ? "Free airport taxi" : "No free airport taxi"}
              </span>
              <div className="Features_hotel">
                <h5>Facilities:</h5>
                <ul>
                  {hotelDetails.HotelFacilities && hotelDetails.HotelFacilities.map((facility, index) => (
                    <li key={index}>{facility}</li>
                  ))}
                </ul>
              </div>
              <div className="Rating_hotel">
                <h5>Rating:</h5>
                {renderStar(hotelDetails.StarRating)}
              </div>
              <div className="Price_hotel">
                INR {hotelDetails.Price?.OfferedPriceRoundedOff || "N/A"}
              </div>
              <button onClick={fetchHotelRoom} className="hotel_Button">Book Now</button>
              {error && <div className="error-message">{error}</div>} 
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default HotelDescription;
