'use client'
import React, { useState, useContext, useEffect } from 'react';
import RenderBarChart from "./barChart";
import RenderPieChart from "./ExpenseChart"; 
import RenderDBC from "./divergingBarChart";
import RenderLineChart from './lineChart';
import { authContext } from './auth-context';
import { currencyFormatter } from './utils';
import ExpenseCategoryItem from './ExpenseCategoryItem';
import AddExpensesModal from './AddExpensesModal';
import AddIncomesModal from './AddIncomesModal';
import { financeContext } from './finance-context';
import Calendar from './Calendar'; // Import Calendar component

import { Chart as ChartJS, Tooltip, LinearScale, CategoryScale, BarElement, Legend} from "chart.js";
import LoginPage from './LoginPage';
import SignUpPage from './SignUpPage';
import Nav from './Navigations';

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
  const [currentPage, setCurrentPage] = useState('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAddIncomeModal, setShowAddIncomeModal] = useState(false);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [balance, setBalance] = useState(0);
  const { expenses, income } = useContext(financeContext);
  const { user } = useContext(authContext);
  
  useEffect((newBalance) => {
    newBalance = income.reduce((total, i) => {
      return total + i.amount;
    }, 0) - expenses.reduce((total, e) => {
      return total + e.total;
    }, 0);
    setBalance(newBalance);
  }, [expenses, income]);

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
      setCurrentPage('login'); // Show the login page when the button is clicked
    }
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentPage('home');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage('login');
  };


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
  const renderCurrentPage = () => {
    switch(currentPage) {
      case 'login':
        return <LoginPage currentPage={currentPage} setCurrentPage={setCurrentPage} />;
      case 'signup':
        return <SignUpPage currentPage={currentPage} setCurrentPage={setCurrentPage} />;
      case 'home':
        return (
        // Main container code...
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

        <main className=" container max-w-2x1 px-6 mx-auto">
          <section className="balance-box">
            <h3 className="balance-label">My Balance</h3>
            <h2 className="balance-amount">{currencyFormatter(balance)}</h2>
          </section>

            <section className='flex items-center gap-2 py-3'>
              <button
                onClick={() => { setShowAddExpenseModal(true); }}
                className='btn btn-primary'>+ Expenses
              </button>

              <button
                onClick={() => { setShowAddIncomeModal(true); }}
                className='btn btn-primary'>+ Income
              </button>
            </section>

            {/** Expenses */}
            <section className='py-6'>
              <h3 className="text-2xl">My Expenses</h3>
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
          </main>

          {<div className="mt-2 group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30 flex justify-between">
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
          </div>}

          {<section className='max-w-2x1 px-6 mx-auto '>
            {renderChart()}
          </section>}
          {/* Calendar */}
          <section className='py-6'>
            <h3 className='text-2xl'>Calendar System</h3>
            <div>
              <Calendar />
            </div>
          </section>
        </main>
        )
    }
  }
  return (
    <>
      {<Nav currentPage={currentPage} />}
      {renderCurrentPage()}
      {<p>[Debugging] Current Page: {currentPage}</p>}
    </>
  );
}