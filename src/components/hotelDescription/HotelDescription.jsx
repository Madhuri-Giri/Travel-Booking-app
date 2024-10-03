import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Col, Carousel, Modal, Button } from "react-bootstrap";
import "./HotelDescription.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import CustomNavbar from "../../pages/navbar/CustomNavbar";
import Footer from "../../pages/footer/Footer";
import Timer from "../timmer/Timer";
import { useDispatch } from "react-redux";
import { fetchHotelRooms } from "../../redux-toolkit/slices/hotelRoomSlice";
import Loading from "../../pages/loading/Loading";

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
  
  const { persons, NoOfRooms, GuestNationality, hotelName } = location.state || {};
  const [showImageModal, setShowImageModal] = useState(false);
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [showFullFacilities, setShowFullFacilities] = useState(false);
  const maxFacilities = 5; 

 
  const facilitiesArray = Array.isArray(hotelDetails.HotelFacilities)
    ? hotelDetails.HotelFacilities
    : hotelDetails.HotelFacilities.split(","); 

  const handleToggleFacilities = () => {
    setShowFullFacilities(!showFullFacilities);
  };

  const displayedFacilities = showFullFacilities
    ? facilitiesArray
    : facilitiesArray.slice(0, maxFacilities);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handleShowDescriptionModal = () => setShowDescriptionModal(true);
  const handleCloseDescriptionModal = () => setShowDescriptionModal(false);

  const lines = hotelDetails.Description.split("\n");
  const shortDescription = lines.slice(0, 6).join("\n");

  const dispatch = useDispatch();

  const fetchHotelRoom = async () => {
    setLoading(true);
    const { resultIndex, hotelCode, srdvType, srdvIndex, traceId } = location.state || {};
    if (!resultIndex || !srdvIndex || !hotelCode || !srdvType || !traceId) {
      // console.error("Missing required parameters for fetching hotel room.");
      return;
    }

    const requestData = { ResultIndex: resultIndex, SrdvIndex: srdvIndex, SrdvType: srdvType, HotelCode: hotelCode, TraceId: traceId };
    
    try {
      const hotelRooms = await dispatch(fetchHotelRooms(requestData)).unwrap();
      // console.log("Hotel Rooms Response:", hotelRooms);
      if (hotelRooms) {
       
        navigate("/hotel-room", { state: { hotelRooms, persons,  NoOfRooms, GuestNationality, hotelName,  resultIndex,
          hotelCode,
          srdvType,
          srdvIndex,
          traceId,
        } });
      } else {
        setError("No hotel room data available.");
      }
    } catch (error) {
      setError("Failed to fetch hotel room details. Please try again later.");
    }
    finally {
      setLoading(false); // Hide loader
    }
    };
  
    if (loading) {
      return <Loading />;
    }
 

  return (
    <>
      <CustomNavbar />
      <Timer />
      <section className="hotelDescriptionSection">
        <Container>
          <Row>
            
            <Col lg={6} className="img_bg_box">
              <Row>
                <Col lg={6}>
                  <Carousel className="hotelCarousel">
                    {hotelDetails.Images && hotelDetails.Images.map((image, index) =>
                      image && (
                        <Carousel.Item key={index}>
                          <img className="hotel_Img " src={image} alt={`${hotelDetails.HotelName} ${index + 1}`} />
                        </Carousel.Item>
                      )
                    )}
                  </Carousel>
                </Col>
                <Col lg={6}>
                  {hotelDetails.Images?.[0] && (
                    <img className="hotel_Img_single" src={hotelDetails.Images[0]} alt="Thumbnail" onClick={() => setShowImageModal(true)} style={{ cursor: "pointer", marginTop: "20px" }} />
                  )}
                  {hotelDetails.Images?.[1] && (
                    <img className="hotel_Img_single_above" src={hotelDetails.Images[1]} alt="Second Thumbnail" onClick={() => setShowImageModal(true)} style={{ cursor: "pointer", marginTop: "20px" }} />
                  )}
                </Col>
              </Row>
            </Col>
            <Col lg={6}>
              <div className="search_Item">
                <div className="Description_hotel">
                  <h3>{hotelDetails.HotelName || "Hotel Name Not Available"}</h3>
                  <div>{renderStar(hotelDetails.StarRating)}</div>
                  <span>{hotelDetails.Address || "Address Not Available"}</span>
                  <div className="Description_hotel">
                    <h5>Description:</h5>
                    <p
          dangerouslySetInnerHTML={{
            __html: isExpanded ? hotelDetails.Description : shortDescription || "Description Not Available",
          }}
          style={{ overflow: "hidden", maxHeight: isExpanded ? "none" : "10em" }}
        />
        <button className="hotel_Button_re" onClick={handleShowDescriptionModal}>
          {isExpanded ? "Read Less" : "Read More"}
        </button>
       
  </div>
  {/* <h5>Facilities:</h5>
      <div className="Features_hotel">
        <ul>
          {displayedFacilities.map((facility, index) => (
            <li key={index}>{facility}</li>
          ))}
        </ul>
        {facilitiesArray.length > maxFacilities && (
          <Button onClick={handleToggleFacilities}>
            {showFullFacilities ? "Read Less" : "Read More"}
          </Button>
        )}
      </div> */}
                   
                  <div className="PriceButton">
                    <button onClick={fetchHotelRoom} className="hotel_Button">Book Now</button>
                  </div>
                  {error && <div className="error-message">{error}</div>}
                </div>
              </div>
            </Col>
          </Row>

          {/* Modal for displaying all images */}
          <Modal show={showImageModal} onHide={() => setShowImageModal(false)} size="lg" centered>
            <Modal.Header closeButton>
              <Modal.Title>{hotelDetails.HotelName} - All Images</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Carousel>
                {hotelDetails.Images && hotelDetails.Images.map((image, index) =>
                  image && (
                    <Carousel.Item key={index}>
                      <img className="hotel_Img_modal" src={image} alt={`Hotel Image ${index + 1}`} />
                    </Carousel.Item>
                  )
                )}
              </Carousel>
            </Modal.Body>
          </Modal>

          {/* Modal for displaying description */}
          <Modal show={showDescriptionModal} onHide={handleCloseDescriptionModal} size="lg"   className="HotelListModal"
      backdrop="static">
            <Modal.Header closeButton />
            <Modal.Body>
              <h6>Description</h6>
            <p dangerouslySetInnerHTML={{ __html: hotelDetails.Description }} />
             <h6> Facilities</h6>
            <ul> <li>{hotelDetails.HotelFacilities || "Facilities Not Available"}</li></ul>
            </Modal.Body> 
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseDescriptionModal}>Close</Button>
            </Modal.Footer>
          </Modal>
        </Container>
      </section>
      <Footer />
    </>
  );
};

export default HotelDescription;
