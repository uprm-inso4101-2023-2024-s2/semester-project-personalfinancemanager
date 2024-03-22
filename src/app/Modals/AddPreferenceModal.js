import Modal from "@/app/Modals/modal";
import { useState, useRef } from "react";
import { toast } from 'react-toastify';

function AddPreferenceModal({ show, onClose, onAddPreference }) {
    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");

    const titleRef = useRef();
    const amountRef = useRef();

    const handleAddPreference = () => {
        const newPreference = {
            title: title.trim(),
            amount: parseFloat(amount)
        };

        if (!newPreference.title || isNaN(newPreference.amount)) {
            toast.error("Please enter a valid title and amount.");
            return;
        }

        onAddPreference(newPreference);
        setTitle("");
        setAmount("");
        onClose();
    };

    return (
        <Modal show={show} onClose={onClose}>
            <div className="flex flex-col gap-4">
                <input
                    type="text"
                    placeholder="Enter preference title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    ref={titleRef}
                    required
                />
                <input
                    type="number"
                    min={0.01}
                    step={0.01}
                    placeholder="Enter preference amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    ref={amountRef}
                    required
                />
                <button onClick={handleAddPreference} className="btn btn-primary">Add Preference</button>
            </div>
        </Modal>
    );
}

export default AddPreferenceModal;
