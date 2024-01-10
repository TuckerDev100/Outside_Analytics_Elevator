// ElevatorSelect.js
import React, { useEffect, useState } from 'react';
import './ElevatorSelect.css';
import eventEmitter from './eventEmitter';

const ElevatorSelect = ({ elevatorInstance }) => {
  const { totalFloors, dockRequests } = elevatorInstance;
  const [floorsData, setFloorsData] = useState([]);

  const generateFloorsData = () => {
    const newFloorsData = Array.from({ length: totalFloors }, (_, index) => {
      const floorNumber = totalFloors - index;
      const isInDockRequests = dockRequests.includes(floorNumber);
      return { floorNumber, isInDockRequests };
    });
    setFloorsData(newFloorsData);
  };

  useEffect(() => {
    // Subscribe to changes and update when triggered
    const updateDockRequests = () => {
      generateFloorsData();
    };
    eventEmitter.on('updateDockRequests', updateDockRequests);

    // Cleanup the event listener when the component unmounts
    return () => {
      eventEmitter.off('updateDockRequests', updateDockRequests);
    };
  }, [dockRequests]);

  useEffect(() => {
    // Initial render
    generateFloorsData();
  }, [totalFloors, dockRequests]); // Run only when totalFloors or dockRequests changes

  return (
    <div>
      <h2>Elevator Select</h2>
      <div className="elevator-select-container elevator-select-scrollable">
        {floorsData.map((floorData) => (
          <div
            key={floorData.floorNumber}
            className={`floor-circle ${floorData.isInDockRequests ? 'yellow' : 'white'}`}
          >
            {floorData.floorNumber}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ElevatorSelect;