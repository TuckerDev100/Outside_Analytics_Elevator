interface ElevatorState {
  emergencyStop: boolean;
  fireMode: boolean;
  doorStuck: boolean;
  maxWeight: number;
  currWeight: number;
  travelTime: number;
  floorsStoppedAt: number[];
  totalFloors: number;
  direction: string;
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
  direction!: string;
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
      dockRequests: state.dockRequests,
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
    this.emergencyStop = newState.emergencyStop ?? this.emergencyStop;
    this.fireMode = newState.fireMode ?? this.fireMode;
    this.doorStuck = newState.doorStuck ?? this.doorStuck;
    this.maxWeight = newState.maxWeight ?? this.maxWeight;
    this.currWeight = newState.currWeight ?? this.currWeight;
    this.travelTime = newState.travelTime ?? this.travelTime;
    this.floorsStoppedAt = newState.floorsStoppedAt ?? this.floorsStoppedAt;
    this.totalFloors = newState.totalFloors ?? this.totalFloors;
    this.direction = newState.direction ?? this.direction;
    this.currFloor = newState.currFloor ?? this.currFloor;
    this.doorOpen = newState.doorOpen ?? this.doorOpen;
    this.dockRequests = newState.dockRequests ?? this.dockRequests;
    this.upRequests = newState.upRequests ?? this.upRequests;
    this.downRequests = newState.downRequests ?? this.downRequests;
    this.logDone = newState.logDone ?? this.logDone;
  }

  wakeUpElevator(): void | null {
    console.log("Elevator is waking up");
    if (this.safetyCheck()) {
      if (this.dockRequests.length > 0) {
        const upDockRequests = this.dockRequests.filter(
          (floor) => floor > this.currFloor
        ).length;
        const downDockRequests = this.dockRequests.filter(
          (floor) => floor < this.currFloor
        ).length;

        if (upDockRequests > downDockRequests) {
          this.direction = "up";
        } else if (downDockRequests > upDockRequests) {
          this.direction = "down";
        } else {
          this.direction = "down";
        }
        console.log(`Initial Direction: ${this.direction}`);
        this.routeCheck();
      } else {
        const totalUpRequests = this.upRequests.filter(
          (floor) => floor > this.currFloor
        ).length;
        const totalDownRequests = this.downRequests.filter(
          (floor) => floor < this.currFloor
        ).length;

        if (totalDownRequests > totalUpRequests) {
          this.direction = "down";
        } else if (totalUpRequests > totalDownRequests) {
          this.direction = "up";
        } else {
          this.direction = "down";
        }
        console.log(`Initial Direction: ${this.direction}`);
        this.routeCheck();
      }
    } else {
      return null;
    }
  }


  routeCheck(): void | null {
    if (!this.safetyCheck()) {
      return null;
    }

    if (
      (this.direction === "down" &&
        this.dockRequests.some((floor) => floor < this.currFloor)) ||
      (this.direction === "up" &&
        this.dockRequests.some((floor) => floor > this.currFloor))
    ) {
      this.moveFloor();
      return;
    }

    if (
      this.direction === "down" &&
      !this.dockRequests.some((floor) => floor < this.currFloor) &&
      (this.currFloor === 0 ||
        this.downRequests.length === 0 ||
        !this.downRequests.some((floor) => floor < this.currFloor))
    ) {
      this.direction = "up";
    } else if (
      this.direction === "up" &&
      (this.currFloor === this.totalFloors ||
        !this.upRequests.some((floor) => floor > this.currFloor))
    ) {
      this.direction = "down";
    }

    if (
      this.dockRequests.length === 0 &&
      this.upRequests.length === 0 &&
      this.downRequests.length === 0
    ) {
      if (this.currFloor > 0) {
        this.direction = "down";
        this.moveFloor();
      } else {
        this.rest();
      }
    }
  }


  dock(): void {
    // Check if there are any requests for the current floor in dockRequests, upRequests, or downRequests
    const dockIndex = this.dockRequests.indexOf(this.currFloor);
    if (dockIndex !== -1) {
      this.dockRequests.splice(dockIndex, 1);
    }

    const stopRequests = [...this.upRequests, ...this.downRequests].filter(
      (floor) => floor === this.currFloor
    );
    stopRequests.forEach((floor) => {
      const upIndex = this.upRequests.indexOf(floor);
      if (upIndex !== -1) {
        this.upRequests.splice(upIndex, 1);
      }
      const downIndex = this.downRequests.indexOf(floor);
      if (downIndex !== -1) {
        this.downRequests.splice(downIndex, 1);
      }
    });
  }


  dockCheck(): void {
    //ARE WE REMOVING FROM REQUEST QUEUES????
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
      // Move up one floor if not already at the top floor
      this.currFloor++;
    } else if (this.direction === "down" && this.currFloor > 0) {
      // Move down one floor if not already at the ground floor
      this.currFloor--;
    }

    setTimeout(() => {
      this.dockCheck();
    }, 0);
  }


  async rest(): Promise<void> {
    console.log("rest invoked");

    if (this.currFloor === 0 && !this.nap) {
      console.log("logState called");
      this.logState();
      this.nap = true; // Set nap to true to prevent further logState calls until new requests arrive
    }

    await this.waitForRequestsOrTimeout();

    if (
      this.dockRequests.length > 0 ||
      this.upRequests.length > 0 ||
      this.downRequests.length > 0
    ) {
      // Reset nap when there are new requests
      this.nap = false;
    }

    if (this.currFloor === 0) {
      this.routeCheck();
    }
  }


  async waitForRequestsOrTimeout(): Promise<void> {
    const delayInSeconds = 5;
    const startTime = new Date().getTime();

    while (new Date().getTime() - startTime < delayInSeconds * 1000) {
      if (
        this.dockRequests.length > 0 ||
        this.upRequests.length > 0 ||
        this.downRequests.length > 0
      ) {
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, 100)); // Adjust the delay as needed
    }

    this.routeCheck();
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


