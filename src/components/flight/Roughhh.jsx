<div className="f-lists">
<div className="flight-content">
    {dd && dd.length > 0 ? (
        dd.map((flightSegments, index) => {
            const sortedFlights = sortFlights([...flightSegments]);
            return sortedFlights.map((flight, segmentIndex) => {
                return flight?.Segments?.[0].map((option, index) => {
                    const airlineCode = option.Airline.AirlineCode;
                    const logoUrl = logos[airlineCode] || ''; // Get logo URL from local storage
                    return (
                        <div className="row" key={`${index}-${segmentIndex}`}>
                            <div className="pricebtnsmobil">
                                <p>₹{flight?.OfferedFare || "Unknown Airline"}</p>
                                <button onClick={() => handleSelectSeat(flight)}>SELECT</button>
                            </div>
                            <p className='regulrdeal'><span>Regular Deal</span></p>
                            <p className="f-listAirlinesNameMOB">{option.Airline.AirlineName}</p><br />

                            <div className="col-2 col-sm-3 f-listCol1">
                                <div className="f-listAirlines">
                                    <img src={logoUrl} className="img-fluid" alt={`${option.Airline.AirlineName} Logo`} />
                                    <p className="f-listAirlinesNameWEb">{option.Airline.AirlineName}</p><br />
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
                                <div>
                                    <button onClick={() => handleSelectSeat(flight)}>SELECT</button>
                                </div>
                            </div>
                        </div>
                    );
                });
            });
        })
    ) : (
        <p>No flights available.</p>
    )}
</div>
</div>


