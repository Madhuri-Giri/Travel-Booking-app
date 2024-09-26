/* eslint-disable react/jsx-key */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import "./FlightSegments.css";
import { MdOutlineFlightTakeoff } from "react-icons/md";
import { FaLongArrowAltRight } from "react-icons/fa";

export default function FlightSegments(props) {
    const flightSegments = props?.flightSegments;
    const logoUrl = props?.logoUrl;

    // function for date convert into day month date--------------------------------------
    const formatDate = (dateString) => {
        if (dateString) {
            const date = new Date(dateString);
            return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', weekday: 'short' }).format(date);
        }
    };
    // func for duration convert hpur minute---------------------
    const convertMinutesToHoursAndMinutes = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return `${hours}h ${remainingMinutes}m`;
    };
    // func for duration convert hpur minute---------------------
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

    const [radiobtn, setRadiobtn] = useState(null)

    return (
        <>
            <section className="segmentsMainSec">
                <h6 className="mt-4">Flights</h6>
                <div className="fligthReviewBoxHed">
                    <div className="col-8 mt-3 fligthReviewBoxHedText">
                        <MdOutlineFlightTakeoff />
                    </div>
                    <div className="col-4 fligthReviewBoxHedbttn">
                        <button>Regular Deal</button>
                    </div>
                </div>
                <section className="flight-segment-container">
                    {
                        flightSegments[0].map((valueSegments, index) => {
                            return (
                                <React.Fragment key={index}>
                                    <div className="row flightSegmentsData">
                                        <div className="col-md-2 col-2 flighttTabContentCol1">
                                            <p>
                                                <img src={logoUrl} className="img-fluid" alt="" />
                                            </p>
                                            <p>{valueSegments.Airline.AirlineName}</p>
                                            <p>{valueSegments.Airline.AirlineCode} - {valueSegments.Airline.FlightNumber}</p>
                                        </div>
                                        <div className="col-md-4 col-3 flighttTabContentCol2">
                                            <div>
                                                <p className="flighttTabContentCol2p1">{valueSegments.Origin.CityName} ({valueSegments.Origin.CityCode})</p>
                                                <h5>{convertUTCToIST(valueSegments.DepTime)}</h5>
                                                <p className="flighttTabContentCol2p2">{formatDate(valueSegments.DepTime)}</p>
                                                <p className="flighttTabContentCol2p3">{valueSegments.Origin.AirportName}</p>
                                            </div>
                                        </div>
                                        <div className="col-md-2 col-3 flighttTabContentCol3">
                                            <p className="flighttTabContentCol3p1">{convertMinutesToHoursAndMinutes(valueSegments.Duration)}</p>
                                            <p className="flighttTabContentCol3p2">cabin class</p>
                                        </div>
                                        <div className="col-md-4 col-4 flighttTabContentCol4">
                                            <div>
                                                <p className="flighttTabContentCol2p1">{valueSegments.Destination.CityName} ({valueSegments.Destination.CityCode})</p>
                                                <h5>{convertUTCToIST(valueSegments.ArrTime)}</h5>
                                                <p className="flighttTabContentCol2p2">{formatDate(valueSegments.ArrTime)}</p>
                                                <p className="flighttTabContentCol2p3">{valueSegments.Destination.AirportName}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Conditionally render the "change Plane" message with dynamic city */}
                                    {index < flightSegments[0].length - 1 && (
                                        <>
                                            <div className="changePlaneDiv">
                                                <p>Change Plane in  
                                                    {/* <FaLongArrowAltRight /> */}
                                                    <span className="ms-1">
                                                    { valueSegments.Destination.CityName} ({valueSegments.Destination.CityCode})
                                                    </span>
                                               </p>
                                               {/* <p>timeee</p> */}
                                            </div>
                                        </>
                                    )}
                                </React.Fragment>
                            );
                        })
                    }
                </section>

            </section>
        </>
    );
}
