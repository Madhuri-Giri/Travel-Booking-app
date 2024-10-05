/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable no-unused-vars */
import "./FlightLists.css"
import { Accordion, Form, Modal, ProgressBar } from 'react-bootstrap';
import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { TiPlane } from "react-icons/ti";
import { FaCalendarAlt, FaUser, FaTimes } from 'react-icons/fa';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaArrowRightLong } from "react-icons/fa6";
import { FaFilter } from "react-icons/fa";
import { MdKeyboardArrowDown, MdModeEdit } from "react-icons/md";
// import { RiTimerLine } from "react-icons/ri";
import Loading from '../../pages/loading/Loading'; // Import the Loading component
import Footer from "../../pages/footer/Footer";
import CustomNavbar from "../../pages/navbar/CustomNavbar";
import EnterOtp from '../popUp/EnterOtp';
import 'swiper/css';
import 'swiper/css/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
// import TimerFlight from '../timmer/TimerFlight';
import { useDispatch, useSelector } from "react-redux";
import { getFlightList } from "../../API/action";
import FlightSegments from "./FlightSegments";
import PriceModal from "./PriceModal";
import { calculateDuration, extractTime } from "../../Custom Js function/CustomFunction";
import { LuTimerReset } from "react-icons/lu";
import Swal from "sweetalert2";
import TimerFlight from '../../components/timmer/TimerFlight'

