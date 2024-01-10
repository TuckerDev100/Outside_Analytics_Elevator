// ElevatorForm.js
import React, { useState, useEffect, useRef } from 'react';
import './ElevatorForm.css';

const ElevatorForm = ({ onSubmit}) => {
  const totalFloorsRef = useRef(null);
  const currFloorRef = useRef(null);
  const dockRequestsRef = useRef(null);
  const submitButtonRef = useRef(null);

  const [totalFloors, setTotalFloors] = useState('');
  const [currFloor, setCurrFloor] = useState('');
  const [dockRequests, setDockRequests] = useState('');
  const [errorForTotalFloors, setErrorForTotalFloors] = useState('');
  const [errorForCurrFloor, setErrorForCurrFloor] = useState('');
  const [errorForDockRequests, setErrorForDockRequests] = useState('');
  const [isFormReady, setFormReady] = useState(false);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault();
      const target = e.target;

      // Perform validation based on the current target
      if (target === submitButtonRef.current) {
        validateDockRequests();
        if (!errorForDockRequests) {
          // If there are no errors in the third field, focus on the submit button
          setSubmitButtonFocus();
        }
      } else if (target === totalFloorsRef.current) {
        validateTotalFloors();
        if (errorForTotalFloors) {
          // If there are errors in the first field, focus on nothing
          return;
        }
        // If no errors in the first field, focus on the second field
        setCurrFloorFocus();
      } else if (target === currFloorRef.current) {
        validateCurrFloor();
        if (errorForCurrFloor) {
          // If there are errors in the second field, focus on nothing
          return;
        }
        // If no errors in the second field, focus on the third field
        setDockRequestsFocus();
      } else if (target === dockRequestsRef.current) {
        // If Tab is pressed in the third field, perform validation and handle focus accordingly
        setSubmitButtonFocus();
      }
    }
  };

  const setSubmitButtonFocus = () => {
    // Perform validation before shifting focus to the submit button
    validateDockRequests();

    // Check if there are no errors in the third field
    if (!errorForDockRequests) {
      // If there are no errors in the third field, focus on the submit button
      submitButtonRef.current.focus();
    } else {
      // If there are errors in the third field, focus on nothing and handle focus on other fields
      if (errorForTotalFloors) {
        totalFloorsRef.current.focus();
      } else if (errorForCurrFloor) {
        currFloorRef.current.focus();
      } else {
        setDockRequestsFocus();
      }
    }

    // Enable or disable the submit button based on overall form validity
    updateFormReady();
  };

  const handleBlur = (e) => {
    const target = e.target;
    if (target === totalFloorsRef.current && totalFloors) {
      validateTotalFloors();
    } else if (target === currFloorRef.current && currFloor) {
      validateCurrFloor();
    }
    // Additional onBlur checks for other fields can be added here
    else if (target === dockRequestsRef.current && dockRequests) {
      validateDockRequests();

      // Update form readiness after dock requests validation
      updateFormReady();
    }
  };

  const handleDockRequestsChange = (e) => {
    const inputValue = e.target.value;
    setDockRequests(inputValue);

    // Check for errors only when focus is moved away
    if (!dockRequestsRef.current.contains(document.activeElement)) {
      validateDockRequests();
    }
  };

  const validateDockRequests = () => {
    let dockRequestValues = dockRequests.split(',').map((floor) => floor.trim());

    // Check for a trailing comma and remove it
    if (dockRequestValues[dockRequestValues.length - 1] === '') {
      dockRequestValues = dockRequestValues.slice(0, -1);
    }

    const dockRequestErrors = [];

    for (const floor of dockRequestValues) {
      // Trim each floor value before validating
      const trimmedFloor = floor.trim();

      // Reject if the floor is not a positive integer or greater than totalFloors
      const parsedFloor = parseInt(trimmedFloor, 10);
      if (!/^\d+$/.test(trimmedFloor) || parsedFloor <= 0 || parsedFloor > parseInt(totalFloors, 10)) {
        dockRequestErrors.push(`${trimmedFloor} is not a valid floor`);
      }
    }

    setErrorForDockRequests(dockRequestErrors.join('; '));
    updateFormReady();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if the form is ready for submission
    if (isFormReady) {
      // Trim trailing comma from dockRequests
      const trimmedDockRequests = dockRequests.replace(/,\s*$/, '');

      // Your existing form submission logic here
      onSubmit({
        totalFloors: parseInt(totalFloors, 10),
        currFloor: parseInt(currFloor, 10),
        dockRequests: trimmedDockRequests.split(',').map((floor) => parseInt(floor.trim(), 10)),
      });
    }
  };

  const setTotalFloorsFocus = () => {
    totalFloorsRef.current.focus();
  };

  const setCurrFloorFocus = () => {
    currFloorRef.current.focus();
  };

  const setDockRequestsFocus = () => {
    dockRequestsRef.current.focus();
  };

  const validateTotalFloors = () => {
    const parsedTotalFloors = parseInt(totalFloors, 10);
    if (isNaN(parsedTotalFloors) || parsedTotalFloors <= 1) {
      setErrorForTotalFloors(parsedTotalFloors === 0 ? "That's not an elevator, that's just an expensive closet!" : 'Please enter a positive whole number for the total floors');
    } else if (parsedTotalFloors > 163) {
      setErrorForTotalFloors("The tallest building in the world is 163 stories. If you want taller, please inquire about our premium services!");
    } else {
      setErrorForTotalFloors('');
    }
    updateFormReady();
  };

  const validateCurrFloor = () => {
    const parsedCurrFloor = parseInt(currFloor, 10);
    if (isNaN(parsedCurrFloor) || parsedCurrFloor <= 0) {
      setErrorForCurrFloor(parsedCurrFloor <= 0 ? "Service for basements will be in an upcoming update. For now, only floors greater than zero are allowed!" : 'Please enter a positive whole number for the current floor');
    } else if (parsedCurrFloor > parseInt(totalFloors, 10)) { 
      setErrorForCurrFloor("The Elevator be above the roof, that is a safety hazard!");
    } else {
      setErrorForCurrFloor('');
    }
    updateFormReady();
  };

  const updateFormReady = () => {
    setFormReady(
      !errorForTotalFloors &&
      !errorForCurrFloor &&
      !errorForDockRequests &&
      totalFloors &&
      currFloor &&
      dockRequests
    );
  };

  useEffect(() => {
    // Set focus on the first input field when the component mounts
    setTotalFloorsFocus();
  }, []); // Empty dependency array ensures it only runs once on mount

  return (
    <form className="elevator-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <h5>Please enter initial elevator info</h5>
        <label>How many floors in the building?</label>
        <input
          type="text"
          value={totalFloors}
          onChange={(e) => setTotalFloors(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          ref={totalFloorsRef}
        />
        {errorForTotalFloors && <p className="error-message">{errorForTotalFloors}</p>}
      </div>

      <div className="form-group">
        <label>What floor is the elevator currently on?</label>
        <input
          type="text"
          value={currFloor}
          onChange={(e) => setCurrFloor(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          ref={currFloorRef}
        />
        {errorForCurrFloor && <p className="error-message">{errorForCurrFloor}</p>}
      </div>

      <div className="form-group">
        <label>As a comma-separated list, what floors need to be visited? Example(1,2,3)</label>
        <input
          type="text"
          value={dockRequests}
          onChange={handleDockRequestsChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          ref={dockRequestsRef}
        />
        {errorForDockRequests && <p className="error-message">{errorForDockRequests}</p>}
      </div>

      <button type="submit" ref={submitButtonRef} disabled={!isFormReady}>
        Submit
      </button>
    </form>
  );
};

export default ElevatorForm;
