import ElevatorCar, { ElevatorState } from "../ElevatorCar";
import { Direction } from "../../enums/Direction";
jest.useFakeTimers();

describe("ElevatorCar", () => {
  let elevatorCar: ElevatorCar;

  beforeEach(() => {
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

      const spyMoveFloor = jest.spyOn(elevatorCar, 'moveFloor');

      elevatorCar.updateState(customState);

      // When
      elevatorCar.wakeUpElevator();

      // Then
      expect(elevatorCar.direction).toBe(Direction.Up);

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
      expect(elevatorCar.dockRequests).toEqual([2]);
      expect(elevatorCar.upRequests).toEqual([1, 2, 3, 5, 6, 7, 8, 9, 10]);
      expect(elevatorCar.downRequests).toEqual([1, 2, 3, 5, 6, 7, 8, 9, 10]);
    
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
      expect(elevatorCar.dockRequests).toEqual([]);
      expect(elevatorCar.upRequests).toEqual([1, 2, 4, 5, 6, 7, 8, 9]);
      expect(elevatorCar.downRequests).toEqual([2, 4, 5, 6, 7, 8, 9, 10]);
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
      expect(elevatorCar.dockRequests).toEqual([]);
      expect(elevatorCar.upRequests).toEqual([1, 2, 3, 4, 5, 6, 8, 9, 10]);
      expect(elevatorCar.downRequests).toEqual([1, 2, 3, 4, 5, 6, 8, 9, 10]);
    
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
      expect(spyHandleNonDockRequests).toHaveBeenCalled();
      expect(spyChooseDirectionBasedOnClosestFloors).toHaveBeenCalled();

      expect(elevatorCar.dockRequests).toEqual([]); 
      expect(elevatorCar.upRequests).toEqual([0,1,2,3,4,6,7,8,9,10]); 
      expect(elevatorCar.downRequests).toEqual([0,1,2,3,4,6,7,8,9,10]); 
    
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
      expect(spyHandleNonDockRequests).toHaveBeenCalled();
      expect(spyChooseDirectionBasedOnClosestFloors).toHaveBeenCalled();


      expect(elevatorCar.dockRequests).toEqual([]); 
      expect(elevatorCar.upRequests).toEqual([]); 
      expect(elevatorCar.downRequests).toEqual([]); 
    
      expect(spyRemoveRequestsEqualToCurrFloor).toHaveBeenCalled();
      expect(spyMoveFloor).toHaveBeenCalled();
      expect(elevatorCar.direction).toBe(Direction.Down);
    });
  });


  describe("routeCheck", () => {
    test("there are dockRequests below: call move", () => {
      // Given
      const customState: Partial<ElevatorState> = {
        currFloor: 5,
        direction: Direction.Down,
        dockRequests: [1, 2, 3, 4],
      };

      elevatorCar.updateState(customState);
      const spyMoveFloor = jest.spyOn(elevatorCar, 'moveFloor');

      // When
      elevatorCar.routeCheck();

      // Then
      expect(spyMoveFloor).toHaveBeenCalled();
    });

    test("Direction is set to Down no dockRequests below currFloor: set direction to Up", () => {
      // Given
      const customState: Partial<ElevatorState> = {
        currFloor: 5,
        direction: Direction.Down,
        dockRequests: [6, 7, 8, 9, 10],
      };

      elevatorCar.updateState(customState);

      // When
      elevatorCar.routeCheck();

      // Then
      expect(elevatorCar.direction).toBe(Direction.Up);
    });

    test("Direction is set to Up no dockRequests above currFloor: set direction to Down", () => {
      // Given
      const customState: Partial<ElevatorState> = {
        currFloor: 5,
        direction: Direction.Up,
        dockRequests: [1, 3, 4, 2],
      };

      elevatorCar.updateState(customState);

      // When
      elevatorCar.routeCheck();

      // Then
      expect(elevatorCar.direction).toBe(Direction.Down);
    });

    test("No dockRequests, upRequests higher than currFloor: Direction should stay Up", () => {
      // Given
      const customState: Partial<ElevatorState> = {
        currFloor: 5,
        direction: Direction.Up,
        dockRequests: [],
        upRequests: [9],
        downRequests: [7,9,2,6,8,2,4]
      };

      elevatorCar.updateState(customState);

      // When
      elevatorCar.routeCheck();

      // Then
      expect(elevatorCar.direction).toBe(Direction.Up);
    });

    test("No dockRequests, downRequests lower than currFloor: Direction should stay Down", () => {
      // Given
      const customState: Partial<ElevatorState> = {
        currFloor: 5,
        direction: Direction.Down,
        dockRequests: [],
        upRequests: [7,9,2,6,8,2,4],
        downRequests: [4]
      };

      elevatorCar.updateState(customState);

      // When
      elevatorCar.routeCheck();

      // Then
      expect(elevatorCar.direction).toBe(Direction.Down);
    });

    test("Direction is down, downRequests lower than currFloor, dockRequests all higher than currFloor: Direction should stay Down", () => {
      // Given
      const customState: Partial<ElevatorState> = {
        currFloor: 5,
        direction: Direction.Down,
        dockRequests: [6,7,8,9],
        upRequests: [7,9,2,6,8,2,4],
        downRequests: [4]
      };

      elevatorCar.updateState(customState);

      // When
      elevatorCar.routeCheck();

      // Then
      expect(elevatorCar.direction).toBe(Direction.Down);
    });

    test("Direction is up, upRequests higher than currFloor, dockRequests all lower than currFloor: Direction should stay up", () => {
      // Given
      const customState: Partial<ElevatorState> = {
        currFloor: 5,
        direction: Direction.Up,
        dockRequests: [1,2,3,4],
        upRequests: [6],
        downRequests: [1,2,3,4,5,6,7,8,9,10]
      };

      elevatorCar.updateState(customState);

      // When
      elevatorCar.routeCheck();

      // Then
      expect(elevatorCar.direction).toBe(Direction.Up);
    });

    // test("there are no requests, currFloor > 0: Direction change to down, moveFloor invoked", () => {
    //   // Given
    //   const customState: Partial<ElevatorState> = {
    //     currFloor: 5,
    //     direction: Direction.Up,
    //     dockRequests: [],
    //     upRequests: [],
    //     downRequests: []
    //   };

    //   elevatorCar.updateState(customState);

    //   const spyMoveFloor = jest.spyOn(elevatorCar, 'moveFloor');


    //   // When
    //   elevatorCar.routeCheck();

    //   // Then
    //   expect(elevatorCar.direction).toBe(Direction.Down);
    //   expect(spyMoveFloor).toHaveBeenCalled();
    // });

    // test("there are no requests, currFloor === 0: Direction change to down, rest invoked", () => {
    //   // Given
    //   const customState: Partial<ElevatorState> = {
    //     currFloor: 0,
    //     direction: Direction.Up,
    //     dockRequests: [],
    //     upRequests: [],
    //     downRequests: []
    //   };

    //   elevatorCar.updateState(customState);

    //   const spyRest = jest.spyOn(elevatorCar, 'rest');


    //   // When
    //   elevatorCar.routeCheck();

    //   // Then
    //   expect(elevatorCar.direction).toBe(Direction.Down);
    //   expect(spyRest).toHaveBeenCalled();
    // });

});

// describe('rest', () => {
  // test("there are no requests: rest waits 10 seconds and then is invoked again", async () => {
  //   // Given
  //   const customState: Partial<ElevatorState> = {
  //     currFloor: 0,
  //     direction: Direction.Down,
  //     dockRequests: [],
  //     upRequests: [],
  //     downRequests: [],
  //     nap: true,
  //   };
  
  //   elevatorCar.updateState(customState);
  
  //   const spyRest = jest.spyOn(elevatorCar, 'rest');
  //   const spySetTimeout = jest.spyOn(global, 'setTimeout');
  
  //   // Mocking the waitForRequestsOrTimeout function to immediately resolve
  //   jest.spyOn(elevatorCar, 'waitForRequestsOrTimeout').mockResolvedValue();
  
  //   // When
  //   await elevatorCar.rest();
  
  //   // Then
  //   expect(spySetTimeout).toHaveBeenCalledWith(expect.any(Function), 10000);
  //   jest.advanceTimersByTime(10000); // Advance timers by 10 seconds
  //   await new Promise(resolve => process.nextTick(resolve)); // Allow promise resolution
  //   expect(spyRest).toHaveBeenCalledTimes(2); // Expect rest to be invoked again after 10 seconds
  // });


  
});

// });

