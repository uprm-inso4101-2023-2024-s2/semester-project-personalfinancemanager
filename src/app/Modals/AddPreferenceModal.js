import Modal from "@/app/Modals/modal";
import { useState, useContext, useRef } from "react";
import { financeContext, checkPreferenceDuplication } from '../Finance-Context/finance-context'; // Adjust import
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';
import { authContext } from "../Page-Functionality/Login/auth-context";


function AddPreferenceModal({ show, onClose }) {
    const [preferenceTitle, setPreferenceTitle] = useState("");
    const [preferenceAmount, setPreferenceAmount] = useState("");
    const { addPreferenceItem } = useContext(financeContext);
    const titleRef = useRef();
    const colorRef = useRef();
    const { user } = useContext(authContext);


    const addPreferenceHandler = async () => {
        const title = preferenceTitle;
        const color = colorRef.current.value;

        try {
            await addPreferenceItem({ title, color, amount: preferenceAmount });
            onClose();
            toast.success("Preference category created!");
            setPreferenceTitle("");
            setPreferenceAmount("");
        } catch (error) {
            console.log(error.message);
            toast.error(error.message);
        }
    }

    return (
        <Modal show={show} onClose={onClose}>
            <div style={{ overflowY: 'auto', overflowX: 'hidden', maxHeight: 'clamp(300px, 65vh, 70vh)' }}>
                <div className="flex flex-col gap-4">
                    <input
                        type="text"
                        placeholder="Enter preference title"
                        value={preferenceTitle}
                        onChange={(e) => setPreferenceTitle(e.target.value)}
                        required
                    />
                    <input
                        type="number"
                        min={0.01}
                        step={0.01}
                        placeholder="Enter preference amount"
                        value={preferenceAmount}
                        onChange={(e) => setPreferenceAmount(e.target.value)}
                        required
                    />
                    <div className="flex items-center justify-between">
                        <label className="expense-label">Pick Color:</label>
                        <input type="color" className="bg bg-slate-500 w-24 h-10" ref={colorRef} />
                    </div>
                    <button onClick={addPreferenceHandler} className="btn btn-primary">Create</button>
                </div>
            </div>
        </Modal>
    );
}

export default AddPreferenceModal;
