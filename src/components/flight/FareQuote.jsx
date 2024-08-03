import { useLocation, useNavigate, Link } from 'react-router-dom';
import { TiPlane } from "react-icons/ti";
import { FaCalendarAlt, FaUser } from 'react-icons/fa';
import "./FlightLists.css";
import React from 'react';
import { LuDot } from "react-icons/lu";



const FareQuote = () => {
    const navigate = useNavigate();

    const location = useLocation();
    const fareData = location.state?.fareData;
    const segmentss = fareData.Segments;
    console.log("segmentss", segmentss);

    const formData = location.state?.formData;  // Using optional chaining to prevent errors if state is undefined

    // function for date convert into day month date--------------------------------------
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).format(date);
    };

    const formattedDate = formatDate("2024-08-29T00:00:00");
    console.log("Formatted Date:", );
    // function for date convert into day month date--------------------------------------

    // func for date -------------------------
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
        return <div>Loading...</div>; // Or any other fallback UI
    }

    const publishedFare = fareData?.Fare?.BaseFare;
    console.log("fareData", fareData);
    console.log("publishedFare", publishedFare);

    const flightDeatilsFun = () => {
        navigate('/flight-details', { state: { fareData: fareData, formData: formData } });
    }


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

            <div className="fare-quote-main">
                {/* {publishedFare ? (
                <div className="last">
                    <h6>₹{publishedFare}</h6>
                    <button>Proceed</button>
                </div>
            ) : (
                <p>No fare data available.</p>
            )} */}

                <section className='fare-quote-sec'>
                    <div className="container fare-quote-container">
                        <div className="row fare-quote-boxRow">
                            <div className="col-md-6 fare-quote-box">
                                <div className="row ">

                                    <div className='col-12 fareQuoteHed'>
                                        <h6>Departing Flight  : <span>{formattedDate}</span></h6>
                                        <p> <span>Delhi</span> <span>Mumbai</span> </p>
                                    </div>
                                    {/* <div className='col-12 fareQuotemain'> */}
                                        {segmentss.map((segmentGroup, groupIndex) => (
                                            <React.Fragment key={groupIndex}>
                                                {segmentGroup.map((segmentDetails, index) => (
                                                    <React.Fragment key={index}>
                                                        <div className='col-12 fareQuotemain'>
                                                        <h6 className='fareQuotemainh6'>{segmentDetails.Airline.AirlineName} <LuDot size={30} /> {segmentDetails.Airline.AirlineCode} <LuDot size={30} /> {segmentDetails.Airline.FlightNumber} </h6>
                                                        <p className='fareQuotemainp1'>{convertUTCToIST(segmentDetails.DepTime)}</p>
                                                        <p className='fareQuotemainp2'>{segmentDetails.Destination.CityName} <LuDot size={30} /> <span>{segmentDetails.Destination.AirportName}</span></p>
                                                        <p className='fareQuotemainp3'>Duration  {convertMinutesToHoursAndMinutes  (segmentDetails.Duration)}</p>
                                                        <p className='fareQuotemainp4'>{convertUTCToIST(segmentDetails.ArrTime)}</p>
                                                        <p className='fareQuotemainp5'>{segmentDetails.Origin.CityName} <LuDot size={30} /> <span>{segmentDetails.Origin.AirportName}</span></p>
                                                        </div>
                                                    </React.Fragment>
                                                ))}
                                            </React.Fragment>
                                        ))}
                                    {/* </div> */}


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
        </>

    );
}

export default FareQuote;
