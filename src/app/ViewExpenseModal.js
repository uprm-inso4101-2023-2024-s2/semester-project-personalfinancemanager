import Modal from "@/app/modal";

function ViewExpenseModal({ show, onClose, expense}){
    return (
      <Modal show={show} onClose={onClose}>
        <div className="flex items-center justify-between">
          <h2 className="text-4xl">{expense.title}</h2>
          <button className="btn btn-danger">Delete</button>
        </div>
      </Modal>
    );
}

export default ViewExpenseModal;