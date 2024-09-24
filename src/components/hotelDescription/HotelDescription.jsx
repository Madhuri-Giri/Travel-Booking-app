import React, { useState } from "react"; 
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Col, Carousel, Modal } from "react-bootstrap";
import "./HotelDescription.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import CustomNavbar from "../../pages/navbar/CustomNavbar";
import Footer from "../../pages/footer/Footer";
import Timer from '../timmer/Timer';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHotelRooms } from '../../redux-toolkit/slices/hotelRoomSlice';

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
  const hotelDetails = location.state?.hotelDetails;
  const hotelIndex = location.state?.hotelIndex; // Get the hotel index from state
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const lines = hotelDetails.Description.split('\n');
  const shortDescription = lines.slice(0, 6).join('\n');

  const parseFacilities = (facilitiesString) => {
    return facilitiesString.split(',').map(item => item.trim());
  };

  const facilities = hotelDetails?.HotelFacilities ? parseFacilities(hotelDetails.HotelFacilities[0]) : [];

  const dispatch = useDispatch(); 
  // const { hotels = [], srdvType, resultIndexes, srdvIndexes, hotelCodes, traceId } = useSelector((state) => state.hotelSearch || {});

  // if (!hotelDetails || !hotels.length) {
  //   return <div>Loading...</div>;
  // }
  const {  resultIndex, hotelCode, srdvType, srdvIndex, traceId } = location.state || {};
  const fetchHotelRoom = async () => {
    if (!resultIndex || !srdvIndex || !hotelCode || !srdvType || !traceId) {
      console.error("Missing required parameters for fetching hotel room.");
      return;
    }

    // Prepare request data using the extracted values
    const requestData = {
      ResultIndex: resultIndex,
      SrdvIndex: srdvIndex,
      SrdvType: srdvType,
      HotelCode: hotelCode,
      TraceId: traceId, // Assuming TraceId is part of hotelDetails
    };

    console.log("Request data room:", requestData);

    try {
      const hotelRooms = await dispatch(fetchHotelRooms(requestData)).unwrap();

      if (hotelRooms) {
        console.log("Hotel room details:", hotelRooms);
        navigate("/hotel-room", { state: { hotelRooms } });
      } else {
        console.error("No hotel room data received.");
        setError("No hotel room data available.");
      }
    } catch (error) {
      console.error("Error fetching hotel room details:", error);
      setError("Failed to fetch hotel room details. Please try again later.");
    }
  };
  return (
    <>
      <CustomNavbar />
      <Timer />
      <section className="hotelDescriptionSection">
        <Container>
          <div className="ro">
            <Container className="hotelName">
              <h3>{hotelDetails.HotelName} Hotel 
                <span> {renderStar(hotelDetails.StarRating)} </span>
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
                      src={hotelDetails.Images[0]}
                      alt={`${hotelDetails.HotelName} Thumbnail`}
                      onClick={() => setShowModal(true)} 
                      style={{ cursor: "pointer" }} 
                    />
                  )}
                  {hotelDetails.Images && hotelDetails.Images.length > 1 && (
                    <img
                      className="hotel_Img_single_above"
                      src={hotelDetails.Images[1]}
                      alt={`${hotelDetails.HotelName} Second Thumbnail`}
                      style={{ marginBottom: "15px", cursor: "pointer" }} 
                      onClick={() => setShowModal(true)} 
                    />
                  )}
                </Col>
              </Row>
            </Container>

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
                  <span className="Distance_hotel">{hotelDetails.Address || N/A}</span>
                  <div className="Description_hotel">
                    <h5>Description :</h5>
                    <p 
                      dangerouslySetInnerHTML={{ __html: isExpanded ? hotelDetails.Description : shortDescription || "Description not available" }} 
                      style={{ overflow: 'hidden', maxHeight: isExpanded ? 'none' : '10em' }} 
                    />
                    <button className="hotel_des_Btn" onClick={handleToggle}>
                      {isExpanded ? 'Read Less' : 'Read More'}
                    </button>
                  </div>
                  <h5>Facilities:</h5>
                  <div className="Features_hotel">
                    {facilities.map((item, index) => (
                      <div key={index} className="Feature_item">
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                  <div className="PriceButton">
                    <div className="Price_hotel">
                      {/* INR {hotelDetails.Price?.OfferedPriceRoundedOff || "N/A"} */}
                    </div>
                    <button onClick={fetchHotelRoom} className="hotel_Button">Book Now</button>
                  </div>
                  {error && <div className="error-message">{error}</div>} 
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      <Footer />
    </>
  );
};

export default HotelDescription;
