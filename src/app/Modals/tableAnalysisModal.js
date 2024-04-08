import { financeContext } from "../Finance-Context/finance-context";
import { useState, useContext } from "react";
import Modal from "./modal";

import {
  expensesFilterByMonth,
  expensesFilterByDay,
  expensesFilterByWeek,
  incomesFilterByMonth,
  incomesFilterByDay,
  incomesFilterByWeek,
} from "../Page-Functionality/Filters/moneyFilters";

function TableAnalisisModal({ show, onClose }) {
  const { expenses, income } = useContext(financeContext);
  const [isIncome, setIsIncome] = useState(true);
  const currentMonth = new Date().getMonth();

  const [meanExpenses] = useState(0); // state for mean expenses
  const [medianExpenses] = useState(0); // state for median expenses
  const [modeExpenses] = useState(0); // state for mode expenses

  const [meanIncome] = useState(0); // state for mean income
  const [medianIncome] = useState(0); // state for median income
  const [modeIncome] = useState(0); // state for mode income

  // Data calculations
  const calculateStatistics = (numbers) => {
    if (numbers.length === 0) return [0, 0, 0];

    const sum = numbers.reduce((a, b) => a + b, 0);
    const sorted = [...numbers].sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);

    const mean = sum / numbers.length;

    let median;
    if (sorted.length % 2 === 0) {
      median = (sorted[middle - 1] + sorted[middle]) / 2;
    } else {
      median = sorted[middle];
    }

    const counts = numbers.reduce((acc, number) => {
      if (number in acc) {
        acc[number]++;
      } else {
        acc[number] = 1;
      }
      return acc;
    }, {});

    let maxCount = 0;
    let mode = null;
    for (const number in counts) {
      if (counts[number] > maxCount) {
        maxCount = counts[number];
        mode = Number(number);
      }
    }

    return [mean, median, mode];
  };

  // Expenses
  const dailyExpenses = expensesFilterByDay(expenses);
  const weeklyExpenses = expensesFilterByWeek(expenses);
  const monthlyExpenses = expensesFilterByMonth(expenses, currentMonth);

  console.log(dailyExpenses, weeklyExpenses, monthlyExpenses);

  const [meanDailyExpenses, medianDailyExpenses, modeDailyExpenses] =
    calculateStatistics(dailyExpenses);

  const [meanWeeklyExpenses, medianWeeklyExpenses, modeWeeklyExpenses] =
    calculateStatistics(weeklyExpenses);

  const [meanMonthlyExpenses, medianMonthlyExpenses, modeMonthlyExpenses] =
    calculateStatistics(monthlyExpenses);

  // Income
  const dailyIncomes = incomesFilterByDay(income);
  const weeklyIncomes = incomesFilterByWeek(income);
  const monthlyIncomes = incomesFilterByMonth(income, currentMonth);

  const [meanDailyIncomes, medianDailyIncomes, modeDailyIncomes] =
    calculateStatistics(dailyIncomes);

  const [meanWeeklyIncomes, medianWeeklyIncomes, modeWeeklyIncomes] =
    calculateStatistics(weeklyIncomes);

  const [meanMonthlyIncomes, medianMonthlyIncomes, modeMonthlyIncomes] =
    calculateStatistics(monthlyIncomes);

  const expensesData = {
    mean: meanExpenses,
    median: medianExpenses,
    mode: modeExpenses,
  };

  const incomesData = {
    mean: meanIncome,
    median: medianIncome,
    mode: modeIncome,
  };

  const handleButtonClick = () => {
    setIsIncome(!isIncome);
  };

  const renderSwitchButton = () => {
    return (
      <div className="flex justify-start items-center mb-6">
        <button onClick={handleButtonClick} className="btn btn-primary">
          {isIncome ? "Switch to Expenses" : "Switch to Income"}
        </button>
      </div>
    );
  };

  const getData = () => {
    if (isIncome) {
      return incomesData;
    } else {
      return expensesData;
    }
  };

  return (
    <Modal show={show} onClose={onClose}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold ">Analysis Table</h2>
      </div>

      {renderSwitchButton()}

      <div>
        <h1 className="mb-6 text text-center text-xl">
          {isIncome ? "Income" : "Expenses"}
        </h1>
      </div>

      <table className="flex justify-center">
        <tbody>
          <thead>
            <tr>
              <th></th>
              <th>Mean</th>
              <th>Median</th>
              <th>Mode</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <strong>Daily</strong>
              </td>
              <td>
                {isIncome
                  ? meanDailyIncomes.toFixed(2)
                  : meanDailyExpenses.toFixed(2)}
              </td>
              <td>
                {isIncome
                  ? medianDailyIncomes.toFixed(2)
                  : medianDailyExpenses.toFixed(2)}
              </td>
              <td>
                {isIncome
                  ? modeDailyIncomes.toFixed(2)
                  : modeDailyExpenses.toFixed(2)}
              </td>
            </tr>
            <tr>
              <td>
                <strong>Weekly</strong>
              </td>
              <td>
                {isIncome
                  ? meanWeeklyIncomes.toFixed(2)
                  : meanWeeklyExpenses.toFixed(2)}
              </td>
              <td>
                {isIncome
                  ? medianWeeklyIncomes.toFixed(2)
                  : medianWeeklyExpenses.toFixed(2)}
              </td>
              <td>
                {isIncome
                  ? modeWeeklyIncomes.toFixed(2)
                  : modeWeeklyExpenses.toFixed(2)}
              </td>
            </tr>
            <tr>
              <td>
                <strong>Mothly</strong>
              </td>
              <td>
                {isIncome
                  ? meanMonthlyIncomes.toFixed(2)
                  : meanMonthlyExpenses.toFixed(2)}
              </td>
              <td>
                {isIncome
                  ? medianMonthlyIncomes.toFixed(2)
                  : medianMonthlyExpenses.toFixed(2)}
              </td>
              <td>
                {isIncome
                  ? modeMonthlyIncomes.toFixed(2)
                  : modeMonthlyExpenses.toFixed(2)}
              </td>
            </tr>
          </tbody>
        </tbody>
      </table>
      <style jsx>{`
        .table-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th, td {
          padding: 18px;
          text-align: center;
          background-color: white;
        }
      
        tr:hover td {
          background-color: #f2f2f2;
        }

        tr {
          border-bottom: 1px solid #f2f2f2;
        }

        th:first-child {
          border-top-left-radius: 10px;
        }

        th:last-child {
          border-top-right-radius: 10px;
        }    

        tr:last-child td:first-child {
          border-bottom-left-radius: 10px;
        }

        tr:last-child td:last-child {
          border-bottom-right-radius: 10px;
        }
      `}</style>
    </Modal>
  );
}

export default TableAnalisisModal;
