import { financeContext } from "./finance-context";
import { useState, useContext, useEffect } from "react";
import Modal from "./modal";

import {
  calculateMean,
  calculateMedian,
  calculateMode,
} from "./dataCalculation";

function TableAnalisisModal({ show, onClose }) {
  const { expenses, income } = useContext(financeContext);
  const [isIncome, setIsIncome] = useState(true);

  const [meanExpenses, setMeanExpenses] = useState(0); // state for mean expenses
  const [medianExpenses, setMedianExpenses] = useState(0); // state for median expenses
  const [modeExpenses, setModeExpenses] = useState(0); // state for mode expenses

  const [meanIncome, setMeanIncome] = useState(0); // state for mean income
  const [medianIncome, setMedianIncome] = useState(0); // state for median income
  const [modeIncome, setModeIncome] = useState(0); // state for mode income

  const calculateAndSet = (data, calculationFunction, setFunction) => {
    if (data.length !== 0) {
      const result = calculationFunction(data);
      setFunction(result);
    }
  };
  
  useEffect(() => {
    calculateAndSet(expenses, calculateMean, setMeanExpenses);
    calculateAndSet(expenses, calculateMedian, setMedianExpenses);
    calculateAndSet(expenses, calculateMode, setModeExpenses);
  }, [expenses]);
  
  useEffect(() => {
    calculateAndSet(income, calculateMean, setMeanIncome);
    calculateAndSet(income, calculateMedian, setMedianIncome);
    calculateAndSet(income, calculateMode, setModeIncome);
  }, [income]);

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
                    <th>Mean</th>
                    <th>Median</th>
                    <th>Mode</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{(isIncome ? incomesData.mean : expensesData.mean)}</td>
                    <td>{(isIncome ? incomesData.median : expensesData.median)}</td>
                    <td>{(isIncome ? incomesData.mode : expensesData.mode)}</td>
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
