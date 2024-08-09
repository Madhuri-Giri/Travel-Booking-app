import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Col, Carousel,  Modal} from "react-bootstrap";
import "./HotelDescription.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

const renderStar = (rating) => {
  const totalStars = 5;
  let stars = [];
  for (let i = 1; i <= totalStars; i++) {
    const color = i <= rating ? "#FFD700" : "#d3d3d3"; 
    stars.push(
      <FontAwesomeIcon key={i} icon={faStar} size="lg" color={color} />
    );
  }
  return stars;
};

const HotelDescription = () => {
  const location = useLocation();
  const navigate = useNavigate(); 
  const [error, setError] = useState(null); 
  const hotelDetails = location.state?.hotelDetails;
  const [showModal, setShowModal] = useState(false); // For modal visibility

  // ------------Start Api Integration--------------
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
  
      const response = await fetch("https://sajyatra.sajpe.in/admin/api/hotel-room", {
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
        console.log("hotel-room API response:", data.GetHotelRoomResult.HotelRoomsDetails);
        
        // Save the hotel room details in local storage
        localStorage.setItem("hotelRooms", JSON.stringify(data.GetHotelRoomResult.HotelRoomsDetails));
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
  // -----------------------End Api Integration--------------------
  return (
    <>
    <section className="hotelDescriptionSection">
    <Container>
    {/* -----start new section---------- */}
    <div className="ro">
     <Container>
     <h3 className="hotelName">{hotelDetails.HotelName} Hotel 
     <span> {renderStar(hotelDetails.StarRating)}   </span>
     </h3>
    
     <Row>

        <Col md={7}>
          <Carousel className="hotelCarousel">
            {hotelDetails.Images && hotelDetails.Images.map((image, index) => (
              image && (
                <Carousel.Item key={index}>
                  <img
                    className="hotel_Img img-fluid"
                    src={image}
                    alt={`${hotelDetails.HotelName} ${index + 1}`}
                  />
                </Carousel.Item>
              )
            ))}
          </Carousel>
        </Col>
        <Col md={5}>
          {hotelDetails.Images && hotelDetails.Images.length > 0 && (
            <img
              className="hotel_Img_single"
              src={hotelDetails.Images[0]} // Show the first image as a thumbnail
              alt={`${hotelDetails.HotelName} Thumbnail`}
              onClick={() => setShowModal(true)} // Open modal on click
              style={{ cursor: "pointer" }} // Change cursor to indicate it's clickable
            />
          )}
        </Col>
      </Row>


     </Container>
      {/* Modal for showing all images */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>{hotelDetails.HotelName} - All Images</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Carousel>
            {hotelDetails.Images && hotelDetails.Images.map((image, index) => (
              image && (
                <Carousel.Item key={index}>
                  <img
                    className="hotel_Img_modal"
                    src={image}
                    alt={`${hotelDetails.HotelName} ${index + 1}`}
                  />
                </Carousel.Item>
              )
            ))}
          </Carousel>
        </Modal.Body>
      </Modal>
      </div>
      </Container>
{/* -----------end section */}

{/* -------------start new section-------------- */}
      <Container>
      <Row>
        <Col>
          <div className="search_Item">
            <div className="Description_hotel">
              <div className="Header_hotel">
                <h1 className="Title_hotel">{hotelDetails.HotelName}</h1>
                <div className="Rating_hotel">
                  {renderStar(hotelDetails.StarRating)}
                </div>
              </div>
              <span className="Distance_hotel">{hotelDetails.Address}</span>
              <div className="Description_hotel">
                <h5>Description :</h5>
                <p dangerouslySetInnerHTML={{ __html: hotelDetails.Description }}></p>
              </div>
              <h5>Facilities:</h5>
              <div className="Features_hotel">
                
                {hotelDetails.HotelFacilities && hotelDetails.HotelFacilities.map((facility, index) => (
                  <div className="Feature_item" key={index}>
                    {facility}
                  </div>
                ))}
              </div>
              <div className="PriceButton">
                <div className="Price_hotel">
                  {/* INR {hotelDetails.Price?.OfferedPriceRoundedOff || "N/A"} */}
                </div>
                <button onClick={fetchHotelRoom} className="hotel_Button">Book Now</button>
              </div>{error && <div className="error-message">{error}</div>} 
            </div>
          </div>
        </Col>
      </Row>
    </Container>

    

    </section>

    </>
  );
};

export default HotelDescription;
