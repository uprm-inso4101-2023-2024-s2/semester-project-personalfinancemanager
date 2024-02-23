import { currencyFormatter } from "./utils.js";
import Modal from "@/app/modal";
import { useState, useRef, useEffect, useContext } from "react";
import { FaRegTrashAlt } from 'react-icons/fa'
import { db } from './index.js';
import { financeContext } from './finance-context';
import { toast } from 'react-toastify';

function AddIncomesModal({ show, onClose }) {
    const amountRef = useRef();
    const descriptionRef = useRef();
    const { income, addIncomeItem, removeIncomeItem } = useContext(financeContext);
   

    // Función para manejar la adición de ingresos
    const addIncomeHandler = async (e) => {
        e.preventDefault();

        const newIncome = {
            amount: +amountRef.current.value,
            description: descriptionRef.current.value,
            createdAt: new Date(),
        };

        try {
            await addIncomeItem(newIncome);        
            descriptionRef.current.value = "";
            amountRef.current.value = "";
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
                        placeholder="Enter income description" 
                        required
                    />
                </div>

                <button type="submit" className='btn btn-primary'>
                    Add entry
                </button>
            </form>

            <div className="flex flex-col gap-4 mt-6">
                <h3 className="text-2xl font-bold"> Income History</h3>
                { income.map(i => {
                    return (
                        <div className="flex justify-between item-center" key= {i.id}>
                            <div>
                                <p className="font-semibold">{i.description}</p>
                                <small className="text-xs">{i.createdAt ? i.createdAt.toISOString() : null}</small>
                            </div>
                            <p className="flex items-center justify-between">
                                { currencyFormatter( i.amount) }
                                <button onClick={() => { deleteIncomeEntryHandler(i.id) }}>
                                    <FaRegTrashAlt/>
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
