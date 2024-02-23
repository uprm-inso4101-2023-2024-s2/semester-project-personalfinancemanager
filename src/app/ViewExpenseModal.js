import Modal from "@/app/modal";
import { useContext } from 'react';
import { currencyFormatter } from "./utils";
import { FaRegTrashAlt } from 'react-icons/fa'
import { financeContext } from "./finance-context";
import { toast } from 'react-toastify';

function ViewExpenseModal({ show, onClose, expense }) {
    const { deleteExpenseItem, deleteExpenseCategory } =
      useContext(financeContext);
  
    const deleteExpenseHandler = async () => {
      try {
        await deleteExpenseCategory(expense.id);
        toast.success("Expense deleted successfully");
      } catch (error) {
        console.log(error.message);
        toast.error(error.message);
      }
    };
  
    const deleteExpenseItemHandler = async (item) => {
      try {
        //  Remove the item from the list
        const updatedItems = expense.items.filter((i) => i.id !== item.id);
  
        // Update the expense balance
        const updatedExpense = {
          items: [...updatedItems],
          total: expense.total - item.amount,
        };
  
        await deleteExpenseItem(updatedExpense, expense.id);
        toast.success("Expense item deleted successfully");
      } catch (error) {
        console.log(error.message);
        toast.error(error.message);
      }
    };
  
  return (
    <Modal show={show} onClose={onClose}>
      <div className="flex items-center justify-between">
        <h2 className="text-4xl">{expense.title}</h2>
        <button onClick={deleteExpenseHandler} className="btn btn-danger">
          Delete
        </button>
      </div>
  
      <div>
        <h3 className="my-8 text-2xl">Expense History</h3>
        {expense.items.map((item) => {
          return (
            <div key={item.id} className="flex items-center justify-between">
              <small>
                {item.createdAt && item.createdAt.toMillis
                  ? new Date(item.createdAt.toMillis()).toISOString()
                  : item.createdAt && item.createdAt.toISOString()}
              </small>
              <p className="flex items-center gap-2 justify-end">
                <button
                  onClick={() => {
                    deleteExpenseItemHandler(item);
                  }}
                >
                  <FaRegTrashAlt />
                </button>
                {currencyFormatter(item.amount)}
              </p>
            </div>
          );
        })}
      </div>
    </Modal>
  );
  }
  
  export default ViewExpenseModal;