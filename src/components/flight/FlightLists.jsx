import "./FlightLists.css"
import { Accordion, Form, ProgressBar } from 'react-bootstrap';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TiPlane } from "react-icons/ti";
import { FaCalendarAlt, FaUser, FaTimes } from 'react-icons/fa';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaArrowRightLong } from "react-icons/fa6";
import { FaFilter } from "react-icons/fa";
import { MdModeEdit } from "react-icons/md";
import { RiTimerLine } from "react-icons/ri";
import Loading from '../../pages/loading/Loading'; // Import the Loading component
import Footer from "../../pages/footer/Footer";
import CustomNavbar from "../../pages/navbar/CustomNavbar";
import EnterOtp from '../popUp/EnterOtp';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import { Navigation } from 'swiper/modules'; // Note the updated import path in newer versions
import 'swiper/css';
import 'swiper/css/navigation';

export default function FlightLists() {
    const swiperRef = useRef(null);

    useEffect(() => {
        if (swiperRef.current) {
            swiperRef.current.swiper.navigation.update();
        }
    }, []);


    const [loading, setLoading] = useState(false); // Add loading state
    const [sortOrder, setSortOrder] = useState(''); // State to manage sorting order

    const [showOtpOverlay, setShowOtpOverlay] = useState(false);

    const navigate = useNavigate();

    // for timerss----------------------------------
    const [timer, setTimer] = useState(600000);

    useEffect(() => {
        const countdown = setInterval(() => {
            setTimer((prev) => prev - 50);
        }, 50);

        if (timer <= 0) {
            clearInterval(countdown);
            alert("Your Session is Expired")
            navigate('/flight-search');
        }

        return () => clearInterval(countdown);
    }, [timer, navigate]);

    const formatTimers = (milliseconds) => {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes} min ${seconds} sec left`;
    };
    // for timerss----------------------------------

    const [callenderListdata, setcallenderListdata] = useState(null);

    const [accordiandepartime, setaccordiandepartime] = useState("02:15 AM");
    const maxaccordiandepartime = "23:15 PM";

    const handledeparttimeSliderChange = (event) => {
        setaccordiandepartime(event.target.value);
    };

    const [accordianArrivedtime, setaccordianArrivedtime] = useState("00:05 AM");
    const maxaccordianArrivedtime = "23:50 PM";

    const handleArrivedtimeSliderChange = (event) => {
        setaccordianArrivedtime(event.target.value);
    };

    const [price, setPrice] = useState(6000);
    const maxPrice = 10000;

    const handleSliderChange = (event) => {
        setPrice(event.target.value);
    };

    const location = useLocation();
    const [flightListData, setFlightListData] = useState('');

    const [flightData, setFlightData] = useState([]);

    // const sliderRef = useRef(null);
    const [sliderRef, setSliderRef] = useState(null);

    useEffect(() => {
        if (location.state) {
            setFlightListData(location.state);
        }
    }, [location.state])

    const listData = location.state.data
    const formData = location.state.formData
    const PreferredDepartureTime = formData.Segments[0].PreferredDepartureTime
    const PreferredArrivalTime = formData.Segments[0].PreferredArrivalTime

    localStorage.setItem("FlightSrdvType", listData.SrdvType)
    localStorage.setItem("FlightTraceId", listData.TraceId)

    // function for date convert into day month date--------------------------------------
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', weekday: 'short' }).format(date);
    };
    const departDatee = formData.Segments[0].PreferredDepartureTime;
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
                localStorage.setItem('callenderData', JSON.stringify(data));
                if (data.Results) {
                    setFlightData(data.Results);
                }
            } catch (error) {
                console.error('Error fetching calendar data:', error);
            }
        };

        getCallenderData();
    }, []);

    useEffect(() => {
        const storedData = localStorage.getItem('callenderData');
        if (storedData) {
            const parsedData = JSON.parse(storedData);
            if (parsedData.Results) {
                setFlightData(parsedData.Results);
            }
        }
    }, []);
    const sliderSettings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 6,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 5,
                    slidesToScroll: 1,
                    infinite: true,
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 1,
                    initialSlide: 1
                }
            }
        ]
    };
    const settings = {
        dots: true,
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
    const fareQuoteHandler = async () => {
        setLoading(true);
    
        const FtraceId = localStorage.getItem('F-TraceId');
        const FresultIndex = localStorage.getItem('F-ResultIndex');
        const FsrdvType = localStorage.getItem('F-SrdvType');
        const FsrdvIndex = localStorage.getItem('F-SrdvIndex');
    
        if (!FtraceId || !FresultIndex || !FsrdvType || !FsrdvIndex) {
            console.error('TraceId, ResultIndex, SrdvType, or SrdvIndex not found in local storage');
            setLoading(false);
            return;
        }
    
        const payload = {
            SrdvIndex: FsrdvIndex,
            ResultIndex: FresultIndex,
            TraceId: parseInt(FtraceId),
            SrdvType: FsrdvType,
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
    
            const fare = data.Results?.Fare || {};
    
            // Save all fare details in local storage
            localStorage.setItem('BaseFare', fare.BaseFare);
            localStorage.setItem('YQTax', fare.YQTax);
            localStorage.setItem('Tax', fare.Tax);
            localStorage.setItem('AdditionalTxnFeeOfrd', fare.AdditionalTxnFeeOfrd);
            localStorage.setItem('AdditionalTxnFeePub', fare.AdditionalTxnFeePub);
            localStorage.setItem('AirTransFee', fare.AirTransFee);
            localStorage.setItem('OtherCharges', fare.OtherCharges);
            localStorage.setItem('TransactionFee', fare.TransactionFee);
            localStorage.setItem('Currency', fare.Currency);

            
    
            if (data.Results && formData) {
                setLoading(false);
                setTimeout(() => {
                    navigate('/flight-Farequote', { state: { fareData: data.Results, formData: formData } });
                }, 1000);
            } else {
                console.error('data.Results or formData is undefined');
                setLoading(false);
            }
        } catch (error) {
            console.error('Error calling the farequote API:', error);
            setLoading(false);
        }
    };
    
    // -------------------------------------------------fare-Quote-api----------------------------------------

    // -------------------------------------user detailsss------------------------------------

    const useridHandler = async () => {
        const loginId = localStorage.getItem('loginId');
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
            // console.log('flight transcNo', data.transaction.transaction_num)
            if (data.result && data.transaction) {
                localStorage.setItem('transactionId', data.transaction.id);
                localStorage.setItem('transactionNum-Flight', data.transaction.transaction_num);
            }
        } catch (error) {
            console.error('Error fetching user details:', error.message);
        }
    };


    const handleSelectSeat = async () => {
        const loginId = localStorage.getItem('loginId');
        console.log('Current loginId:', loginId);
        await useridHandler();
        if (!loginId) {
            console.log('No loginId found, showing OTP overlay');
            setShowOtpOverlay(true);
            return;
        }
        await fareQuoteHandler();
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

    if (loading) {
        return <Loading />;
    }



    const sortFlights = (flights) => {
        if (sortOrder === 'lowToHigh') {
            return flights.sort((a, b) => a.OfferedFare - b.OfferedFare);
        } else if (sortOrder === 'highToLow') {
            return flights.sort((a, b) => b.OfferedFare - a.OfferedFare);
        }
        return flights;
    };


    return (
        <>
            <CustomNavbar />
            {/* timerrr-------------------  */}
            <div className="timer-FlightLists">
                <div> <p><RiTimerLine /> Redirecting in {formatTimers(timer)}...</p> </div>
            </div>
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
                                        <Accordion.Header className="flightlistaccordian">Price</Accordion.Header>
                                        <Accordion.Body className="flightpriceaccordian">
                                            <div className="row">
                                                <div className="col-5 flightstopaccordian">
                                                    <div>
                                                        <span className="custom-checkbox">
                                                            <input
                                                                type="checkbox"
                                                                id="checkbox1"
                                                                checked={sortOrder === 'lowToHigh'}
                                                                onChange={() => setSortOrder('lowToHigh')}
                                                            />
                                                            <label htmlFor="checkbox1"></label>
                                                        </span>
                                                    </div>
                                                    <h6>Low to High</h6>
                                                </div>
                                                <div className="col-5 flightstopaccordian">
                                                    <div>
                                                        <span className="custom-checkbox">
                                                            <input
                                                                type="checkbox"
                                                                id="checkbox2"
                                                                checked={sortOrder === 'highToLow'}
                                                                onChange={() => setSortOrder('highToLow')}
                                                            />
                                                            <label htmlFor="checkbox2"></label>
                                                        </span>
                                                    </div>
                                                    <h6>High to Low</h6>
                                                </div>
                                            </div>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                    <Accordion.Item eventKey="1">
                                        <Accordion.Header className="flightlistaccordian">Airlines</Accordion.Header>
                                        <Accordion.Body>
                                            <div className="airlineFilters mobileAirlines" > </div>
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
                                <Accordion.Header className="flightlistaccordian">Price</Accordion.Header>
                                <Accordion.Body className="flightpriceaccordian">
                                    <div className="row">
                                        <div className="col-5 flightstopaccordian">
                                            <div>
                                                <span className="custom-checkbox">
                                                    <input
                                                        type="checkbox"
                                                        id="checkbox1"
                                                        checked={sortOrder === 'lowToHigh'}
                                                        onChange={() => setSortOrder('lowToHigh')}
                                                    />
                                                    <label htmlFor="checkbox1"></label>
                                                </span>
                                            </div>
                                            <h6>Low to High</h6>
                                        </div>
                                        <div className="col-5 flightstopaccordian">
                                            <div>
                                                <span className="custom-checkbox">
                                                    <input
                                                        type="checkbox"
                                                        id="checkbox2"
                                                        checked={sortOrder === 'highToLow'}
                                                        onChange={() => setSortOrder('highToLow')}
                                                    />
                                                    <label htmlFor="checkbox2"></label>
                                                </span>
                                            </div>
                                            <h6>High to Low</h6>
                                        </div>
                                    </div>
                                </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="1">
                                <Accordion.Header className="flightlistaccordian">Airlines</Accordion.Header>
                                <Accordion.Body>
                                    <div className="airlineFilters desktopAirlines"> </div>
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                    </div>
                    <div className="col-lg-8">
                        <div className="slider-container">
                            <Slider {...settings}>
                                {flightData.map((flight, index) => (
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

                        </div>

                        <div className="f-lists">
                            <div className="flight-content">
                                {dd && dd.length > 0 ? (
                                    dd.map((flightSegments, index) => {
                                        // Sort the flight segments based on the selected sort order
                                        const sortedFlights = sortFlights([...flightSegments]);
                                        return sortedFlights.map((flight, segmentIndex) => {
                                            return flight?.Segments?.[0].map((option, index) => {
                                                return (
                                                    <>
                                                        {(selected.includes(option.Airline.AirlineName) ||
                                                            selected.length === 0) && (
                                                                <div className="row" key={`${index}-${segmentIndex}`}>
                                                                    <div className="pricebtnsmobil">
                                                                        <p>₹{flight?.OfferedFare || "Unknown Airline"}</p>
                                                                        <button onClick={handleSelectSeat}>SELECT</button>
                                                                    </div>
                                                                    <p className='regulrdeal'><span>Regular Deal</span></p>
                                                                    <p className="f-listAirlinesNameMOB">{option.Airline.AirlineName}</p><br></br>

                                                                    <div className="col-2 col-sm-3 f-listCol1">
                                                                        <div className="f-listAirlines">
                                                                            <img src="https://imgak.mmtcdn.com/flights/assets/media/dt/common/icons/AI.png?v=19" className="img-fluid" />
                                                                            <p className="f-listAirlinesNameWEb">{option.Airline.AirlineName}</p><br></br>
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
                                                                        <div> <button onClick={() => handleSelectSeat(index)}>SELECT</button>     </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                    </>
                                                )
                                            })
                                        });
                                    })
                                ) : (
                                    <p>No flights available.</p>
                                )}
                            </div>

                            {/* <div className="flight-content">
                                {dd && dd.length > 0 ? (
                                    dd.map((flightSegments, index) => {

                                        return flightSegments.map((flight, segmentIndex) => {
                                            return (
                                                <>{
                                                    (
                                                        selected.includes(flight?.Segments?.[0][0]?.Airline.AirlineName) || selected.length == 0
                                                    )
                                                    &&
                                                    <div className="row" key={`${index}-${segmentIndex}`}>
                                                        <div className="pricebtnsmobil">
                                                            <p>{flight?.OfferedFare || "Unknown Airline"}</p>
                                                            <button>SELECT</button>
                                                        </div>
                                                        <p className='regulrdeal'><span>Regular Deal</span></p>

                                                        <div className="col-3">
                                                            <div className="d-flex">
                                                                <img src="https://imgak.mmtcdn.com/flights/assets/media/dt/common/icons/AI.png?v=19" className="img-fluid" />
                                                                <p>{flight?.Segments?.[0][0]?.Airline.AirlineName}</p><br></br>
                                                            </div>
                                                        </div>

                                                        <div className="col-6">
                                                            <div className="flistname">
                                                                <p className="flistnamep1">{flight?.Segments?.[0][0]?.Origin.CityCode}</p>
                                                                <div>
                                                                    <p className="flistnamep2">{convertUTCToIST(flight?.Segments?.[0][0]?.DepTime)}</p>
                                                                    <p className="flistnamep4">{flight?.Segments?.[0][0]?.Origin.CityName}</p>
                                                                </div>
                                                                <p className="flistnamep3">{flight?.Segments?.[0][0]?.Duration}</p>
                                                                <div>
                                                                    <p className="flistnamep2">{convertUTCToIST(flight?.Segments?.[0][0]?.ArrTime)}</p>
                                                                    <p className="flistnamep4">{flight?.Segments?.[0][0]?.Destination.CityName}</p>
                                                                </div>
                                                                <p className="flistnamep5">{flight?.Segments?.[0][0]?.Destination.CityCode}</p>
                                                            </div>
                                                        </div>

                                                        <div className="col-3 pricebtns">
                                                            <div><p>₹{flight?.OfferedFare}</p></div>
                                                            <div> <button onClick={fareQuoteHandler}>SELECT</button>     </div>
                                                        </div>
                                                    </div>

                                                }

                                                </>
                                            );
                                        });
                                    })
                                ) : (
                                    <p>No flights available.</p>
                                )}
                            </div> */}
                        </div>
                    </div>
                </div>
                <EnterOtp showModal={showOtpOverlay} onClose={() => setShowOtpOverlay(false)} />

            </div>
            <Footer />
        </>
    )
}