export default function FlightLists() {
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [airlineDetails, setAirlineDetails] = useState([]);
    const [listingData, setListingData] = useState(null);
    const [formDataNew, setFormDataNew] = useState(location?.state?.formData || null);
    const [dataToPass, setDataToPass] = useState(null);
    const [sEGMENTSData, setSEGMENTSData] = useState(null);
    const [isRefundable, setIsRefundable] = useState(null);
    const { isLogin } = useSelector((state) => state.loginReducer);
    const [loading, setLoading] = useState(false); // Add loading state
    const [sortOrder, setSortOrder] = useState(''); // State to manage sorting order
    const [showOtpOverlay, setShowOtpOverlay] = useState(false);
    const [selectedFlightIndex, setselectedFlightIndex] = useState(null);
    const [selectedFlightResultIndex, setselectedFlightResultIndex] = useState(null);
    const [flightCallenderData, setFlightCallenderData] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [showFlightSegments, setShowFlightSegments] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState({});
    const [OfferPriceData, setOfferPriceData] = useState(null);
    const [OfferPriceDataNew, setOfferPriceDataNew] = useState(null);



    const listData = listingData;
    const formData = formDataNew;
    const PreferredDepartureTime = formData?.Segments[0].PreferredDepartureTime
    const PreferredArrivalTime = formData?.Segments[0].PreferredArrivalTime

    // Function to update airline details
    const updateAirlineDetails = (details) => {
        setAirlineDetails(details);
    };

    // // price modal----
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };
    const closeModal = () => {
        setIsModalOpen(false);
    };
    // // price modal----
    // =======stops checkbosxx
    // Function to handle checkbox change
    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };
    // =======stops checkbosxx

    //    ==========radio button data save for price details model=====
    const handleFarePriceSelect = (offerDataNew, Segments, logoUrl) => {
        const offerDataaaModel = {
            fareValue: offerDataNew,
            segments: Segments,
            logoUrl: logoUrl,
        };
        setOfferPriceData(offerDataaaModel)
        openModal();
    }

    // Function to handle "View Details" click
    const handleViewDetails = () => {
        setShowFlightSegments(!showFlightSegments);  // Toggle the visibility
    };

    // Flight search API call------
    useEffect(() => {
        if (location?.state?.formData) {
            getFlightList({ setListingData, setDataToPass, setLogos, setLoading, formData: formDataNew, navigate });
        } else {
            navigate("/flight-search")
        }
    }, [location]);

    const swiperRef = useRef(null);
    useEffect(() => {
        if (swiperRef.current) {
            swiperRef.current.swiper.navigation.update();
        }
    }, []);


    const [logos, setLogos] = useState({});
    useEffect(() => {
        setLogos(logos || {});
    }, [logos]);


    // function for date convert into day month date--------------------------------------
    const formatDate = (dateString) => {
        if (dateString) {
            const date = new Date(dateString);
            return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', weekday: 'short' }).format(date);
        }
    };

    const departDatee = formData?.Segments[0].PreferredDepartureTime;
    const formattedDate = formatDate(departDatee);
    // function for date convert into day month date--------------------------------------

    // func for duration convert hpur minute---------------------
    const convertMinutesToHoursAndMinutes = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return `${hours}h ${remainingMinutes}m`;
    };
    // func for duration convert hpur minute---------------------

    // Function to extract all AirlineName values
    // -------------------------------------------------------------airline filters logic----------------
    const dd = listData?.Results
    let originalAirlineList = [];

    const getAllAirlineNames = (data) => {
        if (data) {
            const airlineNames = [];
            data.forEach(result => {
                result.forEach(segmentArray => {
                    segmentArray.Segments.forEach(segment => {
                        segment.forEach(detail => {
                            airlineNames.push(detail.Airline.AirlineName);
                        });
                    });
                });
            });

            return airlineNames;
        }
    };
    const airlineNames = getAllAirlineNames(dd);
    const uniqueAirlineNames = [...new Set(airlineNames)];
    const createSubjectCheckboxes = () => {
        const airlinesContainers = document.querySelectorAll('.airlineFilters');
        airlinesContainers.forEach(airlinesContainer => {
            airlinesContainer.innerHTML = '';
            uniqueAirlineNames.forEach(airlineName => {
                const div = document.createElement('div');
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.classList.add('airlineFilter', 'largeCheckbox');
                checkbox.value = airlineName;
                checkbox.id = `airlineName${airlineName}`;
                checkbox.addEventListener('change', applyFilters);
                const label = document.createElement('label');
                label.setAttribute('for', `airlineName${airlineName}`);
                label.textContent = airlineName;
                label.classList.add('largeLabel');
                div.appendChild(label);
                div.appendChild(checkbox);
                airlinesContainer.appendChild(div);
                airlinesContainer.appendChild(document.createElement('br'));
            });
        });
    };
    const [selected, setSelected] = useState([]);
    const applyFilters = () => {
        const airlineFilters = document.querySelectorAll('.airlineFilter:checked');
        const selectedAirlines = Array.from(airlineFilters).map(filter => filter.value);
        setSelected(selectedAirlines);
        const originalAirlineList = listData?.Results || [];
    };
    useEffect(() => {
        createSubjectCheckboxes();
    }, []);

    // -------------------------------------------------------------airline filters logic----------------

    // for callender slider-----------------------------------------------------------------------
    const [isDataLoaded, setIsDataLoaded] = useState(false);

    useEffect(() => {
        const getCallenderData = async () => {
            try {
                const response = await fetch('https://sajyatra.sajpe.in/admin/api/get-calender', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        "EndUserIp": "1.1.1.1",
                        "ClientId": "180112",
                        "UserName": "Maneesh3",
                        "Password": "Maneesh@36",
                        "AdultCount": 1,
                        "ChildCount": 0,
                        "InfantCount": 0,
                        "JourneyType": "1",
                        "Segments": [
                            {
                                "Origin": "LKO",
                                "Destination": "KWI",
                                "FlightCabinClass": 1,
                                "PreferredDepartureTime": PreferredDepartureTime,
                                "PreferredArrivalTime": PreferredArrivalTime,
                            }
                        ]
                    })
                });
                const data = await response.json();
                if (data.Results) {
                    setFlightCallenderData(data.Results);
                    setIsDataLoaded(true); // Indicate data is loaded
                }
            } catch (error) {
                console.error('Error fetching calendar data:', error);
            }
        };
        if (PreferredArrivalTime && PreferredDepartureTime) {
            getCallenderData();
        }
    }, [PreferredArrivalTime, PreferredDepartureTime]);

    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 6,
        slidesToScroll: 1,
        nextArrow: <div className="slick-next">Next</div>,
        prevArrow: <div className="slick-prev">Prev</div>,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 5,
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 4,
                },
            },
        ],
    };

    // for callender slider-----------------------------------------------------------------------



    const convertUTCToIST = (utcTimeString) => {
        const utcDate = new Date(utcTimeString);
        const istTime = new Intl.DateTimeFormat('en-IN', {
            timeZone: 'Asia/Kolkata',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
        }).format(utcDate);
        return istTime;
    };



    // ------------------------------------------------fare-Quote-api-----------------------------------------
    const fareQuoteHandler = async (flightSelectedDATA) => {
        setLoading(true);
        if (!dataToPass.TraceId || !dataToPass.ResultIndex || !dataToPass.SrdvType || !dataToPass.SrdvIndex) {
            console.error('TraceId, ResultIndex, SrdvType, not found');
            setLoading(false);

            // Use SweetAlert2 for missing data notification
            Swal.fire({
                icon: 'error',
                title: 'Missing Data',
                text: 'TraceId, ResultIndex, or SrdvType not found!',
            });
            return;
        }

        const payload = {
            SrdvIndex: OfferPriceData?.fareValue.SrdvIndex,
            ResultIndex: OfferPriceData?.fareValue.ResultIndex,
            TraceId: parseInt(dataToPass?.TraceId),
            SrdvType: dataToPass?.SrdvType,
        };

        try {
            const response = await fetch('https://sajyatra.sajpe.in/admin/api/farequote', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const data = await response.json();

            if (data.Results && formData) {
                setLoading(false);
                navigate('/flight-Farequote', {
                    state: {
                        fareQuoteAPIData: data.Results,
                        formData: formData,
                        flightSelectedDATA: flightSelectedDATA,
                        dataToPass: dataToPass
                    }
                });
            } else {
                setLoading(false);

                if (!data.Results) {
                    // Use SweetAlert2 for error notification
                    Swal.fire({
                        icon: 'error',
                        title: 'No Fare Quote Data',
                        text: 'Fare quote data not found! Please try again.',
                    });
                    console.error('data.Results is undefined');
                }

                if (!formData) {
                    // Use SweetAlert2 for missing form data notification
                    Swal.fire({
                        icon: 'error',
                        title: 'Missing Form Data',
                        text: 'Form data is missing! Please try again.',
                    });
                    console.error('formData is undefined');
                }
            }
        } catch (error) {
            console.error('Error calling the farequote API:', error);

            // Use SweetAlert2 for error notification
            Swal.fire({
                icon: 'error',
                title: 'API Error',
                text: `Failed to fetch Farequote API: ${error.message}`,
            });

            setLoading(false);
        }
    };


    const handleSelectSeat = async (flight, logoUrl) => {
        const flightSelectedDATA = {
            flight: flight,
            logoUrl: logoUrl
        }
        if (!isLogin) {
            setShowOtpOverlay(true);
            return;
        }
        await fareQuoteHandler(flightSelectedDATA);  // Pass flightSelectedDATA
    };

    // -------------------------------------------------fare-Quote-api----------------------------------------



    // -----------------mobile view filter side bar------------------------ 
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };
    // -----------------mobile view filter side bar------------------------ 

    const navigateSearch = () => {
        navigate('/flight-search');
    };

    // flight filter logics START--------------------


    const [selectedAirlines, setSelectedAirlines] = useState([]);
    const [availableAirlines, setAvailableAirlines] = useState([]);
    useEffect(() => {
        // Extract all unique airline names from the flights data
        const airlines = new Set();
        dd?.forEach((flightSegments) => {
            flightSegments.forEach((flight) => {
                flight.Segments[0].forEach((option) => {
                    airlines.add(option.Airline.AirlineName);
                });
            });
        });
        setAvailableAirlines(Array.from(airlines));
    }, [dd]);
    // Handle airline filter selection
    const handleAirlineSelect = (airlineName) => {
        setSelectedAirlines((prevSelected) =>
            prevSelected.includes(airlineName)
                ? prevSelected.filter((name) => name !== airlineName)
                : [...prevSelected, airlineName]
        );
    };

    // Filter flights based on selected airlines

    // filter for flight price
    const sortFlights = (flights) => {
        if (sortOrder === 'lowToHigh') {
            return flights.sort((a, b) => a.OfferedFare - b.OfferedFare);
        } else if (sortOrder === 'highToLow') {
            return flights.sort((a, b) => b.OfferedFare - a.OfferedFare);
        }
        return flights;
    };

    const handleCheckboxChange = (order) => {
        setSortOrder(prevOrder => (prevOrder === order ? '' : order));
    };

    const [filteredFlights, setfilteredFlights] = useState(null)

    useEffect(() => {
        if (!dd || !Array.isArray(dd)) {
            // If dd is undefined or not an array, set filteredFlights to an empty array
            setfilteredFlights([]);
            return; // Exit early to avoid further processing
        }

        // Step 1: Filter flights based on selected airlines
        let filteredFlightsNew = selectedAirlines.length > 0
            ? dd.map((flightSegments) =>
                flightSegments.filter((flight) =>
                    flight.Segments[0].some((option) =>
                        selectedAirlines.includes(option.Airline.AirlineName)
                    )
                )
            ).filter(segment => segment.length > 0) // Filter out empty segments
            : dd;

        // Step 2: Apply the stop/non-stop filter logic
        if (selectedOption == 'stop') {
            // Filter for flights with stops (length of Segments > 1)
            filteredFlightsNew = filteredFlightsNew.map(segments =>
                segments.filter(flight => flight.Segments[0].length > 1)
            ).filter(segment => segment.length > 0); // Filter out empty segments after filtering for stops
        } else if (selectedOption == 'non-stop') {
            // Filter for non-stop flights (length of Segments === 1)
            filteredFlightsNew = filteredFlightsNew.map(segments =>
                segments.filter(flight => flight.Segments[0].length == 1)
            ).filter(segment => segment.length > 0); // Filter out empty segments after filtering for non-stop
        }

        // Step 3: Sort the filtered flights based on sortOrder
        const sortedFlights = filteredFlightsNew.map(segments => {
            return segments.sort((a, b) => {
                if (sortOrder === 'lowToHigh') {
                    return a.OfferedFare - b.OfferedFare;
                } else if (sortOrder === 'highToLow') {
                    return b.OfferedFare - a.OfferedFare;
                }
                return 0; // Default case (no sorting)
            });
        }).filter(segment => segment.length > 0); // Filter out empty segments after sorting

        // Step 4: Set the sorted flights to state
        setfilteredFlights(sortedFlights);
    }, [dd, selectedAirlines, sortOrder, selectedOption]); // Include selectedOption in dependencies

    // flight filter logics END------------------------

    if (loading) {
        return <Loading />;
    }

    return (<>{
        listingData && <>
            <CustomNavbar />
            < TimerFlight />
            {/* <TimerFlight/> */}
            {/* timerrr-------------------  */}
            {/* <div className="timer-FlightLists">
                <div> <p><RiTimerLine /> Redirecting in {formatTimers(timer)}...</p> </div>
            </div> */}
            {/* timerrr-------------------  */}

            <section className='flightlistsec1'>
                <div className="container-fluid">
                    <div className="row flightlistsec1Row">
                        <div className="col-10 flightlistsec1MainCol">
                            <div className="d-flex flightlistsec1col">
                                <TiPlane className="mt-1" />
                                <p> {formData.Segments[0].Origin} </p>
                                <p>-</p>
                                <p>{formData.Segments[0].Destination} </p>
                            </div>
                            <div className="d-flex flightlistsec1col">
                                <FaCalendarAlt className="mt-1" />
                                <p><span>Departure on</span> {formattedDate}</p>
                            </div>
                            <div className="d-flex flightlistsec1col">
                                <FaUser className="mt-1" />
                                <p><span>Traveller {formData.AdultCount + formData.ChildCount + formData.InfantCount} , </span> <span>Economy</span></p>
                            </div>
                        </div>
                        <div className="col-2 search-functinality">
                            <button onClick={navigateSearch}><i className="ri-pencil-fill"></i>Modify</button>
                        </div>
                    </div>
                </div>
            </section>

            <section className='flightlistsec1Mobile'>
                <div className="container">
                    <div className="row">
                        <div className="col-2 d-flex flightlistsec1colMobile">
                            <div className="filterIcondiv" onClick={toggleSidebar}>
                                <FaFilter className="mt-1" />
                            </div>
                        </div>
                        <div className="col-8 flightlistsec1colMobile">
                            <div className="flightlistsec1colMobileOriDes">
                                <p>{formData.Segments[0].Origin}</p>
                                <FaArrowRightLong />
                                <p>{formData.Segments[0].Destination}</p>
                            </div>
                            <div className="d-flex flightlistsec1colMobileTravlr">
                                <p><span></span> {formattedDate}</p>
                                <p><span>Traveller {formData.AdultCount + formData.ChildCount + formData.InfantCount}, </span> <span>Economy</span></p>
                            </div>
                        </div>
                        <div className="col-2 d-flex flightlistsec1colMobile">
                            <div className="editIconDiv">
                                <MdModeEdit className="mt-1" onClick={navigateSearch} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Sidebar */}
            {isSidebarOpen && (
                <div className="filter-sidebar">
                    <div className="filter-content">
                        <div className="filterHeder">
                            <button className="close-btn" onClick={toggleSidebar}>
                                <FaTimes />
                            </button>
                            <h4>Filter</h4>
                        </div>
                        <div className="filterSidebarMain row">
                            <div className="col-12 flightlistsec2col1 flightlistsec2col1MobileView">
                                <Accordion defaultActiveKey={['0', '1', '2', '3']} alwaysOpen>

                                    <Accordion.Item eventKey="0">
                                        <Accordion.Header className="flightlistaccordian-header">
                                            <span className="header-title">Stops</span>
                                        </Accordion.Header>
                                        <Accordion.Body>
                                            <div className="checkbox-container row border-box">
                                                <div className="col-6">
                                                    <div className="flightStopsDIV">
                                                        <label className="square-checkbox">
                                                            <input
                                                                type="checkbox"
                                                                value="stop"
                                                                checked={selectedOption === 'stop'}
                                                                onChange={handleOptionChange}
                                                                onClick={() => setSelectedOption('stop')}
                                                            />
                                                            <br></br>
                                                            <span className="checkmark"></span>
                                                            Stop
                                                        </label>
                                                    </div>
                                                </div>
                                                <div className="col-6">
                                                    <div className="flightStopsDIV">
                                                        <label className="square-checkbox">
                                                            <input
                                                                type="checkbox"
                                                                value="non-stop"
                                                                checked={selectedOption === 'non-stop'}
                                                                onChange={handleOptionChange}
                                                                onClick={() => setSelectedOption('non-stop')}
                                                            />
                                                            <br></br>
                                                            <span className="checkmark"></span>
                                                            Non-Stop
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </Accordion.Body>

                                    </Accordion.Item>


                                    <Accordion.Item eventKey="1">
                                        <Accordion.Header className="flightlistaccordian-header">
                                            <span className="header-title">Price</span>
                                        </Accordion.Header>
                                        <Accordion.Body className="flightpriceaccordian">
                                            <div className="row">
                                                <div className="col-12 flightstopaccordian">
                                                    <div>
                                                        <h6>
                                                            <FontAwesomeIcon icon={faArrowDown} className="me-2" /> {/* Icon for Low to High */}
                                                            Low to High
                                                        </h6>
                                                        <span className="custom-checkbox">
                                                            <input
                                                                type="checkbox"
                                                                id="checkbox1"
                                                                checked={sortOrder === 'lowToHigh'}
                                                                onChange={() => handleCheckboxChange('lowToHigh')}
                                                            />
                                                            <label htmlFor="checkbox1"></label>
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="col-12 flightstopaccordian">
                                                    <div>
                                                        <h6>
                                                            <FontAwesomeIcon icon={faArrowUp} className="me-2" /> {/* Icon for High to Low */}
                                                            High to Low
                                                        </h6>
                                                        <span className="custom-checkbox">
                                                            <input
                                                                type="checkbox"
                                                                id="checkbox2"
                                                                checked={sortOrder === 'highToLow'}
                                                                onChange={() => handleCheckboxChange('highToLow')}
                                                            />
                                                            <label htmlFor="checkbox2"></label>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                    <Accordion.Item eventKey="2">
                                        <Accordion.Header className="flightlistaccordian-header">
                                            <span className="header-title">Airlines</span>
                                        </Accordion.Header>
                                        <Accordion.Body>
                                            <div className=" mobileAirlines">
                                                <ul style={{ listStyleType: 'none', padding: 0 }}>
                                                    {availableAirlines.map((airline) => (
                                                        <li key={airline} style={{ marginBottom: '10px' }}>
                                                            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                                                                {airline}
                                                                <input
                                                                    type="checkbox"
                                                                    checked={selectedAirlines.includes(airline)}
                                                                    onChange={() => handleAirlineSelect(airline)}
                                                                    style={{ marginLeft: '10px', transform: 'scale(1.3)', cursor: 'pointer' }} // Scaling the checkbox
                                                                />
                                                            </label>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                </Accordion>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="container-fluid flightlistsec2">
                <div className="row">
                    <div className="col-lg-3 flightlistsec2col1 flightlistsec2col1DeskView">
                        <Accordion defaultActiveKey={['0', '1', '2', '3']} alwaysOpen>
                            <Accordion.Item eventKey="0">
                                <Accordion.Header className="flightlistaccordian-header">
                                    <span className="header-title">Stops</span>
                                </Accordion.Header>
                                <Accordion.Body>
                                    <div className="checkbox-container row border-box">
                                        <div className="col-6">
                                            <div className="flightStopsDIV">
                                                <label className="square-checkbox">
                                                    <input
                                                        type="checkbox"
                                                        value="stop"
                                                        checked={selectedOption === 'stop'}
                                                        onChange={handleOptionChange}
                                                        onClick={() => setSelectedOption('stop')}
                                                    />
                                                    <br></br>
                                                    <span className="checkmark"></span>
                                                    Stop
                                                </label>
                                            </div>
                                        </div>
                                        <div className="col-6">
                                            <div className="flightStopsDIV">
                                                <label className="square-checkbox">
                                                    <input
                                                        type="checkbox"
                                                        value="non-stop"
                                                        checked={selectedOption === 'non-stop'}
                                                        onChange={handleOptionChange}
                                                        onClick={() => setSelectedOption('non-stop')}
                                                    />
                                                    <br></br>
                                                    <span className="checkmark"></span>
                                                    Non-Stop
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </Accordion.Body>

                            </Accordion.Item>


                            <Accordion.Item eventKey="1">
                                <Accordion.Header className="flightlistaccordian-header">
                                    <span className="header-title">Price</span>
                                    {/* <FontAwesomeIcon icon={faChevronDown} className="header-icon" /> */}
                                </Accordion.Header>
                                <Accordion.Body className="flightpriceaccordian">
                                    <div className="row">
                                        <div className="col-12 flightstopaccordian">
                                            <div>
                                                <h6>
                                                    <FontAwesomeIcon icon={faArrowDown} className="me-2" /> {/* Icon for Low to High */}
                                                    Low to High
                                                </h6>
                                                <span className="custom-checkbox">
                                                    <input
                                                        type="checkbox"
                                                        id="checkbox1"
                                                        checked={sortOrder === 'lowToHigh'}
                                                        onChange={() => handleCheckboxChange('lowToHigh')}
                                                    />
                                                    <label htmlFor="checkbox1"></label>
                                                </span>
                                            </div>
                                        </div>
                                        <div className="col-12 flightstopaccordian">
                                            <div>
                                                <h6>
                                                    <FontAwesomeIcon icon={faArrowUp} className="me-2" /> {/* Icon for High to Low */}
                                                    High to Low
                                                </h6>
                                                <span className="custom-checkbox">
                                                    <input
                                                        type="checkbox"
                                                        id="checkbox2"
                                                        checked={sortOrder === 'highToLow'}
                                                        onChange={() => handleCheckboxChange('highToLow')}
                                                    />
                                                    <label htmlFor="checkbox2"></label>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="2">
                                <Accordion.Header className="flightlistaccordian-header">
                                    <span className="header-title">Airlines</span>
                                    {/* <FontAwesomeIcon icon={faChevronDown} className="header-icon" /> */}
                                </Accordion.Header>
                                <Accordion.Body>
                                    <div className="desktopAirlines">
                                        <ul style={{ listStyleType: 'none', padding: 0 }}>
                                            {availableAirlines.map((airline) => (
                                                <li key={airline} style={{ marginBottom: '10px' }}>
                                                    <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                                                        {airline}
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedAirlines.includes(airline)}
                                                            onChange={() => handleAirlineSelect(airline)}
                                                            style={{ marginLeft: '10px', transform: 'scale(1.3)', cursor: 'pointer' }} // Scaling the checkbox
                                                        />
                                                    </label>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                    </div>
                    <div className="col-lg-8">
                        <div className="slider-container">
                            {isDataLoaded ? (
                                <Slider {...settings}>
                                    {flightCallenderData.map((flight, index) => (
                                        <div key={flight.FlightId || index} className="flight-slide">
                                            <h6>
                                                {new Date(flight.DepartureDate).toLocaleDateString('en-US', {
                                                    weekday: 'short',
                                                    month: 'short',
                                                    day: 'numeric',
                                                })}
                                            </h6>
                                            <p>₹{flight.BaseFare}</p>
                                        </div>
                                    ))}
                                </Slider>
                            ) : (
                                <p>Loading data...</p> // Display loading state or placeholder
                            )}
                        </div>

                        <div className="f-lists"> {
                            filteredFlights?.[0].map((value, index) => {
                                const airlineCode = value.Segments[0][0].Airline.AirlineCode
                                const logoUrl = logos[airlineCode] || '';

                                let offerData = null;

                                offerData = value?.FareDataMultiple.reduce((result, next) => {
                                    return next.OfferedFare < result.OfferedFare ? next : result;
                                }, { OfferedFare: Infinity });

                                return (<><div className="flight-content">
                                    <div>
                                        <div className="row flight-contentRow">
                                            <div className="pricebtnsmobil">
                                                <p className="regulrdeal"><span>Regular Deal</span></p>
                                                <div>
                                                    <button onClick={() => handleSelectSeat(value, logoUrl)}>SELECT</button>
                                                </div>
                                            </div>

                                            <div className="listDataMain row">
                                                <div className="flightsLIstdata col-md-8">
                                                    <div className="flightsLIstdataDIV">
                                                        <div className="flightLOGO">
                                                            <img src={logoUrl} className="img-fluid" alt="" />
                                                        </div>
                                                        <div className="arlineanmescode">
                                                            <div>
                                                                <p>{value.Segments[0][0].Airline.AirlineName}</p>
                                                                <span>{value.Segments[0][0].Airline.AirlineCode} - </span>{
                                                                    value.Segments[0].map((valueSeg, index) => {
                                                                        return (
                                                                            <span key={index}>
                                                                                {valueSeg.Airline.FlightNumber}
                                                                                {index < value.Segments[0].length - 1 && ' ,'}
                                                                            </span>
                                                                        );
                                                                    })
                                                                }

                                                            </div>
                                                        </div>

                                                    </div>
                                                    <div className="flightOrigindiv">
                                                        <div>
                                                            <p className="me-1">{listingData?.Origin}</p>
                                                            <strong><p>{extractTime(value.Segments[0][0].DepTime)}</p></strong>

                                                        </div>
                                                    </div>
                                                    <div className="fligtDurationdiv">
                                                        <div>
                                                            <p>
                                                                <span className=""><LuTimerReset /></span>
                                                                {calculateDuration(value.Segments[0][0].DepTime, value.Segments[0][value.Segments[0].length - 1].ArrTime)}
                                                            </p>
                                                            <div className="line-container">
                                                                <hr className="line-with-dot" />
                                                                <div className="dot"></div>
                                                            </div>
                                                            {
                                                                value.Segments[0].length > 1 &&
                                                                <p>{value.Segments[0].length - 1} stop</p>
                                                            }
                                                        </div>
                                                    </div>

                                                    <div className="flightfDestinationDiv">
                                                        <div>
                                                            <p className="me-1">{listingData?.Destination}</p>
                                                            <strong>                                                       <p>
                                                                {extractTime(value.Segments[0][value.Segments[0].length - 1].ArrTime)}
                                                            </p>
                                                            </strong>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="priceradiotbtnn col-md-4">
                                                    <div className="priceradiotbtnnDiv">
                                                        <Form>{
                                                            value?.FareDataMultiple.map((fareValue, fareIndex) => {
                                                                const currentRadioChecked = selectedProduct.index == index ? selectedProduct.fareValue : offerData;

                                                                const fareValueData = {
                                                                    fareValue,
                                                                    segments: value.Segments,
                                                                    logoUrl,
                                                                }
                                                                const isRefundable = fareValue?.IsRefundable;
                                                                const getSourceBgColor = (source) => {
                                                                    switch (source) {
                                                                        case 'Publish':
                                                                            return 'blue';
                                                                        case 'SME':
                                                                            return '#2cc72c';
                                                                        case 'Flexi':
                                                                            return 'darkgreen';
                                                                        case 'Tactical':
                                                                            return 'lightcoral';
                                                                        case 'Corporate':
                                                                            return 'cadetblue';
                                                                        case 'Other':
                                                                            return 'gray';
                                                                        default:
                                                                            return 'cornflowerblue';
                                                                    }
                                                                };
                                                                return (<>
                                                                    <div className="publiceprices" key={fareIndex}>
                                                                        <label>
                                                                            <div>
                                                                                <span style={{ backgroundColor: getSourceBgColor(fareValue.Source) }}>
                                                                                    {fareValue.Source}
                                                                                </span>
                                                                            </div>
                                                                            <div>
                                                                                <input
                                                                                    type="radio"
                                                                                    name="flightOption"
                                                                                    value={`option${fareIndex + 1}`}
                                                                                    onChange={() => {
                                                                                        setSelectedProduct({ index, fareValue }); // Update selectedProduct state
                                                                                        setOfferPriceDataNew('someValue'); // Update anotherState (you can set it to anything you want)
                                                                                    }}

                                                                                    // onChange={() => setSelectedProduct({ index, fareValue })}
                                                                                    defaultChecked={fareValue.OfferedFare == offerData.OfferedFare}
                                                                                />
                                                                                <strong> ₹ {fareValue.OfferedFare}</strong>
                                                                            </div>
                                                                            {/* <p className="isRefundalbe">{isRefundable ? 'Refundable': 'Non-Refundable' }</p> */}
                                                                        </label>
                                                                    </div>

                                                                </>
                                                                );
                                                            })}
                                                        </Form>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="Flightbtnsss">
                                                <span>{showFlightSegments == index ?
                                                    < button className="flightListDetailsBUtton" onClick={() => setShowFlightSegments(null)}> Hide Details
                                                        <MdKeyboardArrowDown />
                                                    </button>
                                                    :
                                                    <button className="flightListDetailsBUtton" onClick={() => setShowFlightSegments(index)}>  Flight Details
                                                        <MdKeyboardArrowDown />
                                                    </button>
                                                }
                                                </span>
                                                {/* The button to view price details */}
                                                <div className="pricefarebtn">
                                                    <button onClick={() => {
                                                        // Use selected product if available, otherwise use the minimum priced product
                                                        const productToView = selectedProduct.index == index ? selectedProduct.fareValue : offerData;
                                                        handleFarePriceSelect(productToView, value.Segments,
                                                            logoUrl);
                                                    }}
                                                    > View Prices Fare <MdKeyboardArrowDown />
                                                    </button>
                                                </div>

                                            </div>
                                            {/* Conditionally render FlightSegments */}
                                            {showFlightSegments == index && (
                                                <div className="flight-segment-section">
                                                    <FlightSegments
                                                        logoUrl={logoUrl}
                                                        flightSegments={value.Segments}
                                                        updateAirlineDetails={updateAirlineDetails} />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                </div >
                                </>
                                )
                            })
                        }

                        </div>
                    </div>
                </div>
                <EnterOtp showModal={showOtpOverlay} onClose={() => setShowOtpOverlay(false)} />
            </div>
            <Footer />
            {isModalOpen &&
                <PriceModal
                    closeModal={closeModal}
                    isModalOpen={isModalOpen}
                    OfferPriceData={OfferPriceData}
                    listingData={listingData}
                />
            }
        </>

    }
    </>

    )
}






