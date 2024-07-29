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
    console.log("formData",formData)
    const dd = listData?.Results
    console.log("dd", dd);

    // console.log("airlines name", dd[0][0].Segments[0][0].Airline.AirlineName);

    let originalAirlineList = [];


    // Function to extract all AirlineName values
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


    // console.log("Filtered Airline List:", filteredAirlineList);


    // originalTeachersList = Array.isArray(data.teachers) ? data.teachers : [];
    const originalTeachersList = listData?.Results
    console.log("originalTeachersList", originalTeachersList);



    const airlineNames = getAllAirlineNames(dd);
    console.log("All airlines names:", airlineNames);

    const uniqueAirlineNames = [...new Set(airlineNames)]; // Get unique subjects
    console.log("uniqueAirlineNames", uniqueAirlineNames);

    const createSubjectCheckboxes = () => {
        const airlinesContainer = document.getElementById('airlineFilters');
        airlinesContainer.innerHTML = ''; // Clear previous content

        const uniqueAirlineNames = [...new Set(airlineNames)]; // Get unique subjects

        uniqueAirlineNames.forEach(airlineNames => {
            const div = document.createElement('div');

            const checkbox = document.createElement('input');

            checkbox.type = 'checkbox';
            checkbox.classList.add('airlineFilter' ,'largeCheckbox');
            checkbox.value = airlineNames;
            checkbox.id = `airlineNames${airlineNames}`;
            checkbox.addEventListener('change', applyFilters);
            const label = document.createElement('label');
            label.setAttribute('for', `airlineNames${airlineNames}`);
            label.textContent = airlineNames;
            label.classList.add('largeLabel');


            div.appendChild(label);
            div.appendChild(checkbox);

            // airlinesContainer.appendChild(checkbox);
            // airlinesContainer.appendChild(label);

            airlinesContainer.appendChild(div);
            airlinesContainer.appendChild(document.createElement('br'));
        });
    };

    const applyFilters = () => {
        const airlineFilters = document.querySelectorAll('.airlineFilter:checked');   
        console.log("airlineFilters", airlineFilters)
        const selected = Array.from(airlineFilters).map(filter => filter.value);
        console.log("selected", selected)
        const originalAirlineList = listData?.Results || []; // Ensure listData.Results is defined

        // Function to filter airlines based on selected names
        const filterAirlines = (data, selected) => {
            return data.filter(result =>
                result.some(segmentArray =>
                    segmentArray.Segments.some(segment =>
                        segment.some(detail =>
                            selected.includes(detail.Airline.AirlineName)
                        )
                    )
                )
            );
        };

        const filteredAirlineList = filterAirlines(originalAirlineList, selected);
        
        console.log("Filtered Airline List:", filteredAirlineList);

        displayTeachersPerPage(filteredTeachers, 1); // Display first page of filtered results
        currentPage = 1; // Reset to first page
        renderPagination(); // Update pagination
    };

    useEffect(() => {
        createSubjectCheckboxes();
      }, []);
    



    // console.log("airlines name", dd.Segments?.[0][0]?.Airline.AirlineName);

    // console.log("listData", listData)

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



    const dateMidRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.pageX - dateMidRef.current.offsetLeft);
        setScrollLeft(dateMidRef.current.scrollLeft);
    };

    const handleMouseLeaveOrUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - dateMidRef.current.offsetLeft;
        const walk = (x - startX) * 3;
        dateMidRef.current.scrollLeft = scrollLeft - walk;
    };



    // ------------------------------------------------fare-Quote-api-----------------------------------------
    const fareQuoteHandler = async () => {
        const traceId = localStorage.getItem('FlightTraceId2');
        const resultIndex = localStorage.getItem('FlightResultIndex2');
        const srdvType = localStorage.getItem('FlightSrdvType');
        const srdvIndex = localStorage.getItem('FlightSrdvIndex2'); // Get SrdvIndex from local storage
        


        if (!traceId || !resultIndex) {
            console.error('TraceId or ResultIndex not found in local storage');
            return;
        }

        const payload = {
            SrdvIndex: srdvIndex,
            ResultIndex: resultIndex,
            TraceId: parseInt(traceId),
            SrdvType: srdvType,
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

            if (data.Results && formData) {
                navigate('/flight-Farequote', { state: { fareData: data.Results, formData: formData } });
              } else {
                console.error('data.Results or formData is undefined');
              }

            // navigate('/flight-Farequote', { state: { fareData: data.Results , formData: formData } });

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
                            <p> {formData.Segments[0].Origin} </p>
                            <p>-</p>
                            <p>{formData.Segments[0].Destination} </p>
                        </div>
                        <div className="col-lg-4 d-flex flightlistsec1col">
                            <FaCalendarAlt className="mt-1" />
                            <p><span>Departure on Wed,</span> 17 July</p>
                        </div>
                        <div className="col-lg-4 d-flex flightlistsec1col">
                            <FaUser className="mt-1" />
                            <p><span>Traveller {formData.AdultCount + formData.ChildCount + formData.InfantCount} , </span> <span>Economy</span></p>
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
                                    <div className="row">
                                        <div className="col-4 flightstopaccordian">
                                            <div><span></span></div>
                                            <p>Non Stop</p>
                                            <h6>Rs.8541</h6>
                                        </div>
                                        <div className="col-4 flightstopaccordian">
                                            <div><span></span></div>
                                            <p>1 Stop</p>
                                            <h6>Rs.8541</h6>
                                        </div>
                                        <div className="col-4 flightstopaccordian">
                                            <div><span></span></div>
                                            <p>2 Stop</p>
                                            <h6>Rs.8541</h6>
                                        </div>
                                    </div>
                                </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="1">
                                <Accordion.Header className="flightlistaccordian">Airlines</Accordion.Header>
                                <Accordion.Body>
                                    <div id="airlineFilters">

                                    </div>

                                    {/* <div className="airlineaccoridna">
                                        <span></span>
                                        <p>Indigo Air</p>
                                        <h6>Rs.7202</h6>
                                    </div>
                                    <div className="airlineaccoridna">
                                        <span></span>
                                        <p>Air India</p>
                                        <h6>Rs.7202</h6>
                                    </div>
                                    <div className="airlineaccoridna">
                                        <span></span>
                                        <p>AirIndia Express</p>
                                        <h6>Rs.7202</h6>
                                    </div>
                                    <div className="airlineaccoridna">
                                        <span></span>
                                        <p>Multiple Airlines</p>
                                        <h6>Rs.7834</h6>
                                    </div>
                                    <div className="airlineaccoridna">
                                        <span></span>
                                        <p>Vistara</p>
                                        <h6>Rs.7202</h6>
                                    </div>
                                    <div className="airlineaccoridna">
                                        <span></span>
                                        <p>Akasa Air</p>
                                        <h6>Rs.9956</h6>
                                    </div>
                                    <div className="airlineaccoridna">
                                        <span></span>
                                        <p>Spice Jet</p>
                                        <h6>Rs.8682</h6>
                                    </div>
                                    <div className="airlineaccoridna">
                                        <span></span>
                                        <p>Air India Exp</p>
                                        <h6>Rs.7202</h6>
                                    </div> */}
                                </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="2">
                                <Accordion.Header className="flightlistaccordian">Price</Accordion.Header>
                                <Accordion.Body>
                                    {/* <ProgressBar now={(price / maxPrice) * 100} label={`${(price / maxPrice) * 100}%`} /> */}
                                    <div className="flightlistaccordianprice">

                                        <div className="flightlistaccordianpricehed">
                                            <p>Rs.{price}</p><p>Rs.{maxPrice}</p>
                                        </div>
                                        <input
                                            type="range"
                                            min="0"
                                            max={maxaccordiandepartime}
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
                                {dd && dd.length > 0 ? (
                                    dd.map((flightSegments, index) => {

                                        return flightSegments.map((flight, segmentIndex) => {

                                            return (
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
                                            );
                                        });
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
