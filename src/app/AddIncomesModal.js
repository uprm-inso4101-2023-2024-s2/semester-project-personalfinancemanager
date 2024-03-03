import { currencyFormatter } from "./utils.js";
import Modal from "@/app/modal";
import { useState, useRef, useContext } from "react";
import { FaRegTrashAlt } from 'react-icons/fa'
import { financeContext } from './finance-context';
import { authContext } from "./auth-context";
import { toast } from 'react-toastify';

// Define the formatDate function
function formatDate(date) {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    const hours = `${date.getHours()}`.padStart(2, '0');
    const minutes = `${date.getMinutes()}`.padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function AddIncomesModal({ show, onClose }) {
    const amountRef = useRef();
    const descriptionRef = useRef();
    const [selectedDate, setSelectedDate] = useState(new Date()); // State for selected date
    const [entryAdded, setEntryAdded] = useState(false); // State to track if entry is added
    const { income, addIncomeItem, removeIncomeItem } = useContext(financeContext);
    const { user } = useContext(authContext);

    // Función para manejar la adición de ingresos
    const addIncomeHandler = async (e) => {
        e.preventDefault();

        const newIncome = {
            amount: +amountRef.current.value,
            description: descriptionRef.current.value,
            createdAt: selectedDate, // Assign selected date
            uid: user.uid,
        };

        try {
            await addIncomeItem(newIncome);        
            descriptionRef.current.value = "";
            amountRef.current.value = "";
            setSelectedDate(new Date()); // Reset selected date
            setEntryAdded(true); // Indicate entry added
            toast.success("Income added successfully");
        } catch (error) {
            console.log(error.message);
            toast.error(error.message);
        }
    };

    const deleteIncomeEntryHandler = async (incomeId) => {
        try {
            await removeIncomeItem(incomeId);
            toast.success("Income deleted successfully");
        } catch (error) {
            console.log(error.message);
            toast.error(error.message);
        }
    };    

    return (
        <Modal show={show} onClose={onClose}>
            <form className="input-ground" onSubmit={addIncomeHandler}>
                <div className="input-ground"> 
                    <label htmlFor="amount"> Income Amount</label>
                    <input 
                        type="number" 
                        name="amount"
                        ref={amountRef}
                        min={0.01} 
                        step={0.01}
                        className="bg bg-slate-500"
                        placeholder="Enter income amount" 
                        required
                    />
                </div>

                <div className="input-ground"> 
                    <label htmlFor="description"> Description</label>
                    <input 
                        name="description"
                        type="text" 
                        ref={descriptionRef}
                        className="bg bg-slate-500"
                        placeholder="Enter income description" 
                        required
                    />
                </div>

                {/* Date Input Field */}
                <div className="input-ground"> 
                    <label htmlFor="date">Select Date and Time</label>
                    <input 
                        type="datetime-local" 
                        name="date"
                        value={formatDate(selectedDate)} // Format ISO date to string
                        onChange={(e) => setSelectedDate(new Date(e.target.value))}
                        required
                    />
                </div>
                <button type="submit" className='btn btn-primary'>
                    Add entry
                </button>
            </form>

            <div className="flex flex-col gap-4 mt-6">
                <h3 className="text-2xl font-bold"> Income History</h3>
                {income.map(i => {
                    return (
                        <div className="flex justify-between item-center" key={i.id}>
                            <div>
                                <p className="font-semibold">{i.description}</p>
                                <small className="text-xs">
                                    {/* Display Date and Time */}
                                    {new Date(i.createdAt).toLocaleString()}
                                </small>
                            </div>

                            <p className="flex items-center justify-between">
                                {currencyFormatter(i.amount)}
                                <button onClick={() => { deleteIncomeEntryHandler(i.id) }}>
                                    <FaRegTrashAlt />
                                </button>
                            </p>
                        </div>
                    );
                })}
            </div>
        </Modal>
    );
}

export default AddIncomesModal;
