import React, { useState, useEffect } from 'react';
import ElevatorCar from './components/ElevatorCar.ts';

function App() {
  const [elevatorConfig, setElevatorConfig] = useState({
    totalFloors: 0,
    currFloor: 0,
    dockRequests: [],
  });
  const [elevatorInstance, setElevatorInstance] = useState(null);

  useEffect(() => {
    console.log('Component re-rendered');
    if (elevatorInstance) {
      console.log('Elevator instance created:', elevatorInstance);
      // You can perform additional actions with the created instance if needed
    }
  }, [elevatorInstance]);

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
    setElevatorConfig((prevConfig) => ({ ...prevConfig, ...totalFloorsInput }));
  
    // Ask for currFloor
    const currFloorInput = await askForInput('What floor is the elevator currently on?', 'currFloor');
    setElevatorConfig((prevConfig) => ({ ...prevConfig, ...currFloorInput }));
  
    // Ask for dockRequests
    const dockRequestsInput = await askForInput('What floors need to be visited? (comma-separated)', 'dockRequests');
    const dockRequestsArray = dockRequestsInput.dockRequests.split(',').map((floor) => parseInt(floor.trim(), 10));
    setElevatorConfig((prevConfig) => ({ ...prevConfig, dockRequests: dockRequestsArray }));
  
    // Create ElevatorCar instance when all inputs are collected
    setElevatorConfig((prevConfig) => {
      const newElevatorInstance = new ElevatorCar({
        ...prevConfig,
        emergencyStop: false,
        fireMode: false,
        doorStuck: false,
        maxWeight: 2500,
        currWeight: 0,
        travelTime: 0,
        floorsStoppedAt: [],
        direction: null,
        motion: 'waiting',
        doorOpen: true,
        upRequests: [],
        downRequests: [],
      });
  
      // Set the instance to state
      setElevatorInstance(newElevatorInstance);
  
      // Invoke wakeUpElevator on the created instance
      newElevatorInstance.wakeUpElevator();
  
      return prevConfig;
    });
  };
  


  return (
    <div>
      <h1>Elevator Simulator</h1>
      <button onClick={promptForElevatorInfo}>Enter Elevator Information</button>
    </div>
  );
}

export default App;