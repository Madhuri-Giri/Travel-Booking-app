import React, { useState, useRef, useEffect } from "react";
import { Row, Col, Container } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./HotelSearch.css";
import offer_img1 from "../../../src/assets/images/offer_img6.jpg";
import offer_img2 from "../../../src/assets/images/offer_img7.jfif";
import offer_img3 from "../../../src/assets/images/offer_img8.jpg";
import play_store_img from "../../../src/assets/images/play_store_img.png";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import CustomNavbar from "../../pages/navbar/CustomNavbar";
import Footer from "../../pages/footer/Footer";
import Loading from '../../pages/loading/Loading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays} from '@fortawesome/free-solid-svg-icons';
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faHotel} from "@fortawesome/free-solid-svg-icons";
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const HotelSearch = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // Add loading state
  const [startDate, setStartDate] = useState(null);
  // const [inputs, setInputs] = useState({ cityOrHotel: '' });

  //------------------- Start  carousel code ---------------------
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

    // Clean up interval on component unmount
    return () => {
      stopAutoScroll();
    };
  }, []);
  //-------------------- End carousal code ------------------------

  const [isVisible, setIsVisible] = useState(true);
  const [showGuestOptions, setShowGuestOptions] = useState(false);
  const guestRef = useRef(null);

  // const handleChange = (event) => {
  //   const { name, value } = event.target;
  //   setInputs((values) => ({ ...values, [name]: value }));
  // };

  const handleDateChange = (date, name) => {
    setInputs((values) => ({ ...values, [name]: date }));
  };

  const handleGuestChange = (name, operation) => {
    setInputs((values) => ({
      ...values,
      [name]:
        operation === "increment"
          ? values[name] + 1
          : values[name] > 0
            ? values[name] - 1
            : 0,
    }));
  };

  const handleClose = () => {
    setIsVisible(false); // Hide the guest options
  };
  // ------------- Start API code -------------------

  const [inputs, setInputs] = useState({
    cityOrHotel: "",
    // checkIn: new Date("2020-04-30"),
    // checkOut: new Date("2020-05-01"),
    checkIn: null,
    checkOut: null,
    adults: 1,
    children: 0,
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true); // Show loader

    const staticCheckIn = new Date("2020-04-30"); // updated
    const staticCheckOut = new Date("2020-05-01"); // updated

    const requestData = {
      BookingMode: "5",
      // CheckInDate: format(inputs.checkIn, "dd/MM/yyyy"),
      CheckInDate: format(staticCheckIn, "dd/MM/yyyy"), // updated
      NoOfNights: "1",
      CountryCode: "IN",
      CityId: "130443",
      ResultCount: null,
      PreferredCurrency: "INR",
      GuestNationality: "IN",
      NoOfRooms: "1",
      RoomGuests: [
        {
          NoOfAdults: inputs.adults,
          NoOfChild: inputs.children.toString(),
          ChildAge: [],
        },
      ],
      PreferredHotel: "",
      MaxRating: "5",
      MinRating: "0",
      ReviewScore: null,
      IsNearBySearchAllowed: false,
    };

    console.log("Request Data:", requestData);

    try {
      const response = await fetch(
        "https://sajyatra.sajpe.in/admin/api/search-hotel",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(requestData),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("hotel-search API Response:", data);

      if (data && data.Results) {

        // Extract the number of adults from the response
        const numberOfAdults = data.NoOfRooms[0].NoOfAdults;
        
        // Save the number of adults in localStorage
        localStorage.setItem("numberOfAdults", numberOfAdults.toString());

        localStorage.setItem("traceId", "1");
        localStorage.setItem("resultIndex", "1");
        localStorage.setItem("srdvType", "SingleTB");
        localStorage.setItem("srdvIndex", "SrdvTB");
        
        // Save hotel details in local storage
        localStorage.setItem("hotelSearchDetails", JSON.stringify(data.Results));
        // Navigate Holel List
        navigate("/hotel-list", { state: { searchResults: data.Results } });
      } else {
        console.error("No search results found or error in response:", data);
        alert("No search results found. Please try again later.");
      }
    } catch (error) {
      console.error("Error searching hotel:", error);
      alert("Error searching hotel. Please try again later.");
    }
    finally {
      setLoading(false); // Hide loader
    }
  };

  // --------------- End API Code ---------------------------------------------------------------------
//------- FIND IP ADDRESS---------
  const [ipAddress, setIpAddress] = useState('');

  // Function to fetch the IP address
  const fetchIPAddress = async () => {
    try {
      // Using the ipify API to get the public IP address
      const response = await axios.get('https://api.ipify.org?format=json');
      setIpAddress(response.data.ip);
      console.log('IP Address:', response.data.ip);
    } catch (error) {
      console.error('Error fetching IP address:', error);
    }
  };

  // Fetch the IP address when the component mounts
  useEffect(() => {
    fetchIPAddress();
  }, []);

  // --------------------------
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isSuggestionVisible, setIsSuggestionVisible] = useState(true);

  const fetchSuggestions = async (query) => {
    if (!query) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch('https://sajyatra.sajpe.in/admin/api/bus_list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });
      const data = await response.json();

      console.log('list hostel Response:', data);

      // Limit the number of suggestions to 7
      const limitedSuggestions = data.data.slice(0, 7);
      setSuggestions(limitedSuggestions);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  useEffect(() => {
    if (query) {
      fetchSuggestions(query);
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    setIsSuggestionVisible(true); 
  };

  const handleSuggestionClick = (name) => {
    setQuery(name);
    setSuggestions([]); 
    setIsSuggestionVisible(false); 
  };


  // ---------------------------------------------------------------------------------------------------
  
  

  if (loading) {
    return <Loading />;
  }

  return (
    <>    
      <CustomNavbar />

      {/* New section start */}
      <div className="hotel_container">
        <div className="content_wrapper">
          <Container>
          <Row className="content_wrapperRow">
            <Col xl={5} md={12} className="order-md-1 order-2">
              <div className="content_box">
                <h1>
                  Discover <span className="luxury-font">luxury</span> and comfort in the heart of the city. Choose your  <span className="luxury-font"> perfect room  </span> and enjoy top-notch amenities and <span className="luxury-font">services</span>.
                </h1>
              </div>
              <button className="btn-book" type="submit">Book Now</button>
            </Col>

            <Col xl={7} md={12} className="order-md-2 order-1">
              <div className="images_container">
                <img
                  src="https://cf.bstatic.com/xdata/images/hotel/max1024x768/225991107.webp?k=8ac4f5d29b44a2a0a933b7c379764e547a26de0bb12e9d869e74935a8c88b33a&o="
                  alt="Image 1"
                  className="img_box image1"
                />

                <img
                  src="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/11/9e/89/c2/achat-comfort-city-frankfurt.jpg?w=300&h=-1&s=1"
                  alt="Image 2"
                  className="img_box image2"
                />

                <img
                  src="https://cf.bstatic.com/xdata/images/hotel/max1024x768/347516271.jpg?k=56e84e8d3ede9cd10d0156bffe90ff767a7e039ff86085b8efc2860f786a1941&o=&hp=1"
                  alt="Image 3"
                  className="img_box image3"
                />
              </div>
            </Col>
          </Row>

          </Container>
        </div>
        {/* End section */}

        {/* New section start */}
        <section className="sec_book">
          <div className="hotel_booking">
          <form onSubmit={handleSubmit}>
  <div className="form-row">

    {/* --------------------------------------------------------------------------------------------------------------- */}

    <div className="form-field">
      <label className="form_label" htmlFor="cityOrHotel">City or Hotel Name:</label>
      <div className="input-with-icon">
        <input
          className="form_in"
          type="text"
          id="cityOrHotel"
          name="cityOrHotel"
          placeholder="Enter city or hotel name"
          value={query}
          onChange={handleInputChange}
        />
        <FontAwesomeIcon icon={faHotel} className="calendar-icon" />
      </div>
      {isSuggestionVisible && suggestions.length > 0 && (
        <ul className="suggestions_hotel">
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.busodma_id}
              onClick={() => handleSuggestionClick(suggestion.busodma_destination_name)}
              style={{ cursor: 'pointer' }} 
            >
              {suggestion.busodma_destination_name}
            </li>
          ))}
        </ul>
      )}
    </div>

    {/* -----------------------------------------------------------------------------------------*/}
     

    <div className="form-field date-picker-field">
      <label className="form_label" htmlFor="checkIn">Check-In Date:</label>
      <div className="input-with-icon">
        <DatePicker className="form_in" selected={inputs.checkIn} 
          onChange={(date) => handleDateChange(date, "checkIn")} 
          dateFormat="dd/MM/yyyy" 
          placeholderText="Select check-in date"
          minDate={new Date()} 
        />
        <FontAwesomeIcon icon={faCalendarDays} className="calendar-icon" />
      </div>
    </div>

    <div className="form-field date-picker-field">
      <label className="form_label" htmlFor="checkOut">Check-Out Date:</label>
      <div className="input-with-icon">
        <DatePicker className="form_in" selected={inputs.checkOut} 
          onChange={(date) => handleDateChange(date, "checkOut")} 
          dateFormat="dd/MM/yyyy" 
          placeholderText="Select check-out date" 
          minDate={inputs.checkIn || new Date()} 
        />
       <FontAwesomeIcon icon={faCalendarDays} className="calendar-icon" />
      </div>
    </div>

    <div className="form-field guest_field">
  <label className="form_label" htmlFor="guestField">Guests:</label>
  <div className="input-with-icon">
    <input className="form_in" type="text" id="guestField" name="guestField" 
      placeholder="Guests" onClick={() => setShowGuestOptions(!showGuestOptions)}
      value={`${inputs.adults} Adults, ${inputs.children} Children`} readOnly />
    <FontAwesomeIcon icon={faUser} className="user-icon" />
    
    {showGuestOptions && isVisible && (
      
      <div ref={guestRef} className="guest_options">
        <FontAwesomeIcon 
          icon={faXmark} 
          className="close_icon" 
          onClick={handleClose}
        />
      {/* <div ref={guestRef} className="guest_options"> */}
        <div className="guest_option">
          <label htmlFor="adults">Adults:</label>
          <button type="button" onClick={() => handleGuestChange("adults", "decrement")}>-</button>
          <span>{inputs.adults}</span>
          <button type="button" onClick={() => handleGuestChange("adults", "increment")}>+</button>
        </div>

        <div className="guest_option">
          <label htmlFor="children">Children:</label>
          <button type="button" onClick={() => handleGuestChange("children", "decrement")}>-</button>
          <span>{inputs.children}</span>
          <button type="button" onClick={() => handleGuestChange("children", "increment")}>+</button>
        </div>
      </div>
    )}
  </div>
</div>

    <button className="btn-sub" type="submit">Search Now</button>
  </div>
</form>

          </div>
        </section>
      </div>
      {/* End section */}

      {/* new section start */}
      <section>
        <Container>
          <div className="Exclusive_offer">
            <h5>Exclusive <span style={{ color: "#00b7eb" }}>Offers</span></h5>
            <div className="offer_container" onMouseEnter={stopAutoScroll} onMouseLeave={startAutoScroll}>
              <div className="offer_box" ref={slideRef}>
                <img src={offer_img1} alt="Offer 1" />
                <img src={offer_img2} alt="Offer 2" />
                <img src={offer_img3} alt="Offer 3" />
                <img src={offer_img1} alt="Offer 4" />
                <img src={offer_img2} alt="Offer 5" />
                <img src={offer_img3} alt="Offer 6" />
              </div>
            </div>
          </div>
        </Container>
      </section>
      {/* End section */}

      {/* new section start */}
      <section>
        <div className="booking_head">
          <h5> Hotel Booking <span style={{ color: "#00b7eb" }}>Now</span> </h5>
        </div>
        <div className="Hotel_Booking_container">
          <div className="booking_box">
            <h5>BOOK HOTEL FASTER.</h5>
            <h5> DOWNLOAD OUR MOBILE APPS TODAY</h5>
            <p>The application will help you find attractions, tours or adventures in a new city </p>
            <img className="play_store" src="https://play.google.com/intl/en_us/badges/images/generic/en_badge_web_generic.png" />
            <img className="apple_play_store" src={play_store_img} />
          </div>
        </div>
      </section>
      {/* end section */}
      <Footer />

    </>
  );
};

export default HotelSearch;