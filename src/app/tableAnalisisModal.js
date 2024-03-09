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

            <div className="flex justify-center items-center mb-6">
                <p className="text-xl" >Income</p>
            </div>
            
            <table className="flex justify-center">
                <tbody>
                    <tr>
                        <th>Income</th>
                        <th>Median</th>
                        <th>Mean</th>
                        <th>Average</th>
                    </tr>
                    <tr>
                        <td>Date</td>
                        <td>Row 1, Cell 2</td>
                        <td>Row 1, Cell 3</td>
                        <td>Row 1, Cell 4</td>
                    </tr>
                    <tr>
                        <td>Month</td>
                        <td>Row 2, Cell 2</td>
                        <td>Row 2, Cell 3</td>
                        <td>Row 2, Cell 4</td>
                    </tr>
                    <tr>
                        <td>Week</td>
                        <td>Row 3, Cell 2</td>
                        <td>Row 3, Cell 3</td>
                        <td>Row 3, Cell 4</td>
                    </tr>
                </tbody>
            </table>
        </Modal>
    );
}

export default TableAnalisisModal;
