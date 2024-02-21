import Modal from "@/app/modal";


function AddIncomesModal({show, onClose}) {
    return (
        <Modal show={show} onClose={onClose}>
            <form className="input-ground">
                <div className="input-ground"> 
                <label htmlFor="amount"> Income Amount</label>
                <input 
                    type="number" 
                    name = "amount"
                    min = {0.01} 
                    step = {0.01}
                    placeholder = "Enter income amount" 
                    required
                />
                </div>

                <div className="input-ground"> 
                <label htmlFor="description"> Description</label>
                <input 
                    name = "description"
                    type="text" 
                    min = {0.01} 
                    step={0.01}
                    placeholder = "Enter income description" 
                    required
                />
                </div>

                <button type = "submit" className='btn btn-primary'>
                Add entry
                </button>
            </form>

            <div className="flex flex-col gap-4 mt-6">
                <h3 className="text-2x1 font-bold"> Income History</h3>
            </div> 
        </Modal>
    );
}

export default AddIncomesModal;