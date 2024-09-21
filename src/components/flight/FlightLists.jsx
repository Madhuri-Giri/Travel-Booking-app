/* eslint-disable no-unused-vars */
import "./FlightLists.css"
import { Accordion, Form, ProgressBar } from 'react-bootstrap';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { TiPlane } from "react-icons/ti";
import { FaCalendarAlt, FaUser, FaTimes } from 'react-icons/fa';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaArrowRightLong } from "react-icons/fa6";
import { FaFilter } from "react-icons/fa";
import { MdModeEdit } from "react-icons/md";
// import { RiTimerLine } from "react-icons/ri";
import Loading from '../../pages/loading/Loading'; // Import the Loading component
import Footer from "../../pages/footer/Footer";
import CustomNavbar from "../../pages/navbar/CustomNavbar";
import EnterOtp from '../popUp/EnterOtp';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import { Navigation } from 'swiper/modules'; // Note the updated import path in newer versions
import 'swiper/css';
import 'swiper/css/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
// import TimerFlight from '../timmer/TimerFlight';
import ReactPaginate from 'react-paginate';
import { useDispatch, useSelector } from "react-redux";
import { getFlightList } from "../../API/action";
import { setLoginData, setTransactionDetails } from '../../redux-toolkit/slices/loginSlice';

