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
  motion: string;
  currFloor: number;
  doorOpen: boolean;
  dockRequests: number[];
  upRequests: number[];
  downRequests: number[];
}
 export default class ElevatorCar {
  private emergencyStop: boolean;
  private fireMode: boolean;
  private doorStuck: boolean;
  private maxWeight: number;
  private currWeight: number;

  private travelTime: number;
  private floorsStoppedAt: number[];

  private totalFloors: number;
  private direction: string;
  private motion: string;
  private currFloor: number;
  private doorOpen: boolean;
  private dockRequests: number[];
  private upRequests: number[];
  private downRequests: number[];

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
      motion: state.motion,
      currFloor: state.currFloor,
      doorOpen: state.doorOpen,
      dockRequests: state.dockRequests,
      upRequests: state.upRequests,
      downRequests: state.downRequests,
    });
  }



private updateState(newState: Partial<ElevatorState>): void {
  // Update the elevator state properties
  this.emergencyStop = newState.emergencyStop ?? this.emergencyStop;
  this.fireMode = newState.fireMode ?? this.fireMode;
  this.doorStuck = newState.doorStuck ?? this.doorStuck;
  this.maxWeight = newState.maxWeight ?? this.maxWeight;
  this.currWeight = newState.currWeight ?? this.currWeight;
  this.travelTime = newState.travelTime ?? this.travelTime;
  this.floorsStoppedAt = newState.floorsStoppedAt ?? this.floorsStoppedAt;
  this.totalFloors = newState.totalFloors ?? this.totalFloors;
  this.direction = newState.direction ?? this.direction;
  this.motion = newState.motion ?? this.motion;
  this.currFloor = newState.currFloor ?? this.currFloor;
  this.doorOpen = newState.doorOpen ?? this.doorOpen;
  this.dockRequests = newState.dockRequests ?? this.dockRequests;
  this.upRequests = newState.upRequests ?? this.upRequests;
  this.downRequests = newState.downRequests ?? this.downRequests;

}

  private sleep(seconds: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
  }

  private wakeUpElevator(): void | null  {
    console.log("Elevator is waking up")
    if (this.safetyCheck()) {
      if (this.dockRequests.length > 0) {
        const upDockRequests = this.dockRequests.filter(floor => floor > this.currFloor).length;
        const downDockRequests = this.dockRequests.filter(floor => floor < this.currFloor).length;
  
        if (upDockRequests > downDockRequests) {
          this.direction = 'up';
        } else if (downDockRequests > upDockRequests) {
          this.direction = 'down';
        } else {
          this.direction = 'down'; // Assuming 'down' when equal
        }
        console.log(`Direction: ${this.direction}`);
        this.dockCheck();
      } else {
        const totalUpRequests = this.upRequests.filter(floor => floor > this.currFloor).length;
        const totalDownRequests = this.downRequests.filter(floor => floor < this.currFloor).length;
  
        if (totalDownRequests > totalUpRequests) {
          this.direction = 'down';
        } else if (totalUpRequests > totalDownRequests) {
          this.direction = 'up';
        } else {
          this.direction = 'down'; // Assuming 'down' when equal
        }
        console.log(`Direction: ${this.direction}`);
        this.dockCheck();
      }
    } else {
      return null;
    }
  }

  private routeCheck(): void | null {
    if (!this.safetyCheck()) {
      return null;
    }

    this.motion = 'awaiting';
  
    if (
      (this.direction === 'down' && this.dockRequests.some((floor) => floor < this.currFloor)) ||
      (this.direction === 'up' && this.dockRequests.some((floor) => floor > this.currFloor))
    ) {
      this.moveFloor();
      return;
    }
  
    if (this.direction === 'down' && (!this.dockRequests.some((floor) => floor < this.currFloor) && (this.currFloor === 0 || this.downRequests.length === 0 || !this.downRequests.some((floor) => floor < this.currFloor)))) {
      console.log(`setting direction to up`);

      this.direction = 'up';
    } else if (this.direction === 'up' && (this.currFloor === this.totalFloors || !this.upRequests.some((floor) => floor > this.currFloor))) {
      console.log(`setting direction to down`);

      this.direction = 'down';
    }
  
    if (this.dockRequests.length === 0 && this.upRequests.length === 0 && this.downRequests.length === 0) {
      console.log(`setting motion to rest`);

      this.motion = 'rest';
    } 
  }

  //TODO on rest() write the results to a log file and clear the travelTime and floorsVisited



  private async dock(): Promise<void> {
    // TODO: Add to floors stopped at
    this.floorsStoppedAt.push(this.currFloor); // Add the current floor to the list of stopped floors
  
    this.motion = 'stop';
    this.doorOpen = true;
  
    if (this.motion === 'stop') {
      // Remove the current floor from dockRequests if it is present
      const dockIndex = this.dockRequests.indexOf(this.currFloor);
      if (dockIndex !== -1) {
        this.dockRequests.splice(dockIndex, 1);
      }
  
      // Rest of the dock logic remains unchanged
      const stopRequests = [...this.upRequests, ...this.downRequests].filter((floor) => floor === this.currFloor);
      stopRequests.forEach((floor) => {
        const index = this.upRequests.indexOf(floor);
        if (index !== -1) {
          this.upRequests.splice(index, 1);
        }
        const downIndex = this.downRequests.indexOf(floor);
        if (downIndex !== -1) {
          this.downRequests.splice(downIndex, 1);
        }
      });
  
      console.log('Opening doors');
  
      // Assuming a 3-second delay
      await this.sleep(3);
  
      console.log('Closing doors');
      this.doorOpen = false;
    }
  }

  private dockCheck(): void {
    let dockPerformed = false;
  
    if (this.currFloor === this.dockRequests.find((floor) => floor === this.currFloor)) {
      dockPerformed = true;
      this.travelTime += 5;
      (async () => {
        console.log(`docking at floor: ${this.currFloor}`);
        await this.dock();
      })();
    } else if (this.direction === 'up' && this.upRequests.includes(this.currFloor)) {
      dockPerformed = true;
      this.travelTime += 5;
      (async () => {
        console.log(`docking at floor: ${this.currFloor}`);
        await this.dock();
      })();
    } else if (this.direction === 'down' && this.downRequests.includes(this.currFloor)) {
      dockPerformed = true;
      this.travelTime += 5;
      (async () => {
        console.log(`docking at floor: ${this.currFloor}`);
        await this.dock();
      })();
    }
  
    if (!dockPerformed) {
      console.log(`passing floor: ${this.currFloor}`);
      this.travelTime += 1; // Increment by 1 when dock() is not performed
    }
  
    this.sleep(1).then(() => {
      this.routeCheck();
      this.moveFloor();
    });
  }

  private moveFloor(): void {
    if (this.motion === 'awaiting') {
      this.motion = 'moving';
    }
  
    if (this.motion === 'rest') {
      console.log(`no requests to service, assuming rest position`);
      if (this.currFloor > 0) {
        // Move down one floor if not already at the ground floor
        this.currFloor--;
        this.direction = 'down';
      } else {
        // Handle the case when motion is 'rest' and currFloor is already at zero
        this.motion = 'rest';
        return;
      }
    } else {
      // Handle the cases when motion is 'moving' or 'awaiting'
      if (this.direction === 'up' && this.currFloor < this.totalFloors) {
        console.log(`going up`);
        // Move up one floor if not already at the top floor
        this.currFloor++;
      } else if (this.direction === 'down' && this.currFloor > 0) {
        console.log(`going down`);
        // Move down one floor if not already at the ground floor
        this.currFloor--;
      }
    }
  
    this.dockCheck();
  }



  private rest(): void {
    console.log('ElevatorCar Object:', this); 
    const invokeDockCheck = () => {
      this.dockCheck();
      if (this.motion === 'rest') {
        setTimeout(invokeDockCheck, 5000); // Invoke dockCheck every 5 seconds if motion is still 'rest'
      }
    };
    invokeDockCheck(); // Start the recursive invocation
  }

  private safetyCheck(): boolean {
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
    }

    else {
      console.log(`safety check passed`);
      return true;
    }

    // Other safety checks can be added here
  }

  private invokeEmergencyStop(): void {
    // Implement emergency stop
  }

  private fireStop(): void {
    // Implement fire stop
  }

  private weightStop(): void {
    // Implement weight stop
  }

  private doorCheck(): void {
    // Implement door check
  }

}

