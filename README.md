===========================================================
•       Provide code that simulates an elevator. You are free to use any language.
•       Upload the completed project to GitHub for discussion during interview.
•       Document all assumptions and any features that weren’t implemented.
•       The result should be an executable, or script, that can be run with the following inputs and generate the following outputs.
        Inputs: [list of floors to visit] (e.g. elevator start=12 floor=2,9,1,32)
        Outputs: [total travel time, floors visited in order] (e.g. 560 12,2,9,1,32)
        Program Constants:
        Single floor travel time: 10


To Consider:

The Elevator Car:
Max weight of the elevator
State of the elevator {up, down, stop}. Elevator door only opens when stopped
Speed of the elevator
panel of buttons
Emergency buttons
Display (floor and direction)

The Elevator System:
The floors being serviced
Elevator buttons at each floor {up, down, null}
Display (floor and direction)

How many floors does the building have?

ASSUMPTION:
This is the only elevator for the building.



Elevator Optimizations:
Optimize for minimizing wait time :
1: Go to the nearest floor with a passenger waiting
2: Take them to their destination, picking up any passengers going in the same direction
PROBLEM: In a tall building with lots of people going back and forth from the 1st and 2nd floor, someone waiting on the top floor will
be stuck.

Optimize for every passenger being served in a reasonable timeframe:
1: Go all the way to the top, then all the way to the bottom
2: Start going all the way to the top. If there are no more requests above, start going down.

Let's say someone is on the 2nd floor and wants to go down to the 1st floor. The elevator is currently going up

