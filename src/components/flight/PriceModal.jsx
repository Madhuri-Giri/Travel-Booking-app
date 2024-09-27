/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';

const PriceModal = ({ isModalOpen, closeModal, OfferPriceData , logoUrl}) => {
  const [activeTab, setActiveTab] = useState('flight');


  const renderTabContent = () => {
    switch (activeTab) {
      case 'flight':
        return <div>
          <section className="">
            {
              OfferPriceData?.FareSegments.map((valueSegments, index) => {

                return (
                  <>
                    <div className="row flightSegmentsData">
                      <div className='flightSegmentsDataHED'> 
                      <p>
                      {valueSegments.FromAirportCode} - {valueSegments.ToAirportCode}
                      </p>

                      </div>
                      <div className="col-md-2 col-2 flighttTabContentCol1">
                        <p>
                        {/* <img src={logoUrl} className="img-fluid" alt="" /> */}
                        </p>
                        <p>{valueSegments.AirlineName}</p>
                        <p>{valueSegments.AirlineCode} - {valueSegments.FlightNumber}</p>
                      </div>
                      <div className="col-md-4 col-3 flighttTabContentCol2">
                        <div>
                          <p className="flighttTabContentCol2p1">{valueSegments.FromCity} ({valueSegments.FromAirportCode})</p>
                          {/* <h5>{convertUTCToIST(valueSegments.DepTime)}</h5> */}
                          {/* <p className="flighttTabContentCol2p2">{formatDate(valueSegments.DepTime)}</p> */}
                          {/* <p className="flighttTabContentCol2p3">{valueSegments.Origin.AirportName}</p> */}
                        </div>
                      </div>
                      <div className="col-md-2 col-3 flighttTabContentCol3">
                        {/* <p className="flighttTabContentCol3p1">{convertMinutesToHoursAndMinutes(valueSegments.Duration)}</p> */}
                        <p className="flighttTabContentCol3p2 flightlistatbborder">
                          <div></div>

                        </p>
                      </div>
                      <div className="col-md-4 col-4 flighttTabContentCol4">
                        <div>
                          <p className="flighttTabContentCol2p1">{valueSegments.ToCity} ({valueSegments.ToAirportCode})</p>
                          {/* <h5>{convertUTCToIST(valueSegments.ArrTime)}</h5> */}
                          {/* <p className="flighttTabContentCol2p2">{formatDate(valueSegments.ArrTime)}</p> */}
                          {/* <p className="flighttTabContentCol2p3">{valueSegments.Destination.AirportName}</p> */}
                        </div>
                      </div>
                    </div>
                    <hr></hr>
                  </>
                )
              })
            }
          </section>

        </div>;
      case 'fare':
        return (
          <div>
            <table className="table table-bordered flightfaretab">
              <thead>
                <tr>
                  <th>Base Fare</th>
                  <th>Head Tax</th>
                  <th>Total Fare</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>₹ {OfferPriceData?.Fare.BaseFare}</td>
                  <td>₹ {OfferPriceData?.Fare.Tax}</td>
                  <td>₹ {OfferPriceData?.Fare.BaseFare + OfferPriceData?.Fare.Tax} </td>
                </tr>
              </tbody>

            </table>
          </div>
        );

      case 'baggage':
        return <div>
          <>
            <div className="row flightBaggagee">
              <div className="col-12">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">Airline</th>
                      <th scope="col">Check-in Baggage</th>
                      <th scope="col">Cabin Baggage</th>
                    </tr>
                  </thead>
                  {
                    OfferPriceData?.FareSegments.map((valueSegments, index) => {
                      return (
                        <>
                          <tbody>
                            <tr>
                              <td>{valueSegments.AirlineCode} {valueSegments.FlightNumber} </td>
                              <td>{valueSegments.Baggage}</td>
                              <td>{valueSegments.CabinBaggage}</td>
                            </tr>
                          </tbody>
                        </>
                      )
                    })
                  }
                </table>
              </div>
            </div>
          </>



        </div>;
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
        <Modal.Title>Fligth and Fare Details</Modal.Title>
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
