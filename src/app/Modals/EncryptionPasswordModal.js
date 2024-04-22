import UnclosableModal from "./UnclosableModal";
import { useState, useRef, useContext } from "react";
import { financeContext } from '../Finance-Context/finance-context.js';
import { authContext } from "../Page-Functionality/Login/auth-context";

function EncryptionPasswordModal({ show, onClose }) {
  const encryptionPasswordRef = useRef();
  const { encryptionPassword, setEncryptionPassword } = useContext(authContext);

  const handleEncryptionPasswordEnter = (e) => {
    e.preventDefault();
    setEncryptionPassword(encryptionPasswordRef.current.value);
    onClose();
    // TODO: Wipe ref from memory
  };

  return (
    <UnclosableModal show={show}>
      <form className="input-ground items-center" onSubmit={handleEncryptionPasswordEnter}>
        <div className="input-ground"> 
            <label htmlFor="encryptionPassword" className="income-label">Encryption password</label>
            <p className="text-black">We need a password to encrypt your data. This way, you'll sleep sound at night with the knowledge that NO ONE can access your financial information.</p>
            <input 
                name="encryptionPassword"
                ref={encryptionPasswordRef}
                type="text" 
                className="center bg bg-slate-500"
                placeholder="Enter password" 
                required
            />
        </div>

        {/* Submit button for adding entry */}
        <button type="submit" className='btn btn-primary'>
            Submit
        </button>
      </form>
    </UnclosableModal>
  );
}

export default EncryptionPasswordModal;
