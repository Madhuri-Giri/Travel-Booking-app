// import "./Home.css"
import '../flight/FlightSearch.css';
import React, { useState, useEffect, useRef } from 'react';
import { Carousel } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { FaAngleDown } from 'react-icons/fa';
import { BiLogoPlayStore, BiSolidPlaneTakeOff, BiSolidPlaneLand } from "react-icons/bi";
import { MdDateRange } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { FaCircleUser } from "react-icons/fa6";
import { FiMinusCircle, FiPlusCircle } from "react-icons/fi";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from "axios";
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import PropTypes from 'prop-types';
import home_insta from "../../../src/assets/images/home-insta.jpg";
import home_newsletter from "../../../src/assets/images/home-yotube.jpg";
import Loading from '../../pages/loading/Loading'; 
import CustomNavbar from '../../pages/navbar/CustomNavbar';
import Footer from '../../pages/footer/Footer';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Home = () => {
  const [loading, setLoading] = useState(false); // Add loading state

  const navigate = useNavigate();

  // states-------------------------------------------
  const [from, setFrom] = useState();
  const [to, setTo] = useState();
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);
  const fromInputRef = useRef(null);
  const toInputRef = useRef(null);
  const fromSuggestionsRef = useRef(null);
  const toSuggestionsRef = useRef(null);
  const mainCityNames = ['Delhi', 'Mumbai', 'Bhopal', 'Indore', 'Goa', 'Hyderabad'];
  const [originCode, setOriginCode] = useState(''); // State for origin code
  const [desctinationCode, setDesctinationCode] = useState(''); // State for origin code
  const [departureDate, setDepartureDate] = useState();
  const [returnDateDep, setReturnDateDep] = useState();
  const [errors, setErrors] = useState({ from: '', to: '', departureDate: '' });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        (fromInputRef.current && !fromInputRef.current.contains(event.target)) &&
        (toInputRef.current && !toInputRef.current.contains(event.target)) &&
        (!fromSuggestionsRef.current || !fromSuggestionsRef.current.contains(event.target)) &&
        (!toSuggestionsRef.current || !toSuggestionsRef.current.contains(event.target))
      ) {
        setFromSuggestions([]); // Clear suggestions if click is outside
        setToSuggestions([]); // Clear suggestions if click is outside
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  const fetchSuggestions = async (query, setSuggestions, isMainCityFetch = false) => {
    try {
      // Encode the query parameter
      const encodedQuery = encodeURIComponent(query);
      const url = `https://sajyatra.sajpe.in/admin/api/flight-list?query=${encodedQuery}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      let suggestions = data.data;

      if (isMainCityFetch) {
        // Filter to only include main cities
        suggestions = suggestions.filter((suggestion) =>
          mainCityNames.includes(suggestion.airport_city_name)
        );
      } else {
        // Filter suggestions based on the input query
        suggestions = suggestions.filter((suggestion) =>
          suggestion.airport_city_name.toLowerCase().includes(query.toLowerCase())
        );
      }

      setSuggestions(suggestions.slice(0, 6)); // Show up to 6 suggestions
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };


  // Function to handle input focus
  const handleFromInputFocus = () => {
    fetchSuggestions('', setFromSuggestions, true);
  };

  const handleToInputFocus = () => {
    fetchSuggestions('', setToSuggestions, true);
  };

  // Function to handle "From" input change  
  const handleFromChange = (event) => {
    const value = event.target.value;
    setFrom(value);
    setErrors({ ...errors, from: '' }); // Clear the error when the user types
    if (value.length > 2) {
      fetchSuggestions(value, setFromSuggestions);
    } else {
      setFromSuggestions([]);
    }
  };
  // Function to handle "To" input change
  const handleToChange = (event) => {
    const value = event.target.value;
    setTo(value);
    setErrors({ ...errors, to: '' }); // Clear the error when the user types
    if (value.length > 2) {
      fetchSuggestions(value, setToSuggestions);
    } else {
      setToSuggestions([]);
    }
  };
  const handleSuggestionClick = (suggestion, setFunction, setSuggestions, setValuee) => {
    setFunction(suggestion.airport_city_name);
    setValuee(suggestion.airport_city_code); // Update with airport city code
    setSuggestions([]);
  };

  // function for dates departure return 
  const handleDateChangeDeparture = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}T00:00:00`;
    setDepartureDate(formattedDate);
    setErrors({ ...errors, departureDate: '' }); // Clear the error when the user selects a date

  };
  const handleDateChangeReturn = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}T00:00:00`;
    setReturnDateDep(formattedDate);
  };

  // function for adult , child , infact dropdown list-------------------------------------------
  const [showDropdown, setShowDropdown] = useState(false);
  const handleShow = () => {
    setShowDropdown(!showDropdown);
  };
  const handleClose = () => {
    setShowDropdown(false);
  };

  // State variables for counts
  const [adultCount, setAdultCount] = useState(1);
  const [childCount, setChildCount] = useState(0);
  const [infantCount, setInfantCount] = useState(0);



  // Handle count change
  const handleCount = (action, type) => {
    let newCount;

    switch (type) {
      case 'AdultCount':
        newCount = action === 'increment' ? adultCount + 1 : Math.max(adultCount - 1, 0);
        setAdultCount(newCount);
        setFormData((prevFormData) => ({
          ...prevFormData,
          AdultCount: newCount
        }));
        break;

      case 'ChildCount':
        newCount = action === 'increment' ? childCount + 1 : Math.max(childCount - 1, 0);
        setChildCount(newCount);
        setFormData((prevFormData) => ({
          ...prevFormData,
          ChildCount: newCount
        }));
        break;

      case 'InfantCount':
        newCount = action === 'increment' ? infantCount + 1 : Math.max(infantCount - 1, 0);
        setInfantCount(newCount);
        setFormData((prevFormData) => ({
          ...prevFormData,
          InfantCount: newCount
        }));
        break;

      default:
        break;
    }
  };




  // func for select flight class----------------------------------------------
  const [selectedflightClass, setSelectedflightClass] = useState('Economy');
  // const handleflightClassChange = (event) => {
  //   setSelectedflightClass(event.target.value);
  //   setFormData((prev) => ({ ...prev, FlightCabinClass: event.target.value }))
  // };

  const handleflightClassChange = (event) => {
    const newFlightClass = event.target.value;
    setSelectedflightClass(newFlightClass);
    // setFormData((prev) => ({ ...prev, FlightCabinClass: newFlightClass }));
    updateSegmentsFlightClass(newFlightClass);
  };
  const updateSegmentsFlightClass = (newFlightClass) => {
    setSegments((prevSegments) =>
      prevSegments.map((segment) => ({
        ...segment,
        FlightCabinClass: newFlightClass
      }))
    );
  };
  // func for select flight class----------------------------------------------



  // for one way & two way tabs-----------------------------------------
  const [activeTab, setActiveTab] = useState('oneway');
  const [tabValue, setTabValue] = useState(1); // State for tab value: 1 for oneway, 2 for twoway
  const [segments, setSegments] = useState([
    {
      Origin: originCode,
      Destination: desctinationCode,
      FlightCabinClass: selectedflightClass,
      PreferredDepartureTime: departureDate,
      PreferredArrivalTime: departureDate
    }
  ]);

  // State for formData, which includes segments
  const [formData, setFormData] = useState({
    AdultCount: adultCount, // Initialize with dynamic count
    ChildCount: childCount,
    InfantCount: infantCount,
    JourneyType: tabValue.toString(),
    FareType: 1,
    Segments: segments
  });

  // Handle tab change
  const handleTabChange = (event) => {
    const selectedTab = event.target.value;
    setActiveTab(selectedTab);
    const newValue = selectedTab === 'oneway' ? 1 : 2;
    setTabValue(newValue);
    setFormData((prevFormData) => ({
      ...prevFormData,
      JourneyType: newValue.toString()
    }));
  };
  const activateTwoWayTab = () => {
    handleTabChange({ target: { value: 'twoway' } });
  };


  useEffect(() => {
    if (tabValue === 1) {
      // One-Way: Keep only one segment
      setSegments([
        {
          Origin: originCode,
          Destination: desctinationCode,
          FlightCabinClass: selectedflightClass,
          PreferredDepartureTime: departureDate,
          PreferredArrivalTime: departureDate
        }
      ]);

      
    } else if (tabValue === 2) {
      // Two-Way: Add a second segment
      setSegments([
        {
          Origin: originCode,
          Destination: desctinationCode,
          FlightCabinClass: selectedflightClass,
          PreferredDepartureTime: departureDate,
          PreferredArrivalTime: departureDate
        },
        {
          Origin: desctinationCode,
          Destination: originCode,
          FlightCabinClass: selectedflightClass,
          PreferredDepartureTime: returnDateDep,
          PreferredArrivalTime: returnDateDep
        }
      ]);

      
    }
  }, [tabValue, departureDate, returnDateDep, selectedflightClass]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      Segments: segments
    }));
  }, [segments]); // Dependency on segments state


  const validateForm = () => {
    let valid = true;
    const newErrors = { from: '', to: '', departureDate: '' };
    if (!from) {
      newErrors.from = 'Origin is required.';
      valid = false;
    }
    if (!to) {
      newErrors.to = 'Destination is required.';
      valid = false;
    }
    if (from && to && from === to) {
      newErrors.from = 'Origin and destination cannot be the same.';
      newErrors.to = 'Origin and destination cannot be the same.';
      valid = false;
    }
    if (!departureDate) {
      newErrors.departureDate = 'Departure date is required.';
      valid = false;
    }
    setErrors(newErrors);
    return valid;
  };

  const getFlightList = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://sajyatra.sajpe.in/admin/api/flight-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`HTTP error! Status: ${response.status}, Response: ${errorText}`);
        alert(`Failed to fetch flight data: ${errorText}`);
        setLoading(false);
        return;
      }

      const data = await response.json();
      console.log("Flight search API response: ", data);

      if (!data.Results) {
        console.error("No results found in the API response");
        alert("No flights found. Please try again later.");
        setLoading(false);
        return;
      }

      localStorage.setItem('Flight-search', JSON.stringify(data));

      const airlineCodes = data.Results.flatMap(result =>
        result.flatMap(fareData =>
          fareData.FareDataMultiple.flatMap(fare =>
            fare.FareSegments.map(segment => segment.AirlineCode)
          )
        )
      );
      const filteredAirlineCodes = airlineCodes.filter(code => code !== "");

      console.log("Airline Codes: ", filteredAirlineCodes);

      const logos = await fetchAirlineLogos(filteredAirlineCodes);
      console.log("Fetched Airline Logos: ", logos);

      const logoMap = filteredAirlineCodes.reduce((acc, code, index) => {
        acc[code] = logos[index] || '';
        return acc;
      }, {});

      localStorage.setItem('Airline-Logos', JSON.stringify(logoMap));

      const firstResult = data?.Results?.[0]?.[0];
      if (firstResult && firstResult.FareDataMultiple?.[0]) {
        const { SrdvIndex, ResultIndex, IsLCC } = firstResult.FareDataMultiple[0];
        const { TraceId, SrdvType } = data;
        localStorage.setItem("F-SrdvIndex", SrdvIndex);
        localStorage.setItem("F-ResultIndex", ResultIndex);
        localStorage.setItem("F-TraceId", TraceId);
        localStorage.setItem("F-SrdvType", SrdvType);
        localStorage.setItem("F-IsLcc", IsLCC);
      } else {
        console.log("SrdvIndex or FareDataMultiple not found");
      }

      setLoading(false);
      navigate("/flight-list", { state: { data: data, formData: formData } });

    } catch (error) {
      console.error('Error fetching flight data:', error.message);
      alert(`An error occurred: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Fetch airline logos by codes
  const fetchAirlineLogos = async (airlineCodes) => {
    try {
      const response = await fetch('https://sajyatra.sajpe.in/admin/api/airline-logo', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Airline logo API response: ", data);

      const logoMap = data.data.reduce((acc, curr) => {
        acc[curr.airline_code] = curr.airline_log;
        return acc;
      }, {});

      return airlineCodes.map(code => logoMap[code] || null);
    } catch (error) {
      console.error('Error fetching airline logos:', error);
      return airlineCodes.map(() => null);
    }
  };
  // Search flight handler
  const searchFlightHandler = async () => {
    if (!validateForm()) {
      return;
    }

    // Call the function to get flight list if validation passes
    await getFlightList();
  };
  // ------------------------------------------------------------------------------------------------------------


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



  if (loading) {
    return <Loading />;
  }

  return (
    <>

      <CustomNavbar />

      <section className='flightPageBanner'>
        <div className="container-fluid ">
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
                          <div className="col-12 flightformCol">
                            <div className="form-group position-relative flight-input-container">
                              <span className="plane-icon">
                                <BiSolidPlaneTakeOff />
                              </span>
                              <input
                                type="text"
                                className="form-control"
                                id="flightStartingPoint"
                                placeholder="Starting Point"
                                value={from}
                                onChange={handleFromChange}
                                onFocus={handleFromInputFocus}
                                ref={fromInputRef}
                              />
                              {fromSuggestions.length > 0 && (
                                <ul className="suggestions-list flight-suggestions-listFrom" ref={fromSuggestionsRef}>
                                  {fromSuggestions.map((suggestion, index) => (
                                    <li
                                      className="text-red"
                                      key={index}
                                      onClick={() => handleSuggestionClick(suggestion, setFrom, setFromSuggestions, setOriginCode)}
                                    >
                                      {suggestion.airport_city_name}
                                    </li>
                                  ))}
                                </ul>
                              )}
                              <label className="flight-input-labelFrom" htmlFor="flightStartingPoint">
                                Starting Point
                              </label>
                            </div>
                            {errors.from && <p className="error-message">{errors.from}</p>}
                          </div>

                          <div className="col-12 flightformCol">
                            <div className="form-group flight-input-container">
                              <span className="plane-icon">
                                <BiSolidPlaneLand />
                              </span>
                              <input
                                type="text"
                                className="form-control"
                                id="flightDestinationPoint"
                                placeholder="Destination"
                                value={to}
                                onChange={handleToChange}
                                onFocus={handleToInputFocus}
                                ref={toInputRef}
                              />
                              {toSuggestions.length > 0 && (
                                <ul className="suggestions-list flight-suggestions-listTo" ref={toSuggestionsRef}>
                                  {toSuggestions.map((suggestion, index) => (
                                    <li
                                      key={index}
                                      onClick={() => handleSuggestionClick(suggestion, setTo, setToSuggestions, setDesctinationCode)}
                                    >
                                      {suggestion.airport_city_name}
                                    </li>
                                  ))}
                                </ul>
                              )}
                              <label className="flight-input-labelTo" htmlFor="flightDestinationPoint">
                                Destination
                              </label>
                            </div>
                            {errors.to && <p className="error-message">{errors.to}</p>}
                          </div>

                          <div className="col-6 flightformCol">
                            <div className="form-group flight-input-container">
                              <span className="plane-icon">
                                <MdDateRange />
                              </span>
                              <div className="date-picker-wrapper flightDateDiv form-control flightDepDATE">
                                <DatePicker
                                  name="PreferredDepartureTime"
                                  selected={departureDate}
                                  onChange={handleDateChangeDeparture}
                                  className="departureCallender"
                                  id="PreferredDepartureTime"
                                  placeholderText="Select a date"
                                  minDate={new Date()}
                                />
                              </div>
                              <label className="flight-input-labelDepDate" htmlFor="PreferredDepartureTime">Departure</label>
                            </div>
                            {errors.departureDate && <p className="error-message">{errors.departureDate}</p>}
                          </div>

                          <div className="col-6 flight-input-container onewayreturnhidebtn">
                            <span className="plane-icon"></span>
                            <Link onClick={activateTwoWayTab}>Add Return date</Link>
                          </div>

                          <div className="col-sm-8 flightformCol form-group " onClick={handleShow}>
                            <div className="form-control flightTravellerclssFormControl  flight-input-container">
                              <span className="travellerplane-icon">
                                <FaCircleUser />
                              </span>
                              <div className="flightTravellerclss">
                                <p> Traveller - <span>{adultCount + childCount + infantCount}</span> , </p>
                                <p> Class - <span>{selectedflightClass}</span>  </p>
                                <FaAngleDown className="downarrrow" />
                              </div>
                              <label className="flight-input-labelTravel" htmlFor="text">Travellers $ Cabin</label>
                            </div>
                          </div>

                          <div className="col-sm-4 form-group home-flight-search">
                            <button onClick={searchFlightHandler} type="button" className="btn">Search</button>
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
                                        onClick={() => handleCount('decrement', 'AdultCount')}
                                      />
                                      <span>{adultCount}</span>
                                      <FiPlusCircle
                                        className='adultPlusicon'
                                        onClick={() => handleCount('increment', 'AdultCount')}
                                      />
                                    </div>
                                  </div>

                                  <div className='flightpageagebox'>
                                    <h6 style={{ color: '#222' }}>Children</h6>
                                    <div className='childIcons'>
                                      <FiMinusCircle
                                        className='childMinusicon'
                                        onClick={() => handleCount('decrement', 'ChildCount')}
                                      />
                                      <span>{childCount}</span>
                                      <FiPlusCircle
                                        className='childPlusicon'
                                        onClick={() => handleCount('increment', 'ChildCount')}
                                      />
                                    </div>
                                  </div>

                                  <div className='flightpageagebox'>
                                    <h6 style={{ color: '#222' }}>Infants</h6>
                                    <div className='infantIcons'>
                                      <FiMinusCircle
                                        className='infantsMinusicon'
                                        onClick={() => handleCount('decrement', 'InfantCount')}
                                      />
                                      <span>{infantCount}</span>
                                      <FiPlusCircle
                                        className='infantsPlusicon'
                                        onClick={() => handleCount('increment', 'InfantCount')}
                                      />
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
                          <div className="col-12 flightformCol">
                            <div className="form-group position-relative flight-input-container">
                              <span className="plane-icon">
                                <BiSolidPlaneTakeOff />
                              </span>
                              <input
                                type="text"
                                className="form-control"
                                id="flightStartingPoint"
                                placeholder="Starting Point"
                                value={from}
                                onChange={handleFromChange}
                                onFocus={handleFromInputFocus}
                                ref={fromInputRef}
                              />
                              {fromSuggestions.length > 0 && (
                                <ul className="suggestions-list flight-suggestions-listFrom" ref={fromSuggestionsRef}>
                                  {fromSuggestions.map((suggestion, index) => (
                                    <li
                                      className="text-red"
                                      key={index}
                                      onClick={() => handleSuggestionClick(suggestion, setFrom, setFromSuggestions, setOriginCode)}
                                    >
                                      {suggestion.airport_city_name}
                                    </li>
                                  ))}
                                </ul>
                              )}
                              <label className="flight-input-labelFrom" htmlFor="flightStartingPoint">
                                Starting Point
                              </label>
                            </div>
                            {errors.from && <p className="error-message">{errors.from}</p>}
                          </div>

                          <div className="col-12 flightformCol">
                            <div className="form-group flight-input-container">
                              <span className="plane-icon">
                                <BiSolidPlaneLand />
                              </span>
                              <input
                                type="text"
                                className="form-control"
                                id="flightDestinationPoint"
                                placeholder="Destination"
                                value={to}
                                onChange={handleToChange}
                                onFocus={handleToInputFocus}
                                ref={toInputRef}
                              />
                              {toSuggestions.length > 0 && (
                                <ul className="suggestions-list flight-suggestions-listTo" ref={toSuggestionsRef}>
                                  {toSuggestions.map((suggestion, index) => (
                                    <li
                                      key={index}
                                      onClick={() => handleSuggestionClick(suggestion, setTo, setToSuggestions, setDesctinationCode)}
                                    >
                                      {suggestion.airport_city_name}
                                    </li>
                                  ))}
                                </ul>
                              )}
                              <label className="flight-input-labelTo" htmlFor="flightDestinationPoint">
                                Destination
                              </label>
                            </div>
                            {errors.to && <p className="error-message">{errors.to}</p>}
                          </div>



                          <div className="col-6 flightformCol">
                            <div className="form-group flight-input-container">
                              <span className="plane-icon">
                                <MdDateRange />
                              </span>
                              <div className="date-picker-wrapper flightDateDiv form-control flightDepDATE" >
                                <DatePicker
                                  selected={departureDate}
                                  onChange={handleDateChangeDeparture}
                                  className="departureCallender"
                                  placeholderText="Select a departure date"
                                  minDate={new Date()} // Departure date cannot be in the past
                                />

                              </div>
                              <label className="flight-input-labelDepDate" htmlFor="PreferredDepartureTime">Departure</label>
                            </div>
                            {errors.departureDate && <p className="error-message">{errors.departureDate}</p>}

                          </div>

                          <div className="col-6 flightformCol">
                            <div className="form-group flight-input-container">
                              <span className="plane-icon">
                                <MdDateRange />
                              </span>
                              <div className="date-picker-wrapper flightDateDiv form-control flightRetDATE">

                                <DatePicker
                                  selected={returnDateDep}
                                  onChange={handleDateChangeReturn}
                                  className="returnCallender"
                                  placeholderText="Select a return date"
                                  minDate={departureDate} // Return date cannot be before the departure date
                                />
                              </div>
                              <label className="flight-input-labelRetDate" htmlFor="PreferredArrivalTime">Return</label>
                            </div>
                          </div>

                          <div className="col-sm-8 flightformCol form-group " onClick={handleShow}>
                            <div className="form-control flightTravellerclssFormControl  flight-input-container">
                              <span className="travellerplane-icon">
                                <FaCircleUser />
                              </span>
                              <div className="flightTravellerclss">
                                <p> Traveller - <span>{adultCount + childCount + infantCount}</span> , </p>
                                <p> Class - <span>{selectedflightClass}</span>  </p>
                                <FaAngleDown className="downarrrow" />
                              </div>
                              <label className="flight-input-labelTravel" htmlFor="text">Travellers $ Cabin</label>
                            </div>
                          </div>

                          <div className="col-sm-4 form-group home-flight-search">
                            <button onClick={searchFlightHandler} type="button" className="btn">Search</button>
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
                                        onClick={() => handleCount('decrement', 'AdultCount')}
                                      />
                                      <span>{adultCount}</span>
                                      <FiPlusCircle
                                        className='adultPlusicon'
                                        onClick={() => handleCount('increment', 'AdultCount')}
                                      />
                                    </div>
                                  </div>

                                  <div className='flightpageagebox'>
                                    <h6 style={{ color: '#222' }}>Children</h6>
                                    <div className='childIcons'>
                                      <FiMinusCircle
                                        className='childMinusicon'
                                        onClick={() => handleCount('decrement', 'ChildCount')}
                                      />
                                      <span>{childCount}</span>
                                      <FiPlusCircle
                                        className='childPlusicon'
                                        onClick={() => handleCount('increment', 'ChildCount')}
                                      />
                                    </div>
                                  </div>

                                  <div className='flightpageagebox'>
                                    <h6 style={{ color: '#222' }}>Infants</h6>
                                    <div className='infantIcons'>
                                      <FiMinusCircle
                                        className='infantsMinusicon'
                                        onClick={() => handleCount('decrement', 'InfantCount')}
                                      />
                                      <span>{infantCount}</span>
                                      <FiPlusCircle
                                        className='infantsPlusicon'
                                        onClick={() => handleCount('increment', 'InfantCount')}
                                      />
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



      <section className='exictingOffers'>
        <div className="container-fluid">
          <h5 className=''>Exclusive Offers</h5>
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
                    // src='/src/assets/images/home-newsletter.jpg'
                    src={home_newsletter}
                    alt="First slide"
                  />
                </Carousel.Item>
                <Carousel.Item>
                  <img
                    className="d-block w-100 img-fluid"
                    // src='/src/assets/images/home-insta-new.jpg'
                    src={home_insta}
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
      <Footer />
    </>
  )
}


export default Home