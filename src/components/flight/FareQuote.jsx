/* eslint-disable no-unused-vars */
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { TiPlane } from "react-icons/ti";
import { FaCalendarAlt, FaUser } from 'react-icons/fa';
import "./FlightLists.css";
import React from 'react';
import { LuDot } from "react-icons/lu";
// import { RiTimerLine } from "react-icons/ri";
import CustomNavbar from '../../pages/navbar/CustomNavbar';
import Footer from '../../pages/footer/Footer';
import Loading from '../../pages/loading/Loading'; // Import the Loading component
import { FaArrowRightLong } from 'react-icons/fa6';
// impor TimerFlight from '../timmer/TimerFlight';


const FareQuote = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false); // Add loading state

    const location = useLocation();
    const formData = location.state?.formData;  // Using optional chaining to prevent errors if state is undefined
    const dataToPass = location.state?.dataToPass;
    const fareQuoteAPIData = location.state?.fareQuoteAPIData;
    const segmentss = fareQuoteAPIData.Segments;

    // selected flight data get------
    const { flightSelectedDATA } = location?.state || {};
    console.log('flightSelectedDATA', flightSelectedDATA);

    const publishedFare = flightSelectedDATA?.flight?.OfferedFare;

    // function for date convert into day month date--------------------------------------
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).format(date);
    };

    const formattedDate = formatDate(formData.Segments[0].PreferredDepartureTime);
    // console.log("Formatted Date:", formattedDate);
    // function for date convert into day month date--------------------------------------

    // func for date -------------------------------
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
    // func for date -------------------------

    // func for duration convert hpur minute---------------------
    const convertMinutesToHoursAndMinutes = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return `${hours}h ${remainingMinutes}m`;
    };
    // func for duration convert hpur minute---------------------

    // Check if formData exists
    if (!formData) {
        console.error('formData is undefined');
        return <div>Loading...</div>;
    }

    const flightDeatilsFun = () => {
        setLoading(true);
        setTimeout(() => {
            navigate('/flight-details', {
                state: {
                    fareQuoteAPIData: fareQuoteAPIData,
                    formData: formData,
                    flightSelectedDATA: flightSelectedDATA,
                    dataToPass: dataToPass,
                }
            });
        }, 1000);
    }

    // for timerss----------------------------------
    // const [timer, setTimer] = useState(0);

    // useEffect(() => {
    //   const updateTimer = () => {
    //     const endTime = localStorage.getItem('F-timerEndTime');
    //     const now = Date.now();
    //     if (endTime) {
    //       const remainingTime = endTime - now;
    //       if (remainingTime <= 0) {
    //         localStorage.removeItem('F-timerEndTime');
    //         navigate('/flight-search');
    //       } else {
    //         setTimer(remainingTime);
    //       }
    //     } else {
    //       navigate('/flight-search');
    //     }
    //   };
    //   updateTimer();

    //   const interval = setInterval(updateTimer, 1000); 

    //   return () => clearInterval(interval);
    // }, [navigate]);

    // const formatTimers = (milliseconds) => {
    //   const totalSeconds = Math.floor(milliseconds / 1000);
    //   const minutes = Math.floor(totalSeconds / 60);
    //   const seconds = totalSeconds % 60;
    //   return `${minutes} min ${seconds} sec left`;
    // };
    // for timerss----------------------------------

    if (loading) {
        return <Loading />;
    }

    return (
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
                        <div className="col-12 flightlistsec1MainCol">
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
                        {/* <div className="col-2 search-functinality">
                            <button onClick={navigateSearch}><i className="ri-pencil-fill"></i>Modify</button>
                        </div> */}
                    </div>
                </div>
            </section>

            <div className="fare-quote-main">
                <section className='fare-quote-sec'>
                    <div className="container fare-quote-container">
                        <div className="row fare-quote-boxRow">
                            <div className="col-lg-6 fare-quote-box">
                                <div className="row ">

                                    <div className='col-12 fareQuoteHed'>
                                        <h6>Departing Flight  : <span>{formattedDate}</span></h6>
                                        <p> <span>{formData.Segments[0].Origin}</span> <FaArrowRightLong />  <span>{formData.Segments[0].Destination}</span> </p>
                                    </div>
                                    {segmentss.map((segmentGroup, groupIndex) => (
                                        <React.Fragment key={groupIndex}>
                                            {segmentGroup.map((segmentDetails, index) => (
                                                <React.Fragment key={index}>
                                                    <div className='col-12 fareQuotemain'>
                                                        <h6 className='fareQuotemainh6'>{segmentDetails.Airline.AirlineName} <LuDot size={30} /> {segmentDetails.Airline.AirlineCode} <LuDot size={30} /> {segmentDetails.Airline.FlightNumber} </h6>
                                                        <p className='fareQuotemainp1'>{convertUTCToIST(segmentDetails.DepTime)}</p>
                                                        <p className='fareQuotemainp2'>{segmentDetails.Destination.CityName} <LuDot size={30} /> <span>{segmentDetails.Destination.AirportName}</span></p>
                                                        <p className='fareQuotemainp3'>Duration  {convertMinutesToHoursAndMinutes(segmentDetails.Duration)}</p>
                                                        <p className='fareQuotemainp4'>{convertUTCToIST(segmentDetails.ArrTime)}</p>
                                                        <p className='fareQuotemainp5'>{segmentDetails.Origin.CityName} <LuDot size={30} /> <span>{segmentDetails.Origin.AirportName}</span></p>
                                                    </div>
                                                </React.Fragment>
                                            ))}
                                        </React.Fragment>
                                    ))}

                                    {publishedFare ? (
                                        <div className="fareQuotemainLast col-12">
                                            <h5>Fare  <span>₹{publishedFare}</span></h5>
                                            <button onClick={flightDeatilsFun}>Proceed</button>
                                        </div>
                                    ) : (
                                        <p>No fare data available.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <Footer />
        </>

    );
}

export default FareQuote;
