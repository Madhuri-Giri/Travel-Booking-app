import "./FlightLists.css"
import { Accordion, Form, ProgressBar } from 'react-bootstrap';
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { TiPlane } from "react-icons/ti";
import { FaCalendarAlt, FaUser } from 'react-icons/fa';

export default function FlightLists() {

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

    useEffect(() => {
        if (location.state) {
            setFlightListData(location.state);
        }
    }, [location.state])
    console.log("location", location)

    const dateMidRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const scrollLeftClick = () => {
        if (dateMidRef.current) {
            dateMidRef.current.scrollLeft -= 150;
        }
    };

    const scrollRightClick = () => {
        if (dateMidRef.current) {
            dateMidRef.current.scrollLeft += 150;
        }
    };

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

    // Sample data for dates and prices
    const flightData = [

        { date: '16 July,Mon', price: '$71,000' },
        { date: '17 July,Tue', price: '$75,000' },
        { date: '18 July,Wed', price: '$73,000' },
        { date: '19 July,Thu', price: '$75,000' },
        { date: '20 July,Fri', price: '$71,000' },
        { date: '21 July,Sat', price: '$72,000' },
        { date: '22 July,Sun', price: '$71,000' },
        { date: '23 July,Mon', price: '$76,000' },
        { date: '24 July,Tue', price: '$71,000' },
        { date: '25 July,Wed', price: '$71,000' },
        { date: '26 July,Thu', price: '$73,000' },
        { date: '27 July,Fri', price: '$71,000' },
        { date: '28 July,Sat', price: '$71,000' },
        { date: '29 July,Sun', price: '$71,000' },
        { date: '30 July,Mon', price: '$71,000' },
        { date: '31 July,Tue', price: '$71,000' },

    ];


    const flightsData = [
        {
            airline: "IndiGo",
            imgSrc: "https://imgak.mmtcdn.com/flights/assets/media/dt/common/icons/6E.png?v=19",
            departure: "12:30",
            arrival: "2:10",
            duration: "1h 35m",
            price: "$62,000",
            offer: "Get Rs 425 off using MMTSUPER code",
            seatsLeft: "9 seats left",
            startflightshortname: "DEL",
            endflightshortname: "BLR",
            startflightFullname: "Delhi",
            endflightFullname: "Banglore"

        },
        {
            airline: "Air India",
            imgSrc: "https://imgak.mmtcdn.com/flights/assets/media/dt/common/icons/AI.png?v=19",
            departure: "10:00",
            arrival: "12:30",
            duration: "2h 30m",
            price: "$55,000",
            offer: "Get Rs 500 off using AIRSUPER code",
            seatsLeft: "5 seats left",
            startflightshortname: "BOM",
            endflightshortname: "CCU",
            startflightFullname: "Mumbai",
            endflightFullname: "Kolkata"
        },
        {
            airline: "IndiGo",
            imgSrc: "https://imgak.mmtcdn.com/flights/assets/media/dt/common/icons/6E.png?v=19",
            departure: "12:30",
            arrival: "2:10",
            duration: "1h 35m",
            price: "$62,000",
            offer: "Get Rs 425 off using MMTSUPER code",
            seatsLeft: "9 seats left",
            startflightshortname: "HYD",
            endflightshortname: "MAA",
            startflightFullname: "Hydrabad",
            endflightFullname: "Madras"
        },
        {
            airline: "Air India",
            imgSrc: "https://imgak.mmtcdn.com/flights/assets/media/dt/common/icons/AI.png?v=19",
            departure: "10:00",
            arrival: "12:30",
            duration: "2h 30m",
            price: "$55,000",
            offer: "Get Rs 500 off using AIRSUPER code",
            seatsLeft: "5 seats left",
            startflightshortname: "DEL",
            endflightshortname: "BLR",
            startflightFullname: "Delhi",
            endflightFullname: "Banglore"
        },
        {
            airline: "IndiGo",
            imgSrc: "https://imgak.mmtcdn.com/flights/assets/media/dt/common/icons/6E.png?v=19",
            departure: "12:30",
            arrival: "2:10",
            duration: "1h 35m",
            price: "$62,000",
            offer: "Get Rs 425 off using MMTSUPER code",
            seatsLeft: "9 seats left",
            startflightshortname: "DEL",
            endflightshortname: "BLR",
            startflightFullname: "Delhi",
            endflightFullname: "Banglore"
        },
        {
            airline: "Air India",
            imgSrc: "https://imgak.mmtcdn.com/flights/assets/media/dt/common/icons/AI.png?v=19",
            departure: "10:00",
            arrival: "12:30",
            duration: "2h 30m",
            price: "$55,000",
            offer: "Get Rs 500 off using AIRSUPER code",
            seatsLeft: "5 seats left",
            startflightshortname: "DEL",
            endflightshortname: "BLR",
            startflightFullname: "Delhi",
            endflightFullname: "Banglore"
        },
    ];


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
                                    <div className="airlineaccoridna">
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
                                    </div>
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
                                <div
                                    className="date-mid"
                                    ref={dateMidRef}
                                    onMouseDown={handleMouseDown}
                                    onMouseLeave={handleMouseLeaveOrUp}
                                    onMouseUp={handleMouseLeaveOrUp}
                                    onMouseMove={handleMouseMove}
                                >
                                    {flightData.map((flight, index) => (
                                        <div className="d-one" key={index}>
                                            <h6>{flight.date}</h6>
                                            <p>{flight.price}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="date-right" onClick={scrollRightClick}>
                                    <i className="ri-arrow-right-s-line"></i>
                                </div>
                            </div>
                        </div>

                        <div className="f-lists">
                            <div className="flight-content">
                                {flightsData.map((flight, index) => (
                                    <div className="row">
                                         <div className="pricebtnsmobil">
                                            <p>{flight.price}</p>
                                            <button>SELECT</button> 
                                        </div>
                                        <p className='regulrdeal'><span>Regular Deal</span></p>
                                        <div className="col-3">
                                            <div className="d-flex">
                                                <img src={flight.imgSrc} alt={flight.airline} />
                                                <p>{flight.airline}</p>
                                            </div>
                                        </div>
                                        <div className="col-6">
                                            <div className="flistname">
                                                <p className="flistnamep1">{flight.startflightshortname}</p>
                                                <div>
                                                    <p className="flistnamep2">{flight.departure}</p>
                                                    <p className="flistnamep4">{flight.startflightFullname}</p>
                                                </div>
                                                <p className="flistnamep3">02h 45m</p>
                                                <div>
                                                    <p className="flistnamep2">{flight.arrival}</p>
                                                    <p className="flistnamep4">{flight.endflightFullname}</p>
                                                </div>
                                                <p className="flistnamep5">GOI</p>
                                            </div>
                                        </div>
                                        <div className="col-3 pricebtns">
                                            <div><p>{flight.price}</p></div>
                                            <div> <button>SELECT</button>     </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}
