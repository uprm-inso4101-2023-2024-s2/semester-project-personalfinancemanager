import React from 'react';
import RenderBarChart from "../Charts/barChart";
import RenderPieChart from "../Charts/ExpenseChart"; 
import RenderDBC from "../Charts/divergingBarChart";
import RenderLineChart from '../Charts/lineChart';
import { useContext, useState } from "react";
import { financeContext } from '../Finance-Context/finance-context'




function GraphsPage() {
  const [chartType, setChartType] = useState('');
  const { expenses, income } = useContext(financeContext);




  const renderChart = () => {
    switch (chartType) {
      case "Bar Chart":
        return <RenderBarChart expensesData={expenses} />;
      case "Pie Chart":
        return <RenderPieChart expensesData={expenses} />;
      case "Line Chart":
        return <RenderLineChart expensesData ={expenses} incomeData = {income} />;
      case "Diverging Bar Chart":
        return <RenderDBC expensesData ={expenses} incomeData = {income} /> 
      default:
        return null;
    }
  }

  return (
    <div className="graphs-page-container bg-custom-gray min-h-screen text-white">
      <h2 className="text-center text-3xl font-bold py-5">Graphs</h2>
      <div className="chart-selection flex justify-center gap-4 py-5">
      </div>
            <div className="mt-2 group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30 flex justify-between">
              <button style={{ margin: '0 5px' }} onClick={() => setChartType("Bar Chart")}>
                <img src="https://cdn.pixabay.com/photo/2014/03/25/16/26/bar-chart-297122_1280.png" alt="Bar Chart" style={{ width: '100px', height: 'auto' }} />
              </button>
              <button style={{ margin: '0 5px' }} onClick={() => setChartType("Pie Chart")}>
                <img src="https://freesvg.org/img/1529053464.png" alt="Pie Chart" style={{ width: '100px', height: 'auto' }} />
              </button>
              <button style={{ margin: '0 5px' }} onClick={() => setChartType("Line Chart")}>
                <img src="https://c.mql5.com/31/4/MAStop_200.png" alt="Line Chart" style={{ width: '100px', height: 'auto' }} />
              </button>
              <button style={{ margin: '0 5px' }} onClick={() => setChartType("Diverging Bar Chart")}>
                <img src="https://www.xelplus.com/wp-content/uploads/2019/04/Charting-Survey-Results-727a6c.png" alt="Diverging Bar Chart" style={{ width: '100px', height: 'auto' }} />
              </button>
            </div>
            <div className="mt-20 flex justify-center">
              <h3 className="text-2xl font-semibold">{chartType}</h3> 
            </div>
            <section className="max-w-2x1 px-6 mx-auto flex justify-center">
              {renderChart()}
            </section>
    </div>
  );
}

export default GraphsPage;