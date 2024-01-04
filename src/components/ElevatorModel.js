// ElevatorModel.js
import React, { useEffect, useState } from 'react';
import './ElevatorModel.css'; // Import the CSS file

const ElevatorModel = ({ totalFloors, currFloor, dockRequests }) => {
  const [floors, setFloors] = useState([]);

  useEffect(() => {
    // Generate the floors with elevator position, reversed order
    const generateFloors = () => {
      const newFloors = Array.from({ length: totalFloors + 1 }, (_, index) => {
        const isElevatorFloor = index === currFloor;
        const reversedIndex = totalFloors - index; // Reverse the order
        return { floorNumber: reversedIndex, isElevatorFloor };
      });
      setFloors(newFloors);
    };

    generateFloors();
  }, [totalFloors, currFloor]);

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
