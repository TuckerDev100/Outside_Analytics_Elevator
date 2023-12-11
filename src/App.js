import React, { useState, useEffect } from 'react';
import ElevatorCar from './components/ElevatorCar.ts';
import './App.css';

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

    const totalFloorsInput = await askForInput('How many floors in the building?', 'totalFloors');

    const currFloorInput = await askForInput('What floor is the elevator currently on?', 'currFloor');

    const dockRequestsInput = await askForInput('What floors need to be visited? (comma-separated)', 'dockRequests');

    
    const dockRequestsArray = dockRequestsInput.dockRequests.split(',').map((floor) => parseInt(floor.trim(), 10));

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

    setElevatorInstance(newElevatorInstance);

    newElevatorInstance.wakeUpElevator();
  };

  return (
    <div  className="centered-container">
      <h1>Elevator Simulator</h1>
      <button onClick={promptForElevatorInfo}>Enter Elevator Information</button>
      <p>Press F12 to see output</p>
    </div>
  );
}

export default App;