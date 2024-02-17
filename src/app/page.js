'use client'
import React, { useState } from 'react';
import RenderBarChart from "./barChart";
import RenderPieChart from "./ExpenseChart"; // Import the RenderPieChart component
import RenderDBC from "./divergingBarChart";
import theNothinger from './somethingElse';
import ExpenseCategoryItem from './ExpenseCategoryItem';
import RenderLineChart from './lineChart';

export default function Home() {
  const [chartType, setChartType] = useState('bar');

  const toggleChartType = () => {
    setChartType(prevType => {
      if (prevType === 'bar') return 'pie';
      else if (prevType === 'pie') return 'line';
      else if (prevType === 'line') return 'divergence';
      else return 'bar';
    });
  }

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
          <small className="text-gray-400 text-md">My Balance</small>
          <h2 className="text-4x1 font-bold">$100</h2>
        </section>

        {/* Add Expenses feature */}
        <section>
          <h3 className='flex-2x1'>My Expenses</h3>
          <div className='flex flex-col gap-2 mt-6'>
            <ExpenseCategoryItem color={'#014'} title={'Mock-cost'} total={300}/>
            <ExpenseCategoryItem color={'#032'} title={'Mock-cost'} total={125}/>
            <ExpenseCategoryItem color={'#121'} title={"Mock-cost"} total={200}/>
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

        <section className='max-w-2x1 px-6 mx-auto'>
          {renderChart()}
        </section>
      </main>
    </>
  );
}
