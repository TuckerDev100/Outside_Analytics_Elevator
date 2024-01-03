// ElevatorModel.js
import React from 'react';

const ElevatorModel = ({ totalFloors, currFloor, dockRequests }) => {
  // Convert dockRequests to an array if it's not already
  const dockRequestsArray = Array.isArray(dockRequests) ? dockRequests : dockRequests.split(',').map((floor) => parseInt(floor.trim(), 10));

  // Your ElevatorModel logic here using the props (totalFloors, currFloor, dockRequests)
  return (
    <div>
      <h2>Elevator Model</h2>
      <p>Total Floors: {totalFloors}</p>
      <p>Current Floor: {currFloor}</p>
      <p>Dock Requests: {dockRequestsArray.join(', ')}</p>
      {/* Add your rendering logic here */}
    </div>
  );
};

export default ElevatorModel;
