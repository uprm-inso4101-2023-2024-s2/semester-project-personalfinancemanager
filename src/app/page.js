'use client'
import React, { useState, useContext, useEffect } from 'react';
import RenderBarChart from "./barChart";
import RenderPieChart from "./ExpenseChart"; 
import RenderDBC from "./divergingBarChart";
import RenderLineChart from './lineChart';
import LoginPage from './LoginPage';
import { authContext } from './auth-context';
import { currencyFormatter } from './utils';
import ExpenseCategoryItem from './ExpenseCategoryItem';
import AddExpensesModal from './AddExpensesModal';
import AddIncomesModal from './AddIncomesModal';
import { financeContext } from './finance-context';
import Calendar from './Calendar'; // Import Calendar component

import { Chart as ChartJS, Tooltip, LinearScale, CategoryScale, BarElement, Legend} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

export default function Home() {
  const [chartType, setChartType] = useState('bar');
  const [displayExpenses, setDisplayExpenses] = useState(true); 
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAddIncomeModal, setShowAddIncomeModal] = useState(false);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [balance, setBalance] = useState(0);
  const { expenses, income } = useContext(financeContext);



  useEffect((newBalance) => {
    newBalance = income.reduce((total, i) => {
      return total + i.amount;
    }, 0) - expenses.reduce((total, e) => {
      return total + e.total;
    }, 0);
    setBalance(newBalance);
  }, [expenses, income]);

  const [isLoginPage, setLoginPage] = useState(false);
  const { user } = useContext(authContext);

  const toggleChartType = () => {
    setChartType(prevType => {
      if (prevType === 'bar') return 'pie';
      else if (prevType === 'pie') return 'line';
      else if (prevType === 'line') return 'divergence';
      else return 'bar';
    });
  }
  const handleLoginButtonClick = () => {
    if (isLoggedIn) {
      setIsLoggedIn(false); // If user is logged in, log them out
    } else {
      setLoginPage(true); // Show the login page when the button is clicked
    }
  };

  const handleLogin = (email) => {
    setLoginPage(false);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const buttonBaseClass = "btn py-2 px-4 font-semibold rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-opacity-75";
  const buttonWidthClass = "w-36 sm:w-44";

  const renderChart = () => {
    switch (chartType) {
      case 'bar':
        return <RenderBarChart expensesData={expenses} />;
      case 'pie':
        return <RenderPieChart expensesData={expenses} />;
      case 'line':
        return <RenderLineChart />;
      case 'divergence':
        return <RenderDBC expensesData ={expenses} incomeData = {income} /> 
      default:
        return null;
    }
  }

  

  if (!user) {

      <main className=" container max-w-2x1 px-6 mx-auto">

            <div className="button-container">
              <button
                onClick={() => setShowAddIncomeModal(true)}
                className={`${buttonBaseClass} ${buttonWidthClass} bg-green-500 hover:bg-green-550`}
                style={{ margin: 'auto' }} 
              >
                Income +
              </button>
              <button
                onClick={() => setShowAddExpenseModal(true)}
                className={`${buttonBaseClass} ${buttonWidthClass} bg-red-500 hover:bg-red-550`}
                style={{ margin: 'auto' }}
              >
                Expenses +
              </button>
            </div>
              
            <section className="max-w-2x1 px-6 mx-auto flex justify-center">
              {renderChart()}
            </section>

            {/* Calendar */}
            <section className='py-6 pl-6'>
              <h3 className='text-2xl text-center'>Calendar System</h3>
              <div className="flex justify-center">
                <Calendar />
              </div>
            </section>
         
        </main>

  }
}
