import Modal from "@/app/modal";
import {useState, useContext} from "react";


const DUMMY_DATA = [
    {
      id: '1',
      title: 'Family',
      color: '#f00',
      amount: 500,
    },
    {
      id: '2',
      title: 'Education',
      color: '#ff6',
      amount: 200,
    },
    {
      id: '3',
      title: 'Pets',
      color: '#008f',
      amount: 1200,
    },
    {
      id: '4',
      title: 'Cinema',
      color: '#d07',
      amount: 800,
    }
  ];

function AddExpensesModal({show, onClose}) {

    const [selectedCategory, setSelectedCategory] = useState(null);

    return (
        <Modal show={show} onClose={onClose}>
            <div className="flex flex-col gap-4">
                <label className="text-slate-100 text-md"> Enter an amount...</label>
                <input 
                    type="number"
                    min={0.01} 
                    step={0.01} 
                    placeholder="Enter expense amount" 
                    required
                />
            </div>

            {/* Expenses Category */} 
            <div className="flex flex-col gap-4 mt-6">
                {DUMMY_DATA.map((expense) => {
                    return (
                        <button key = {expense.id} onClick={() => {setSelectedCategory(expense.id);}}>
                            <div 
                                style = {{boxShadow: expense.id == selectedCategory ? "1px 1px 4px" : "none",}}
                                className="flex items-center justify-between px-4 py-4 bg-slate-200 rounded-3xl">
                                <div className="flex items-center gap-2">
                                    {/* Colored Circle */}
                                    <div 
                                        className="w-[25px] h-[25px] rounded-full"
                                        style={{backgroundColor: expense.color,}}
                                    />
                                    <h4 className="capitalize">{expense.title}</h4>
                                </div>
                            </div>
                        </button>
                    );
                })} 
            </div>
        </Modal>
    );
}

export default AddExpensesModal;