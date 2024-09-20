 {/* Tab Content */}
                {/* MobileSitting lower seats logic ------------ START */}
                {activeTab === 'lower' && seatType === 'Sitting' && (
                  <div className="lower sittingSeat  Mobil">
                    <div className="sit">
                      <div className="bus-layout">
                        {lowerSeatsBus.map((seatObject, seatIndex) => {
                          const seatName = seatObject?.SeatName || null;

                          // Gender-based filtering
                          const isMaleSeat = seatObject.IsMalesSeat;
                          const isFemaleSeat = seatObject.IsLadiesSeat;
                          const isSeatStatus = seatObject.SeatStatus; // Seat availability status

                          const isGenderAllowed =
                            gender === '' || // Show all if no gender selected
                            (gender === 'Male' && isMaleSeat) || // Show Male seats
                            (gender === 'Female' && isFemaleSeat); // Show Female seats

                          // Check if seatName exists and gender is allowed
                          if (!seatName || !isGenderAllowed) {
                            return (
                              <div
                                className="sit-img disabled"
                                style={{
                                  backgroundColor: 'transparent',
                                  pointerEvents: 'none',
                                  position: 'relative',
                                }}
                                key={`empty-${seatIndex}`}
                              >
                                <div className="seat-image-container">
                                  <img width={25} src={BusSeatImg} alt="disabled seat" />
                                  <div className="seat-details">
                                    <span>Seat Unavailable</span>
                                  </div>
                                </div>
                              </div>
                            );
                          }

                          // Determine if the seat should be disabled
                          const isSelected = selectedSeats.includes(seatName);
                          const basePrice = getLowerBasePrice(seatName);
                          const isDisabled = basePrice === null || !isSeatStatus; // Disable if price is null or seat is unavailable

                          return (
                            <div
                              onClick={!isDisabled ? () => handleSeatSelect(seatName) : undefined}
                              style={{
                                backgroundColor: isDisabled
                                  ? 'transparent'
                                  : isSelected
                                    ? '#ccc'
                                    : 'transparent',
                                pointerEvents: isDisabled ? 'none' : 'auto',
                                position: 'relative',
                              }}
                              className={`sit-img ${seatObject.isLastRow
                                ? 'last-row'
                                : seatIndex % 4 === 2
                                  ? 'aisle'
                                  : ''
                                } ${isDisabled ? 'disabled' : ''}`}
                              key={seatName}
                            >
                              <div className="seat-image-container">
                                <img width={25} src={BusSeatImg} alt="seat" />
                                <div className="seat-details">
                                  <span>Seat No {seatName} </span>
                                  <p>
                                    <span>, Fare :</span> ₹{basePrice !== null ? Math.round(basePrice) : 'N/A'}
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
                {/* MobileSitting lower seats logic ------------ END */}

                {/* MobileSleeper lower seats logic ------------ START */}
                {activeTab === 'lower' && seatType === 'Sleeper' && (
                  <div className="lower sleeperSeat">
                    <div className="sit">
                      {lowerSeatNames.map((seatName) => {
                        const seatObject = lowerSeatsBus.find(seat => seat.SeatName === seatName);
                        if (!seatObject) return null;

                        const isSelected = selectedSeats.includes(seatName);
                        const basePrice = getLowerBasePrice(seatName);
                        const isDisabled = basePrice === null;

                        return (
                          <div
                            onClick={!isDisabled ? () => handleSeatSelect(seatName) : undefined}
                            style={{
                              backgroundColor: isSelected ? '#ccc' : isDisabled ? '#f0f0f0' : 'transparent',
                              pointerEvents: isDisabled ? 'none' : 'auto',
                              position: 'relative',
                            }}
                            className={`sit-img ${seatObject.isLastRow ? 'last-row' : seatObject.seatIndex % 4 === 2 ? 'aisle' : ''} ${isDisabled ? 'disabled' : ''}`}
                            key={seatName}
                          >
                            <div className="seat-image-container">
                              <img width={25} src={BusSeatImgSleeper} alt="seat" />
                              <div className="seat-details">
                                <span>Seat No {seatName}  </span>
                                <p> <span> , Fare :</span> ₹{basePrice !== null ? `${Math.round(basePrice)}` : 'N/A'}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                {/* MobileSleeper lower seats logic ------------ END */}


                {/* MobileSitting upper seats logic ------------ START */}
                {activeTab === 'upper' && seatType === 'Sitting' && (
                  <div className="upper sittingSeat Mobil">
                    <div className="sit">
                      <div className="bus-upperlayout">
                        {upperSeatsBus.map((seatObject, seatIndex) => {
                          const seatName = seatObject?.SeatName || null;

                          // Gender-based filtering
                          const isMaleSeat = seatObject.IsMalesSeat;
                          const isFemaleSeat = seatObject.IsLadiesSeat;
                          const isSeatStatus = seatObject.SeatStatus; // Seat availability status

                          const isGenderAllowed =
                            gender === '' || // Show all if no gender selected
                            (gender === 'Male' && isMaleSeat) || // Show Male seats
                            (gender === 'Female' && isFemaleSeat); // Show Female seats

                          // If seatName is unavailable or gender-based filter doesn't match, display a disabled seat
                          if (!seatName || !isGenderAllowed) {
                            return (
                              <div
                                className="sit-img disabled"
                                style={{
                                  backgroundColor: 'transparent',
                                  pointerEvents: 'none',
                                  position: 'relative',
                                }}
                                key={`empty-${seatIndex}`}
                              >
                                <div className="seat-image-container">
                                  <img width={40} src={BusSeatImgSleeper} alt="disabled seat" />
                                  <div className="seat-details">
                                    <span>Seat Unavailable</span>
                                  </div>
                                </div>
                              </div>
                            );
                          }

                          // Determine if the seat should be disabled
                          const isSelected = selectedSeats.includes(seatName);
                          const basePrice = getUpperBasePrice(seatName);
                          const isDisabled = basePrice === null || !isSeatStatus; // Disable seat if price is null or seat status is false

                          // Check if the seat should be vertical
                          const isVerticalSeat = ['', ''].includes(seatName);

                          return (
                            <div
                              onClick={!isDisabled ? () => handleSeatSelect(seatName) : undefined}
                              style={{
                                backgroundColor: isDisabled
                                  ? 'transparent'
                                  : isSelected
                                    ? '#ccc'
                                    : 'transparent',
                                pointerEvents: isDisabled ? 'none' : 'auto',
                                position: 'relative',
                              }}
                              className={`sit-img ${seatObject.isLastRow
                                ? 'last-row'
                                : seatIndex % 4 === 2
                                  ? 'aisle'
                                  : ''
                                } ${isDisabled ? 'disabled' : ''}`}
                              key={seatName}
                            >
                              <div className="seat-image-container">
                                <img
                                  width={40}
                                  src={BusSeatImgSleeper}
                                  alt="seat"
                                  style={{
                                    transform: isVerticalSeat ? 'rotate(90deg)' : 'none',
                                  }}
                                  className={isVerticalSeat ? 'vertical-seat' : 'horizontal-seat'}
                                />
                                <div className="seat-details">
                                  <span>Seat No {seatName}</span>
                                  <p>
                                    <span>, Fare :</span> ₹{basePrice !== null ? `${Math.round(basePrice)}` : 'N/A'}
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
                {/* MobileSitting upper seats logic ------------ END */}

                {/* MobileSleeper upper seats logic ------------ START */}
                {activeTab === 'upper' && seatType === 'Sleeper' && (
                  <div className="upper sleeperSeat">
                    <div className="sit">
                      {upperSeatNames.map((seatName) => {
                        const seatObject = upperSeatsBus.find(seat => seat.SeatName === seatName);
                        if (!seatObject) return null;

                        const isSelected = selectedSeats.includes(seatName);
                        const basePrice = getUpperBasePrice(seatName);
                        const isDisabled = basePrice === null;

                        return (
                          <div
                            onClick={!isDisabled ? () => handleSeatSelect(seatName) : undefined}
                            style={{
                              backgroundColor: isSelected ? '#ccc' : isDisabled ? '#f0f0f0' : 'transparent',
                              pointerEvents: isDisabled ? 'none' : 'auto',
                              position: 'relative',
                            }}
                            className={`sit-img ${seatObject.isLastRow ? 'last-row' : seatObject.seatIndex % 4 === 2 ? 'aisle' : ''} ${isDisabled ? 'disabled' : ''}`}
                            key={seatName}
                          >
                            <div className="seat-image-container">
                              <img width={25} src={BusSeatImgSleeper} alt="seat" />
                              <div className="seat-details">
                                <span>Seat No {seatName}  </span>
                                <p> <span> , Fare :</span> ₹{basePrice !== null ? `${Math.round(basePrice)}` : 'N/A'}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                {/* MobileSleeper upper seats logic ------------ END */}