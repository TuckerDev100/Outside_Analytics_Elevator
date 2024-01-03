// CarDisplay.js
import React, { useEffect, useState } from 'react';

const CarDisplay = ({ elevatorInstance }) => {
  const [floorsStoppedAt, setFloorsStoppedAt] = useState([]);
  const [travelTime, setTravelTime] = useState(0);
  const [currFloor, setCurrFloor] = useState(0); // Add state for current floor

  useEffect(() => {
    const updateDisplay = () => {
      setFloorsStoppedAt([...elevatorInstance.floorsStoppedAt]);
      setTravelTime(elevatorInstance.travelTime);
      setCurrFloor(elevatorInstance.currFloor); // Update current floor
    };

    updateDisplay();

    // Listen for changes in the elevatorInstance state
    const intervalId = setInterval(updateDisplay, 500); // Adjust the interval as needed

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [elevatorInstance]);

  return (
    <div>
      <h2>Car Display</h2>
      <p>Current Floor: {currFloor}</p>
      <p>Floors Stopped At: {floorsStoppedAt.join(', ')}</p>
      <p>Travel Time: {travelTime} seconds</p>
    </div>
  );
};

export default CarDisplay;
