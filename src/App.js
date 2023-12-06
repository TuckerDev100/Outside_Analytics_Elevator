import React, { useState, useEffect } from 'react';
import ElevatorCar, { ElevatorState } from './components/ElevatorCar.ts';

function App() {
  const [elevatorConfig, setElevatorConfig] = useState<ElevatorState | null>(null);
  const elevatorRef = React.useRef<ElevatorCar | null>(null);

  useEffect(() => {
    if (elevatorConfig) {
      // If elevatorConfig is set, create a new instance of ElevatorCar
      elevatorRef.current = new ElevatorCar(elevatorConfig);
      // Start the elevator logic
      elevatorRef.current.wakeUpElevator();
    }
  }, [elevatorConfig]);

  const handleScannerInput = () => {
    // Ask for elevator parameters
    const totalFloors = parseInt(prompt('Enter total floors:', '10'), 10);
    const currFloor = parseInt(prompt('Enter current floor:', '0'), 10);
    // Add prompts for other elevator parameters

    // Set elevator configuration
    setElevatorConfig({
      totalFloors,
      currFloor,
      // Set other values accordingly
    });
  };

  const runElevator = () => {
    if (!elevatorConfig) {
      // If elevatorConfig is not set, ask for parameters first
      handleScannerInput();
    }
    // No else block here; the elevatorConfig will trigger useEffect when it changes.
  };

  return (
    <div>
      <h1>Elevator Simulator</h1>
      <button onClick={handleScannerInput}>Input Elevator Parameters</button>
      <button onClick={runElevator}>Run Elevator</button>

      {/* Conditionally render components that depend on elevatorConfig */}
      {elevatorConfig && (
        <div>
          {/* Add your components here */}
        </div>
      )}
    </div>
  );
}

export default App;