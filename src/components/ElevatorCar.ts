import { Direction } from "src/enums/Direction";
import eventEmitter from './eventEmitter';
export interface ElevatorState {
  emergencyStop: boolean;
  fireMode: boolean;
  doorStuck: boolean;
  maxWeight: number;
  currWeight: number;
  travelTime: number;
  floorsStoppedAt: number[];
  totalFloors: number;
  direction: Direction;
  currFloor: number;
  doorOpen: boolean;
  dockRequests: number[];
  upRequests: number[];
  downRequests: number[];
  logDone: boolean;
  nap: boolean;
}

export default class ElevatorCar {

  travelTime!: number;
  floorsStoppedAt!: number[];

  totalFloors!: number;
  currFloor!: number;
  dockRequests!: number[];

  upRequests!: number[];
  downRequests!: number[];

  direction: Direction = Direction.None;
  
  doorOpen!: boolean;

  logDone!: boolean;
  nap!: boolean;

  emergencyStop!: boolean;
  fireMode!: boolean;
  doorStuck!: boolean;
  maxWeight!: number;
  currWeight!: number;



  constructor(state: ElevatorState) {
    this.updateState({
      emergencyStop: state.emergencyStop,
      fireMode: state.fireMode,
      doorStuck: state.doorStuck,
      maxWeight: state.maxWeight,
      currWeight: state.currWeight,
      travelTime: state.travelTime,
      floorsStoppedAt: state.floorsStoppedAt,
      totalFloors: state.totalFloors,
      direction: state.direction,
      currFloor: state.currFloor,
      doorOpen: state.doorOpen,
      dockRequests: state.dockRequests || [],
      upRequests: state.upRequests,
      downRequests: state.downRequests,
      logDone: state.logDone,
      nap: state.nap,
    });
  }

  updateState(newState: Partial<ElevatorState>): void {
    Object.assign(this, newState);
  }

  public logState(): void {
    const elevatorState: ElevatorState = {
      emergencyStop: this.emergencyStop,
      fireMode: this.fireMode,
      doorStuck: this.doorStuck,
      maxWeight: this.maxWeight,
      currWeight: this.currWeight,
      travelTime: this.travelTime,
      floorsStoppedAt: this.floorsStoppedAt,
      totalFloors: this.totalFloors,
      direction: this.direction,
      currFloor: this.currFloor,
      doorOpen: this.doorOpen,
      dockRequests: this.dockRequests,
      upRequests: this.upRequests,
      downRequests: this.downRequests,
      logDone: this.logDone,
      nap: this.nap,
    };

    console.log("Elevator State:", elevatorState);
  }


  wakeUpElevator(): void | null {
    if (!this.safetyCheck()) {
      return null;
    }

    this.removeRequestsEqualToCurrFloor();

    if (this.dockRequests.length > 0) {
      this.handleDockRequests();
    } else {
      this.handleNonDockRequests();
    }

    this.moveFloor();
  }

  private noRequestsBelow(): boolean {
    return (
      (this.direction === "down" && !this.dockRequests.some((floor) => floor < this.currFloor)) ||
      (this.direction === "up" && !this.downRequests.some((floor) => floor < this.currFloor))
    );
  }

  private noRequestsAbove(): boolean {
    return (
      (this.direction === "up" && !this.dockRequests.some((floor) => floor > this.currFloor)) ||
      (this.direction === "down" && !this.upRequests.some((floor) => floor > this.currFloor))
    );
  }

  handleDockRequests(): void { // THIS SETS DIRECTION, IT DOES NOT HANDLE DOCKING AND IS POORLY NAMED.
    const upDockRequests = this.countRequestsAbove(this.dockRequests);
    const downDockRequests = this.countRequestsBelow(this.dockRequests);

    this.direction = upDockRequests > downDockRequests
      ? Direction.Up
      : downDockRequests > upDockRequests
      ? Direction.Down
      : this.chooseDirectionBasedOnClosestFloors();
  }

  // MAYBE THESE TWO SHOULD BE COMBINED AND WEIGHTED TOGETHER? SHOULD THE PEOPLE IN THE ELEVATOR BE PRIORITIZED?
  // HERE I SAY YES. IN ANOTHER PART OF THE CODE I SAY NO. MAKE A DECISION.

