import "./FlightLists.css"
import { Accordion, Form, ProgressBar } from 'react-bootstrap';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TiPlane } from "react-icons/ti";
import { FaCalendarAlt, FaUser } from 'react-icons/fa';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function FlightLists() {
    const navigate = useNavigate();

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
    const sliderRef = useRef(null);
    useEffect(() => {
        if (location.state) {
            setFlightListData(location.state);
        }
    }, [location.state])
    // console.log("FullData", location.state)
    // console.log("FlightlistData", flightListData)
    const listData = location.state.data
    const formData = location.state.formData

    // console.log("Origin", formData.Segments[0]["Origin"])
    // const dd = listData?.Results

    // console.log("dd", dd);
    // console.log("airlines name", dd[0][0].Segments[0][0].Airline.AirlineName);


    // ------------------------------------------------filter airlines Logic--------------------------------

    const [filteredFlightData, setFilteredFlightData] = useState([]);
    const [uniqueAirlineNames, setUniqueAirlineNames] = useState([]);
    const [selectedAirlines, setSelectedAirlines] = useState([]);
    const [originalFlightData, setOriginalFlightData] = useState([]);
    const dd = filteredFlightData


    useEffect(() => {
        if (location.state && location.state.data) {
            const flightList = location.state.data.Results;
            setOriginalFlightData(flightList);
            setFilteredFlightData(flightList);
            const airlineNames = getAllAirlineNames(flightList);
            setUniqueAirlineNames([...new Set(airlineNames)]);
        }
    }, [location.state]);

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

    useEffect(() => {
        createAirlineCheckboxes();
    }, [uniqueAirlineNames]);

    const createAirlineCheckboxes = () => {
        const airlinesContainer = document.getElementById("airlineFilters");
        if (!airlinesContainer) return;

        airlinesContainer.innerHTML = "";
        uniqueAirlineNames.forEach(airlineName => {
            const div = document.createElement("div");

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.classList.add("airlineFilter", "largeCheckbox");
            checkbox.value = airlineName;
            checkbox.id = `airlineName${airlineName}`;
            checkbox.addEventListener("change", handleAirlineFilterChange);

            const label = document.createElement("label");
            label.setAttribute("for", `airlineName${airlineName}`);
            label.textContent = airlineName;
            label.classList.add("largeLabel");

            div.appendChild(checkbox);
            div.appendChild(label);
            airlinesContainer.appendChild(div);
            airlinesContainer.appendChild(document.createElement("br"));
        });
    };

    const handleAirlineFilterChange = (event) => {
        const { value, checked } = event.target;
        setSelectedAirlines(prev => {
            if (checked) {
                return [...prev, value];
            } else {
                return prev.filter(airline => airline !== value);
            }
        });
    };

    useEffect(() => {
        console.log('Filtered Flight Data:', filteredFlightData);
    }, [filteredFlightData]);
    

    useEffect(() => {
        applyFilters();
    }, [selectedAirlines]);

    const displayFilterAirlinesdata = () => {

    }

    const applyFilters = () => {
        if (selectedAirlines.length === 0) {
            // If no airline is selected, show all flight data
            setFilteredFlightData(originalFlightData);
            return;
        }

        // Filter the original flight data based on selected airlines
        const filteredData = originalFlightData.flatMap(result =>
            result.flatMap(segmentArray =>
                segmentArray.Segments.flatMap(segment =>
                    segment.filter(detail =>
                        selectedAirlines.includes(detail.Airline.AirlineName)
                    )
                )
            )
        );

        // Update the filtered flight data state
        setFilteredFlightData(filteredData);
    };


    // -----------------------------------------------filter airlines Logic------------------------------------




    localStorage.setItem("FlightSrdvType", listData.SrdvType)
    localStorage.setItem("FlightTraceId", listData.TraceId)


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
                                "PreferredDepartureTime": "2024-07-30T00:00:00",
                                "PreferredArrivalTime": "2024-07-30T00:00:00",
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

    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        variableWidth: true,
    };

    // Scroll functions
    const scrollLeftClick = () => {
        if (sliderRef.current) {
            sliderRef.current.slickPrev();
        }
    };

    const scrollRightClick = () => {
        if (sliderRef.current) {
            sliderRef.current.slickNext();
        }
    };



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
        const traceId = localStorage.getItem('FlightTraceId2');
        const resultIndex = localStorage.getItem('FlightResultIndex2');

        if (!traceId || !resultIndex) {
            console.error('TraceId or ResultIndex not found in local storage');
            return;
        }

        const payload = {
            SrdvIndex: "1",
            ResultIndex: resultIndex,
            TraceId: parseInt(traceId),
            SrdvType: "MixAPI"
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

            navigate('/flight-Farequote', { state: { fareData: data.Results } });

        } catch (error) {
            console.error('Error calling the farequote API:', error);
        }
    };


    // -------------------------------------------------fare-Quote-api----------------------------------------



    return (
        <>

            <section className='flightlistsec1'>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-4 d-flex flightlistsec1col">
                            <TiPlane className="mt-1" />
                            <p>New Delhi <span>(DEL) </span> </p>
                            <p>-</p>
                            <p>Banglore <span>(BLR)</span></p>
                        </div>
                        <div className="col-lg-4 d-flex flightlistsec1col">
                            <FaCalendarAlt className="mt-1" />
                            <p><span>Departure on Wed,</span> 17 July</p>
                        </div>
                        <div className="col-lg-4 d-flex flightlistsec1col">
                            <FaUser className="mt-1" />
                            <p>1 <span>Traveller , Economy</span></p>
                        </div>
                    </div>
                </div>
            </section>

            <div className="container-fluid flightlistsec2">
                <div className="row">
                    <div className="col-lg-3 flightlistsec2col1">
                        <Accordion defaultActiveKey={['0', '1', '2', '3']} alwaysOpen>
                            <Accordion.Item eventKey="0">
                                <Accordion.Header className="flightlistaccordian">Stops</Accordion.Header>
                                <Accordion.Body>

                                    <Form>
                                        <div className="row">
                                            <div className="col-4 flightstopaccordian">
                                                <Form.Check type="checkbox" id="nonstop" />
                                                <label>Non Stop</label>
                                                <h6>Rs.8541</h6>
                                            </div>
                                            <div className="col-4 flightstopaccordian">
                                                <Form.Check type="checkbox" id="onestop" for="1 Stop" />
                                                <label>1 Stop</label>
                                                <h6>Rs.8541</h6>
                                            </div>
                                            <div className="col-4 flightstopaccordian">
                                                <Form.Check type="checkbox" id="twostop" />
                                                <label>2 Stop</label>
                                                <h6>Rs.8541</h6>
                                            </div>
                                        </div>
                                    </Form>

                                </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="1">
                                <Accordion.Header className="flightlistaccordian">Airlines</Accordion.Header>
                                <Accordion.Body>
                                    <div id="airlineFilters">

                                    </div>

                                </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="2">
                                <Accordion.Header className="flightlistaccordian">Price</Accordion.Header>
                                <Accordion.Body>
                                    <div className="flightlistaccordianprice">
                                        <div className="flightlistaccordianpricehed">
                                            <p>Rs.{price}</p><p>Rs.{maxPrice}</p>
                                        </div>
                                        <input
                                            type="range"
                                            min="0"
                                            max={maxPrice}
                                            value={price}
                                            onChange={handleSliderChange}
                                            className="form-range"
                                        />
                                    </div>
                                </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="3">
                                <Accordion.Header>Another Accordion</Accordion.Header>
                                <Accordion.Body>
                                    <div className="flightlistaccordianprice mb-5">
                                        <ul>
                                            <li>
                                                <h6>Departure from New Delhi (DEL) </h6>
                                            </li>
                                        </ul>
                                        <div className="flightlistaccordianpricehed">
                                            <p>Rs.{accordiandepartime}</p><p>Rs.{maxaccordiandepartime}</p>
                                        </div>
                                        <input
                                            type="range"
                                            min="0"
                                            max={maxPrice}
                                            value={price}
                                            onChange={handledeparttimeSliderChange}
                                            className="form-range"
                                        />
                                    </div>

                                    <div className="flightlistaccordianprice">
                                        <ul>
                                            <li>
                                                <h6>Arrived at Banglore (BLR) </h6>
                                            </li>
                                        </ul>
                                        <div className="flightlistaccordianpricehed">
                                            <p>Rs.{accordianArrivedtime}</p><p>Rs.{maxaccordianArrivedtime}</p>
                                        </div>
                                        <input
                                            type="range"
                                            min="0"
                                            max={maxaccordianArrivedtime}
                                            value={accordianArrivedtime}
                                            onChange={handleArrivedtimeSliderChange}
                                            className="form-range"
                                        />
                                    </div>
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                    </div>
                    <div className="col-lg-8">
                        <div className="flight-date-slider">
                            <div className="flight-d-slide">
                                <div className="date-left" onClick={scrollLeftClick}>
                                    <i className="ri-arrow-left-s-line"></i>
                                </div>
                                <div className="date-mid" >
                                    <Slider ref={sliderRef} {...settings}>
                                        {flightData.map((flight, index) => (
                                            <div style={{ margin: '1vmax' }} className="d-one" key={index}>
                                                <h6>{new Date(flight.DepartureDate).toLocaleDateString()}</h6>
                                                <p>{flight.BaseFare}</p>
                                            </div>
                                        ))}
                                    </Slider>
                                </div>
                                <div className="date-right" onClick={scrollRightClick}>
                                    <i className="ri-arrow-right-s-line"></i>
                                </div>
                            </div>
                        </div>

                        <div className="f-lists">
                            <div className="flight-content">
                                {Array.isArray(filteredFlightData) && filteredFlightData.length > 0 ? (
                                    filteredFlightData.map((flightSegments, index) => {
                                        // Ensure flightSegments is an array before mapping over it
                                        if (Array.isArray(flightSegments)) {
                                            return flightSegments.map((flight, segmentIndex) => {
                                                return (
                                                    <div className="row" key={`${index}-${segmentIndex}`}>
                                                        <div className="pricebtnsmobil">
                                                            <p>{flight?.OfferedFare || "Unknown Fare"}</p>
                                                            <button onClick={fareQuoteHandler}>SELECT</button>
                                                        </div>
                                                        <p className='regulrdeal'><span>Regular Deal</span></p>
                                                        <div className="col-3">
                                                            <div className="d-flex">
                                                            <img src="https://imgak.mmtcdn.com/flights/assets/media/dt/common/icons/AI.png?v=19" className="img-fluid" />

                                                                {/* <img src={flight?.Segments?.[0]?.[0]?.Airline?.AirlineLogo || "default-logo.png"} alt="Airline Logo" className="img-fluid" /> */}
                                                                <p>{flight?.Segments?.[0]?.[0]?.Airline?.AirlineName || "Unknown Airline"}</p>
                                                                <br />
                                                            </div>
                                                        </div>
                                                        <div className="col-6">
                                                            <div className="flistname">
                                                                <p className="flistnamep1">{flight?.Segments?.[0]?.[0]?.Origin?.CityCode || "N/A"}</p>
                                                                <div>
                                                                    <p className="flistnamep2">{convertUTCToIST(flight?.Segments?.[0]?.[0]?.DepTime) || "N/A"}</p>
                                                                    <p className="flistnamep4">{flight?.Segments?.[0]?.[0]?.Origin?.CityName || "Unknown City"}</p>
                                                                </div>
                                                                <p className="flistnamep3">{flight?.Segments?.[0]?.[0]?.Duration || "N/A"}</p>
                                                                <div>
                                                                    <p className="flistnamep2">{convertUTCToIST(flight?.Segments?.[0]?.[0]?.ArrTime) || "N/A"}</p>
                                                                    <p className="flistnamep4">{flight?.Segments?.[0]?.[0]?.Destination?.CityName || "Unknown City"}</p>
                                                                </div>
                                                                <p className="flistnamep5">{flight?.Segments?.[0]?.[0]?.Destination?.CityCode || "N/A"}</p>
                                                            </div>
                                                        </div>
                                                        <div className="col-3 pricebtns">
                                                            <div><p>₹{flight?.OfferedFare || "N/A"}</p></div>
                                                            <div>
                                                                <button onClick={fareQuoteHandler}>SELECT</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            });
                                        } else {
                                            return <p key={index}>Invalid flight segments data.</p>;
                                        }
                                    })
                                ) : (
                                    <p>No flights available.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
