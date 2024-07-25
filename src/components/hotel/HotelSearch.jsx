import React, { useState, useRef, useEffect } from "react";
import { Button, Row, Col, Container } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./HotelSearch.css";
import hotel_img from "../../../src/assets/images/hotel_img.png";
import offer_img1 from "../../../src/assets/images/offer_img6.jpg";
import offer_img2 from "../../../src/assets/images/offer_img7.jfif";
import offer_img3 from "../../../src/assets/images/offer_img8.jpg";
import play_store_img from "../../../src/assets/images/play_store_img.png";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

const HotelSearch = () => {
  const slideContainerRef = useRef(null);
  const intervalRef = useRef(null);
  const scrollWidthRef = useRef(0);

  const navigate = useNavigate();

  const startAutoScroll = () => {
    intervalRef.current = setInterval(() => {
      if (slideContainerRef.current) {
        const imageWidth =
          slideContainerRef.current.querySelector("img").clientWidth + 32; // Including gap between images
        scrollWidthRef.current += imageWidth;

        slideContainerRef.current.scrollTo({
          left: scrollWidthRef.current,
          behavior: "smooth",
        });

        // Reset scroll to start when it reaches the end
        if (
          scrollWidthRef.current >=
          slideContainerRef.current.scrollWidth - slideContainerRef.current.clientWidth
        ) {
          scrollWidthRef.current = 0;
          slideContainerRef.current.scrollTo({
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

  useEffect(() => {
    startAutoScroll();
    return () => clearInterval(intervalRef.current);
  }, []);

  const [inputs, setInputs] = useState({
    cityOrHotel: "",
    checkIn: new Date("2020-04-30"),
    checkOut: new Date("2020-05-01"),
    adults: 1,
    children: 0,
  });

  const [showGuestOptions, setShowGuestOptions] = useState(false);
  const guestRef = useRef(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setInputs((values) => ({ ...values, [name]: value }));
  };

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

  const handleSubmit = async (event) => {
    event.preventDefault();

    const requestData = {
      BookingMode: "5",
      CheckInDate: format(inputs.checkIn, "dd/MM/yyyy"),
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
      console.log("API Response:", data);

      if (data && data.Results) {
        localStorage.setItem("traceId", "1");
        localStorage.setItem("resultIndex", "1");
        localStorage.setItem("srdvType", "SingleTB");
        localStorage.setItem("srdvIndex", "SrdvTB");

        navigate("/hotel-list", { state: { searchResults: data.Results } });
      } else {
        console.error("No search results found or error in response:", data);
        alert("No search results found. Please try again later.");
      }
    } catch (error) {
      console.error("Error searching hotel:", error);
      alert("Error searching hotel. Please try again later.");
    }
  };

  const handleClickOutside = (event) => {
    if (guestRef.current && !guestRef.current.contains(event.target)) {
      setShowGuestOptions(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
    ],
  };

  return (
    <>
      {/* New section start */}
      <div className="hotel_container">
        <div className="content_wrapper">
          <Row>
            <Col xl={4} md={12} className="order-md-1 order-2">
              <div className="content_box">
                <h1>Discover Your Perfect Getaway</h1>
                <p>
                  Experience luxury and comfort at Hotel. Located in the heart
                  of City, our hotel offers top-notch amenities and services.
                  Explore our curated list of top-rated hotels tailored just for
                  you. Choose from a variety of room types to suit your needs
                  and preferences. Enter your destination, dates, and
                  preferences to find the perfect stay.
                </p>
              </div>
            </Col>

            <Col xl={8} md={12} className="order-md-2 order-1">
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
        </div>
        {/* End section */}

        {/* New section start */}
        <section className="sec_book">
          <div className="hotel_booking">
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-field">
                  <label className="form_lable" htmlFor="cityOrHotel">City or Hotel Name: </label>
                  <input className="form_in" type="text" id="cityOrHotel"  name="cityOrHotel"
                    placeholder="Enter city or hotel name" value={inputs.cityOrHotel} onChange={handleChange}  />
                </div>

                <div className="form-field">
                  <label className="form_lable" htmlFor="checkIn">Check-In Date: </label>
                  <DatePicker className="form_in" selected={inputs.checkIn} onChange={(date) => handleDateChange(date, "checkIn")} dateFormat="dd/MM/yyyy" placeholderText="Select check-in date" />
                </div>

                <div className="form-field">
                  <label className="form_lable" htmlFor="checkOut">Check-Out Date:</label>
                  <DatePicker  className="form_in" selected={inputs.checkOut} onChange={(date) => handleDateChange(date, "checkOut")} dateFormat="dd/MM/yyyy" placeholderText="Select check-out date" />
                </div>

                <div className="form-field guest_field">
                  <label className="form_lable" htmlFor="guestField"> Guests:</label>
                  <input className="form_in" type="text" id="guestField" name="guestField" placeholder="Guests" onClick={() => setShowGuestOptions(!showGuestOptions)}
            value={`${inputs.adults} Adults, ${inputs.children} Children`} readOnly />
                  {showGuestOptions && (
                    <div ref={guestRef} className="guest_options">
                      <div className="guest_option">
                        <label htmlFor="adults">Adults:</label>
                        <button
                          type="button" onClick={() => handleGuestChange("adults", "decrement") }>-
                        </button>
                        <span>{inputs.adults}</span>
                        <button
                          type="button" onClick={() =>  handleGuestChange("adults", "increment")}>+
                        </button>
                      </div>

                      <div className="guest_option">
                        <label htmlFor="children">Children:</label>
                        <button
                          type="button" onClick={() => handleGuestChange("children", "decrement")}> -
                        </button>
                        <span>{inputs.children}</span>
                        <button
                          type="button"onClick={() => handleGuestChange("children", "increment")}>+
                        </button>
                      </div>
                    </div>
                  )}
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
          <div className="Exclusive-offer">
            <h5>
              Exclusive <span style={{ color: "#00b7eb" }}>Offers</span>
            </h5>
          </div>
          <div className="offer_container">
            <div className="offer_box" ref={slideContainerRef} >
            <Slider {...settings}>
                <div>
                  <img src={offer_img1} alt="Offer Image 1" className="offer_img" />
                </div>
                <div>
                  <img  src={offer_img2}  alt="Offer Image 2" className="offer_img" />
                </div>
                <div>
                  <img src={offer_img3} alt="Offer Image 3" className="offer_img" />
                </div>
              </Slider>
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
      
    </>
  );
};

export default HotelSearch;
