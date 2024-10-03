import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addBoardingPoint } from '../../redux-toolkit/bus/boardingSlice'; // Update the path if necessary
import './BoardAndDrop.css';

const BoardAndDrop = () => {
  const dispatch = useDispatch();
  const { boardingPoints, loading, error } = useSelector((state) => state.boarding);
  const traceId = useSelector((state) => state.bus.traceId);
  const selectedBusIndex = useSelector((state) => state.busSelection.selectedBusIndex);

  const [selectedBoardingPoint, setSelectedBoardingPoint] = useState('');
  const [selectedDroppingPoint, setSelectedDroppingPoint] = useState('');

  useEffect(() => {
    // console.log('Current traceId:', traceId);
    // console.log('Current resultIndex:', selectedBusIndex);
  
    if (traceId && selectedBusIndex) {
      dispatch(addBoardingPoint({ traceId, selectedBusIndex }));
    }
  }, [traceId, selectedBusIndex, dispatch]);
  

  const handleBoardingSelect = (point) => {
    setSelectedBoardingPoint(point.CityPointName);
    // console.log('Selected Boarding Point:', point);
  };

  const handleDroppingSelect = (point) => {
    setSelectedDroppingPoint(point.CityPointName);
    // console.log('Selected Dropping Point:', point);
  };

  return (
    <div className="bording">
      <div className="container">
        <div className="row">
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-danger">Error: {error}</p>
          ) : (
            <>
              <div className="select col-12">
                <select
                  id="boarding-select"
                  className="form-select"
                  value={selectedBoardingPoint}
                  onChange={(e) =>
                    handleBoardingSelect(
                      boardingPoints.find((point) => point.CityPointName === e.target.value)
                    )
                  }
                >
                  <option value="" disabled>
                    Select Boarding Point
                  </option>
                  {boardingPoints.map((point) => (
                    <option key={point.CityPointIndex} value={point.CityPointName}>
                      {point.CityPointName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="select col-12">
                <select
                  id="dropping-select"
                  className="form-select"
                  value={selectedDroppingPoint}
                  onChange={(e) =>
                    handleDroppingSelect(
                      boardingPoints.find((point) => point.CityPointName === e.target.value)
                    )
                  }
                >
                  <option value="" disabled>
                    Select Dropping Point
                  </option>
                  {boardingPoints.map((point) => (
                    <option key={point.CityPointIndex} value={point.CityPointName}>
                      {point.CityPointName}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BoardAndDrop;
