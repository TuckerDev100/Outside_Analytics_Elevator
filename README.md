===========================================================

# The assignment

Provide code that simulates an elevator. You are free to use any language.
Upload the completed project to GitHub for discussion during interview.
Document all assumptions and any features that weren’t implemented.
The result should be an executable, or script, that can be run with the following inputs and generate the following outputs.
Inputs: [list of floors to visit] (e.g. elevator start=12 floor=2,9,1,32)
Outputs: [total travel time, floors visited in order] (e.g. 560 12,2,9,1,32)
Program Constants:
Single floor travel time: 10

# Installation

### If using the build.zip file:

1. Download the build.zip file.
2. Right-click on it and choose "Extract" or "Unzip" to unpack its contents.
3. If you don't have npm, please go to https://nodejs.org/ and install Node.js and npm.
4. Open a Command Prompt (Windows) or Terminal (macOS/Linux) window.
5. Navigate to the extracted build folder using the 'cd' command. Ensure you are at the level where you see the different components of the extracted file.
6. Run the command `npm install -g serve` and wait for it to finish.
7. After the installation is complete, run the command `serve -s` and wait for it to finish.
8. Once done, open a web browser and enter http://localhost:5000 into the address bar.

Voila! You should now see the app functionality.

### If cloning from GitHub

1. Open a terminal.
2. Run the command `git clone https://github.com/TuckerDev100/Outside_Analytics_Assesment.git`.
3. If you don't have npm, please go to https://nodejs.org/ and install Node.js and npm.
4. In the terminal, navigate to the project directory.
5. Run `npm install` to install all dependencies.
6. Run `npm start`.
7. It should open a webpage on localhost:3000.

# How to use the App
Enter information into the text boxes. My apologies, but I do not have error handling or input validation. 
For number of floors,
 enter a whole integer greater than one. For the floor the elevator is on enter enter a number greater than zero and less than
 or equal to the total number of floors.
 for the floors that need to be visited, enter a comma separted list of integers, such as
 1,8,4,2. Do not add any values less than zero or greater than total floors.

 If you encounter an error, refresh the page.

Hit F12 and look at the console. The list of floors in order will be in the floorsStoppedAt array.
The total time taken will be the value for travelTime

## ASSUMPTIONS: **\***

This is the only elevator for the building.

The elevator will consist of two parts, The ElevatorCar and the ElevatorSystem. The ElevatorCar represents the elevator itself.

The ElevatorSystem represents users making requests to go up and down on each floor.

When calling the Elevator using the buttons, Users will have a choice to select if they wish to go up or down.
Some elevators just have a singular call button, but this one has two.

Whether a user wants to go up or down, if the elevator stops at their floor they will get on/off regardless of the intentions of the elevator.

It takes 10 seconds to go from one floor to another. I assume this means onloading a passenger, going to the next floor, and then offloading the passenger.
From this I take it to mean that it takes 5 seconds to dock at one floor. I decided to add one second to the timer if a floor is not docked at. 

---

## Why did I optimize it this this way?

Given that there is one elevator, there are two possible ways to optimize it:

### Optimize for minimizing wait time :

1: Go to the nearest floor with a passenger waiting
2: Take them to their destination, picking up any passengers going in the same direction

### Optimize for every passenger being served in a reasonable timeframe:

1: Go all the way to the top, then all the way to the bottom
2: Start going all the way to the top. If there are no more requests above, start going down.

I went with option two. Here's why:
Let's say that there is that floors 1-3 are very popular. As soon as the elevator gets services floor 3,
there is almost always another request on floor 2 or 1. This can keep going indefinetly.
If there are no requests on floors 4-9, but there is someone on floor 10 who wants to go down,
that person may be waiting a long time.
This is unnacceptable because elevators are not a lazy alternative to the stairs,
they are an important piece of infrastrucre to make building handicap accessible.
Sure with the second option someone wanting to go up may have to first go down and will have to wait longer,
but that is an acceptable trade off. Just like how in parking lots there are almost always more handicap spots
than are neccessary, serving everyone takes priority over maximum efficiency.

# What did I do well?
I am proud of the ElevatorCar class. I designed it in a way that it will efficeintly handle most scenarios. 

I also mocked up features that are beyond the scope of the assignment, but any reasonalbe elevator should have.
I took the assignment to be *simulate* an Elevator, not write an elevator algorithm to get certain outputs. I think my
elevator is well thought out.

Good tests. This project took too long, so I had to comment out some tests and features to get out an MVP. However,
the behaviors that are tested are tested thouroughly and the testing framework is set up. It will be very easy for
me or another dev to continue where I left off and write good readable tests that verify behavior


# What can I improve on?
The UI obviously. While it could be said that UI is not super important for elevator logic, this is an interview assesment
and presentation matters. The UI is ugly, has no input validation or error handling, and was clearly an afterthought. 
If I was doing this assignment again, I would get the Elevator logic to meet the only the MVP of the business logic requirments,
get the UI to an if not pretty at least reasonable state, then focus on good elevator featurs that are not relevant to the MVP.

I took a bit longer than I would have liked. I committed too hard to extra features and thinking about all the things an elevator
should do and have. Again, I would have benifitted from a more narrow focus on an MVP that only meets the requirements outlined, 
submitting that, and THEN circling back and adding the simulation aspects.

# Next steps
Assuming that I continue on this elevator project, again I would make the UI better.

After initialization, while the elevator is running I want to add timouts or asyncs to make it take longer to move from one floor to another
While the elevator is running, the user should be able to enter what floor they are on and what floor they want to go to using 
a more fleshed out ElevatorSystem class. This should then translate that into upRequests and downRequests, which are converted into dockRequests 
once the elevator picks up the request. This should use state to live update dockRequests, upRequest, and downRequest and put them in their proper queues.

After the elevator has serviced all requests, it should head to the ground floor, assuming it is not interrupted by more requests on its way down.
Once it it at the ground floor, It should log the floors it visited and the time it took to a log file. This is data that can be help optimize the elevator later. Once it is at the ground floor it should enter a power saving mode where it checks for new requests periodically.

Normal actions of the elevator should be interruptable in the event of a safety condition. This includes someone hitting an emergency stop button,
the elevator being over weight, the door failing to shut, or a firefighter inserting a key into the the fire keyhole. 