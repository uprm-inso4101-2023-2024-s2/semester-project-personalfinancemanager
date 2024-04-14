import Modal from "@/app/Modals/modal";
import { useState, useContext, useRef } from "react";
import { financeContext, checkExpensesDuplication } from '../Finance-Context/finance-context';
import AddCategoryItem from "../Page-Functionality/addcategoryItem";
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';
import { authContext } from "../Page-Functionality/Login/auth-context";

/**
 * Function to format a date object to a string in the format 'YYYY-MM-DDTHH:MM'.
 * 
 * @param {Date} date - The date object to be formatted.
 * @returns {string} - Returns the formatted date string.
 */
function formatDate(date) {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    const hours = `${date.getHours()}`.padStart(2, '0');
    const minutes = `${date.getMinutes()}`.padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

/**
 * Component for adding expenses modal.
 * 
 * @param {object} props - The props object containing show and onClose properties.
 * @param {boolean} props.show - Indicates whether the modal is shown or not.
 * @param {function} props.onClose - Callback function to close the modal.
 * @returns {JSX.Element} - Returns JSX for the AddExpensesModal component.
 */
function AddExpensesModal({ show, onClose }) {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [expenseAmount, setExpenseAmount] = useState("");
    const [selectedDate, setSelectedDate] = useState(new Date()); // State for selected date
    const { expenses, addExpenseItem, addCategory } = useContext(financeContext);
    const [showAddExpense, setShowAddExpense] = useState(false);
    const titleRef = useRef();
    const colorRef = useRef();
    const { user } = useContext(authContext);

    /**
     * Handles adding an expense item.
     */
    const AddCategoryItemHandler = async () => {
        const expense = expenses.find((e) => e.id === selectedCategory);

        const newExpense = {
            color: expense.color,
            title: expense.title,
            total: expense.total + +expenseAmount,
            items: [
                ...expense.items,
                {
                    amount: +expenseAmount,
                    createdAt: selectedDate, // Use selected date
                    id: uuidv4(),
                },
            ],
        };

        try {
            await addExpenseItem(selectedCategory, newExpense);
            setExpenseAmount("");
            setSelectedCategory(null);
            onClose();
            toast.success("Expense added!");
        } catch (error) {
            console.log(error.message);
            toast.error(error.message);
        }
    };

    /**
     * Handles adding a new expense category.
     */
    const addCategoryHandler = async () => {
        const title = titleRef.current.value;
        const color = colorRef.current.value;

        try {
            const isDuplicate = await checkExpensesDuplication(user, title);
            if(isDuplicate){
                toast.error("This category already exists. Please choose a new category name.");
                return;
            }
            await addCategory({title, color, total: 0});
            setShowAddExpense(false);
            toast.success("Category created!");
        } catch (error) {
            console.log(error.message);
            toast.error(error.message);
        }
    }

    return (
        <Modal show={show} onClose={onClose}>
        <div style={{ overflowY: 'auto', overflowX:'hidden', maxHeight: 'clamp(300px, 65vh, 70vh)' }}>
            <div className="flex flex-col gap-4">
                <label className="expense-label"> Expense Amount</label>
                <input
                    type="number"
                    min={0.01}
                    step={0.01}
                    className="bg bg-slate-500"
                    placeholder="Enter expense amount"
                    value={expenseAmount}
                    onChange={(e) => { setExpenseAmount(e.target.value); }}
                    required
                />
            </div>
            {expenseAmount > 0 && selectedCategory && (
                <div className="mt-6">
                {/* Date Input Field */}
                    <label htmlFor="date">Select Date and Time:</label>
                    <input 
                        style={{color: "black", backgroundColor: "gray-500", borderRadius: "5px", marginRight: "10px", marginLeft: "10px",cursor: "pointer"}}
                        type="datetime-local" 
                        name="date"
                        value={formatDate(selectedDate)} // Format ISO date to string
                        onChange={(e) => setSelectedDate(new Date(e.target.value))}
                        required
                    />
                    <button className="btn btn-primary" onClick={AddCategoryItemHandler}>Add Expense</button>
                </div>
            )}

            {/* Expenses Category */}
            {expenseAmount > 0 && (
                
                <div className= "flex flex-col gap-4 mt-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-2x1 expense-label">Select Expense Category</h3>
                        <button onClick={() => setShowAddExpense(true)} className="text-lime-800">+ New Category</button>
                    </div>

                    {showAddExpense && (
                        <div className= "flex items-center justify-between">
                            <input type="text" placeholder="Enter Title" ref={titleRef}/>
                            <label className="expense-label">Pick Color:</label>
                            <input type="color" className="bg bg-slate-500 w-24 h-10" ref={colorRef}/>
                            <button onClick={addCategoryHandler} className="btn btn2-primary-outline">Create</button>
                            <button className="btn btn-danger">Cancel</button>
                        </div>
                    )}

                    {expenses.map((expense) => (
                        <button key={expense.id} onClick={() => setSelectedCategory(expense.id)}>
                            <div
                                style={{ boxShadow: expense.id === selectedCategory ? "1px 1px 4px" : "none", width: "90%", margin: "0 auto" }}
                                className="flex items-center justify-between px-2 py-2 bg-slate-500 rounded-3xl"
                            >
                                <div className="flex items-center gap-1">
                                    <div
                                        className="w-[25px] h-[25px] rounded-full"
                                        style={{ backgroundColor: expense.color }}
                                    />
                                    <h4 className="capitalize text-sm">{expense.title}</h4>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
        </Modal>
    );
}

export default AddExpensesModal;
