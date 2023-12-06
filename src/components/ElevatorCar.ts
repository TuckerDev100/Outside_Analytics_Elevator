interface ElevatorState {
  emergencyStop?: boolean;
  fireMode?: boolean;
  doorStuck?: boolean;
  maxWeight?: number;
  currWeight?: number;
  travelTime?: number;
  floorsStoppedAt?: number[];
  totalFloors?: number;
  direction?: string;
  motion?: string;
  currFloor?: number;
  doorOpen?: boolean;
  dockRequests?: number[];
  upRequests?: number[];
  downRequests?: number[];
}

class ElevatorCar {
  private emergencyStop: boolean = false;
  private fireMode: boolean = false;
  private doorStuck: boolean = false;
  private maxWeight: number = 2500;
  private currWeight: number = 0;

  private travelTime: number = 0;
  private floorsStoppedAt: number[] = [];

  private totalFloors: number;
  private direction: string = 'rest';
  private motion: string = 'idle';
  private currFloor: number = 0;
  private doorOpen: boolean = false;
  private dockRequests: number[] = [];
  private upRequests: number[] = [];
  private downRequests: number[] = [];

  constructor({
    totalFloors = 10,
    dockRequests = [],
    upRequests = [],
    downRequests = [],
    currFloor = 0,
  }: {
    totalFloors?: number;
    dockRequests?: number[];
    upRequests?: number[];
    downRequests?: number[];
    currFloor?: number;
  } = {}) {
    this.totalFloors = totalFloors;
    this.dockRequests = dockRequests;
    this.upRequests = upRequests;
    this.downRequests = downRequests;
    this.currFloor = currFloor;
  }

  public setElevatorState(newState: Partial<ElevatorState>): void {
    // Update the elevator state properties
    this.emergencyStop = newState.emergencyStop ?? this.emergencyStop;
    this.fireMode = newState.fireMode ?? this.fireMode;
    this.doorStuck = newState.doorStuck ?? this.doorStuck;
    // ... (update other properties similarly)
  }


  private sleep(seconds: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
  }

  wakeUpElevator(): void | null {
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
  
        this.dockCheck();
      }
    } else {
      return null;
    }
  }

  private safetyCheck(): boolean {
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
    }

    else {
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

  private async dock(): Promise<void> {
    this.motion = 'stop';
    this.doorOpen = true;
  
    if (this.motion === 'stop') {
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
        await this.dock();
      })();
    } else if (this.direction === 'up' && this.upRequests.includes(this.currFloor)) {
      dockPerformed = true;
      this.travelTime += 5;
      (async () => {
        await this.dock();
      })();
    } else if (this.direction === 'down' && this.downRequests.includes(this.currFloor)) {
      dockPerformed = true;
      this.travelTime += 5;
      (async () => {
        await this.dock();
      })();
    }
  
    if (!dockPerformed) {
      this.travelTime += 1; // Increment by 1 when dock() is not performed
    }
  
    this.sleep(1).then(() => {
      this.routeCheck();
      this.moveFloor();
    });
  }

  private moveFloor(): void {
    if (this.motion === 'stopped') {
      this.motion = 'moving';
    }
  
    if (this.motion === 'rest') {
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
      // Handle the cases when motion is 'moving' or 'idle'
      if (this.direction === 'up' && this.currFloor < this.totalFloors) {
        // Move up one floor if not already at the top floor
        this.currFloor++;
      } else if (this.direction === 'down' && this.currFloor > 0) {
        // Move down one floor if not already at the ground floor
        this.currFloor--;
      }
    }
  
    this.dockCheck();
  }

  private routeCheck(): void | null {
    if (!this.safetyCheck()) {
      return null;
    }
  
    if (
      (this.direction === 'down' && this.dockRequests.some((floor) => floor < this.currFloor)) ||
      (this.direction === 'up' && this.dockRequests.some((floor) => floor > this.currFloor))
    ) {
      this.moveFloor();
      return;
    }
  
    if (this.direction === 'down' && (!this.dockRequests.some((floor) => floor < this.currFloor) && (this.currFloor === 0 || this.downRequests.length === 0 || !this.downRequests.some((floor) => floor < this.currFloor)))) {
      this.direction = 'up';
    } else if (this.direction === 'up' && (this.currFloor === this.totalFloors || !this.upRequests.some((floor) => floor > this.currFloor))) {
      this.direction = 'down';
    }
  
    if (this.dockRequests.length === 0 && this.upRequests.length === 0 && this.downRequests.length === 0) {
      this.motion = 'rest';
    } else {
      this.motion = 'awaiting';
    }
  }

  private rest(): void {
    this.dockCheck();
    this.sleep(5).then(() => {
      this.routeCheck();
    });
  }
}

// Example usage:
const elevator = new ElevatorCar({
  totalFloors: 10,
  currFloor: 3,
  dockRequests: [4, 7, 10],
  upRequests: [6, 8, 9],
  downRequests: [2, 1],
});

// Invoke wakeUpElevator to start the elevator logic
elevator.wakeUpElevator();

interface ElevatorState {
  emergencyStop?: boolean;
  fireMode?: boolean;
  doorStuck?: boolean;
  maxWeight?: number;
  currWeight?: number;
  travelTime?: number;
  floorsStoppedAt?: number[];
  totalFloors?: number;
  direction?: string;
  motion?: string;
  currFloor?: number;
  doorOpen?: boolean;
  dockRequests?: number[];
  upRequests?: number[];
  downRequests?: number[];
}