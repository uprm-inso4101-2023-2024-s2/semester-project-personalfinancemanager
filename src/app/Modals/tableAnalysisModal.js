import { financeContext } from "../Finance-Context/finance-context";
import { useState, useContext } from "react";
import Modal from "./modal";

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

  // Expenses Filters
  const monthlyExpensesfilter = (data, month) => {
    return data.flatMap((item) => {
      if (item && item.items) {
        return item.items
          .filter((item) => {
            const itemDate = new Date(item.createdAt.seconds * 1000);
            return itemDate.getMonth() === month;
          })
          .map((item) => item.amount);
      } else {
        return [];
      }
    });
  };
  
  const dailyExpensesfilter = (data) => {
    const currentDate = new Date();
    const currentDay = currentDate.getDate();
    const currentMonth = currentDate.getMonth();
  
    return data.flatMap((item) => {
      if (item && item.items) {
        return item.items
          .filter((item) => {
            const itemDate = new Date(item.createdAt.seconds * 1000);
            return (
              itemDate.getMonth() === currentMonth &&
              itemDate.getDate() === currentDay
            );
          })
          .map((item) => item.amount);
      } else {
        return [];
      }
    });
  };
  
  const weeklyExpensesfilter = (data) => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  
    return data.flatMap((item) => {
      if (item && item.items) {
        return item.items
          .filter((item) => {
            const itemDate = new Date(item.createdAt.seconds * 1000);
            return itemDate >= oneWeekAgo;
          })
          .map((item) => item.amount);
      } else {
        return [];
      }
    });
  };

  // Income Filters
  const monthlyIncomefilter = (data, month) => {
    return data
      .filter((item) => {
        const itemDate = new Date(item.createdAt);
        return itemDate.getMonth() === month;
      })
      .map((item) => item.amount);
  };

  const dailyIncomefilter = (data) => {
    const currentDate = new Date();
    const currentDay = currentDate.getDate();
    const currentMonth = currentDate.getMonth();
  
    return data
      .filter((item) => {
        const itemDate = new Date(item.createdAt);
        return (
          itemDate.getMonth() === currentMonth &&
          itemDate.getDate() === currentDay
        );
      })
      .map((item) => item.amount);
  };

  const weeklyIncomefilter = (data) => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  
    return data
      .filter((item) => {
        const itemDate = new Date(item.createdAt);
        return itemDate >= oneWeekAgo;
      })
      .map((item) => item.amount);
  };

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
  const dailyExpenses = dailyExpensesfilter(expenses);
  const weeklyExpenses = weeklyExpensesfilter(expenses);
  const monthlyExpenses = monthlyExpensesfilter(expenses, currentMonth);

  const [
    meanDailyExpenses,
    medianDailyExpenses,
    modeDailyExpenses,
  ] = calculateStatistics(dailyExpenses);

  const [
    meanWeeklyExpenses,
    medianWeeklyExpenses,
    modeWeeklyExpenses,
  ] = calculateStatistics(weeklyExpenses);

  const [
    meanMonthlyExpenses,
    medianMonthlyExpenses,
    modeMonthlyExpenses,
  ] = calculateStatistics(monthlyExpenses);

  // Income
  const dailyIncomes = dailyIncomefilter(income);
  const weeklyIncomes = weeklyIncomefilter(income);
  const monthlyIncomes = monthlyIncomefilter(income, currentMonth);

  const [
    meanDailyIncomes,
    medianDailyIncomes,
    modeDailyIncomes,
  ] = calculateStatistics(dailyIncomes);

  const [
    meanWeeklyIncomes,
    medianWeeklyIncomes,
    modeWeeklyIncomes,
  ] = calculateStatistics(weeklyIncomes);

  const [
    meanMonthlyIncomes,
    medianMonthlyIncomes,
    modeMonthlyIncomes,
  ] = calculateStatistics(monthlyIncomes);

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
              <td>{isIncome ? meanDailyIncomes.toFixed(2) : meanDailyExpenses.toFixed(2)}</td>
              <td>{isIncome ? medianDailyIncomes.toFixed(2) : medianDailyExpenses.toFixed(2)}</td>
              <td>{isIncome ? modeDailyIncomes.toFixed(2) : modeDailyExpenses.toFixed(2)}</td>
            </tr>
            <tr>
              <td>
                <strong>Weekly</strong>
              </td>
              <td>{isIncome ? meanWeeklyIncomes.toFixed(2) : meanWeeklyExpenses.toFixed(2)}</td>
              <td>{isIncome ? medianWeeklyIncomes.toFixed(2) : medianWeeklyExpenses.toFixed(2)}</td>
              <td>{isIncome ? modeWeeklyIncomes.toFixed(2) : modeWeeklyExpenses.toFixed(2)}</td>
            </tr>
            <tr>
              <td>
                <strong>Mothly</strong>
              </td>
              <td>{isIncome ? meanMonthlyIncomes.toFixed(2) : meanMonthlyExpenses.toFixed(2)}</td>
              <td>{isIncome ? medianMonthlyIncomes.toFixed(2) : medianMonthlyExpenses.toFixed(2)}</td>
              <td>{isIncome ? modeMonthlyIncomes.toFixed(2) : modeMonthlyExpenses.toFixed(2)}</td>
            </tr>
          </tbody>
        </tbody>
      </table>
      <style jsx>{`
        .table-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh; // This makes the container take up the full height of the viewport
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th,
        td {
          border: 1px solid black;
          padding: 18px;
          text-align: center;
        }

        th {
          background-color: #f2f2f2;
        }

        tr:nth-child(even) {
          background-color: #f2f2f2;
        }

        tr:nth-child(odd) {
          background-color: #ffffff;
        }

        tr:hover {
          background-color: #ddd; // Change this to the color you want for the hover effect
        }
      `}</style>
    </Modal>
  );
}

export default TableAnalisisModal;
