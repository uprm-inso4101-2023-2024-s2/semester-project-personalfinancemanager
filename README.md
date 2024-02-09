# semester-project-personalfinancemanager
# NOT FINAL! 

# Summary 
- Project allows the user to manage their fininance by way of the user inputing their cost into a webapp which in turn stores it in the database allowing the user to constatnly have acess to thier financial analysis 
 
- Webapp: that connects allows the user to manage the finiances by allowing them to inputing their expenditures, limits also notifies the user of necessary information warning expenses etc.  

- Backend: Calculates the users spending limits, cost of living, roi on investments.

- Database: handles the user data and allows the user to store their data and acess it from multiple devices 


# Features 

- Budgeting your Finances. The app will save your financial cashflow information. Separate them in different categories and save the expectations for each category. 

- Tracking of Financial Behavious. An important feature is the ability of infering important analytics of the end user, and give advices on how it should act to meet their requirements

- Interact though any device. The application will assure a safe 

- Notify for exceeding expedings

- Data Visualization. The app will analize your expending patterns and give you advices for fulfilling your personal  finance requirements.


## Overview 
Project helps users manage personal finances by giving them an overview of their expenses allowing them to visualize and analyze by storing their expenditures in jsons acessed by two means one stored in a cloudflare kv and the method involves exporting the json from the kv and reading it locally the user will get an analysis of their expenditure which they will input into the program and as stated previously will be stored in a kv the main web application will be stored in a page running react and typescript in order to facilitate development and the api will be managed by a cloudflare worker. The application will also give the user notifications for importatnt financial events such as bill due etc.


## Getting Started 
1. Ensure your Node.js version is higher than 18, preferably the latest available(20.11). https://nodejs.org/en/download/. Make sure that you download the 64 bit version.

2. To run the application, execute the following commands in your VS terminal:
   a. Switch to bash shell (May not be necessary). You do this by typing `bash` in the terminal.
   b. Run `npm install`.
   c. Execute `npm run dev`.
3. If you want to make use of some tutorials to guide you here is one:
    https://www.freecodecamp.org/ 
    It has a couple useful tutorials in many topics.