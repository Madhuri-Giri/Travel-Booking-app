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
import Loading from "../../pages/loading/Loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faCalendarDays, faUser, faHotel, faXmark, faTimes} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { searchHotels } from "../../redux-toolkit/slices/hotelSlice";
import Swal from 'sweetalert2';

const HotelSearch = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // Add loading state
  const [startDate, setStartDate] = useState(null);
  const dispatch = useDispatch();
  const { hotels,  error } = useSelector((state) => state.hotels || {});

  const [inputs, setInputs] = useState({
    cityOrHotel: "",
    checkIn: null,
    checkOut: null,
    adults: 1,
    children: 0,
    rooms: 1,
    NoOfNights: 1,
  });

  const [isVisible, setIsVisible] = useState(true);
  const [showGuestOptions, setShowGuestOptions] = useState(false);
  const guestRef = useRef(null);
  const inputRef = useRef(null);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  // const [inputs, setInputs] = React.useState({ NoOfNights: "" });
  const dropdownRef = useRef(null);

  const [childAges, setChildAges] = useState([]);

  const handleChildAgeChange = (index, age) => {
    if (Number(age) >= 18) {
      // Show SweetAlert if the child age is 18 or greater
      Swal.fire({
        title: "Invalid Age",
        text: "Child age must be less than 18.",
        icon: "warning",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK"
      }).then(() => {
        // Reset the specific child age input field after pressing OK
        const newChildAges = [...childAges];
        newChildAges[index] = ""; // Reset to empty
        setChildAges(newChildAges);
      });
    } else {
      // If age is valid, update the state
      const newChildAges = [...childAges];
      newChildAges[index] = age;
      setChildAges(newChildAges);
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleSelect = (value) => {
    setInputs({ ...inputs, NoOfNights: value });
    setDropdownOpen(false); 
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false); 
    }
  };

  const handleCloseClick = () => {
    setIsSuggestionVisible(false);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Carousel logic
  const slideRef = useRef(null);
  const intervalRef = useRef(null);
  const scrollWidthRef = useRef(0);

  const startAutoScroll = () => {
    intervalRef.current = setInterval(() => {
      if (slideRef.current) {
        const imageWidth =
          slideRef.current.querySelector("img").clientWidth + 32;
        scrollWidthRef.current += imageWidth;

        slideRef.current.scrollTo({
          left: scrollWidthRef.current,
          behavior: "smooth",
        });

        if (
          scrollWidthRef.current >=
          slideRef.current.scrollWidth - slideRef.current.clientWidth
        ) {
          scrollWidthRef.current = 0;
          slideRef.current.scrollTo({
            left: 0,
            behavior: "auto",
          });
        }
      }
    }, 2000);
  };

  const stopAutoScroll = () => {
    clearInterval(intervalRef.current);
  };

  const handleNightChange = (event) => {
    const value = parseInt(event.target.value, 10);
    if (value >= 1 && value <= 30) {
      setInputs((prevInputs) => ({
        ...prevInputs,
        NoOfNights: value,
      }));
    }
  };
  useEffect(() => {
    startAutoScroll();
    return () => stopAutoScroll();
  }, []);

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
    setShowGuestOptions(false);
  };

  const handleToggleOptions = () => {
    setShowGuestOptions((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        guestRef.current &&
        !guestRef.current.contains(event.target) &&
        !inputRef.current.contains(event.target)
      ) {
        handleClose();
      }
    };

    

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchIPAddress = async () => {
    try {
      const response = await axios.get("https://api.ipify.org?format=json");
      setIpAddress(response.data.ip);
    } catch (error) {
      console.error("Error fetching IP address:", error);
    }
  };

  useEffect(() => {
    fetchIPAddress();
  }, []);

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isSuggestionVisible, setIsSuggestionVisible] = useState(true);

  const fetchSuggestions = async (query) => {
    if (!query) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        "https://sajyatra.sajpe.in/admin/api/hotel-list",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query }),
        }
      );
      const data = await response.json();
      const limitedSuggestions = data.data.slice(0, 7);

      localStorage.setItem("CityListRes", JSON.stringify(limitedSuggestions));

      setSuggestions(limitedSuggestions);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const citylistres = localStorage.getItem("CityListRes");
    const cityList = citylistres ? JSON.parse(citylistres) : [];

    if (cityList.length === 0) {
      alert("No cities available. Please select a city.");
      return;
    }

    const selectedCity = cityList[0];

  
 // Create the roomGuestsArray based on inputs
 const roomGuestsArray = [];
 let remainingAdults = inputs.adults;
 const roomsCount = inputs.rooms;
 const childrenCount = inputs.children;

   // Validate child ages
    for (const age of childAges) {
      if (age === "" || Number(age) >= 18) {
        alert("Child age must be less than 18 and cannot be empty.");
        return;
      }
    }

 for (let i = 0; i < roomsCount; i++) {
   let adultsInRoom = Math.ceil(remainingAdults / (roomsCount - i));
   roomGuestsArray.push({
     NoOfAdults: adultsInRoom,
     NoOfChild: childrenCount,
     ChildAge: childAges.slice(0, childrenCount), 
   });
   remainingAdults -= adultsInRoom;
 }

    const requestData = {
     BookingMode: "5",
    CheckInDate: format(inputs.checkIn, "dd/MM/yyyy"),
    NoOfNights: inputs.NoOfNights,
    CountryCode: selectedCity.countrycode,
    CityId: selectedCity.cityid,
    ResultCount: null,
    PreferredCurrency: "INR",
    GuestNationality: selectedCity.countrycode,
    NoOfRooms: inputs.rooms,
    RoomGuests: roomGuestsArray, 
    PreferredHotel: "",
    MaxRating: "5",
    MinRating: "0",
    ReviewScore: null,
    IsNearBySearchAllowed: false,
  };

  try {
    // Dispatch the searchHotels action
    const response = await dispatch(searchHotels(requestData)).unwrap();
  
    if (response.Results && response.Results.length > 0) {
      const hotels = response.Results;
      navigate("/hotel-list", { 
        state: { 
          searchResults: hotels 
        } 
      }); 
    } else {
      // Use SweetAlert for no hotel found
      Swal.fire({
        title: "No Hotels Found",
        text: "Please select a correct city.",
        icon: "warning",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK"
      });
    }
  } catch (error) {
    // Use SweetAlert for error handling
    Swal.fire({
      title: "Error!",
      text: "No Hotel found. Please select correct city.",
      icon: "error",
      confirmButtonColor: "#d33",
      confirmButtonText: "OK"
    });
  } finally {
    setLoading(false); // Hide loader
  }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <CustomNavbar />

      <div className="hotel_container">
        <div className="content_wrapper">
          <Container>
            <Row className="content_wrapperRow">
              <Col xl={5} md={12} className="order-md-1 order-2">
                <div className="content_box">
                  <h1>
                    Discover <span className="luxury-font">luxury</span> and
                    comfort in the heart of the city. Choose your
                    <span className="luxury-font"> perfect room </span> and
                    enjoy top-notch amenities and
                    <span className="luxury-font">services</span>.
                  </h1>
                </div>
                <button className="btn-book" type="submit">
                  Book Now
                </button>
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

        <section className="sec_book">
          <div className="hotel_booking">
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-field">
                  <label className="form_label" htmlFor="cityOrHotel">
                    City or Hotel Name:
                  </label>
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
        <div className="suggestions_hotel_container">
          <ul className="suggestions_hotel">
            <FontAwesomeIcon
              icon={faTimes}
              className="close-icon"
              onClick={handleCloseClick}
              style={{
                position: 'absolute',
                right: '10px',
                top: '10px',
                cursor: 'pointer',
              }}
            />
            {suggestions.map((suggestion) => (
              <li
                key={suggestion.busodma_id}
                onClick={() => handleSuggestionClick(suggestion.Destination)}
                style={{ cursor: 'pointer' }}
              >
                {suggestion.Destination}
              </li>
            ))}
          </ul>
          </div>
                  )}
                </div>

                <div className="form-field date-picker-field">
                  <label className="form_label" htmlFor="checkIn">
                    Check-In Date:
                  </label>
                  <div className="input-with-icon">
                    <DatePicker
                      className="form_in"
                      selected={inputs.checkIn}
                      onChange={(date) => handleDateChange(date, "checkIn")}
                      dateFormat="dd/MM/yyyy"
                      placeholderText="Select check-in date"
                      minDate={new Date()}
                    />
                    <FontAwesomeIcon
                      icon={faCalendarDays}
                      className="calendar-icon"
                    />
                  </div>
                </div>

                <div className="form-field custom-dropdown" ref={dropdownRef}>
  <label className="form_label" htmlFor="NoOfNights">No of Days:</label>
  <div className="input-with-icon">
    <input
      className="form_in"
      type="text"
      id="NoOfNights"
      value= {inputs.NoOfNights || ""}
      placeholder="Select Number of Nights"
      readOnly
      onClick={toggleDropdown}
    />
    {dropdownOpen && (
      <div className="dropdown-list">
        <ul>
          {[...Array(30).keys()].map((n) => (
            <li key={n + 1} onClick={() => handleSelect(n + 1)}>
              {n + 1}
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
</div>

                <div className="form-field guest_field">
                  <label className="form_label" htmlFor="guestField">
                    Guests:
                  </label>
                  <div className="input-with-icon" ref={inputRef}>
                    <input
                      className="form_in"
                      type="text"
                      id="guestField"
                      name="guestField"
                      placeholder="Guests"
                      onClick={handleToggleOptions}
                      value={`${inputs.rooms} Rooms, ${inputs.adults} Adults, ${inputs.children} Children`}
                      readOnly
                    />
                    <FontAwesomeIcon icon={faUser} className="user-icon" />
                    {showGuestOptions && isVisible && (
                      <div ref={guestRef} className="guest_options">
                        <FontAwesomeIcon
                          icon={faXmark}
                          className="close_icon"
                          onClick={handleClose}
                        />

                        <div className="guest_option">
                          <label htmlFor="room">Room:</label>
                          <button
                            type="button"
                            onClick={() =>
                              handleGuestChange("rooms", "decrement")
                            }
                          >
                            -
                          </button>
                          <span>{inputs.rooms}</span>
                          <button
                            type="button"
                            onClick={() =>
                              handleGuestChange("rooms", "increment")
                            }
                          >
                            +
                          </button>
                        </div>

                        <div className="guest_option">
                          <label htmlFor="adults">Adults:</label>
                          <button
                            type="button"
                            onClick={() =>
                              handleGuestChange("adults", "decrement")
                            }
                          >
                            -
                          </button>
                          <span>{inputs.adults}</span>
                          <button
                            type="button"
                            onClick={() =>
                              handleGuestChange("adults", "increment")
                            }
                          >
                            +
                          </button>
                        </div>
                        <div className="guest_option">
                          <label htmlFor="children">Children:</label>
                          <button
                            type="button"
                            onClick={() =>
                              handleGuestChange("children", "decrement")
                            }
                          >
                            -
                          </button>
                          <span>{inputs.children}</span>
                          <button
                            type="button"
                            onClick={() =>
                              handleGuestChange("children", "increment")
                            }
                          >
                            +
                          </button>
                          </div>
                            {/* Dynamic child age inputs */}
                  {Array.from({ length: inputs.children }).map((_, index) => (
                    <div className="child-age" key={index}>
                      <label className="form_label" htmlFor={`childAge${index}`}>
                        Child {index + 1} Age:
                      </label>
                      <input
                        type="number"
                        id={`childAge${index}`}
                        value={childAges[index] || ""}
                        onChange={(e) => handleChildAgeChange(index, e.target.value)}
                        min="0"
                         className="child-age-input"
                      />
                    </div>
                  ))}
                       
                      </div>
                    )}
                  </div>
                </div>

                <button className="btn-sub" type="submit">
                  Search Now
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>

      <section>
        <Container>
          <div className="Exclusive_offer">
            <h5>
              Exclusive <span style={{ color: "#00b7eb" }}>Offers</span>
            </h5>
            <div
              className="offer_container"
              onMouseEnter={stopAutoScroll}
              onMouseLeave={startAutoScroll}
            >
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

      <section>
        <div className="booking_head">
          <h5>
            {" "}
            Hotel Booking <span style={{ color: "#00b7eb" }}>Now</span>{" "}
          </h5>
        </div>
        <div className="Hotel_Booking_container">
          <div className="booking_box">
            <h5>BOOK HOTEL FASTER.</h5>
            <h5> DOWNLOAD OUR MOBILE APPS TODAY</h5>
            <p>
              The application will help you find attractions, tours or
              adventures in a new city{" "}
            </p>
            <img
              className="play_store"
              src="https://play.google.com/intl/en_us/badges/images/generic/en_badge_web_generic.png"
              alt="Play Store"
            />
            <img
              className="apple_play_store"
              src={play_store_img}
              alt="App Store"
            />
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default HotelSearch;