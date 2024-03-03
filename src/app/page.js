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


  const renderChart = () => {
    switch (chartType) {
      case 'bar':
        return <RenderBarChart />;
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
    return <LoginPage/>
  }
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

      <main className=" container max-w-2x1 px-6 mx-auto">
        <section className="py-3">
          <small className="text-black text text-lg">My Balance</small>
          <h2 className="text-4x1 text text-3xl font-bold">{currencyFormatter(balance)}</h2>
        </section>

        <section className='flex items-center gap-2 py-3'>
          <button 
            onClick={() => {setShowAddExpenseModal(true);}}
            className='btn btn-primary'>+ Expenses
          </button>
          
          <button 
            onClick={() => {setShowAddIncomeModal(true);}}
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
              
          { <div className="mt-2 group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30 flex justify-between">
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
          </div> }

          { <section className='max-w-2x1 px-6 mx-auto '>
            {renderChart()}
          </section> }

          {/* Calendar */}
          <section className='py-6'>
            <h3 className='text-2xl'>Calendar System</h3>
            <div>
              <Calendar />
            </div>
          </section>
        </main>
    </>
  );
}