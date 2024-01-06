import React, { useEffect, useState } from 'react';
import './ElevatorModel.css';
import eventEmitter from './eventEmitter';

const ElevatorModel = ({ elevatorInstance }) => {
  const { totalFloors, currFloor } = elevatorInstance;
  const [floors, setFloors] = useState([]);

  const generateFloors = () => {
    console.log('generateFloors invoked');
    const newFloors = Array.from({ length: totalFloors + 1 }, (_, index) => {
      const isElevatorFloor = index === totalFloors - currFloor;
      const reversedIndex = totalFloors - index;
      return { floorNumber: reversedIndex, isElevatorFloor };
    });
    setFloors(newFloors);
  };

  useEffect(() => {
    // Subscribe to changes and update when triggered
    const updateElevatorModel = () => {
      console.log('updateElevatorModel event received');
      generateFloors();
    };
    eventEmitter.on('updateElevatorModel', updateElevatorModel);

    // Cleanup the event listener when the component unmounts
    return () => {
      eventEmitter.off('updateElevatorModel', updateElevatorModel);
    };
  }, [totalFloors, currFloor]);

  useEffect(() => {
    // Initial render
    generateFloors();
  }, [totalFloors, currFloor]); // Run only when totalFloors or currFloor changes

  return (
    <div>
      <h2>Elevator Model</h2>
      <div className="elevator-model-container">
        <div className="elevator-model">
          {floors.map((floor) => (
            <div key={floor.floorNumber} className="floor">
              <span className="floor-number">{floor.floorNumber}</span>
              <span style={{ whiteSpace: 'pre' }}>{floor.isElevatorFloor ? '| X |' : '|   |'}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ElevatorModel;
