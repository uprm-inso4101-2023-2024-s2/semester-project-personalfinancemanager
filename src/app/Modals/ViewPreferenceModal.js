import Modal from "@/app/Modals/modal";
import { useContext, useState } from 'react';
import { currencyFormatter } from "../Finance-Context/utils";
import { FaRegTrashAlt } from 'react-icons/fa'
import { financeContext } from "../Finance-Context/finance-context";
import { toast } from 'react-toastify';

function ViewPreferenceModal({ show, onClose, preference }) {
    const { deletePreferenceItem, deletePreferenceCategory, updatePreference } =
    useContext(financeContext);
    
  const [selectedColor, setSelectedColor] = useState(preference.color);

  const deletePreferenceHandler = async () => {
    try {
      await deletePreferenceCategory(preference.id);
      toast.success("Preference category deleted successfully");
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  const handleColorChange = (e) => {
    setSelectedColor(e.target.value);
  };

  const handleUpdateColor = async () => {
    try {
      const updatedPreference = { ...preference, color: selectedColor };
      await updatePreference(updatedPreference);
      toast.success("Preference category color updated successfully");
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  return (
    <Modal show={show} onClose={onClose}>
      <div className="flex items-center justify-between">
        <h2 className="text-4xl">{preference.title}</h2>
        <button onClick={deletePreferenceHandler} className="btn btn-danger">
          Delete
        </button>
      </div>

      {/* Change Color */}
      <div className="mt-4 flex items-center">
        <label className="mr-2">Pick Color</label>
        <input
          type="color" 
          className="bg bg-slate-500 w-24 h-10"
          value={selectedColor}
          onChange={handleColorChange}        
        />
        <button onClick={handleUpdateColor} className="btn btn-primary ml-2">Update Color</button>
      </div>

      <div>
        <h3 className="my-8 text-2xl">Preference Details</h3>
        <p>Amount: {currencyFormatter(preference.amount)}</p>
      </div>
    </Modal>
  );
}

export default ViewPreferenceModal;
