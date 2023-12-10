import ElevatorCar, { ElevatorState } from "../ElevatorCar";

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
      direction: "up",
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

  test("ElevatorCar is waking up", () => {
    // Customize state for this specific test
    const customState: Partial<ElevatorState> = {
      totalFloors: 10,
      currFloor: 0,
      dockRequests: [1, 2, 3],
    };

    // Apply the custom state
    elevatorCar.updateState(customState);

    // Your test logic here
    const spyConsoleLog = jest.spyOn(console, "log");
    elevatorCar.wakeUpElevator();

    // Add your assertions here based on the expected behavior
    expect(spyConsoleLog).toHaveBeenCalledWith("Elevator is waking up");
    // Add more assertions as needed for the expected state or behavior
  });


  // more tests
});
