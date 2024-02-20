# PersonalFinanceManager Documentation

## Team Composition

The project team consists of 27 individuals, each bringing unique skills and perspectives to the development of the PersonalFinanceManager app.

## 1. Introduction

### 1.1 Overview

PersonalFinanceManager is designed to assist individuals in making informed financial decisions and planning their finances with precision. By leveraging data and aligning with users' financial goals, our app aims to simplify and enhance the budgeting process.

### 1.2 Current Challenges and Solution

Many people struggle with efficiently managing their budgets. Traditional methods, such as handwritten notebooks or complex spreadsheet templates, are often tedious and inaccessible for some. The PersonalFinanceManager app addresses this issue by offering an intuitive platform that minimizes technical and economic barriers. It not only facilitates budget tracking and management but also provides predictive insights and actionable recommendations to improve spending habits according to user goals.

## 2. Project Scope and Methodology

### Scope

The PersonalFinanceManager WebApp targets a broad audience seeking to improve their personal finance management. Initially, the app will require manual input of transactions, with future iterations planned to include automatic bank account synchronization for real-time tracking and categorization of expenses and income.

### Span

Our development process adopts the AGILE methodology, enabling flexibility and continuous improvement through successive sprints. This approach ensures that the app remains responsive to user needs and evolving project goals.

### Synopsis

The app's design acknowledges the reality that a completely frictionless experience is unattainable. Users must actively engage with the app to reap its full benefits. Our vision includes gradually introducing features that accommodate passive users, allowing them to receive essential notifications with minimal effort.

### Domain Description

- **Entities**: The primary entity is the user, alongside financial entities such as cash flow (income and expenses) and liquid assets. Abstract entities like debt are also considered to capture the full financial picture of the user.

- **Functions**: Users can perform two main actions: earning and spending money, categorized by type for detailed tracking. Setting financial goals is another critical function, enabling personalized advice and progress tracking.

- **Events**: The app distinguishes between synchronous and asynchronous events. Synchronous events update the user's financial overview in real-time, while asynchronous events include notifications and reminders to guide user behavior towards their financial goals.

- **Behaviors**: The ultimate behavior change targeted by the app is the alignment of the user's financial activities with their set goals. This involves a dynamic interaction between user actions, app feedback, and personalized advice to encourage positive financial habits.

## Conclusion

PersonalFinanceManager aspires to transform the way individuals interact with their finances. Through a user-friendly interface, data-driven insights, and a forward-looking development approach, we aim to empower users to achieve their financial goals with confidence.


## Descriptive Part

### 2.1 Domain Description
The app is designed to analyze simple financial behaviors and patterns, such as repeat expenses, unusually high spending in specific categories (e.g., entertainment), and savings patterns. It aims to compare these observations with user-defined savings goals, such as saving a specific amount monthly. The app includes several built-in categories for budgeting but allows users to add custom categories to tailor the budgeting experience to their needs.
#### 2.1.1 Financial Management and Analysis
The app serves users looking to gain insights into their spending habits, budget effectively, and achieve financial goals. It focuses on analyzing repeat expenses, high spending in various categories, and savings patterns to guide users towards financial stability.

#### 2.1.2 User-Defined Goals and Categories
Users can set goals like saving for significant purchases or contributing to retirement accounts, and categorize transactions to track progress. Customizable categories enhance user experience by allowing for personalized budgeting and tracking.

### 2.2 Requirements

#### 2.2.1 Functional Requirements

- **Budgeting and Goal Setting**: Users can define financial goals within various categories, including one-time and recurring savings goals, purchase limits, and investment contributions.
- **Expense Tracking and Analysis**: The app compares user-inputted expenses with historical data to identify trends, unusual spending, and opportunities for savings.
- **Data Visualization**: Offers pie charts, bar graphs, and line graphs to visualize financial data based on user-selected criteria, such as time frames or categories.
- **Notifications**: Alerts users about potential deviations from their financial goals based on current spending patterns.

#### 2.2.2 Non-Functional Requirements

- **Performance Optimization**: Efficient use of Cloudflare KV to reduce bandwidth costs.
- **Data Security**: Encryption within the KV store ensures that only users can access their data.

### 2.3 Implementation

#### 2.3.1 Web Application

- The primary interface allows users to enter expenses, view recent transactions, and access a general financial analysis dashboard.
- Additional features include a transaction history page and a settings page for customization.
- Built with React and TypeScript, facilitating development and ensuring scalability.

#### 2.3.2 Backend

- Although specific algorithms for financial calculations are pending, the backend will support complex data processing for budgeting, tracking, and analysis.
- A Cloudflare Worker will manage the API, enabling efficient data handling and application logic execution.

#### 2.3.3 Database

- Utilizes a Cloudflare KV store, where each entry consists of a unique user identifier and a JSON object containing the user's financial data, ensuring quick access and data integrity.

### 2.4 Validation and Verification

- Initial testing involves a mock user with dummy data to simulate financial transactions and user interactions.
- Detailed testing strategies, including unit testing for individual components and integration testing for end-to-end functionality, are in development.

### 2.5 Challenges and Solutions

**Data Security and Privacy**: Implementing robust encryption and access control mechanisms to protect sensitive financial data.

**User Engagement**: Developing intuitive UI/UX and incorporating gamification elements to encourage regular app usage.

**Scalability**: Planning for cloud services and database scaling strategies to accommodate growing user data efficiently.

### 2.6 Future Enhancements

- **Machine Learning for Personalized Insights**: Integrate ML algorithms to offer tailored financial advice and predictive analytics based on user data.
- **Bank Integration**: Enable direct linkages to financial institutions for real-time transaction data, simplifying expense tracking.
- **Social Financial Goals**: Introduce features for users to set and achieve financial goals collaboratively, enhancing community support.
- **Enhanced Notifications**: Develop AI-driven notifications for personalized alerts on financial opportunities or risks, based on user behavior and external financial trends.
