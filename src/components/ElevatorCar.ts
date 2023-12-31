import { Direction } from "src/enums/Direction";

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
  emergencyStop!: boolean;
  fireMode!: boolean;
  doorStuck!: boolean;
  maxWeight!: number;
  currWeight!: number;

  travelTime!: number;
  floorsStoppedAt!: number[];

  totalFloors!: number;
  direction: Direction = Direction.None;
  currFloor!: number;
  doorOpen!: boolean;
  dockRequests!: number[];
  upRequests!: number[];
  downRequests!: number[];
  logDone!: boolean;
  nap!: boolean;

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

  updateState(newState: Partial<ElevatorState>): void {
    Object.assign(this, newState);
}

  wakeUpElevator(): void | null {
    console.log("Elevator is waking up");
  
    if (!this.safetyCheck()) {
      return null;
    }
  
    this.removeRequestsEqualToCurrFloor();

    console.log(`UP REQUESTS: ${this.upRequests}, DOWN REQUESTS: ${this.downRequests}`);

  
    if (this.dockRequests.length > 0) {
      this.handleDockRequests();
    } else {
      this.handleNonDockRequests();
    }
  
    console.log(`Initial Direction: ${this.direction}`);
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

private noUpAndDownRequests(): boolean {
    const totalUpRequests = this.upRequests.filter((floor) => floor > this.currFloor).length;
    const totalDownRequests = this.downRequests.filter((floor) => floor < this.currFloor).length;

    return totalUpRequests === 0 && totalDownRequests === 0;
}
  
handleDockRequests(): void {
  const upDockRequests = this.countRequestsAbove(this.dockRequests);
  const downDockRequests = this.countRequestsBelow(this.dockRequests);

  console.log(`upDockRequests: ${upDockRequests}, downDockRequests: ${downDockRequests}`);

  this.direction = upDockRequests > downDockRequests
    ? Direction.Up
    : downDockRequests > upDockRequests
      ? Direction.Down
      : this.chooseDirectionBasedOnClosestFloors();
}

handleNonDockRequests(): void {
  const totalUpRequests = this.countRequestsAbove(this.upRequests);
  const totalDownRequests = this.countRequestsBelow(this.downRequests);

  console.log(`totalUpRequests: ${totalUpRequests}, totalDownRequests: ${totalDownRequests}`);

  if (totalUpRequests === totalDownRequests) {
    this.direction = this.chooseDirectionBasedOnClosestFloors();
  } else {
    this.direction = totalUpRequests > totalDownRequests ? Direction.Up : Direction.Down;
  }
}

chooseDirectionBasedOnClosestFloors(): Direction {
  console.log("Choosing direction based on closest floors...");

  const closestUpFloor = this.findClosestFloor(this.upRequests);
  const closestDownFloor = this.findClosestFloor(this.downRequests);

  console.log(`closestUpFloor: ${closestUpFloor}, closestDownFloor: ${closestDownFloor}`);

  if (this.upRequests.length === 0 && this.downRequests.length === 0) {
    return Direction.Down;
  }

  const closestUpDiff = Math.abs(closestUpFloor - this.currFloor);
  const closestDownDiff = Math.abs(closestDownFloor - this.currFloor);

  console.log(`closestUpDiff: ${closestUpDiff}, closestDownDiff: ${closestDownDiff}`);

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

  async routeCheck(): Promise<void | null> { // Adjust return type
    if (!this.safetyCheck()) {
      return null;
    }

    if (this.noRequests()) {
      this.logState(); // Call logState when noRequests is true
      return null; // Return null to match the type
    }

    if (this.direction === Direction.Up && this.upRequests.some((floor) => floor > this.currFloor)) {
      console.log("Changing direction to Down");
      this.direction = Direction.Up;
      this.moveFloor();
      this.logDone = false; 
      return null;
    }

    if (this.direction === Direction.Down && this.downRequests.some((floor) => floor < this.currFloor)) {
      console.log("Changing direction to Up");
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
      console.log("Changing direction to Up");
      this.direction = Direction.Up;
      this.moveFloor();
      this.logDone = false; 
      return null;
    } else if (this.direction === Direction.Up && this.noRequestsAbove()) {
      console.log("Changing direction to Down");
      this.direction = Direction.Down;
      this.moveFloor();
      this.logDone = false; 
      return null;
    }

    if (this.noRequests()) {
      // this.rest(); // Comment out the rest() method
    }

    return null; // Add a return statement to match the type
  }


  dock(): void {
    //TODO add a stop elevator method
    //TODO add a door opening method
    this.removeRequestsEqualToCurrFloor();
    //TODO add a weight check method
    //TODO add a door closing method
  }

  dockCheck(): void {
    let dockPerformed = false;

    const dockIfNeeded = (floor: number): void => {
      if (this.currFloor === floor) {
        dockPerformed = true;
        this.travelTime += 5;
        console.log(`docking at floor: ${this.currFloor}`);
        this.dock();
        this.floorsStoppedAt.push(this.currFloor);
      }
    };

    if (this.dockRequests.includes(this.currFloor)) {
      dockIfNeeded(this.currFloor);
    } else if (
      this.direction === "up" &&
      this.upRequests.includes(this.currFloor)
    ) {
      dockIfNeeded(this.currFloor);
    } else if (
      this.direction === "down" &&
      this.downRequests.includes(this.currFloor)
    ) {
      dockIfNeeded(this.currFloor);
    }

    if (!dockPerformed) {
      this.travelTime += 1;
    }

    setTimeout(() => {
      this.routeCheck();
    }, 0);
  }

  moveFloor(): void {
    if (this.logDone && this.currFloor > 0) {
      this.currFloor--;
    } else if (this.direction === "up" && this.currFloor < this.totalFloors) {
      this.currFloor++;
    } else if (this.direction === "down" && this.currFloor > 0) {
      this.currFloor--;
    }

    setTimeout(() => {
      this.dockCheck();
    }, 0);
  }

  async rest(): Promise<void> {
    if (this.currFloor === 0 && !this.nap && this.noRequests()) {
      if (!this.logDone) {
        this.logState();
        this.logDone = true;
      }

      this.nap = true;
    }

    await this.waitForRequestsOrTimeout();

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

  async waitForRequestsOrTimeout(): Promise<void> {
    const delayInSeconds = 10;
    const startTime = new Date().getTime();

    while (new Date().getTime() - startTime < delayInSeconds * 1000) {
      if (this.noRequests()) {
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, 100)); 
    }

    this.routeCheck();
  }


  noRequests(): boolean {
    return (
      this.dockRequests.length === 0 &&
      this.upRequests.length === 0 &&
      this.downRequests.length === 0
    );
  }


  safetyCheck(): boolean {
    if (this.emergencyStop) {
      this.invokeEmergencyStop();
      console.log(`EMERGENCY STOP`);
      return false;
    }

    if (this.fireMode) {
      this.fireStop();
      console.log(`FIRE MODE ACTIVATED`);
      return false;
    }

    if (this.doorStuck) {
      this.doorCheck();
      console.log(`DOOR CHECK FAILED`);
      return false;
    } else {
      return true;
    }
  }

  invokeEmergencyStop(): void {
    // Implement emergency stop
  }

  fireStop(): void {
    // Implement fire stop
  }

  weightStop(): void {
    // Implement weight stop
  }

  doorCheck(): void {
    // Implement door check
  }
}
