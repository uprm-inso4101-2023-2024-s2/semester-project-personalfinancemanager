<<<<<<< HEAD
'use client'
import React, { useState } from 'react';
import RenderBarChart from "./barChart";
import RenderPieChart from "./ExpenseChart"; 
import RenderDBC from "./divergingBarChart";
import AddCategoryItem from "./addcategoryItem";
import RenderLineChart from './lineChart';

export default function Home() {
  const [chartType, setChartType] = useState('bar');
  const [displayExpenses, setDisplayExpenses] = useState(true); 

  const [expensesData, setExpensesData] = useState([
    { color: '#014', title: 'housing', total: 300 },
    { color: '#032', title: 'transportation', total: 125 },
    { color: '#121', title: 'food', total: 200 },
  ]);

  const [incomesData, setIncomesData] = useState([
    { color: '#123', title: 'investments', total: 500 },
    { color: '#456', title: 'salary', total: 250 },
    { color: '#789', title: 'loan', total: 150 },
  ]);

  const calculateTotal = (data) => {
    return data.reduce((sum, item) => sum + item.total, 0);
  };

  const totalExpenses = calculateTotal(expensesData);
  const totalIncomes = calculateTotal(incomesData);

  const toggleChartType = () => {
    setChartType(prevType => {
      if (prevType === 'bar') return 'pie';
      else if (prevType === 'pie') return 'line';
      else if (prevType === 'line') return 'divergence';
      else return 'bar';
    });
  }

  const toggleDisplay = () => {
    setDisplayExpenses((prevDisplay) => !prevDisplay); 
  };

  const renderChart = () => {
    switch (chartType) {
      case 'bar':
        return <RenderBarChart />;
      case 'pie':
        return <RenderPieChart />;
      case 'line':
        return <RenderLineChart />;
      case 'divergence':
        return <RenderDBC />
      default:
        return null;
    }
  }
  return (
    <>
      <main className="container max-w-2x1 px-6 mx-auto">
      <section className="py-3">
          <small className="text-black-400 text-md">My Balance</small>
          <h2 className="text-4x1 font-bold">${totalIncomes - totalExpenses}</h2>
        </section>

          {/* Add Expenses feature */}
          <section>
            <small className="text-black-400 text-md">My {displayExpenses ? 'Expenses' : 'Incomes'}</small>
            <h2 className="text-4x1 font-bold">${displayExpenses ? totalExpenses : totalIncomes}</h2>
          <div className='flex flex-col gap-2 mt-6'>
            {displayExpenses ? (
              expensesData.map((item, index) => (
                <AddCategoryItem key={index} color={item.color} title={item.title} total={item.total} />
              ))
            ) : (
              incomesData.map((item, index) => (
                <AddCategoryItem key={index} color={item.color} title={item.title} total={item.total} />
              ))
            )}
          </div>
          
         </section>
              
        <button style={{ margin: '25px 0' }} className="bg-blue-500 text-white px-4 py-2 rounded" onClick={toggleDisplay}>{displayExpenses ? 'Show Incomes' : 'Show Expenses'}</button>

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

        <section className='max-w-2x1 px-6 mx-auto'>
          {renderChart()}
        </section>
      </main>
    </>
  );
=======
'use client';

import React, { useState } from 'react';
import RenderBarChart from './barChart';
import theNothinger from './somethingElse';
import ExpenseCategoryItem from './ExpenseCategoryItem';
import LoginPage from './LoginPage'; // imports the LoginPage components

function Home() {
    const [showBarChart, setShowBarChart] = useState(false);
    const [isLoginPage, setLoginPage] = useState(false);

    const toggleChange = () => {
        setShowBarChart(!showBarChart);
    };

    const handleLoginButtonClick = () => {
        setLoginPage(true); // Show the login page when the button is clicked
    };

    const handleLogin = (email) => {
        setLoginPage(false);
    };

    return (
        <>
            {isLoginPage ? (
                <LoginPage onLogin={handleLogin} />
            ) : (
                <main className="container max-w-2x1 px-6 mx-auto">
                    {/* Login button */}
                    <div className="flex justify-end mt-1">
                        <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleLoginButtonClick}>Login</button>
                    </div>

                    <section className="py-3">
                        <small className="text-gray-400 text-md">My Balance</small>
                        <h2 className="text-4x1 font-bold">$100</h2>
                    </section>

                    {/* Add Expenses feature */}
                    <section>
                        <h3 className="flex-2x1">My Expenses</h3>
                        <div className="flex flex-col gap-2 mt-6">
                            <ExpenseCategoryItem color={'#014'} title={'Mock-cost'} total={300} />
                            <ExpenseCategoryItem color={'#032'} title={'Mock-cost'} total={125} />
                            <ExpenseCategoryItem color={'#121'} title={'Mock-cost'} total={200} />
                        </div>
                    </section>

                    <div className="mt-2 group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
                        <button onClick={toggleChange}>{showBarChart ? 'Show Nothing' : 'Show Bar Chart'}</button>
                    </div>
                    <section className="max-w-2x1 px-6 mx-auto">{showBarChart ? <RenderBarChart /> : <theNothinger />}</section>
                </main>
            )}
        </>
    );
>>>>>>> 142b82f (Implemented a Login Page file and edited page file to show the login page when clicked on the button)
}

export default Home;
