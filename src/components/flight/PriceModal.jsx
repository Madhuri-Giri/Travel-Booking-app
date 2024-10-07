/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { calculateWaitingTime, extractTime } from '../../Custom Js function/CustomFunction';
import { LuTimerReset } from 'react-icons/lu';

const PriceModal = ({ isModalOpen, closeModal, OfferPriceData, listingData }) => {
  const [activeTab, setActiveTab] = useState('flight');
  console.log('OfferPriceDataaaaa', OfferPriceData);

  // Use fareValue if available, otherwise fall back to OfferPriceData directly.
  const fareDetails = OfferPriceData.fareValue || OfferPriceData;
  const logoUrl = OfferPriceData?.logoUrl;
  const waitingTime = calculateWaitingTime("15:45", "20:55");

  // function for date convert into day month date--------------------------------------
  const formatDate = (dateString) => {
    if (dateString) {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', weekday: 'short' }).format(date);
    }
  };

  // func for duration convert hour minute---------------------
  const convertMinutesToHoursAndMinutes = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  // func for converting UTC to IST---------------------
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

  const renderTabContent = () => {
    switch (activeTab) {
      case 'flight':
        return (
          <div>
            <section className="flight-pricemodal-container">
              {
                // Use segments from either fareValue or OfferPriceData directly
                OfferPriceData?.segments[0].map((valueSegments, index) => {
                  return (
                    <React.Fragment key={index}>
                      <div className="row flightSegmentsData">
                        <div className="col-md-2 col-12 flighttTabContentCol1 flightSegmentsAirlines">
                          <p>
                            <img src={logoUrl} className="img-fluid" alt="" />
                          </p>
                          <p>{valueSegments.Airline.AirlineName}</p>
                          <p>{valueSegments.Airline.AirlineCode} - {valueSegments.Airline.FlightNumber}</p>
                        </div>
                        <div className="col-md-4 col-3 flighttTabContentCol2 fmodalcol2">
                          <div>
                            <p className="flighttTabContentCol2p1">
                              {valueSegments.Origin.CityName} ({valueSegments.Origin.CityCode})
                            </p>
                            <h5>{convertUTCToIST(valueSegments.DepTime)}</h5>
                            <p className="flighttTabContentCol2p2">{formatDate(valueSegments.DepTime)}</p>
                            <p className="flighttTabContentCol2p3">{valueSegments.Origin.AirportName}</p>
                          </div>
                        </div>
                        <div className="col-md-2 col-3 flighttTabContentCol3 fmodalcol3">
                          <p className="flighttTabContentCol3p1">
                            <span className=""><LuTimerReset /></span>
                            {convertMinutesToHoursAndMinutes(valueSegments.Duration)}
                          </p>
                          <p className="flighttTabContentCol3p2">cabin class</p>
                        </div>
                        <div className="col-md-4 col-4 flighttTabContentCol4 fmodalcol4">
                          <div>
                            <p className="flighttTabContentCol2p1">
                              {valueSegments.Destination.CityName} ({valueSegments.Destination.CityCode})
                            </p>
                            <h5>{convertUTCToIST(valueSegments.ArrTime)}</h5>
                            <p className="flighttTabContentCol2p2">{formatDate(valueSegments.ArrTime)}</p>
                            <p className="flighttTabContentCol2p3">{valueSegments.Destination.AirportName}</p>
                          </div>
                        </div>
                      </div>

                      {/* Conditionally render the "change Plane" message with dynamic city */}
                      {index < OfferPriceData?.segments[0].length - 1 && (
                        <div className="changePlaneDivMOdel">
                          <p>
                            Change Plane in
                            <span className="ms-1">
                              {valueSegments.Destination.CityName} ({valueSegments.Destination.CityCode})
                            </span>
                          </p>
                        </div>
                      )}
                    </React.Fragment>
                  );
                })
              }
            </section>
          </div>
        );
      case 'fare':
        return (
          <div>
            <table className="table table-bordered flightfaretab">
              <thead>
                <tr>
                  <th>Base Fare</th>
                  <th>Tax</th>
                  <th>Total Fare</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>₹ {fareDetails.Fare.BaseFare}</td>
                  <td>₹ {fareDetails.Fare.Tax}</td>
                  <td>₹ {fareDetails.Fare.PublishedFare}</td>
                </tr>
                <tr>
                  <td colSpan="2" style={{ textAlign: 'left' }}><strong>Total</strong></td>
                  <td><strong>₹ {fareDetails.Fare.PublishedFare}</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        );
      case 'baggage':
        return (
          <div>
            <div className="row flightBaggagee">
              <div className="col-12">
                <table className="table flightmodalbaggagetable">
                  <thead>
                    <tr>
                      <th scope="col">Airline</th>
                      <th scope="col">Check-in Baggage</th>
                      <th scope="col">Cabin Baggage</th>
                    </tr>
                  </thead>
                  {
                    fareDetails.FareSegments.map((valueSegments, index) => (
                      <tbody key={index}>
                        <tr>
                          <td>{valueSegments.AirlineCode} {valueSegments.FlightNumber}</td>
                          <td>{valueSegments.Baggage}</td>
                          <td>{valueSegments.CabinBaggage}</td>
                        </tr>
                      </tbody>
                    ))
                  }
                </table>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      show={isModalOpen}
      onHide={() => closeModal()}
      size="lg"
      centered
      className="fligthListModal"
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title>Flight and Fare Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="tabs flightPriceTabs">
          <button onClick={() => setActiveTab('flight')} className={activeTab === 'flight' ? 'active' : ''}>
            Flight Details
          </button>
          <button onClick={() => setActiveTab('fare')} className={activeTab === 'fare' ? 'active' : ''}>
            Fare Summary
          </button>
          <button onClick={() => setActiveTab('baggage')} className={activeTab === 'baggage' ? 'active' : ''}>
            Baggage
          </button>
        </div>
        <div className="tab-content">
          {renderTabContent()}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default PriceModal;
