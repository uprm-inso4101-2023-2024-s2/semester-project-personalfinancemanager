import UnclosableModal from "./UnclosableModal";

function Modal({show, onClose, children}){
    return (
      <UnclosableModal show={show} onClose={onClose}>
        <button 
          onClick={() => {
            onClose(false);
          }}
        className='w-10 h-10 mb-4 font-bold rounded-full bg-gray-100'
        >
          X
        </button>
        {children}
      </UnclosableModal>
  );
}

export default Modal;