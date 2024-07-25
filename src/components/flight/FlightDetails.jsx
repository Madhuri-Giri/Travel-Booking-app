import "./FlightLists.css"
import "./FlightDetails.css"
import React from 'react'
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TiPlane } from "react-icons/ti";
import { FaCalendarAlt, FaUser } from 'react-icons/fa';
import { MdOutlineFlightTakeoff } from "react-icons/md";


export default function FlightDetails() {

    const [activeTabFlightDetails, setActiveTabFlightDetails] = useState('flight');

    const renderContent = () => {
        switch (activeTabFlightDetails) {
            case 'flight':
                return <div>
                    <div className="row flighttTabContent">
                        <div className="col-3 flighttTabContentCol1">
                            <img src="https://imgak.mmtcdn.com/flights/assets/media/dt/common/icons/AI.png?v=19" className="img-fluid" />
                            <p>Indigo Air</p>
                        </div>
                        <div className="col-3 flighttTabContentCol2">
                            <p className="flighttTabContentCol2p1">Mumbai</p>
                            <h5>00:25</h5>
                            <p className="flighttTabContentCol2p2">Tue,July23</p>
                            <p className="flighttTabContentCol2p3">Chhatrapati Shivaji International Airport</p>
                        </div>
                        <div className="col-3 flighttTabContentCol3">
                            <p>02h 10m</p>
                            <p>Economy</p>
                        </div>
                        <div className="col-3 flighttTabContentCol4">
                            <p className="flighttTabContentCol2p1">New Delhi</p>
                            <h5>22:15</h5>
                            <p className="flighttTabContentCol2p2">Tue,July23</p>
                            <p className="flighttTabContentCol2p3">Indira Gandhi International Airport</p>
                        </div>

                    </div>
                </div>;
            case 'baggage':
                return <div>
                    <div className="row mt-4 mb-4 baggageTabRow">
                        <div className="col-12">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th scope="col">Airline</th>
                                        <th scope="col">Check-in Baggage</th>
                                        <th scope="col">Cabin Baggage</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Airline 1</td>
                                        <td>01 Bag of 15 kg</td>
                                        <td>7 kg</td>
                                    </tr>

                                </tbody>
                            </table>
                            <p>The baggage information is just for reference. Please Check with airline before check-in. For more information, visit Website.</p>
                        </div>
                    </div>

                </div>;
            case 'fare':
                return <div>
                    <div className="row mt-4 mb-4 fareTabRow">
                        <div className="col-12">
                            <table className="table fare-bordered-table">
                                <thead>
                                    <tr>
                                        <td scope="col">Traveller</td>
                                        <td scope="col" style={{ textAlign: 'end' }}>Base Fare</td>
                                        <td scope="col" style={{ textAlign: 'end' }}>Taxes</td>
                                        <td scope="col" style={{ textAlign: 'end' }}>Total Fare</td>

                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>1 Adult</td>
                                        <td style={{ textAlign: 'end' }}>₹3665</td>
                                        <td style={{ textAlign: 'end' }}>₹551</td>
                                        <td style={{ textAlign: 'end' }}>₹4216</td>
                                    </tr>
                                    <tr>
                                        <td style={{ fontWeight: 'bold' }}>Total</td>
                                        <td></td>
                                        <td></td>
                                        <td style={{ textAlign: 'end' }}>₹4216</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                    </div>
                </div>;
            case 'cancellation':
                return <div>
                    <div className="row cancellationTabRow">
                        <div className="col-12">
                            <div className="row">
                                <div className="col-6 cancellationtable">
                                    <h6>Cancellation Charges</h6>
                                    <table className="table fare-bordered-table">
                                        <thead>
                                            <tr>
                                                <td scope="col">Before 4 hours Departure</td>
                                                <td scope="col">As per airlines policy</td>

                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>Agency Fee</td>
                                                <td>₹500</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="col-6 cancellationtable">
                                    <h6>Reschedule Charges</h6>
                                    <table className="table fare-bordered-table">
                                        <thead>
                                            <tr>
                                                <td scope="col">Before 4 hours Departure</td>
                                                <td scope="col">As per airlines policy</td>

                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>Agency Fee</td>
                                                <td>₹500</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div>
                                <h6 style={{ fontWeight: 'bold' }}>Terms & Conditions</h6>
                                <ul>
                                    <li>
                                        The charges will be on per passenger per sector
                                    </li>
                                    <li>
                                        Rescheduling Charges = Rescheduling/Change Penalty + Fare Difference (if applicable)
                                    </li>
                                    <li>
                                        Partial cancellation is not allowed on the flight tickets which are book under special discounted fares
                                    </li>
                                    <li>
                                        In case, the customer have not cancelled the ticket within the stipulated time or no show then only statutory taxes are refundable from the respective airlines For infants there is no baggage allowance
                                    </li>
                                    <li>
                                        In certain situations of restricted cases, no amendments and cancellation is allowed
                                    </li>
                                    <li>
                                        Penalty from airlines needs to be reconfirmed before any cancellation or amendments
                                    </li>
                                    <li>
                                        Penalty changes in airline are indicative and can be changed without any prior notice
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>;
            default:
                return <div>Flight Information</div>;
        }
    }


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

            <section className="flightDetailssec">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-9">
                            <div className="fdetailspriceBox">
                                <p>You got the best price available!</p>
                                <div>
                                    <h6>Final Price</h6>
                                    <h5>₹630</h5>
                                </div>
                            </div>


                            <div className="row">
                                <div className="fligthReviewhed">
                                    <MdOutlineFlightTakeoff />
                                    <h5>Review Flight Details</h5>
                                </div>
                                <div className="col-12 ">
                                    <div className="fligthReviewBox">
                                        <div className="fligthReviewBoxHed">
                                            <div className="col-8 mt-3 fligthReviewBoxHedText">
                                                <MdOutlineFlightTakeoff />
                                                <h6>DEL - BOM</h6>
                                                <p>02h 10m</p>
                                            </div>
                                            <div className="col-4 fligthReviewBoxHedbttn">
                                                <button>Regular Deal</button>
                                            </div>
                                        </div>

                                        <div className="fligthReviewBoxHedMain">
                                            <div className="tabs">
                                                <button onClick={() => setActiveTabFlightDetails('flight')} className={activeTabFlightDetails === 'flight' ? 'active' : ''}>Flight</button>
                                                <button onClick={() => setActiveTabFlightDetails('baggage')} className={activeTabFlightDetails === 'baggage' ? 'active' : ''}>Baggage</button>
                                                <button onClick={() => setActiveTabFlightDetails('fare')} className={activeTabFlightDetails === 'fare' ? 'active' : ''}>Fare</button>
                                                <button onClick={() => setActiveTabFlightDetails('cancellation')} className={activeTabFlightDetails === 'cancellation' ? 'active' : ''}>Cancellation</button>
                                            </div>
                                            <div className="tab-content">
                                                {renderContent()}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="fligthReviewhed">
                                    <MdOutlineFlightTakeoff />
                                    <h5>Price Details</h5>
                                </div>
                                <div className="col-12">
                                    <div className="fligthPriceDetailsBox">
                                        <div className="fligthPriceDetailsBoxDiv1">
                                            <p>Base Fare</p>
                                            <p>0</p>
                                        </div>
                                        <div className="fligthPriceDetailsBoxDiv2">
                                            <p>Taxes</p>
                                            <p>0</p>
                                        </div>
                                        <hr></hr>
                                        <div className="fligthPriceDetailsBoxDiv3">
                                            <h6>Total Fare</h6>
                                            <p>₹0</p>
                                        </div>
                                        <div className="fligthPriceDetailsBoxDiv4">
                                            <h6>Insurance (All Traveller)</h6>
                                            <p>₹249</p>
                                        </div>
                                        <div className="fligthPriceDetailsBoxDiv5">
                                            <h6>Sub Total</h6>
                                            <p>₹249</p>
                                        </div>
                                        <div className="fligthPriceDetailsBoxDiv6">
                                            <h6>Coupon Applied</h6>
                                            <p>₹100 OFF</p>
                                        </div>
                                        <div className="fligthPriceDetailsBoxDiv7">
                                            <h5>You Pay</h5>
                                            <p>₹149</p>
                                        </div>
                                        <div className="fligthPriceDetailsBoxDiv8">
                                            <img src="/src/assets/images/Low-Price-Guarantee-Offer.gif" className="img-fluid" />
                                        </div>

                                    </div>

                                </div>
                            </div>

                            <div className="row">
                                <div className="fligthReviewhed">
                                    <MdOutlineFlightTakeoff />
                                    <h5>Contact Details</h5>
                                </div>
                                <div className="col-12">
                                   
                                </div>
                            </div>




                        </div>
                        <div className="col-3">

                        </div>
                    </div>
                </div>
            </section>

        </>
    )
}
