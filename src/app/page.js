/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-key */
'use client'
import React, { useState, useContext, useEffect } from 'react';
import RenderBarChart from "./Charts/barChart";
import RenderPieChart from "./Charts/ExpenseChart"; 
import RenderDBC from "./Charts/divergingBarChart";
import RenderLineChart from './Charts/lineChart';
import { currencyFormatter } from './Finance-Context/utils';
import ExpenseCategoryItem from './Page-Functionality/ExpenseCategoryItem';
import { authContext} from './Page-Functionality/Login/auth-context';
import AddExpensesModal from './Modals/AddExpensesModal';
import AddIncomesModal from './Modals/AddIncomesModal';
import { financeContext } from './Finance-Context/finance-context';
import Calendar from './Page-Functionality/Calendar';
import TableAnalisisModal from './Modals/tableAnalysisModal';
import { toast } from 'react-toastify';
import { Chart as ChartJS, Tooltip, LinearScale, CategoryScale, BarElement, Legend} from "chart.js";
import LoginPage from './Pages/LoginPage';
import SignUpPage from './Pages/SignUpPage';
import ForgotPassword from './Page-Functionality/Login/ForgotPassword';
import GraphsPage from './Pages/GraphsPage';
import { useGraph } from './Page-Functionality/graphcontext'



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
  const [showTableAnalisis, setShowTableAnalisis] = useState(false);
  const [balance, setBalance] = useState(0);
  const { expenses, income } = useContext(financeContext);
  const { user } = useContext(authContext);
  const { showGraph } = useGraph();

  useEffect((newBalance) => {
    newBalance = income.reduce((total, i) => {
      return total + i.amount;
    }, 0) - expenses.reduce((total, e) => {
      return total + e.total;
    }, 0);
    setBalance(newBalance);

    if (showGraph) {
      setCurrentPage('graph');
    } else if (user) {
      setCurrentPage('home');
    } else {
      setCurrentPage('login');
    }
  }, [showGraph, user, income, expenses]);

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


  const renderCurrentPage = () => {
    switch(currentPage) {
      case 'graph':
        return <GraphsPage />
      case 'login':
        return <LoginPage currentPage={currentPage} setCurrentPage={setCurrentPage} />;
      case 'signup':
        return <SignUpPage currentPage={currentPage} setCurrentPage={setCurrentPage} />;
      case 'forgotpassword':
        return <ForgotPassword currentPage={currentPage} setCurrentPage={setCurrentPage} />;
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
              <h3 className="text-2xl pl-6"></h3>
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

           

            {/* Calendar */}
            <section className='py-6 pl-6'>
              <h3 className='text-2xl text-center'>Calendar System</h3>
              <div className="flex justify-center">
                <Calendar />
              </div>
            </section>
          </section>
        </main>
        )
    }
  }
  return (
    <>
      {renderCurrentPage()}
      {<p>[Debugging] Current Page: {currentPage}</p>}
    </>
  );
}