  handleNonDockRequests(): void { // THIS SETS DIRECTION, IT DOES NOT HANDLE DOCKING AND IS POORLY NAMED.
    const totalUpRequests = this.countRequestsAbove(this.upRequests);
    const totalDownRequests = this.countRequestsBelow(this.downRequests);

    if (totalUpRequests === totalDownRequests) {
      this.direction = this.chooseDirectionBasedOnClosestFloors();
    } else {
      this.direction = totalUpRequests > totalDownRequests ? Direction.Up : Direction.Down;
    }
  }

  chooseDirectionBasedOnClosestFloors(): Direction { 
    const closestUpFloor = this.findClosestFloor(this.upRequests);
    const closestDownFloor = this.findClosestFloor(this.downRequests);

    if (this.upRequests.length === 0 && this.downRequests.length === 0) {
      return Direction.Down;
    }

    const closestUpDiff = Math.abs(closestUpFloor - this.currFloor);
    const closestDownDiff = Math.abs(closestDownFloor - this.currFloor);

    if (closestUpDiff < closestDownDiff) {
      return Direction.Up;
    } else if (closestDownDiff < closestUpDiff) {
      return Direction.Down;
    } else {
      return Direction.Down;
    }
  }

  private countRequestsAbove(requests: number[]): number {
    return requests.filter(floor => floor > this.currFloor).length;
  }

  private countRequestsBelow(requests: number[]): number {
    return requests.filter(floor => floor < this.currFloor).length;
  }

  private findClosestFloor(requests: number[]): number {
    return requests.length > 0 ? Math.min(...requests) : this.totalFloors;
  }

  removeRequestsEqualToCurrFloor(): void {
    this.dockRequests = this.dockRequests.filter(
      (floor) => floor !== this.currFloor
    );
    this.upRequests = this.upRequests.filter(
      (floor) => floor !== this.currFloor
    );
    this.downRequests = this.downRequests.filter(
      (floor) => floor !== this.currFloor
    );
  }

  routeCheck(): void | null {
    if (!this.safetyCheck()) {
      return null;
    }

    if (this.noRequests()) {
      this.logState();
      return null;
    }

    if (this.direction === Direction.Up && this.upRequests.some((floor) => floor > this.currFloor)) {
      this.direction = Direction.Up;
      this.moveFloor();
      this.logDone = false;
      return null;
    }

    if (this.direction === Direction.Down && this.downRequests.some((floor) => floor < this.currFloor)) {
      this.direction = Direction.Down;
      this.moveFloor();
      this.logDone = false;
      return null;
    }

    if (
      (this.direction === Direction.Down && this.dockRequests.some((floor) => floor < this.currFloor)) ||
      (this.direction === Direction.Up && this.dockRequests.some((floor) => floor > this.currFloor))
    ) {
      this.moveFloor();
      this.logDone = false;
      return null;
    }

    if (this.direction === Direction.Down && this.noRequestsBelow()) {
      this.direction = Direction.Up;
      this.moveFloor();
      this.logDone = false;
      return null;
    } else if (this.direction === Direction.Up && this.noRequestsAbove()) {
      this.direction = Direction.Down;
      this.moveFloor();
      this.logDone = false;
      return null;
    }

    if (this.noRequests()) {
      // this.rest(); // Was in the middle of implementing the rest() method
    }

    return null;
  }

  dock(): void {
    //NOTE - This is a little silly as is. Ideally, you would have a system or switch that would physically verify that the elevator has stopped,
    // another one to verify that the door has opened successfully, and another one to verify that the door has closed successfully before
    // moving the elevator. This is because it is VERY IMPORTANT to make sure the elevator doors are fully closed before moving it
    //TODO add a stop elevator method
    //TODO add a door opening method
    this.removeRequestsEqualToCurrFloor(); //TODO REDUNDANT?
    //TODO add a weight check method
    //TODO add a door closing method. if a person or thing blocks the elevator door, it should stop. 
    // This is the diff between putting your hand in the door being a friendly gesture hold the elevator and cutting your hand off.
  }
  
