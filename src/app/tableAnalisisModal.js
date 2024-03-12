import { useState } from 'react';
import Modal from "./modal";

function TableAnalisisModal({ show, onClose, initialData = [] }) {
    const [isIncome, setIsIncome] = useState(true);

    const [expensesData, setExpensesData] = useState(initialData.expenses || [
        { label: "Expense 1", median: 100, mean: 80, average: 90 },
        { label: "Expense 2", median: 200, mean: 150, average: 175 },
    ]);
    
    const [incomesData, setIncomesData] = useState(initialData.incomes || [
        { label: "Income 1", median: 500, mean: 400, average: 450 },
        { label: "Income 2", median: 800, mean: 700, average: 750 },
    ]);

    const handleButtonClick = () => {
        setIsIncome(!isIncome);
    }

    const renderSwitchButton = () => {
        return (
            <div className="flex justify-start items-center mb-6">
                <button onClick={handleButtonClick} className="btn btn-primary">
                    {isIncome ? 'Switch to Expenses' : 'Switch to Income'}
                </button>
            </div>
        );
    }

    const getData = () => {
        return isIncome ? incomesData : expensesData;
    }

    return (
        <Modal show={show} onClose={onClose}>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold ">Analysis Table</h2>
            </div>
            
            {renderSwitchButton()}

            <div>
                <h1 className="mb-6 text text-center text-xl" >{isIncome ? 'Income' : 'Expenses'}</h1>
            </div>
            
            <table className="flex justify-center">
                <tbody>
                    <tr>
                        <th></th>
                        <th>Median</th>
                        <th>Mean</th>
                        <th>Average</th>
                    </tr>
                    {getData().map((row, index) => (
                        <tr key={index}>
                            <td>{row.label}</td>
                            <td>{row.median}</td>
                            <td>{row.mean}</td>
                            <td>{row.average}</td>
                        </tr>
                    ))}
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

        th, td {
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
