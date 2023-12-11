import ElevatorCar, { ElevatorState } from "../ElevatorCar";
import { Direction } from "../../enums/Direction";
jest.useFakeTimers(); // Enable fake timers

describe("ElevatorCar", () => {
  let elevatorCar: ElevatorCar;

  beforeEach(() => {
    // Default state for testing
    const defaultState: ElevatorState = {
      emergencyStop: false,
      fireMode: false,
      doorStuck: false,
      maxWeight: 0,
      currWeight: 0,
      travelTime: 0,
      floorsStoppedAt: [],
      totalFloors: 0,
      direction: Direction.Up,
      currFloor: 1,
      doorOpen: false,
      dockRequests: [],
      upRequests: [],
      downRequests: [],
      logDone: false,
      nap: false,
    };

    elevatorCar = new ElevatorCar(defaultState);
  });

  describe("wakeUpElevator", () => {
    test("all dockRequests above: set 'direction' field to 'up' and call routeCheck", () => {
      // Given
      const customState: Partial<ElevatorState> = {
        totalFloors: 10,
        currFloor: 0,
        dockRequests: [1, 2, 3],
        upRequests: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        downRequests: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      };

      // Spy on the routeCheck method
      const spyMoveFloor = jest.spyOn(elevatorCar, 'moveFloor');

      // Apply the custom state
      elevatorCar.updateState(customState);

      // When
      elevatorCar.wakeUpElevator();

      // Then
      // Check if 'direction' is set to 'up'
      expect(elevatorCar.direction).toBe(Direction.Up);

      // Check if routeCheck is called
      expect(spyMoveFloor).toHaveBeenCalled();
    });

    test("all dockRequests below: set 'direction' to 'down'", () => {
      // Given
      const customState: Partial<ElevatorState> = {
        totalFloors: 10,
        currFloor: 10,
        dockRequests: [1, 2, 3],
        upRequests: [1,2,3,4,5,6,7,8,9,10],
        downRequests: [1,2,3,4,5,6,7,8,9,10]
      };

      elevatorCar.updateState(customState);

      const spyMoveFloor = jest.spyOn(elevatorCar, 'moveFloor');

      // When
      elevatorCar.wakeUpElevator();

      // Then
      expect(elevatorCar.direction).toBe(Direction.Down);

      expect(spyMoveFloor).toHaveBeenCalled();
    });

    test("more dockRequests above: set 'direction' to 'up'", () => {
      // Given
      const customState: Partial<ElevatorState> = {
        totalFloors: 10,
        currFloor: 5,
        dockRequests: [3,6,7,2,9],
        upRequests: [1,2,3,4,5,6,7,8,9,10],
        downRequests: [1,2,3,4,5,6,7,8,9,10]
      };

      elevatorCar.updateState(customState);


      const spyMoveFloor = jest.spyOn(elevatorCar, 'moveFloor');

      // When
      elevatorCar.wakeUpElevator();

      // Then
      expect(elevatorCar.direction).toBe(Direction.Up);

      expect(spyMoveFloor).toHaveBeenCalled();
    });

    test("more dockRequests below: set 'direction' to 'down'", () => {
      // Given
      const customState: Partial<ElevatorState> = {
        totalFloors: 10,
        currFloor: 5,
        dockRequests: [9,7,2,4,3],
        upRequests: [1,2,3,4,5,6,7,8,9,10],
        downRequests: [1,2,3,4,5,6,7,8,9,10]
      };

      elevatorCar.updateState(customState);


      const spyMoveFloor = jest.spyOn(elevatorCar, 'moveFloor');
      const spyRemoveRequestsEqualToCurrFloor = jest.spyOn(elevatorCar, 'removeRequestsEqualToCurrFloor');


      // When
      elevatorCar.wakeUpElevator();

      // Then
      expect(elevatorCar.direction).toBe(Direction.Down);

      expect(spyMoveFloor).toHaveBeenCalled();
    });

    test("requests matching currFloor: removeRequestsEqualToCurrFloor removes them", () => {
      // Given
      const customState: Partial<ElevatorState> = {
        totalFloors: 10,
        currFloor: 4,
        dockRequests: [4, 2],
        upRequests: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        downRequests: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      };
    
      elevatorCar.updateState(customState);

      const spyMoveFloor = jest.spyOn(elevatorCar, 'moveFloor');
      const spyRemoveRequestsEqualToCurrFloor = jest.spyOn(elevatorCar, 'removeRequestsEqualToCurrFloor');
    
      // When
      elevatorCar.wakeUpElevator();
    
      // Then
      // Check if requests matching currFloor have been removed from their respective queues
      expect(elevatorCar.dockRequests).toEqual([2]); // Only remove the dockRequest matching currFloor
      expect(elevatorCar.upRequests).toEqual([1, 2, 3, 5, 6, 7, 8, 9, 10]); // Requests for floors above currFloor
      expect(elevatorCar.downRequests).toEqual([1, 2, 3, 5, 6, 7, 8, 9, 10]); // Requests for floors below currFloor
    
      // Ensure that routeCheck is called
      expect(spyRemoveRequestsEqualToCurrFloor).toHaveBeenCalled();
      expect(spyMoveFloor).toHaveBeenCalled();
      expect(elevatorCar.direction).toBe(Direction.Down);
    });

    test("no dockRequsts, more higher upRequests: 'direction' set to 'up'", () => {
      // Given
      const customState: Partial<ElevatorState> = {
        totalFloors: 10,
        currFloor: 3,
        dockRequests: [3],
        upRequests: [1, 2, 3, 4, 5, 6, 7, 8, 9],
        downRequests: [2, 3, 4, 5, 6, 7, 8, 9, 10],
      };
    
      elevatorCar.updateState(customState);

      const spyMoveFloor = jest.spyOn(elevatorCar, 'moveFloor');
      const spyRemoveRequestsEqualToCurrFloor = jest.spyOn(elevatorCar, 'removeRequestsEqualToCurrFloor');
    
      // When
      elevatorCar.wakeUpElevator();
    
      // Then
      // Check if requests matching currFloor have been removed from their respective queues
      expect(elevatorCar.dockRequests).toEqual([]); // Only remove the dockRequest matching currFloor
      expect(elevatorCar.upRequests).toEqual([1, 2, 4, 5, 6, 7, 8, 9]); // Requests for floors above currFloor
      expect(elevatorCar.downRequests).toEqual([2, 4, 5, 6, 7, 8, 9, 10]); // Requests for floors below currFloor
    
      // Ensure that routeCheck is called
      expect(spyRemoveRequestsEqualToCurrFloor).toHaveBeenCalled();
      expect(spyMoveFloor).toHaveBeenCalled();
      expect(elevatorCar.direction).toBe(Direction.Up);
    });

    test("no dockRequsts, more lower downRequests: 'direction' set to 'down'", () => {
      // Given
      const customState: Partial<ElevatorState> = {
        totalFloors: 10,
        currFloor: 7,
        dockRequests: [7],
        upRequests: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        downRequests: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      };
    
      elevatorCar.updateState(customState);

      const spyMoveFloor = jest.spyOn(elevatorCar, 'moveFloor');
      const spyRemoveRequestsEqualToCurrFloor = jest.spyOn(elevatorCar, 'removeRequestsEqualToCurrFloor');
    
      // When
      elevatorCar.wakeUpElevator();
    
      // Then
      // Check if requests matching currFloor have been removed from their respective queues
      expect(elevatorCar.dockRequests).toEqual([]); // Only remove the dockRequest matching currFloor
      expect(elevatorCar.upRequests).toEqual([1, 2, 3, 4, 5, 6, 8, 9, 10]); // Requests for floors above currFloor
      expect(elevatorCar.downRequests).toEqual([1, 2, 3, 4, 5, 6, 8, 9, 10]); // Requests for floors below currFloor
    
      // Ensure that routeCheck is called
      expect(spyRemoveRequestsEqualToCurrFloor).toHaveBeenCalled();
      expect(spyMoveFloor).toHaveBeenCalled();
      expect(elevatorCar.direction).toBe(Direction.Down);
    });

    test("no dockRequsts, equal up and down requests: 'direction' set to 'down'", () => {
      // Given
      const customState: Partial<ElevatorState> = {
        totalFloors: 10,
        currFloor: 5,
        dockRequests: [5],
        upRequests: [0,1,2,3,4,5,6,7,8,9,10],
        downRequests: [0,1,2,3,4,5,6,7,8,9,10],
      };
    
      elevatorCar.updateState(customState);
    
      const spyRemoveRequestsEqualToCurrFloor = jest.spyOn(elevatorCar, 'removeRequestsEqualToCurrFloor');
      const spyHandleNonDockRequests = jest.spyOn(elevatorCar, 'handleNonDockRequests');
      const spyChooseDirectionBasedOnClosestFloors = jest.spyOn(elevatorCar, 'chooseDirectionBasedOnClosestFloors');
      const spyMoveFloor = jest.spyOn(elevatorCar, 'moveFloor');
    
      // When
      elevatorCar.wakeUpElevator();
    
      // Then
      // Check if requests matching currFloor have been removed from their respective queues
      expect(spyHandleNonDockRequests).toHaveBeenCalled();
      expect(spyChooseDirectionBasedOnClosestFloors).toHaveBeenCalled();


      expect(elevatorCar.dockRequests).toEqual([]); 
      expect(elevatorCar.upRequests).toEqual([0,1,2,3,4,6,7,8,9,10]); 
      expect(elevatorCar.downRequests).toEqual([0,1,2,3,4,6,7,8,9,10]); 
    
      // Ensure that routeCheck is called
      expect(spyRemoveRequestsEqualToCurrFloor).toHaveBeenCalled();
      expect(spyMoveFloor).toHaveBeenCalled();
      expect(elevatorCar.direction).toBe(Direction.Down);
    });

    test("no requests: 'direction' set to 'down'", () => {
      // Given
      const customState: Partial<ElevatorState> = {
        totalFloors: 10,
        currFloor: 5,
        dockRequests: [5],
        upRequests: [],
        downRequests: [],
      };
    
      elevatorCar.updateState(customState);
    
      const spyRemoveRequestsEqualToCurrFloor = jest.spyOn(elevatorCar, 'removeRequestsEqualToCurrFloor');
      const spyHandleNonDockRequests = jest.spyOn(elevatorCar, 'handleNonDockRequests');
      const spyChooseDirectionBasedOnClosestFloors = jest.spyOn(elevatorCar, 'chooseDirectionBasedOnClosestFloors');
      const spyMoveFloor = jest.spyOn(elevatorCar, 'moveFloor');
    
      // When
      elevatorCar.wakeUpElevator();
    
      // Then
      // Check if requests matching currFloor have been removed from their respective queues
      expect(spyHandleNonDockRequests).toHaveBeenCalled();
      expect(spyChooseDirectionBasedOnClosestFloors).toHaveBeenCalled();


      expect(elevatorCar.dockRequests).toEqual([]); 
      expect(elevatorCar.upRequests).toEqual([]); 
      expect(elevatorCar.downRequests).toEqual([]); 
    
      // Ensure that routeCheck is called
      expect(spyRemoveRequestsEqualToCurrFloor).toHaveBeenCalled();
      expect(spyMoveFloor).toHaveBeenCalled();
      expect(elevatorCar.direction).toBe(Direction.Down);
    });
  });

  // Add more tests for other methods or scenarios
});