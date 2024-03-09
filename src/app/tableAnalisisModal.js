import Modal from "./modal";

function TableAnalisisModal({ show, onClose }) {
    return (
        <Modal show={show} onClose={onClose}>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Table Analisis</h2>
                <button onClick={onClose}>
                    <span className="text-2xl">&times;</span>
                </button>
            </div>
            <div className="flex justify-center items-center">
                <p>Table Analisis</p>
            </div>
        </Modal>
    );
}

export default TableAnalisisModal;