export default function FlightLists() {
    const location = useLocation();
    const dispatch = useDispatch();

    const [listingData, setListingData] = useState(null);
    const [formDataNew, setFormDataNew] = useState(location?.state?.formData || null);
    const [dataToPass, setDataToPass] = useState(null);

    // get login data from Redux
    const loginData = useSelector((state) => state.login); // Assuming the slice is named 'login'
    console.log('Redux login data:', loginData);

    useEffect(() => {
        if (dataToPass) {
            console.log("SrdvIndex:", dataToPass.SrdvIndex);
            console.log("ResultIndex:", dataToPass.ResultIndex);
            console.log("TraceId:", dataToPass.TraceId);
            console.log("SrdvType:", dataToPass.SrdvType);
            console.log("IsLCC:", dataToPass.IsLCC);
        } else {
            console.log("dataToPass is null or undefined");
        }
    }, [dataToPass]);

    // Flight search API call------
    useEffect(() => {
        if (location?.state?.formData) {
            getFlightList({ setListingData, setDataToPass, setLogos, setLoading, formData: formDataNew, navigate });
        } else {
            navigate("/flight-search")
        }
    }, [location]);

    console.log("listingData", listingData);
    console.log("dataToPass", dataToPass);

    const swiperRef = useRef(null);
    // const { flightSearchData } = flightSearchReducer;
    // const { logoMap } = flightSearchData;

    useEffect(() => {
        if (swiperRef.current) {
            swiperRef.current.swiper.navigation.update();
        }
    }, []);


    const [logos, setLogos] = useState({});

    useEffect(() => {
        setLogos(logos || {});
    }, [logos]);


    const [loading, setLoading] = useState(false); // Add loading state
    const [sortOrder, setSortOrder] = useState(''); // State to manage sorting order
    const [showOtpOverlay, setShowOtpOverlay] = useState(false);

    const navigate = useNavigate();

    const [flightCallenderData, setFlightCallenderData] = useState([]);

    const listData = listingData;
    const formData = formDataNew;
    const PreferredDepartureTime = formData?.Segments[0].PreferredDepartureTime
    const PreferredArrivalTime = formData?.Segments[0].PreferredArrivalTime

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
        // console.log("selected", selected);

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
            return;
        }

        const payload = {
            SrdvIndex: dataToPass.SrdvIndex,
            ResultIndex: dataToPass.ResultIndex,
            TraceId: parseInt(dataToPass.TraceId),
            SrdvType: dataToPass.SrdvType,
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
            console.log('FareQuote API Response:', data);
            console.log('FareQuote API Response:', data);
            console.log('aaaaaaa:', data.Results);


            if (data.Results && formData) {
                setLoading(false);
                setTimeout(() => {
                    navigate('/flight-Farequote', {
                        state: {
                            fareQuoteAPIData: data.Results,
                            formData: formData,
                            flightSelectedDATA: flightSelectedDATA, // Pass selected seat data here
                            dataToPass: dataToPass  // Pass selected seat data here
                        }
                    });
                }, 1000);
            } else {
                setLoading(false);
                if (!data.Results) {
                    alert('Fare quote data not found! Please try again.');
                    console.error('data.Results is undefined');
                }
                if (!formData) {
                    alert('Form data is missing! Please try again.');
                    console.error('formData is undefined');
                }
            }
        } catch (error) {
            console.error('Error calling the farequote API:', error);
            alert('failed to fecth Farequote API -', error);
            setLoading(false);
        }
    };

    // -------------------------------------------------fare-Quote-api----------------------------------------

    // -------------------------------------user detailsss------------------------------------

    const useridHandler = async () => {
        // const loginId = localStorage.getItem('loginId');
        const loginId = loginData.loginId;   // get loginId from Redux (login API data) 
        try {
            const requestBody = {
                user_id: loginId,
            };
            const response = await fetch('https://sajyatra.sajpe.in/admin/api/user-detail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user details');
            }

            const data = await response.json();
            console.log('User details:', data);
            if (data.result && data.transaction) {
                localStorage.setItem('transactionId', data.transaction.id);
                localStorage.setItem('transactionNum', data.transaction.transaction_num);
                //save userdetails API transaction data on the redux
                dispatch(setTransactionDetails(data.transaction));

            }
        } catch (error) {
            console.error('Error fetching user details:', error.message);
        }
    };


    const handleSelectSeat = async (flight, logoUrl) => {
        const flightSelectedDATA = {
            flight: flight,
            logoUrl: logoUrl
        }

        const loginId = localStorage.getItem('loginId');
        console.log('Current loginId:', loginId)
        await useridHandler();
        if (!loginId) {
            console.log('No loginId found, showing OTP overlay');
            setShowOtpOverlay(true);
            return;
        }
        await fareQuoteHandler(flightSelectedDATA);  // Pass flightSelectedDATA
    };



    // -------------------------------------user detailsss------------------------------------

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
    const filteredFlights = selectedAirlines.length > 0
        ? dd.map((flightSegments) =>
            flightSegments.filter((flight) =>
                flight.Segments[0].some((option) =>
                    selectedAirlines.includes(option.Airline.AirlineName)
                )
            )
        ).filter(segment => segment.length > 0) // Filter out empty segments
        : dd;
    // console.log("filteredFlights----", filteredFlights);


    // flight filter logics END------------------------

    // Pagination State
    const [currentPage, setCurrentPage] = useState(0);
    const hotelsPerPage = 9;
    const [pageCount, setPageCount] = useState(0);

    useEffect(() => {
        if (dd) {
            const totalPages = Math.ceil(dd.length / hotelsPerPage);
            // console.log("dd", dd);

            setPageCount(totalPages);
        }
    }, [dd]);

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

    const offset = currentPage * hotelsPerPage;
    const currentHotels = dd?.slice(offset, offset + hotelsPerPage);

    // console.log("currentHotels", currentHotels);
    // console.log("offset", offset);
    // console.log("pageCount", pageCount);

    // flight list pagination logics -------------



    if (loading) {
        return <Loading />;
    }

    return (
        <>

            {
                listingData &&
                <>
                    <CustomNavbar />
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
                                            <Accordion.Item eventKey="1">
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
                                    <Accordion.Item eventKey="1">
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

                                <div className="f-lists">
                                    <div className="flight-content">
                                        {filteredFlights && filteredFlights.length > 0 ? (
                                            currentHotels.map((hotel, indexHotel) => (
                                                filteredFlights.map((flightSegments, index) => {
                                                    // Sort the flight segments based on the selected sort order
                                                    const sortedFlights = sortFlights([...flightSegments]);
                                                    return sortedFlights.map((flight, segmentIndex) => {
                                                        return flight?.Segments?.[0].map((option, optionIndex) => {
                                                            const airlineCode = option.Airline.AirlineCode;
                                                            const logoUrl = logos[airlineCode] || ''; // Get logo URL from local storage
                                                            return (
                                                                <div key={`${index}-${segmentIndex}-${optionIndex}`}>
                                                                    <div className="row">
                                                                        <div className="pricebtnsmobil">
                                                                            <p>₹{flight?.OfferedFare || "Unknown Airline"}</p>
                                                                            <button onClick={() => handleSelectSeat(flight, logoUrl)}>SELECT</button>
                                                                        </div>
                                                                        <p className="regulrdeal"><span>Regular Deal</span></p>
                                                                        <p className="f-listAirlinesNameMOB">{option.Airline.AirlineName}</p><br />

                                                                        <div className="col-2 col-sm-3 f-listCol1">
                                                                            <div className="f-listAirlines">
                                                                                <img src={logoUrl} className="img-fluid" alt={`${option.Airline.AirlineName} Logo`} />
                                                                                <p className="f-listAirlinesNameWEb">{option.Airline.AirlineName}</p><br />
                                                                            </div>
                                                                        </div>

                                                                        <div className="col-sm-6 col-10 f-listCol2">
                                                                            <div className="flistname">
                                                                                <p className="flistnamep1">{option.Origin.CityCode}</p>
                                                                                <div>
                                                                                    <p className="flistnamep2">{convertUTCToIST(option.DepTime)}</p>
                                                                                    <p className="flistnamep4">{option.Origin.CityName}</p>
                                                                                </div>
                                                                                <p className="flistnamep3">{convertMinutesToHoursAndMinutes(option.Duration)}</p>
                                                                                <div>
                                                                                    <p className="flistnamep2">{convertUTCToIST(option.ArrTime)}</p>
                                                                                    <p className="flistnamep4">{option.Destination.CityName}</p>
                                                                                </div>
                                                                                <p className="flistnamep5">{option.Destination.CityCode}</p>
                                                                            </div>
                                                                        </div>

                                                                        <div className="col-md-3 pricebtns f-listCol3">
                                                                            <div><p>₹{flight?.OfferedFare}</p></div>
                                                                            <div>
                                                                                <button onClick={() => handleSelectSeat(flight, logoUrl)}>SELECT</button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        });
                                                    });
                                                })
                                            ))
                                        ) : (
                                            <p>No flights available.</p>
                                        )}

                                    </div>
                                </div>

                                <div className="paginationContainer">
                                    <ReactPaginate
                                        previousLabel={'previous'}
                                        nextLabel={'next'}
                                        breakLabel={'...'}
                                        pageCount={pageCount}
                                        marginPagesDisplayed={2}
                                        pageRangeDisplayed={5}
                                        onPageChange={handlePageClick}
                                        containerClassName={'pagination'}
                                        activeClassName={'active'}
                                        pageClassName={'page-item'}
                                        pageLinkClassName={'page-link'}
                                        previousClassName={'page-item'}
                                        previousLinkClassName={'page-link'}
                                        nextClassName={'page-item'}
                                        nextLinkClassName={'page-link'}
                                        breakClassName={'page-item'}
                                        breakLinkClassName={'page-link'}
                                    />
                                </div>


                            </div>
                        </div>
                        <EnterOtp showModal={showOtpOverlay} onClose={() => setShowOtpOverlay(false)} />

                    </div>
                    <Footer />
                </>

            }
        </>

    )
}