  //TODO BIG REFACTOR MOVE FLOOR HAPPENS FIRST AND ALREADY DOES A LOT OF THIS
  dockCheck(): void {
    let dockPerformed = false;

    const dockIfNeeded = (floor: number): void => {
      if (this.currFloor === floor) {
        dockPerformed = true;
        this.travelTime += 5; //REDUNDANT? TIME IS INCREMENTED IN MOVEFLOOR() MOVEFLOOR ALREADY REMOVES THIS FLOOR FROM DOCKREQUESTS. THIS WILL NEVER BE INVOKED.
        this.dock();
        this.floorsStoppedAt.push(this.currFloor); //ALSO REDUNDANT?? HAPPENING IN MOVEFLOOR WTF
      }
    };

    if (this.dockRequests.includes(this.currFloor)) { //ALSO REDUNDANT
      dockIfNeeded(this.currFloor);
    } else if (
      this.direction === Direction.Up && //SOME FORM OF THIS WILL BE USEFUL ONCE UP/DOWN REQUESTS ARE IMPLEMENTD.
      this.upRequests.includes(this.currFloor)
    ) {
      dockIfNeeded(this.currFloor);
    } else if (
      this.direction === Direction.Down &&
      this.downRequests.includes(this.currFloor)
    ) {
      dockIfNeeded(this.currFloor);
    }

  }
  // TODO IF DIRECTION IS UP AND THERE US A USER ON CURRFLOOR WANTING TO GO UP, THE ELEVATOR SHOULD ALSO STOP. 
  // I DON'T THINK THIS IS ACCOUNTED FOR, DOUBLE CHECK

  moveFloor(): void {
    const processFloor = async (floor: number, isDocking: boolean): Promise<void> => {
      console.log(`Processing floor ${floor}`);

      eventEmitter.emit('updateElevatorModel');
      console.log('event emit');
      const waitDuration = isDocking ? 5 : 1;
  
      this.currFloor = floor;
      this.travelTime += waitDuration;
  
      if (isDocking) {
        this.floorsStoppedAt.push(floor);
        this.removeRequestsEqualToCurrFloor();
        this.dockCheck();
      }
  
      await this.delay(waitDuration);
  
      if (!this.noRequests()) {
        const nextFloor = this.direction === Direction.Up ? floor + 1 : floor - 1;
        await processFloor(nextFloor, this.dockRequests.includes(nextFloor));
      } else if (isDocking && this.dockRequests.length > 0) {
        const nextDockFloor = this.dockRequests.shift()!;
        await processFloor(nextDockFloor, true);
      }    
    };
  
    // Start the floor movement
    processFloor(this.currFloor, this.dockRequests.includes(this.currFloor));
  }
  
  
  

// MAYBE REFACTOR TO ASYNC???
  private delay(seconds: number): Promise<void> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, seconds * 1000);
    });
  }
  

  rest(): void | null {
    if (this.currFloor === 0 && !this.nap && this.noRequests()) {
      if (!this.logDone) {
        this.logState();
        this.logDone = true;
      }

      this.nap = true;
    }

    if (this.noRequests()) {
      this.nap = false;
      this.logDone = false;
      this.direction = Direction.Down;
      this.routeCheck();
    }

    if (this.currFloor === 0 && this.noRequests()) {
      this.routeCheck();
    }
  }


  noRequests(): boolean {
    return (
      this.dockRequests.length === 0 &&
      this.upRequests.length === 0 &&
      this.downRequests.length === 0
    );
  }

  safetyCheck(): boolean {
    //NOTE ideally this should run asynchronously constantly and interrupt all other elevator functions at a moment's notice
    if (this.emergencyStop) {
      this.invokeEmergencyStop();
      return false;
    }

    if (this.fireMode) {
      this.fireStop();
      return false;
    }

    if (this.doorStuck) {
      this.doorCheck();
      return false;
    } else {
      return true;
    }
  }

  invokeEmergencyStop(): void {
    //NOTE - if someone hits the emergecy stop, the elevator should ignore all request logic and immediately stop the elevator at the nearest floor.
    //TODO -  Implement emergency stop
  }

  fireStop(): void {
    //NOTE - If the fire key is inserted, the elevator should ignore all other requests and go to the floor the fireman has requested
    //TODO -  Implement fire stop
  }

  weightStop(): void {
    //NOTE - if the weight is exceeded, if the elevator is stopped it should stay stopped and activate an alarm notification until the weight is acceptable
    //TODO -  Implement weight stop
  }

  doorCheck(): void {
    //NOTE - The door closing should be an operation. If the door begins to close but runs into something, it should reverse course.
    // if this happens a certain number of times it should activate an alarm
    //TODO -  Implement door check
  }
}
