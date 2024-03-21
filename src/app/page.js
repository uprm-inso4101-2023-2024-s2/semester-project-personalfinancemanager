/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-key */
'use client'
import React, { useState, useContext, useEffect } from 'react';
import RenderBarChart from "./Charts/barChart";
import RenderPieChart from "./Charts/ExpenseChart"; 
import RenderDBC from "./Charts/divergingBarChart";
import RenderLineChart from './Charts/lineChart';
import LoginPage from './Pages/LoginPage';
import { authContext } from './Page-Functionality/Login/auth-context';
import { currencyFormatter } from './Finance-Context/utils';
import ExpenseCategoryItem from './Page-Functionality/ExpenseCategoryItem';
import AddExpensesModal from './Modals/AddExpensesModal';
import AddIncomesModal from './Modals/AddIncomesModal';
import { financeContext } from './Finance-Context/finance-context';
import Calendar from './Page-Functionality/Calendar';
import TableAnalisisModal from './Modals/tableAnalysisModal';

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
  const [showTableAnalisis, setShowTableAnalisis] = useState(false);
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
    return <LoginPage />
  } else {
    return (
      <>
        <main className="container max-w-2x1 px-6 mx-auto">
         {/* Add Income Modal */}
      <AddIncomesModal 
        show={showAddIncomeModal} 
        onClose={setShowAddIncomeModal}
      />
      
      {/* Add Expenses Modal */}
      <AddExpensesModal 
        show={showAddExpenseModal} 
        onClose={setShowAddExpenseModal} 
      />

      {/* Table Analisis */}
      <TableAnalisisModal 
        show={showTableAnalisis} 
        onClose={setShowTableAnalisis}
      />

          <section className="container max-w-2x1 px-6 mx-auto">
            <section className="balance-box">
              <h3 className="balance-label">My Balance</h3>
              <h2 className="balance-amount">{currencyFormatter(balance)}</h2>
            </section>

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
              <button 
                onClick={() => {setShowTableAnalisis(true);}}
                className={`${buttonBaseClass} ${buttonWidthClass} bg-yellow-500 hover:bg-red-550`}
                style={{ margin: 'auto' }}
              >
                Table
              </button>
            </div>

            {/** Expenses */}
            <section className='py-6'>
              <h3 className="text-2xl pl-6">My Expenses</h3>
              <div className='flex flex-col gap-4 mt-6'>
                {expenses.map((expense) => {
                  return (
                    <ExpenseCategoryItem
                      expense={expense}
                    />
                  );
                })}
              </div>
            </section>

            <div className="mt-2 group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30 flex justify-between">
              <button style={{ margin: '0 5px' }} onClick={() => setChartType('bar')}>
                <img src="https://cdn.pixabay.com/photo/2014/03/25/16/26/bar-chart-297122_1280.png" alt="Bar Chart" style={{ width: '100px', height: 'auto' }} />
              </button>
              <button style={{ margin: '0 5px' }} onClick={() => setChartType('pie')}>
                <img src="https://freesvg.org/img/1529053464.png" alt="Pie Chart" style={{ width: '100px', height: 'auto' }} />
              </button>
              <button style={{ margin: '0 5px' }} onClick={() => setChartType('line')}>
                <img src="https://c.mql5.com/31/4/MAStop_200.png" alt="Line Chart" style={{ width: '100px', height: 'auto' }} />
              </button>
              <button style={{ margin: '0 5px' }} onClick={() => setChartType('divergence')}>
                <img src="https://www.xelplus.com/wp-content/uploads/2019/04/Charting-Survey-Results-727a6c.png" alt="Diverging Bar Chart" style={{ width: '100px', height: 'auto' }} />
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
          </section>
        </main>
      </>
    );
  }
}