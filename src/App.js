import React, { useState, useEffect } from 'react';
import ElevatorCar from './components/ElevatorCar.ts';

function App() {
  const [elevatorConfig, setElevatorConfig] = useState({
    totalFloors: 0,
    currFloor: 0,
    dockRequests: [],
  });
  const [elevatorInstance, setElevatorInstance] = useState(null);

  const askForInput = (question, property) => {
    return new Promise((resolve) => {
      const userInput = prompt(question);
      resolve({ [property]: userInput });
    });
  };

  const promptForElevatorInfo = async () => {
    console.log('Please enter elevator information:');

    // Ask for totalFloors
    const totalFloorsInput = await askForInput('How many floors in the building?', 'totalFloors');

    // Ask for currFloor
    const currFloorInput = await askForInput('What floor is the elevator currently on?', 'currFloor');

    // Ask for dockRequests
    const dockRequestsInput = await askForInput('What floors need to be visited? (comma-separated)', 'dockRequests');

    // Map string input to integers

    const dockRequestsArray = dockRequestsInput.dockRequests.split(',').map((floor) => parseInt(floor.trim(), 10));

    // Create ElevatorCar instance when all inputs are collected
    const newElevatorInstance = new ElevatorCar({
      ...totalFloorsInput,
      ...currFloorInput,
      dockRequests: dockRequestsArray,
      emergencyStop: false,
      fireMode: false,
      doorStuck: false,
      maxWeight: 2500,
      currWeight: 0,
      travelTime: 0,
      floorsStoppedAt: [],
      direction: null,
      motion: 'awaiting',
      doorOpen: true,
      upRequests: [],
      downRequests: [],
      logDone: false,
      nap: false
    });

    // Set the instance to state
    setElevatorInstance(newElevatorInstance);

    // Invoke wakeUpElevator on the created instance
    newElevatorInstance.wakeUpElevator();
  };

  return (
    <div>
      <h1>Elevator Simulator</h1>
      <button onClick={promptForElevatorInfo}>Enter Elevator Information</button>
    </div>
  );
}

export default App;