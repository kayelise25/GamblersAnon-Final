# Gamblers-Anonymous
![image](https://user-images.githubusercontent.com/40900372/228919735-24736d0d-8df2-4198-8d65-b08180510774.png)

Gamblers Anonymous is a team of students at Hampton University with the aim to create a virtual Blackjack game that will teach a player a strategy to win the game. The goal is to develop software that will play as the dealer and allow players to choose their preferred decision. Players have the options to hit, stand, split, or double down based on their hand. However, our software will also notify the player of the best choice for their given hand, essentially teaching them the better choices as a user plays the game. The choices recommended to the user will be based on a Blackjack strategy card developed by our team. 

## Installation

Ensure product file is downloaded to local machine
Install Node.js
Download the installer from NodeJS WebSite.
Run the installer.
Follow the installer steps, agree the license agreement and click the next button.
Restart your system/machine.
Run npm install in terminal/command prompt 
*Do not run inside the node installer 
Install Mongo DB
Run npm install mongodb  in terminal/command prompt
	*Do not run inside the node installer 

For issues regarding installation, please review MongoDB or Nodejs installation documentation. 

## To Run (Locally)
1. Open Terminal/Command Prompt
2. Navigate to the application directory (Application Name = GA-Blackjack-Simulation-Beta) **check notes for UNIX and Command Prompt Command 
3. Enter the command “node server.js” If the application has connected successfully, terminal/command prompt will print out “Running at Port 3000, connected to mongoDB”. 
4. Open a web browser
5. Enter “localhost:3000” in the URL to launch the application 
6. Once the application is launched, you will be able to play blackjack in regular mode or teaching mode by adjusting the toggle and clicking start.

For issues regarding running the application, check notes for some possible errors.

## Notes
### UNIX COMMANDS (MAC)
cd : change directories/navigate your file system : use to find project file
ls : list directory components/files : use to check if project file or server file is in directory 

### COMMAND PROMPT COMMAND (WINDOWS)
cd : change directories/navigate your file system : use to find project file
dir : list directory components/files : use to check if project file or server file is in the directory 


### Possible Errors
Module Not Found / Cant find node.server.js = list directory and check if server.js is located in the directory; if not navigate to corrected project folder 

Start Button Not Working = hover over start button for 10-20 second and click start 2-3 times ; refresh page if still not clicking 

Strategy Card pop up displays “T” = check database connection ; download MongoDB Compass to use a GUI to monitor and manipulate database 
If the database is empty, it can be reloaded with the stratCard.json file in the project folder
