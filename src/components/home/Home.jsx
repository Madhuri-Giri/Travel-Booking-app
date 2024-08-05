// import "./Home.css"
import '../flight/FlightSearch.css';
import React, { useState, useEffect } from 'react';
import { Carousel, Dropdown, Modal, Button } from 'react-bootstrap';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { FaCalendarAlt, FaUser, FaAngleDown } from 'react-icons/fa';
import { BiLogoPlayStore } from "react-icons/bi";
import { MdDateRange } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { GiCommercialAirplane } from "react-icons/gi";
import { TbBus } from "react-icons/tb";
import { FaCircleUser, FaBaby, FaPerson, FaChildReaching } from "react-icons/fa6";
import { FiMinusCircle, FiPlusCircle } from "react-icons/fi";
import { RiHotelFill } from "react-icons/ri";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from "axios";
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import PropTypes from 'prop-types';

const Home = () => {
  const navigate = useNavigate();

  // states-------------------------------------------
  const [from, setFrom] = useState('LKO');
  const [to, setTo] = useState('KWI');
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);
  const [preferredDepartureTime, setPreferredDepartureTime] = useState(new Date());
  const [preferredArrivalTime, setPreferredArrivalTime] = useState(new Date());

  const fetchSuggestions = async (query, setSuggestions) => {
    console.log('test');
    try {
      const response = await fetch(`https://srninfotech.com/projects/travel-app/api/bus_list?query=${query}`);
      const data = await response.json();
      // console.log('API Response:', data)
      const filteredSuggestions = data.data.filter(suggestion =>
        suggestion.busodma_destination_name.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    }
    catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

   // function for adult , child , infact dropdown list-------------------------------------------
   const [showDropdown, setShowDropdown] = useState(false);
   const handleShow = () => {
     setShowDropdown(!showDropdown);
   };
   const handleClose = () => {
     setShowDropdown(false);
   };
   // function for adult , child , infact dropdown list-------------------------------------------
 

  // func for Origin & Destination----------------------------------------------------------------
  const handleFromChange = (event) => {
    const value = event.target.value;
    console.log("vvvvvvalue", value)
    setFrom(value);
    if (value.length > 2) {
      fetchSuggestions(value, setFromSuggestions);
    } else {
      setFromSuggestions([]);
    }
  };

  const handleToChange = (event) => {
    const value = event.target.value;
    setTo(value);
    if (value.length > 2) {
      fetchSuggestions(value, setToSuggestions);
    } else {
      setToSuggestions([]);
    }
  };
  // func for Origin & Destination----------------------------------------------------------------


  // function for select From & To --------------------------------------
  const handleSuggestionClick = (suggestion, fieldSetter) => {
    fieldSetter(suggestion.busodma_destination_name);
  };

  const handleToSelect = (suggestion) => {
    handleSuggestionClick(suggestion, setTo);
    setToSuggestions([]);
  };

  const handleFromSelect = (suggestion) => {
    handleSuggestionClick(suggestion, setFrom);
    setFromSuggestions([]);

    let updatedSegments = formData.Segments;
    updatedSegments[0]["Origin"] = suggestion.busodma_destination_name;
    setFormData((prev) => ({ ...prev, Segments: updatedSegments }));
  };
  // function for select From & To --------------------------------------

  // Static formData------------------------------------------------------------
  const [formData, setFormData] = useState({
    AdultCount: 1,
    ChildCount: 0,
    InfantCount: 0,
    JourneyType: "1",
    FareType: 1,
    Segments: [
      {
        Origin: "LKO",
        Destination: "KWI",
        FlightCabinClass: 1,
         PreferredDepartureTime: "2024-08-20T00:00:00",
        PreferredArrivalTime: "2024-08-25T00:00:00"
      }
    ]
  });
  // Static formData------------------------------------------------------------

  // search API integration function----------------------------------------------
  const getFlightList = async () => {
    try {
      const response = await fetch('https://sajyatra.sajpe.in/admin/api/flight-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("hello", data);


      // Save TraceId to local storage with the key "FlightTraceId2"
      if (data.TraceId) {
        localStorage.setItem("FlightTraceId2", data.TraceId);
        console.log("Saved TraceId to local storage:", data.TraceId); // Log TraceId
      }

      if (data?.Results?.[0]?.[0]?.FareDataMultiple?.[0]?.ResultIndex) {
        const resultIndex = data.Results[0][0].FareDataMultiple[0].ResultIndex;
        localStorage.setItem("FlightResultIndex2", resultIndex);

        console.log("Saved ResultIndex to local storage:", resultIndex);
      } else {
        console.log("ResultIndex not found");
      }

      if (data?.Results?.[0]?.[0]?.FareDataMultiple?.[0]?.SrdvIndex) {
        const srdvIndex = data.Results[0][0].FareDataMultiple[0].SrdvIndex;
        localStorage.setItem("FlightSrdvIndex2", srdvIndex);
        console.log("Saved SrdvIndex to local storage:", srdvIndex);
      } else {
        console.log("SrdvIndex not found");
      }


      navigate("/flight-list", { state: { data: data, formData: formData } });
    }
    catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  }
  // search API integration function----------------------------------------------


  // function for dynamic dep arr date----------------------------------------
  // const handleChange = (date) => {
  //   const formattedDate = new Date(date).toISOString().split('.')[0];
  //   console.log("formattedDate", formattedDate);
  //   setFormData((prev) => {
  //     let updatedSegments = [...prev.Segments];
  //     updatedSegments[0]["PreferredDepartureTime"] = formattedDate;
  //     updatedSegments[0]["PreferredArrivalTime"] = formattedDate;
  //     console.log("updatedSegments", updatedSegments);
  //     return { ...prev, Segments: updatedSegments };
  //   });
  // };
const handleChange = (date) => {
  // Set the time part to "00:00:00" (AnyTime) for both PreferredDepartureTime and PreferredArrivalTime
  const formattedDate = new Date(date).toISOString().split('T')[0] + 'T00:00:00';
  console.log("formattedDate", formattedDate);

  setFormData((prev) => {
    let updatedSegments = [...prev.Segments];
    updatedSegments[0]["PreferredDepartureTime"] = formattedDate;
    updatedSegments[0]["PreferredArrivalTime"] = formattedDate;
    console.log("updatedSegments", updatedSegments);
    return { ...prev, Segments: updatedSegments };
  });
};

  
  // function for dynamic dep arr date----------------------------------------

  // fun for increase decrease adult , child , infant count------------------------------------------------
  const handleCount = (key, name) => {
    console.log("called", key, name)
    if (key == "increment") {
      setFormData((prev) => ({ ...prev, [name]: formData[name] + 1 }));
    } else if (key == "decrement") {
      if (formData[name] > 0) {
        setFormData((prev) => ({ ...prev, [name]: formData[name] - 1 }));
      }
    }
  }
  // fun for increase decrease adult , child , infant count------------------------------------------------


  // func for select flight class----------------------------------------------
  const [selectedflightClass, setSelectedflightClass] = useState('Economy');
  const handleflightClassChange = (event) => {
    setSelectedflightClass(event.target.value);
    setFormData((prev) => ({ ...prev, JourneyType: event.target.value }))
  };
  // func for select flight class----------------------------------------------



  // for one way & two way tabs-----------------------------------------
  const [activeTab, setActiveTab] = useState('oneway');

  const handleTabChange = (event) => {
    setActiveTab(event.target.value);
  };
  // for one way & two way tabs-----------------------------------------


  // ----------  Api integration start for slider image  ----------
  const [offerSliderImages, setOfferSliderImages] = useState([]);
  useEffect(() => {
    axios.get('https://sajyatra.sajpe.in/admin/api/offer')
      .then(response => {
        setOfferSliderImages(response.data.data);
      })
      .catch(error => {
        console.error('Error slider image fetching data: ', error);
      });
  }, []);
  // ----------  Api integration end for slider image  ----------



  // slider logics------------------------------------------------------
  const SamplePrevArrow = (props) => {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, display: "block", left: "10px", zIndex: 1 }}
        onClick={onClick}
      >
      </div>
    );
  };
  SamplePrevArrow.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    onClick: PropTypes.func,
  };
  const SampleNextArrow = (props) => {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, display: "block", right: "10px", zIndex: 1 }}
        onClick={onClick}
      >
        {/* <FaArrowRightLong style={{ color: 'black', fontSize: '30px' }} /> */}
      </div>
    );
  };
  SampleNextArrow.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    onClick: PropTypes.func,
  };
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    prevArrow: <SamplePrevArrow />,
    nextArrow: <SampleNextArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
        }
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1
        }
      }
    ]
  };
  // slider logics------------------------------------------------------



  return (
    <>


      <section className='flightPageBanner'>
        <div className="container-fluid ">
          <div className="findFlightss"><button>Find Flights</button></div>
          <div className="row">
            <div className="col-lg-5 ">
              <div className="flightmainBooking">
                <div className="ps-3">
                  <button className="onewaybutton">
                    <input
                      type="radio"
                      id="oneway"
                      name="tripType"
                      value="oneway"
                      checked={activeTab === 'oneway'}
                      onChange={handleTabChange}
                    />
                    <label htmlFor="oneway" className="ml-2"> One Way </label>
                  </button>

                  <button className="twowaybutton">
                    <input
                      type="radio"
                      id="twoway"
                      name="tripType"
                      value="twoway"
                      checked={activeTab === 'twoway'}
                      onChange={handleTabChange}
                    />
                    <label htmlFor="twoway">Round Trip</label>
                  </button>
                </div>
                <hr></hr>
                <div>
                  {activeTab === 'oneway' && (
                    <div className="ps-2 pe-2">
                      <form action="" >
                        <div className="row flightformRow">
                          <div className="col-12">
                            <div className="form-group  position-relative">
                              <label htmlFor="text" >From</label>
                              <input type="text" className="form-control" id="flightSatrtingPoint" placeholder='Starting Point' value={from} onChange={handleFromChange} />
                              {fromSuggestions.length > 0 && (
                                <ul className="suggestions-list">
                                  {fromSuggestions.map((suggestion, index) => (
                                    <li className='text-red' key={index} onClick={() => handleFromSelect(suggestion, setFrom)}>
                                      {suggestion.
                                        busodma_destination_name
                                      }              </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          </div>
                          <div className="col-12 mt-2">
                            <div className="form-group">
                              <label htmlFor="text">To</label>
                              <input type="text" className="form-control" id="flightDestinationPoint" placeholder='Destination' value={to} onChange={handleToChange} />
                              {toSuggestions.length > 0 && (
                                <ul className="suggestions-list">
                                  {toSuggestions.map((suggestion, index) => (
                                    <li key={index} onClick={() => handleToSelect(suggestion, setTo)}>
                                      {suggestion.busodma_destination_name
                                      }
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          </div>

                          <div className="col-sm-6 mt-2">
                            <div className="form-group">
                              <label htmlFor="PreferredDepartureTime">Departure Date</label>
                              <div className="date-picker-wrapper form-control">
                                <DatePicker
                                  name="PreferredDepartureTime"
                                  selected={preferredDepartureTime}
                                  onChange={(date) => handleChange(date, "PreferredDepartureTime")}
                                  className="departureCallender"
                                  id="PreferredDepartureTime"
                                  placeholderText="Select a date"
                                />
                                <MdDateRange className="date-picker-icon" />
                              </div>
                            </div>
                          </div>
                          <div className="col-sm-6">
                            <div className="form-group onewayreturnhidebtn">
                              <Link>Add Return date</Link>
                              <MdDateRange className="mt-1 ms-2" />
                            </div>
                          </div>

                          <div className="col-sm-8 form-group  mt-3" onClick={handleShow}>
                            <label htmlFor="text">Travellers $ Cabin</label>
                            <div className="form-control flightTravellerclssFormControl">
                              <div className="flightTravellerclss">
                                <FaCircleUser />
                                <p> Traveller - <span>{formData.AdultCount + formData.ChildCount + formData.InfantCount}</span> , </p>
                                <p> Class - <span>{formData.JourneyType}</span>  </p>
                                <FaAngleDown className="downarrrow" />
                              </div>
                            </div>
                          </div>

                          <div className="col-sm-4 form-group home-flight-search">
                            <button onClick={getFlightList} type="button" className="btn">Search</button>
                          </div>

                          <div>
                            {showDropdown && (
                              <div className="row travellerdropdown">
                                <div className="dropdown-header">
                                  <RxCross2 onClick={handleClose} className="close-icon" />
                                </div>
                                <div className="col-sm-6 travellerdropdowncol1">
                                  <h6>SELECT PASSENGERS</h6>
                                  <div className='flightpageagebox'>
                                    <h6 style={{ color: '#222' }}>Adults</h6>
                                    <div className='adultIcons'>
                                      <FiMinusCircle
                                        className='adultMinusicon'
                                        values=""
                                        onClick={() => handleCount("decrement", "AdultCount")}
                                      />
                                      <span>{formData.AdultCount}</span>
                                      <FiPlusCircle
                                        className='adultPlusicon'
                                        onClick={() => handleCount("increment", "AdultCount")}
                                      />
                                    </div>
                                  </div>
                                  <div className='flightpageagebox'>
                                    <h6 style={{ color: '#222' }}>Children</h6>
                                    <div className='childIcons'>
                                      <FiMinusCircle
                                        className='childMinusicon'
                                        onClick={() => handleCount("decrement", "ChildCount")}
                                      />
                                      <span>{formData.ChildCount}</span>
                                      <FiPlusCircle
                                        className='childPlusicon'
                                        onClick={() => handleCount("increment", "ChildCount")}
                                      />
                                    </div>
                                  </div>
                                  <div className='flightpageagebox'>
                                    <h6 style={{ color: '#222' }}>Infants</h6>
                                    <div className='infantIcons'>
                                      <FiMinusCircle
                                        className='infantsMinusicon'
                                        onClick={() => handleCount("decrement", "InfantCount")} />
                                      <span>{formData.InfantCount}</span>
                                      <FiPlusCircle
                                        className='infantsPlusicon'
                                        onClick={() => handleCount("increment", "InfantCount")} />
                                    </div>
                                  </div>
                                </div>
                                <div className="col-sm-5 travellerdropdowncol2">
                                  <h6>SELECT TRAVEL</h6>
                                  <p>Choose Travel Class</p>
                                  <div>
                                    <input
                                      type="radio"
                                      id="economy"
                                      name="flightClass"
                                      value="Economy"
                                      checked={selectedflightClass === 'Economy'}
                                      onChange={handleflightClassChange}
                                    />
                                    <label htmlFor="economy">Economy</label>
                                  </div>
                                  <div>
                                    <input
                                      type="radio"
                                      id="premiumEconomy"
                                      name="flightClass"
                                      value="Premium Economy"
                                      checked={selectedflightClass === 'Premium Economy'}
                                      onChange={handleflightClassChange}
                                    />
                                    <label htmlFor="premiumEconomy">Premium Economy</label>
                                  </div>
                                  <div>
                                    <input
                                      type="radio"
                                      id="business"
                                      name="flightClass"
                                      value="Business"
                                      checked={selectedflightClass === 'Business'}
                                      onChange={handleflightClassChange}
                                    />
                                    <label htmlFor="business">Business</label>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                      </form>
                    </div>
                  )}
                  {activeTab === 'twoway' && (

                    <div className="ps-2 pe-2">

                      <form action="" >
                        <div className="row flightformRow">
                          <div className="col-12">
                            <div className="form-group  position-relative">
                              <label htmlFor="text" >From</label>
                              <input type="text" className="form-control" id="flightSatrtingPoint" placeholder='Starting Point' value={from} onChange={handleFromChange} />
                              {fromSuggestions.length > 0 && (
                                <ul className="suggestions-list">
                                  {fromSuggestions.map((suggestion, index) => (
                                    <li className='text-red' key={index} onClick={() => handleFromSelect(suggestion, setFrom)}>
                                      {suggestion.
                                        busodma_destination_name
                                      }              </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          </div>
                          <div className="col-12 mt-2">
                            <div className="form-group">
                              <label htmlFor="text">To</label>
                              <input type="text" className="form-control" id="flightDestinationPoint" placeholder='Destination' value={to} onChange={handleToChange} />
                              {toSuggestions.length > 0 && (
                                <ul className="suggestions-list">
                                  {toSuggestions.map((suggestion, index) => (
                                    <li key={index} onClick={() => handleToSelect(suggestion, setTo)}>
                                      {suggestion.busodma_destination_name
                                      }
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          </div>

                          <div className="col-sm-6 mt-2">
                            <div className="form-group">
                              <label htmlFor="PreferredDepartureTime">Departure Date</label>
                              <div className="date-picker-wrapper form-control">
                                <DatePicker
                                  name="PreferredDepartureTime"
                                  selected={preferredDepartureTime}
                                  onChange={(date) => handleChange(date, "PreferredDepartureTime")}
                                  className=""
                                  id="PreferredDepartureTime"
                                  placeholderText="Select a date"
                                />
                                <MdDateRange className="date-picker-icon" />
                              </div>
                            </div>
                          </div>
                          <div className="col-sm-6 mt-2">
                            <div className="form-group">
                              <div className="form-group">
                                <label htmlFor="PreferredArrivalTime">Return Date</label>
                                <div className="date-picker-wrapper form-control">
                                  <DatePicker
                                    name="PreferredArrivalTime"
                                    selected={preferredArrivalTime}
                                    onChange={(date) => handleChange(date, "PreferredArrivalTime")}
                                    className=""
                                    id="PreferredArrivalTime"
                                    placeholderText="Select a date"
                                  />
                                  <MdDateRange className="date-picker-icon" />
                                </div>
                              </div>

                            </div>
                          </div>

                          <div className="col-sm-8 form-group  mt-3" onClick={handleShow}>
                            <label htmlFor="text">Travellers $ Cabin</label>
                            <div className="form-control flightTravellerclssFormControl">
                              <div className="flightTravellerclss">
                                <FaCircleUser />
                                <p> <span>{formData.AdultCount + formData.ChildCount + formData.InfantCount}</span> Traveller , </p>
                                <p> <span>{formData.JourneyType}</span> Cabin Class </p>
                                <FaAngleDown className="downarrrow" />
                              </div>
                            </div>
                          </div>

                          <div className="col-sm-4 form-group home-flight-search">
                            <button onClick={getFlightList} type="button" className="btn">Search</button>
                          </div>

                          <div>
                            {showDropdown && (
                              <div className="row travellerdropdown">
                                <div className="dropdown-header">
                                  <RxCross2 onClick={handleClose} className="close-icon" />
                                </div>
                                <div className="col-sm-6 travellerdropdowncol1">
                                  <h6>SELECT PASSENGERS</h6>
                                  <div className='flightpageagebox'>
                                    <h6 style={{ color: '#222' }}>Adults</h6>
                                    <div className='adultIcons'>
                                      <FiMinusCircle
                                        className='adultMinusicon'
                                        onClick={() => handleCount("decrement", "AdultCount")}
                                      />
                                      <span>{formData.AdultCount}</span>
                                      <FiPlusCircle
                                        className='adultPlusicon'
                                        onClick={() => handleCount("increment", "AdultCount")}
                                      />
                                    </div>
                                  </div>
                                  <div className='flightpageagebox'>
                                    <h6 style={{ color: '#222' }}>Children</h6>
                                    <div className='childIcons'>
                                      <FiMinusCircle
                                        className='childMinusicon'
                                        onClick={() => handleCount("decrement", "ChildCount")}
                                      />
                                      <span>{formData.ChildCount}</span>
                                      <FiPlusCircle
                                        className='childPlusicon'
                                        onClick={() => handleCount("increment", "ChildCount")}
                                      />
                                    </div>
                                  </div>
                                  <div className='flightpageagebox'>
                                    <h6 style={{ color: '#222' }}>Infants</h6>
                                    <div className='infantIcons'>
                                      <FiMinusCircle
                                        className='infantsMinusicon'
                                        onClick={() => handleCount("decrement", "InfantCount")} />
                                      <span>{formData.InfantCount}</span>
                                      <FiPlusCircle
                                        className='infantsPlusicon'
                                        onClick={() => handleCount("increment", "InfantCount")} />
                                    </div>
                                  </div>
                                </div>
                                <div className="col-sm-5 travellerdropdowncol2">
                                  <h6>SELECT TRAVEL</h6>
                                  <p>Choose Travel Class</p>
                                  <div>
                                    <input
                                      type="radio"
                                      id="economy"
                                      name="flightClass"
                                      value="Economy"
                                      checked={selectedflightClass === 'Economy'}
                                      onChange={handleflightClassChange}
                                    />
                                    <label htmlFor="economy">Economy</label>
                                  </div>
                                  <div>
                                    <input
                                      type="radio"
                                      id="premiumEconomy"
                                      name="flightClass"
                                      value="Premium Economy"
                                      checked={selectedflightClass === 'Premium Economy'}
                                      onChange={handleflightClassChange}
                                    />
                                    <label htmlFor="premiumEconomy">Premium Economy</label>
                                  </div>
                                  <div>
                                    <input
                                      type="radio"
                                      id="business"
                                      name="flightClass"
                                      value="Business"
                                      checked={selectedflightClass === 'Business'}
                                      onChange={handleflightClassChange}
                                    />
                                    <label htmlFor="business">Business</label>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              </div>

            </div>

            <div className="col-lg-7 bannerSlider">
              <Carousel>
                <Carousel.Item>
                  <img
                    className="d-block w-100 img-fluid"
                    src="https://www.vimaansafar.com/img/Vimaansafar-1.jpg?vt"
                    alt="First slide"
                  />

                </Carousel.Item>
                <Carousel.Item>
                  <img
                    className="d-block w-100 img-fluid"
                    src="https://www.vimaansafar.com/img/International-Flight.jpg"
                    alt="Second slide"
                  />

                </Carousel.Item>
                <Carousel.Item>
                  <img
                    className="d-block w-100 img-fluid"
                    src="https://www.vimaansafar.com/img/Zero-vs.jpg?"
                    alt="Third slide"
                  />

                </Carousel.Item>
              </Carousel>
            </div>

          </div>
        </div>
      </section>

      <section className='flightbooksec2'>
        <div className="container">
          <div className="row">
            <img className='img-fluid' src='https://www.vimaansafar.com/img/footer-trustlogo_new.png?dd' />
          </div>
        </div>
      </section>
      
      <section className="flightbooksec3">
        <h5>Reasons to book with us?</h5>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-4 flightbooksec3Col">
              <div> <img src="https://www.vimaansafar.com/img/fastT.png" className="img-fluid"></img>  </div>
              <div>
                <h6>FAST BOOKING</h6>
                <p>We offer fast booking, fantastic products, competitive pricing & amazing experience.</p>
              </div>
            </div>
            <div className="col-md-4 flightbooksec3Col">
              <div> <img src="https://www.vimaansafar.com/img/eDeal.png" className="img-fluid"></img>  </div>
              <div>
                <h6>FAST BOOKING</h6>
                <p>We offer fast booking, fantastic products, competitive pricing & amazing experience.</p>
              </div>
            </div>
            <div className="col-md-4 flightbooksec3Col">
              <div> <img src="https://www.vimaansafar.com/img/24Support.png" className="img-fluid"></img>  </div>
              <div>
                <h6>FAST BOOKING</h6>
                <p>We offer fast booking, fantastic products, competitive pricing & amazing experience.</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* <section className="exictingOffers">
        <div className="container-fluid mb-5 ss">
          <div className="row">
            <h5>Exicting offers</h5>
            <div className="col-4">
              <img className='img-fluid' src='https://www.vimaansafar.com/img/slide-72_t.png' />
            </div>
            <div className="col-4">
              <img className='img-fluid' src='https://www.vimaansafar.com/img/slide-71_t.png?t' />
            </div>
            <div className="col-4">
              <img className='img-fluid' src='https://www.vimaansafar.com/img/slide-75_t.png' />

            </div>
          </div>
        </div>
      </section> */}


      <section className='exictingOffers mt-5 mb-5'>
        <div className="container-fluid">
          <h5 className='mb-3'>Exclusive Offers</h5>
          <Slider {...settings}>
            {offerSliderImages.map((offer, offerIndex) => {
              return (
                <div className="exictingOfferslider col-md-3 mt-4 p-2" key={offerIndex}>
                  <img className='img-fluid' src={offer.slider_img} />
                </div>
              )
            }
            )}
          </Slider>
        </div>
      </section>

      <section className="exclusive-dealsSec">
        <div className="container-fluid mb-5">
          <div className="row mb-4">
            <h2>Exclusive Deals</h2>
            <div className="col-lg-4 col-md-6 exclusivecol">
              <div className="position-relative">
                <img src="https://www.vimaansafar.com/img/city/delhi.jpg" className="img-fluid" alt="Bangkok" />
                <div className="overlay-text position-absolute top-0 start-0 p-3 text-white">
                  <h3>Delhi</h3>
                  <p>Rs 2200</p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 exclusivecol">
              <div className="position-relative">
                <img src="https://www.vimaansafar.com/img/city/amritsar.jpg" className="img-fluid" alt="Bangkok" />
                <div className="overlay-text position-absolute top-0 start-0 p-3 text-white">
                  <h3>Amritsar</h3>
                  <p>Rs 1900</p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 exclusivecol">
              <div className="position-relative">
                <img src="https://www.vimaansafar.com/img/city/srinagar.jpg" className="img-fluid" alt="Bangkok" />
                <div className="overlay-text position-absolute top-0 start-0 p-3 text-white">
                  <h3>Srinagar</h3>
                  <p>Rs 2400</p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 exclusivecol">
              <div className="position-relative">
                <img src="https://www.vimaansafar.com/img/city/bangkok.jpg" className="img-fluid" alt="Bangkok" />
                <div className="overlay-text position-absolute top-0 start-0 p-3 text-white">
                  <h3>Bangkok</h3>
                  <p>Rs 7000</p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 exclusivecol">
              <div className="position-relative">
                <img src="https://www.vimaansafar.com/img/city/dubai.jpg" className="img-fluid" alt="Bangkok" />
                <div className="overlay-text position-absolute top-0 start-0 p-3 text-white">
                  <h3>Dubai</h3>
                  <p>Rs 11000</p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 exclusivecol">
              <div className="position-relative">
                <img src="https://www.vimaansafar.com/img/city/hongkong.jpg" className="img-fluid" alt="Bangkok" />
                <div className="overlay-text position-absolute top-0 start-0 p-3 text-white">
                  <h3>Hong Kong</h3>
                  <p>Rs 13000</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



      <section className="flightsec7 bg-light">
        <div className="container">
          <div className="row flightsec7row">
            <div className="col-lg-5 flightsec7col">
              <h3>Newsletter</h3>
              <p>Subscribe to our newsletter and stay updated with our travel offers.</p>
              <div className="form-group flightsec7form">
                <label htmlFor="text" >Enter your email address to subscribe</label>
                <input type="text" className="form-control" id="flightSatrtingPoint" placeholder='Email' />
                <p>Provide your email address to subscribe. For e.g abc@xyz.com</p>
                <div className="flightsubscr">
                  <button>SUBSCRIBE</button>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <Carousel>
                <Carousel.Item>
                  <img
                    className="d-block w-100 img-fluid"
                    src='/src/assets/images/home-yotube.jpg'
                    alt="First slide"
                  />
                </Carousel.Item>
                <Carousel.Item>
                  <img
                    className="d-block w-100 img-fluid"
                    src='/src/assets/images/home-insta.jpg'
                    alt="First slide"
                  />
                </Carousel.Item>
              </Carousel>
            </div>
          </div>
        </div>
      </section>

      <section className="flightsec6">
        <div className="container">
          <div className="row">
            <div className="col-12 flightsec6col">
              <div className="flightsec6coldiv">
                <h1>BOOK TICKET FASTER.</h1>
                <h1>DOWNLOAD OUR MOBILE APPS TODAY</h1>
                <p>The application will help you find attractions, tours or adventures in a new city</p>
                <button className="googleplaybtn">
                  <BiLogoPlayStore /><h6>Google Play</h6>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

    </>
  )
}

export default Home